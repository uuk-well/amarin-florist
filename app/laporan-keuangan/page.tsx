"use client";

import { useMemo, useState } from "react";
import { mockReportOrders, mockVendorSummaries } from "@/lib/mock-data";
import { formatRupiah } from "@/lib/utils/currency";
import { TotalIncomeCard } from "@/app/components/finance/total-income-card";
import { VendorPaymentsList } from "@/app/components/finance/vendor-payments-list";
import { AppHeader } from "@/app/components/layout/app-header";
import { RequireAuth } from "@/app/components/auth/require-auth";
import { generateFinanceReportPdf } from "@/lib/services/pdf-client";
import { generateFinanceReportCsv } from "@/lib/services/csv-client";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function presetRange(preset: "today" | "week" | "month"): { from: string; to: string } {
  const now = new Date();
  if (preset === "today") {
    return { from: toISODate(now), to: toISODate(now) };
  }
  if (preset === "week") {
    const day = now.getDay();
    const diff = (day + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    return { from: toISODate(monday), to: toISODate(now) };
  }
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  return { from: toISODate(first), to: toISODate(now) };
}

export default function FinanceReportPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
    if (toDate) toDate.setHours(23, 59, 59, 999);
    return mockReportOrders.filter((o) => {
      const created = new Date(o.created_at);
      if (fromDate && created < fromDate) return false;
      if (toDate && created > toDate) return false;
      return true;
    });
  }, [from, to]);

  const totalIncome = filtered.reduce((s, o) => s + o.total_price, 0);
  const vendorTotals = useMemo(() => {
    const map = new Map<string, { name: string; total: number; count: number }>();
    for (const v of mockVendorSummaries) {
      map.set(v.vendorId, { name: v.vendorName, total: 0, count: 0 });
    }
    for (const o of filtered) {
      const entry = [...map.entries()].find(([, m]) => m.name === o.vendor_name);
      if (entry) {
        const m = entry[1];
        m.total += o.total_price;
        m.count += 1;
      }
    }
    return [...map.values()];
  }, [filtered]);

  const totalVendor = vendorTotals.reduce((s, v) => s + v.total, 0);

  function applyPreset(preset: "today" | "week" | "month") {
    const r = presetRange(preset);
    setFrom(r.from);
    setTo(r.to);
  }

  return (
    <RequireAuth>
      <main className="min-h-screen bg-zinc-50">
        <AppHeader />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-1 text-2xl font-bold text-zinc-900">Laporan Keuangan</h1>
        <p className="mb-8 text-sm text-zinc-500">
          Rekap pendapatan dan pembayaran vendor per periode.
        </p>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => applyPreset("today")}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => applyPreset("week")}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Minggu Ini
            </button>
          <button
            type="button"
            onClick={() => applyPreset("month")}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Bulan Ini
          </button>
          <button
            type="button"
            onClick={() =>
              generateFinanceReportPdf({
                periodLabel: from || to ? `Periode ${from} s/d ${to}` : "Semua Periode",
                totalIncome,
                totalVendor,
                vendorPayments: vendorTotals,
                orders: filtered.map((o) => ({
                  id: o.id,
                  customerName: o.customer_name,
                  vendorName: o.vendor_name,
                  total: o.total_price,
                })),
              })
            }
            className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
          >
            Ekspor PDF
          </button>
          <button
            type="button"
            onClick={() =>
              generateFinanceReportCsv({
                periodLabel: from || to ? `Periode ${from} s/d ${to}` : "Semua Periode",
                totalIncome,
                totalVendor,
                vendorPayments: vendorTotals,
                orders: filtered.map((o) => ({
                  id: o.id,
                  customerName: o.customer_name,
                  vendorName: o.vendor_name,
                  total: o.total_price,
                })),
              })
            }
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Ekspor Excel
          </button>
          </div>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700">
            Dari
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="input"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700">
            Sampai
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="input"
            />
          </label>
          {(from || to) && (
            <button
              type="button"
              onClick={() => {
                setFrom("");
                setTo("");
              }}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Reset
            </button>
          )}
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TotalIncomeCard label="Total Pendapatan" amount={totalIncome} />
          <TotalIncomeCard
            label="Total Bayar Vendor"
            amount={totalVendor}
            variant="vendor"
          />
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Pembayaran Vendor
          </h2>
          <VendorPaymentsList items={vendorTotals} />
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">Detail Pesanan</h2>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-5 py-3">No. Invoice</th>
                  <th className="px-5 py-3">Pelanggan</th>
                  <th className="px-5 py-3">Vendor</th>
                  <th className="px-5 py-3">Tanggal</th>
                  <th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((o) => (
                  <tr key={o.id}>
                    <td className="px-5 py-3 font-mono text-xs text-zinc-500">{o.id}</td>
                    <td className="px-5 py-3 font-medium text-zinc-900">
                      {o.customer_name}
                    </td>
                    <td className="px-5 py-3 text-zinc-600">{o.vendor_name}</td>
                    <td className="px-5 py-3 text-zinc-500">{formatDate(o.created_at)}</td>
                    <td className="px-5 py-3 text-right font-semibold text-rose-600">
                      {formatRupiah(o.total_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      </main>
    </RequireAuth>
  );
}
