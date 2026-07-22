import { MockUsersRepository } from "@/lib/repositories/users-repository";

export async function POST(request: Request) {
  let body: { email?: string; name?: string; password?: string };
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
  if (body.password.length < 6) {
    return Response.json(
      { error: "Password minimal 6 karakter." },
      { status: 400 }
    );
  }

  // Produksi: daftarkan via Supabase Auth (signUp) lalu insert profil ke tabel users.
  // Mock: kembalikan profil tiruan.
  const repo = new MockUsersRepository();
  const user = await repo.create({
    id: `usr_${Date.now()}`,
    email: body.email,
    name: body.name ?? null,
  });

  return Response.json({ user }, { status: 201 });
}
