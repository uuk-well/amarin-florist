"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/lib/mock-data";
import { PaginatedOrders } from "@/app/components/orders/paginated-orders";
import { ReprintModal } from "@/app/components/orders/reprint-modal";
import { AppHeader } from "@/app/components/layout/app-header";
import { RequireAuth } from "@/app/components/auth/require-auth";

type SavedOrder = {
  id: string;
  senderName: string;
  greetingMessage: string;
  deliveryAddress: string;
  deliveryPhone: string;
  deliveryDateTime: string;
  createdAt: string;
};

export default function OrdersListPage() {
  const [reprintOrder, setReprintOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const stored: SavedOrder[] = JSON.parse(
      localStorage.getItem("amarin_orders") || "[]"
    );
    const mapped: Order[] = stored.map((o) => ({
      id: o.id,
      customer_name: o.senderName,
      pic_order: "",
      vendor_name: "",
      flower_arrangement: o.greetingMessage,
      total_price: 0,
      created_at: o.createdAt,
    }));
    setOrders(mapped);
  }, []);

  return (
    <RequireAuth>
      <main className="min-h-screen bg-zinc-50">
        <AppHeader />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-1 text-2xl font-bold text-zinc-900">Daftar Pesanan</h1>
        <p className="mb-8 text-sm text-zinc-500">
          Riwayat seluruh transaksi pesanan.
        </p>

        <PaginatedOrders orders={orders} onReprint={setReprintOrder} />
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
