"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/components/auth/auth-provider";

export default function RegisterPage() {
  const { register, login } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Nama, email, dan password wajib diisi.");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    setError("");
    const err = await register(email, password, name);
    if (err) {
      setError(err);
      return;
    }
    setSuccess(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-base font-bold text-white">
            A
          </span>
          <span className="text-xl font-semibold text-zinc-900">Amarin Florist</span>
        </div>

        <h1 className="mb-1 text-center text-lg font-semibold text-zinc-900">
          Daftar Akun
        </h1>
        <p className="mb-6 text-center text-sm text-zinc-500">
          Buat akun untuk mengelola pesanan.
        </p>

        {success ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-zinc-600">
              Akun <strong>{email}</strong> berhasil dibuat. Silakan login.
            </p>
            <Link
              href="/login"
              className="block w-full rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-600"
            >
              Masuk Sekarang
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Nama</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="cth. Ibu Sari"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="nama@email.com"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-zinc-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
              />
            </label>

            {error && <span className="text-xs text-red-500">{error}</span>}

            <button
              type="submit"
              className="w-full rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-600"
            >
              Daftar
            </button>

            <Link
              href="/login"
              className="mt-4 block text-center text-sm font-medium text-rose-600 hover:text-rose-700"
            >
              Sudah punya akun? Masuk
            </Link>
          </form>
        )}
      </div>
    </main>
  );
}
