// middleware.ts (project root)
// Redirects visitors to /en or /zh based on preference and cookie
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Root‑level middleware
 *
 * 1. Executes only for the exact path "/".
 * 2. If a "lang" cookie is present ("en" or "zh"), the visitor is redirected to that locale.
 * 3. If no cookie exists, the visitor is redirected according to the browser's
 *    Accept‑Language header (starts with "zh" → "/zh", otherwise "/en").
 * 4. The chosen locale is stored in a "lang" cookie (1‑year expiry) for future visits.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieLang = request.cookies.get('lang')?.value;
  console.log('[MW] cookieLang =', cookieLang, 'pathname =', pathname);

  // Intercept only the root path "/"
  if (pathname === '/') {
    // 1° Check existing cookie
    if (cookieLang === 'en' || cookieLang === 'zh') {
      return NextResponse.redirect(new URL(`/${cookieLang}`, request.url), 307);
    }

    // 2° Use Accept‑Language header on first visit
    const accept = request.headers.get('accept-language')?.toLowerCase() ?? '';
    const targetLang: 'en' | 'zh' = accept.startsWith('zh') ? 'zh' : 'en';

    // 3° Redirect and set the cookie (1 year)
    const res = NextResponse.redirect(new URL(`/${targetLang}`, request.url), 307);
    res.cookies.set('lang', targetLang, { maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  // All other routes continue normally
  return NextResponse.next();
}

/**
 * Apply this middleware only to the root route.
 */
export const config = {
  matcher: ['/'],
};