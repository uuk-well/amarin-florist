"use client";

import { useEffect, useState } from "react";

type SavedOrder = {
  id: string;
  senderName: string;
  greetingMessage: string;
  deliveryAddress: string;
  deliveryPhone: string;
  deliveryDateTime: string;
  createdAt: string;
};

export function TodayOrdersList() {
  const [orders, setOrders] = useState<SavedOrder[]>([]);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("amarin_orders") || "[]"
    );
    setOrders(stored);
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
            <p className="font-medium text-zinc-900">{order.senderName}</p>
            <p className="text-sm text-zinc-500">{order.greetingMessage}</p>
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
