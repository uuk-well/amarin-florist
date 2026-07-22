export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  if (!body.email?.toString().trim() || !body.password) {
    return Response.json(
      { error: "Email dan password wajib diisi." },
      { status: 400 }
    );
  }

  // Produksi: verifikasi via Supabase Auth (signInWithPassword) dan kembalikan session.
  // Mock: hasilkan token tiruan.
  const token = `mock_${Buffer.from(body.email).toString("base64")}.${Date.now()}`;

  return Response.json({
    token,
    user: { email: body.email, name: body.email.split("@")[0] },
  });
}
