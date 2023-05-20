import type {
  NextRequest,
  NextFetchEvent,
} from 'next/server';
import { NextResponse } from 'next/server';
export function middleware(
  req: NextRequest,
  ev: NextFetchEvent,
) {
  if (!req.url.includes('/api')) {
    if (
      !req.url.includes('/log-in') &&
      !req.cookies.clonesession &&
      !req.url.includes('/create-account')
    ) {
      return NextResponse.redirect(
        new URL('/log-in', req.url),
      );
    }
  }
}
