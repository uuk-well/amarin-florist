"use client";

import { useState } from "react";

type Step = "request" | "reset";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setMessage("Email wajib diisi.");
      return;
    }
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error ?? "Gagal mengirim tautan reset.");
      return;
    }
    setMessage("");
    setStep("reset");
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setMessage("Password minimal 6 karakter.");
      return;
    }
    if (password !== confirm) {
      setMessage("Konfirmasi password tidak cocok.");
      return;
    }
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "mock_token", password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error ?? "Gagal mereset password.");
      return;
    }
    setMessage("Password berhasil direset. Silakan masuk.");
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

        {step === "request" ? (
          <>
            <h1 className="mb-1 text-center text-lg font-semibold text-zinc-900">
              Lupa Password
            </h1>
            <p className="mb-6 text-center text-sm text-zinc-500">
              Masukkan email untuk menerima tautan reset.
            </p>
            <form onSubmit={handleRequest} className="space-y-4">
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
              {message && <span className="text-xs text-red-500">{message}</span>}
              <button
                type="submit"
                className="w-full rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-600"
              >
                Kirim Tautan Reset
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="mb-1 text-center text-lg font-semibold text-zinc-900">
              Reset Password
            </h1>
            <p className="mb-6 text-center text-sm text-zinc-500">
              Buat password baru untuk {email}.
            </p>
            <form onSubmit={handleReset} className="space-y-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-zinc-700">Password Baru</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-zinc-700">
                  Konfirmasi Password
                </span>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                />
              </label>
              {message && (
                <span className="text-xs text-rose-600">{message}</span>
              )}
              <button
                type="submit"
                className="w-full rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-600"
              >
                Reset Password
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
