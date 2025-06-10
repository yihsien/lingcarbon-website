/**
 * POST /api/lang?set=en | /api/lang?set=zh
 *
 * Persists the chosen UI language in a cookie so that edge‑middleware
 * can redirect the user to the correct locale on future visits.
 *
 * Returns: { ok: true } on success, or 400 with error message on invalid input.
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const lang = url.searchParams.get('set');

  // Accept only "en" or "zh"
  if (lang !== 'en' && lang !== 'zh') {
    return NextResponse.json(
      { ok: false, error: 'invalid lang' },
      { status: 400 }
    );
  }

  // Store the preference for 1 year
  const cookieStore = await cookies();
  cookieStore.set('lang', lang, {
    maxAge: 60 * 60 * 24 * 365, // one year
    path: '/',
    sameSite: 'lax',
  });

  return NextResponse.json({ ok: true });
}