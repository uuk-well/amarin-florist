"use client";

import { useMemo, useState } from "react";
import type { Order } from "@/lib/mock-data";
import { OrdersTable } from "@/app/components/orders/orders-table";

const PAGE_SIZE = 5;

export function PaginatedOrders({
  orders,
  onReprint,
  onEdit,
}: {
  orders: Order[];
  onReprint?: (order: Order) => void;
  onEdit?: (order: Order) => void;
}) {
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
    if (toDate) toDate.setHours(23, 59, 59, 999);

    return orders.filter((o) => {
      const haystack = [o.customer_name, o.pic_order, o.vendor_name]
        .join(" ")
        .toLowerCase();
      if (q && !haystack.includes(q)) return false;

      const created = new Date(o.created_at);
      if (fromDate && created < fromDate) return false;
      if (toDate && created > toDate) return false;
      return true;
    });
  }, [orders, query, from, to]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  function resetFilters() {
    setQuery("");
    setFrom("");
    setTo("");
    setPage(1);
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700">
          Cari
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Nama / PIC / vendor…"
            className="input w-full sm:w-64"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700">
          Dari
          <input
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setPage(1);
            }}
            className="input"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700">
          Sampai
          <input
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setPage(1);
            }}
            className="input"
          />
        </label>
        <button
          type="button"
          onClick={resetFilters}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Reset
        </button>
      </div>

      <OrdersTable orders={visible} onReprint={onReprint} onEdit={onEdit} />

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-zinc-600">
          <span>
            Halaman {safePage} dari {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
