export async function POST(request: Request) {
  let body: { token?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  if (!body.token || !body.password) {
    return Response.json(
      { error: "Token dan password baru wajib diisi." },
      { status: 400 }
    );
  }
  if (body.password.length < 6) {
    return Response.json(
      { error: "Password minimal 6 karakter." },
      { status: 400 }
    );
  }

  // Produksi: verifikasi token lalu update password via Supabase Auth
  // (updateUser). Mock: selalu sukses demi kontrak API.
  return Response.json({ message: "Password berhasil direset." });
}
