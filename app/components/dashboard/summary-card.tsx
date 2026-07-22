"use client";

import { useState } from "react";

type PeriodFinance = {
  income: number;
  vendorExpense: number;
};

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function SummaryCard({
  label,
  finance,
  onChange,
  icon,
}: {
  label: string;
  finance: PeriodFinance;
  onChange: (f: PeriodFinance) => void;
  icon: React.ReactNode;
}) {
  const [editing, setEditing] = useState<"income" | "expense" | null>(null);
  const [temp, setTemp] = useState("");

  const net = finance.income - finance.vendorExpense;

  function startEdit(field: "income" | "expense") {
    setEditing(field);
    setTemp(String(field === "income" ? finance.income : finance.vendorExpense));
  }

  function saveEdit() {
    const val = Number(temp.replace(/[^0-9]/g, "")) || 0;
    if (editing === "income") {
      onChange({ ...finance, income: val });
    } else if (editing === "expense") {
      onChange({ ...finance, vendorExpense: val });
    }
    setEditing(null);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
          {icon}
        </div>
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-sm font-medium text-zinc-500">{label}</span>

          {/* Pendapatan */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Pendapatan</span>
            {editing === "income" ? (
              <input
                type="text"
                inputMode="numeric"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                  if (e.key === "Escape") setEditing(null);
                }}
                className="w-32 rounded border border-rose-300 px-2 py-0.5 text-right text-sm font-semibold text-zinc-900 outline-rose-500"
                autoFocus
              />
            ) : (
              <button
                type="button"
                onClick={() => startEdit("income")}
                className="text-sm font-semibold text-zinc-900 hover:text-rose-600"
              >
                {formatRupiah(finance.income)}
              </button>
            )}
          </div>

          {/* Pengeluaran Vendor */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Pengeluaran Vendor</span>
            {editing === "expense" ? (
              <input
                type="text"
                inputMode="numeric"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                  if (e.key === "Escape") setEditing(null);
                }}
                className="w-32 rounded border border-rose-300 px-2 py-0.5 text-right text-sm text-zinc-700 outline-rose-500"
                autoFocus
              />
            ) : (
              <button
                type="button"
                onClick={() => startEdit("expense")}
                className="text-sm text-red-500 hover:text-red-600"
              >
                {formatRupiah(finance.vendorExpense)}
              </button>
            )}
          </div>

          {/* Bersih */}
          <div className="flex items-center justify-between border-t border-dashed border-zinc-200 pt-0.5">
            <span className="text-xs font-medium text-zinc-500">Bersih</span>
            <span
              className={`text-sm font-bold ${
                net >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {formatRupiah(net)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { PeriodFinance };
