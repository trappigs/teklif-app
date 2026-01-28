import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Statik dosyalar ve Next.js iç dosyalarına her zaman izin ver
  if (path.startsWith('/_next') || path.startsWith('/static') || path.includes('.')) {
    return NextResponse.next();
  }

  // Herkese açık sayfalar
  const isLoginPage = path === '/login';
  
  // Teklif paylaşım linki kontrolü: /proposal/ID (ID varsa izin ver, yoksa /proposal ana sayfası korumalıdır)
  const isSharedProposal = path.startsWith('/proposal/') && path.split('/').length > 2;

  // Eğer giriş sayfası veya paylaşılan teklif ise izin ver
  if (isLoginPage || isSharedProposal) {
    return NextResponse.next();
  }

  // Diğer tüm sayfalar için (Ana sayfa, Admin, Portföy vb.) oturum kontrolü yap
  const isAuth = request.cookies.has('session_token');

  if (!isAuth) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
