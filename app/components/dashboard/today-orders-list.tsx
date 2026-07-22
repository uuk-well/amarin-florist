"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/lib/models/order";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function TodayOrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/pesanan")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders ?? []))
      .catch(() => {});
  }, []);

  if (orders.length === 0) {
    return (
      <p className="px-5 py-8 text-center text-sm text-zinc-400">
        Belum ada pesanan hari ini.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-100">
      {orders.map((order) => (
        <li
          key={order.id}
          className="flex items-center justify-between px-5 py-4"
        >
          <div>
            <p className="font-medium text-zinc-900">
              {order.senderName || order.customerName}
            </p>
            <p className="text-sm text-zinc-500">
              {order.greetingMessage || order.flowerArrangement}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-400">
              {new Date(order.createdAt).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
