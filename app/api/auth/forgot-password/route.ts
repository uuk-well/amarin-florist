export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  if (!body.email?.toString().trim()) {
    return Response.json({ error: "Email wajib diisi." }, { status: 400 });
  }

  // Produksi: generate reset token lalu kirim email via Supabase Auth
  // (resetPasswordForEmail). Mock: selalu sukses demi kontrak API.
  return Response.json({
    message: "Jika email terdaftar, tautan reset telah dikirim.",
  });
}
