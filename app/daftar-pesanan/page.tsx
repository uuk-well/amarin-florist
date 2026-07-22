"use client";

import { useState } from "react";
import type { Order } from "@/lib/mock-data";
import { PaginatedOrders } from "@/app/components/orders/paginated-orders";
import { ReprintModal } from "@/app/components/orders/reprint-modal";
import { AppHeader } from "@/app/components/layout/app-header";
import { RequireAuth } from "@/app/components/auth/require-auth";
import { mockOrders } from "@/lib/mock-data";

export default function OrdersListPage() {
  const [reprintOrder, setReprintOrder] = useState<Order | null>(null);

  return (
    <RequireAuth>
      <main className="min-h-screen bg-zinc-50">
        <AppHeader />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-1 text-2xl font-bold text-zinc-900">Daftar Pesanan</h1>
        <p className="mb-8 text-sm text-zinc-500">
          Riwayat seluruh transaksi pesanan.
        </p>

        <PaginatedOrders orders={mockOrders} onReprint={setReprintOrder} />
      </div>

      {reprintOrder && (
        <ReprintModal
          order={reprintOrder}
          onClose={() => setReprintOrder(null)}
        />
      )}
      </main>
    </RequireAuth>
  );
}
