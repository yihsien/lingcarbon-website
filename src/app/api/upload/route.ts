import { google } from 'googleapis';
import { handleUpload} from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { Readable } from 'stream';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ServiceAccountJSON = {
  private_key: string;
  client_email: string;
  [k: string]: string | undefined;
};

function getDriveClient() {
  const raw = process.env.GDRIVE_SERVICE_JSON;
  if (!raw) throw new Error('GDRIVE_SERVICE_JSON env missing');
  
  let creds: ServiceAccountJSON;
  try {
    creds = JSON.parse(raw) as ServiceAccountJSON;
  } catch {
    throw new Error('Invalid GDRIVE_SERVICE_JSON format');
  }
  
  // Fix escaped newlines in private key
  creds.private_key = creds.private_key.replace(/\\n/g, '\n');
  
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });
  
  return google.drive({ version: 'v3', auth });
}

const DRIVE_FOLDER = process.env.GDRIVE_TARGET_FOLDER;

type BlobResult = {
  url: string;
  pathname: string;
  contentType?: string;
};

function toNodeStream(web: ReadableStream<Uint8Array>): NodeJS.ReadableStream {
  const fromWeb = (Readable as unknown as {
    fromWeb?: (stream: ReadableStream<Uint8Array>) => NodeJS.ReadableStream;
  }).fromWeb;
  
  if (typeof fromWeb === 'function') {
    return fromWeb(web);
  }
  
  const reader = web.getReader();
  return new Readable({
    async read() {
      try {
        const { value, done } = await reader.read();
        if (done) {
          this.push(null);
        } else {
          this.push(Buffer.from(value));
        }
      } catch (err) {
        this.destroy(err as Error);
      }
    },
  });
}

async function uploadToDrive(
  url: string,
  pathname: string,
  mimeType = 'application/octet-stream',
) {
  console.log('[DEBUG][Drive] Starting upload to Drive:', { url, pathname, mimeType });
  
  if (!DRIVE_FOLDER) {
    throw new Error('GDRIVE_TARGET_FOLDER environment variable is missing');
  }

  try {
    // Create drive client for this specific upload
    const drive = getDriveClient();
    
    console.log('[DEBUG][Drive] Fetching blob from:', url);
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`Blob fetch failed: ${res.status} ${res.statusText}`);
    }
    
    if (!res.body) {
      throw new Error('No response body from blob fetch');
    }

    const fileName = pathname.split('/').pop() || 'unnamed-file';
    console.log('[DEBUG][Drive] Uploading file:', fileName, 'to folder:', DRIVE_FOLDER);

    const uploadResult = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [DRIVE_FOLDER],
        mimeType,
      },
      media: {
        mimeType,
        body: toNodeStream(res.body as ReadableStream<Uint8Array>),
      },
      supportsAllDrives: true,
      fields: 'id,name,size,mimeType', // Get back file info for verification
    });

    console.log('[DEBUG][Drive] Upload successful:', {
      fileId: uploadResult.data.id,
      fileName: uploadResult.data.name,
      size: uploadResult.data.size,
      mimeType: uploadResult.data.mimeType,
    });

    return uploadResult.data;
  } catch (error) {
    console.error('[DEBUG][Drive] Upload failed:', {
      error: error instanceof Error ? error.message : String(error),
      pathname,
      url,
    });
    throw error;
  }
}

/* POST handler for Vercel Blob token & URL */
export async function POST(req: Request) {
  console.log('[DEBUG][Route] /api/upload POST called');
  try {
    const body = await req.json();
    console.log('[DEBUG][Route] POST body received:', Object.keys(body));
    
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        console.log('[DEBUG][Blob] onBeforeGenerateToken for:', pathname);
        const newPathname = `uploads/${Date.now()}-${pathname.split('/').pop()}`;
        console.log('[DEBUG][Blob] Generated pathname:', newPathname);
        
        return {
          maximumSizeInBytes: 50 * 1024 * 1024, // 50MB
          pathname: newPathname,
          allowOverwrite: true,
        };
      },
      onUploadCompleted: async ({ blob }: { blob: BlobResult }) => {
        console.log('[DEBUG][Blob] upload completed (POST):', blob.pathname);
        try {
          await uploadToDrive(
            blob.url,
            blob.pathname,
            blob.contentType ?? 'application/octet-stream',
          );
          console.log('[DEBUG][Drive] upload succeeded:', blob.pathname);
        } catch (err) {
          console.error('[DEBUG][Drive] upload failed:', (err as Error).message);
        }
      },
    });
    
    console.log('[DEBUG][Route] POST handleUpload success:', result);
    return NextResponse.json(result);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[DEBUG][Route] POST error:', errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 },
    );
  }
}

