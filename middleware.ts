import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/lupa-password",
  "/api/auth/login",
  "/api/auth/register",
];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

// Verifikasi token tiruan: harus diawali "mock_" (diisi setelah login via /api/auth/login).
function isValidToken(token: string | undefined): boolean {
  return !!token && token.startsWith("mock_");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;

  // API: tolak dengan 401 jika token tidak valid.
  if (pathname.startsWith("/api/")) {
    if (!isValidToken(bearer)) {
      return NextResponse.json(
        { error: "Tidak terautentikasi." },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Halaman: guard client-side (RequireAuth) sudah cukup; middleware hanya
  // memastikan cookie sesi ada bila nanti auth asli dipasang.
  const token = request.cookies.get("amarin_token")?.value;
  if (!isValidToken(token)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
