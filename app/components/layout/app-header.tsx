"use client";

import Link from "next/link";
import { useAuth } from "../auth/auth-provider";

const navItems = [
  { href: "/", label: "Dasbor" },
  { href: "/pesanan-baru", label: "Pesanan Baru" },
  { href: "/daftar-pesanan", label: "Daftar Pesanan" },
  { href: "/vendor", label: "Vendor" },
  { href: "/pembayaran-vendor", label: "Pembayaran Vendor" },
  { href: "/laporan-keuangan", label: "Laporan" },
];

export function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500 text-sm font-bold text-white">
              A
            </span>
            <span className="text-lg font-semibold text-zinc-900">Amarin Florist</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-zinc-500 sm:block">
            {user ? user.name : "Tamu"}
          </span>
          {user ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Keluar
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-600"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
