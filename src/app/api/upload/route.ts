import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import Busboy from 'busboy';
import type { FileInfo } from 'busboy';

// If your TS config complains about the default export of `busboy`,
// enable `esModuleInterop` or suppress like this:
//   // @ts-ignore-next-line
//   import Busboy from 'busboy';
// We already have esModuleInterop enabled in `tsconfig.json`. If not,
// uncomment the next directive.

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


/*  ─── POST /api/upload ─────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  // 1. Ensure Drive folder env present
  const folderId = process.env.GDRIVE_TARGET_FOLDER;
  if (!folderId) {
    return NextResponse.json(
      { error: 'GDRIVE_TARGET_FOLDER env missing' },
      { status: 500 },
    );
  }

  // 2. Stream‑parse the multipart body with Busboy
  return new Promise<NextResponse>((resolve, reject) => {
    const results: { name: string; success: boolean; error?: string }[] = [];

    // Cast because Busboy expects a plain object map<string,string>
    // Headers.getAll isn't available in Node18 ↔ web spec mismatch,
    // so we collect the *first* value for each header key.
    const headerEntries: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headerEntries[key.toLowerCase()] = value;
    });
    const bb = Busboy({ headers: headerEntries });

    bb.on('file', (_field: string, file: NodeJS.ReadableStream, info: FileInfo) => {
      const { filename = 'upload.bin', mimeType = 'application/octet-stream' } = info;

      // Validate filename
      if (invalidChars.test(filename) || filename.length > MAX_LEN) {
        file.resume(); // drain stream
        results.push({ name: filename, success: false, error: 'Invalid file name' });
        return;
      }

      // Directly pipe the incoming stream to Google Drive
      drive.files.create({
        requestBody: {
          name: filename,
          parents: [folderId],
          mimeType,
        },
        media: {
          mimeType,
          body: file,       // ← stream upload
        },
        supportsAllDrives: true,
      })
      .then(() => {
        results.push({ name: filename, success: true });
      })
      .catch((err: Error) => {
        results.push({ name: filename, success: false, error: err.message });
      });
    });

    bb.on('finish', () => {
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;

      if (failureCount === 0) {
        resolve(
          NextResponse.json({
            success: true,
            message: `Successfully uploaded ${successCount} files`,
            results,
          }),
        );
      } else if (successCount > 0) {
        resolve(
          NextResponse.json({
            success: false,
            message: `Partial upload: ${successCount} succeeded, ${failureCount} failed`,
            results,
          }, { status: 207 }),
        );
      } else {
        resolve(
          NextResponse.json({
            success: false,
            message: 'All uploads failed',
            results,
          }, { status: 500 }),
        );
      }
    });

    bb.on('error', (err) => {
      reject(err);
    });

    // Node 20 has Readable.fromWeb, Node ≤18 may not include it in
    // @types/node yet. Provide a safe fallback.
    function toNodeStream(web: ReadableStream<Uint8Array>) {
      // Narrow the static `fromWeb` method without using `any`
      const fromWeb = (Readable as typeof Readable & {
        fromWeb?: (stream: ReadableStream<Uint8Array>) => NodeJS.ReadableStream;
      }).fromWeb;

      if (typeof fromWeb === 'function') {
        return fromWeb(web);
      }
      // Fallback: convert WebReadableStream to async iterator
      const iterator = web.getReader();
      return Readable.from(
        (async function* () {
          while (true) {
            const { done, value } = await iterator.read();
            if (done) break;
            if (value) yield Buffer.from(value);
          }
        })(),
      );
    }
    const nodeStream = toNodeStream(
      req.body as unknown as ReadableStream<Uint8Array>,
    );
    nodeStream.pipe(bb);
  }).catch((err: Error) => {
    console.error('Upload Route Error:', err.message);
    return NextResponse.json(
      { error: 'Upload failed', details: err.message },
      { status: 500 },
    );
  });
}
/*  ─── Dev Setup Reminder ─────────────────────────────────────────
  pnpm add busboy
  pnpm add -D @types/busboy      # if your tsconfig doesn't pick up bundled types
  ──────────────────────────────────────────────────────────────── */