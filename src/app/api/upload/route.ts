import { NextRequest, NextResponse } from 'next/server';

/*  ─── Settings ─────────────────────────────────────────────────── */

export const dynamic = 'force-dynamic';           // don’t cache
const invalidChars = /[\\/?%*:|"<>]/;             // forbidden chars
const MAX_LEN = 255;                              // filename length limit

/*  ─── POST /api/upload ─────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  // 1. Pull the file out of the multipart body
  const form = await req.formData();
  const blob = form.get('file') as Blob | null;
  if (!blob) {
    return NextResponse.json({ error: 'No file received' }, { status: 400 });
  }

  const name = (blob as File).name || 'upload.bin';

  // 2. Server-side filename validation (extra safety)
  if (invalidChars.test(name) || name.length > MAX_LEN) {
    return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
  }

  // 3. Read webhook URL from env
  const webhook = process.env.N8N_UPLOAD_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json(
      { error: 'N8N_UPLOAD_WEBHOOK_URL is missing' },
      { status: 500 },
    );
  }

  // 4. Forward the file to n8n
  const fd = new FormData();
  fd.set('file', blob, name);

  const resp = await fetch(webhook, { method: 'POST', body: fd });

  if (!resp.ok) {
    const text = await resp.text();
    return NextResponse.json(
      { error: 'n8n error', details: text },
      { status: 502 },
    );
  }

  // 5. Success
  return NextResponse.json({ ok: true });
}