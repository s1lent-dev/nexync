import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken');
  if (req.nextUrl.pathname === '/reset-password') {
    const urlToken = req.nextUrl.searchParams.get('token');
    if (!urlToken) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (token) {
    if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else {
    if (req.nextUrl.pathname !== '/login' && req.nextUrl.pathname !== '/register') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/', '/reset-password'],
};
