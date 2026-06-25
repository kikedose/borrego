import { type NextRequest, NextResponse } from 'next/server';
import type { Locale } from './lib/i18n';
import { defaultLocale, supportedLocales } from './lib/i18n';
import { findBestLocaleMatch, parseAcceptLanguage } from './lib/utils';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if there is any supported locale in the pathname
  const pathnameHasLocale = supportedLocales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // Explicitly continue the middleware chain
  if (pathnameHasLocale) return NextResponse.next();

  // 2. If no locale is present, detect the best locale and redirect
  // Get the Accept-Language header
  const acceptLanguageHeader = request.headers.get('accept-language');

  // Parse the header to get preferred languages
  const preferredLanguages = parseAcceptLanguage(acceptLanguageHeader);

  // Find the best match among supported locales
  // Checks for cookies first
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value as
    | Locale
    | undefined;
  const matchedLocale =
    (cookieLocale && supportedLocales.includes(cookieLocale)
      ? cookieLocale
      : null) ??
    findBestLocaleMatch(preferredLanguages, supportedLocales, defaultLocale);

  // Construct the new URL with the detected locale
  // It's safer to clone the URL object before modifying it
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${matchedLocale}${pathname}`;

  // Redirect to the new URL (e.g., /projects/[id] -> /en/projects/[id] or /es/projects/[id])
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  // Run on application routes only.
  // Ignore APIs, framework internals, deployment internals, and anything that looks like a static file.
  matcher: ['/((?!api|_next|_vercel|.*\\.).*)'],
};
