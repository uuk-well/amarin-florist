import type { Order } from "@/lib/mock-data";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TodayOrdersList({ orders }: { orders: Order[] }) {
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
        <li key={order.id} className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="font-medium text-zinc-900">{order.customer_name}</p>
            <p className="text-sm text-zinc-500">{order.flower_arrangement}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-rose-600">
              {formatRupiah(order.total_price)}
            </p>
            <p className="text-xs text-zinc-400">{formatTime(order.created_at)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
