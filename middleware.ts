import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/lupa-password"];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteksi sisi klien (RequireAuth) sudah cukup untuk halaman.
  if (isPublic(pathname) || !pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // API routes: cek cookie Supabase session
  const cookies = request.cookies;
  const hasSession = cookies.getAll().some((c) => c.name.startsWith("sb-"));

  if (!hasSession) {
    return NextResponse.json(
      { error: "Tidak terautentikasi." },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
