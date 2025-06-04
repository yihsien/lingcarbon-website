import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { PassThrough } from 'stream';

/*  ─── Settings ─────────────────────────────────────────────────── */

export const runtime = 'nodejs';                 // force Node (edge has 1 MB limit)
export const dynamic = 'force-dynamic';          // don't cache

const invalidChars = /[\\/?%*:|"<>]/;            // forbidden chars
const MAX_LEN = 255;                             // filename length limit

/*  ─── Helpers ──────────────────────────────────────────────────── */

type ServiceAccountCredentials = {
  type: 'service_account';
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain?: string;
  [key: string]: string | undefined;
};

/** Returns an authenticated Google Drive client using the service‑account
 *  JSON stored in the GDRIVE_SERVICE_JSON env var. */
function getDriveClient() {
  const raw = process.env.GDRIVE_SERVICE_JSON;
  if (!raw) throw new Error('GDRIVE_SERVICE_JSON env missing');

  const creds = JSON.parse(raw) as ServiceAccountCredentials;
  if (typeof creds.private_key === 'string') {
    creds.private_key = creds.private_key.replace(/\\n/g, '\n');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  return google.drive({ version: 'v3', auth });
}

// ── Drive client reused across invocations ────────────────
const drive = getDriveClient();

/** Converts a Buffer into a Node.js readable stream. */
function bufferToStream(buf: Buffer) {
  const stream = new PassThrough();
  stream.end(buf);
  return stream;
}

/*  ─── POST /api/upload ─────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    // 1. Pull files out of the multipart body
    const form = await req.formData();
    const files: File[] = [];
    
    // Fixed: Collect all files properly
    for (const [, value] of form.entries()) {
      if (value instanceof File) {
        files.push(value);
        console.log(`Found file: ${value.name} (${value.size} bytes)`);
      }
    }

    if (!files.length) {
      return NextResponse.json({ error: 'No files received' }, { status: 400 });
    }

    console.log(`Processing ${files.length} files`);

    // 2. Ensure Drive folder env present
    const folderId = process.env.GDRIVE_TARGET_FOLDER;
    if (!folderId) {
      return NextResponse.json(
        { error: 'GDRIVE_TARGET_FOLDER env missing' },
        { status: 500 },
      );
    }

    // 3. Process and validate files
    const processedFiles: { name: string; mime: string; buffer: Buffer }[] = [];
    
    for (const file of files) {
      const name = file.name || 'upload.bin';

      // Validate filename
      if (invalidChars.test(name) || name.length > MAX_LEN) {
        console.error(`Invalid filename: ${name}`);
        return NextResponse.json({ error: `Invalid file name: ${name}` }, { status: 400 });
      }

      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const mime = file.type || 'application/octet-stream';

        processedFiles.push({ name, mime, buffer });
        console.log(`Processed file: ${name} (${buffer.length} bytes, ${mime})`);
      } catch (error) {
        console.error(`Error processing file ${name}:`, error);
        return NextResponse.json({ error: `Failed to process file: ${name}` }, { status: 400 });
      }
    }

    // 4. Upload all files sequentially with better error handling
    const uploadResults: { name: string; success: boolean; error?: string }[] = [];
    
    for (const [idx, { name, mime, buffer }] of processedFiles.entries()) {
      console.log(`--- Uploading file ${idx + 1}/${processedFiles.length}: ${name}`);

      try {
        // Create a fresh stream for each upload
        const stream = bufferToStream(buffer);

        const response = await drive.files.create({
          requestBody: {
            name,
            parents: [folderId],
            mimeType: mime,
          },
          media: { 
            mimeType: mime, 
            body: stream 
          },
          supportsAllDrives: true,
        });

        console.log(`✓ Successfully uploaded ${name} (ID: ${response.data.id})`);
        uploadResults.push({ name, success: true });

        // Add delay between uploads to avoid rate limiting
        if (idx < processedFiles.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`✗ Failed to upload ${name}:`, errorMessage);
        uploadResults.push({ name, success: false, error: errorMessage });
        
        // Continue with other files instead of failing completely
        // If you want to fail fast, uncomment the next line:
        // throw error;
      }
    }

    // 5. Check results and return appropriate response
    const successCount = uploadResults.filter(r => r.success).length;
    const failureCount = uploadResults.length - successCount;

    if (failureCount === 0) {
      console.log(`All ${successCount} files uploaded successfully`);
      return NextResponse.json({ 
        success: true, 
        message: `Successfully uploaded ${successCount} files`,
        results: uploadResults 
      });
    } else if (successCount > 0) {
      console.log(`Partial success: ${successCount} succeeded, ${failureCount} failed`);
      return NextResponse.json({ 
        success: false,
        message: `Partial upload: ${successCount} succeeded, ${failureCount} failed`,
        results: uploadResults 
      }, { status: 207 }); // 207 Multi-Status
    } else {
      console.log('All uploads failed');
      return NextResponse.json({ 
        success: false,
        message: 'All uploads failed',
        results: uploadResults 
      }, { status: 500 });
    }

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Upload Route Error:', message);

    return NextResponse.json(
      { error: 'Upload failed', details: message },
      { status: 500 },
    );
  }
}