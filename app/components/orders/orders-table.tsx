import type { Order } from "@/lib/mock-data";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function OrdersTable({
  orders,
  onReprint,
}: {
  orders: Order[];
  onReprint?: (order: Order) => void;
}) {
  if (orders.length === 0) {
    return (
      <p className="px-5 py-10 text-center text-sm text-zinc-400">
        Belum ada pesanan.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-5 py-3">No. Invoice</th>
            <th className="px-5 py-3">Pelanggan</th>
            <th className="px-5 py-3">Rangkaian</th>
            <th className="px-5 py-3">Tanggal</th>
            <th className="px-5 py-3 text-right">Total</th>
            <th className="px-5 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-zinc-50">
              <td className="px-5 py-3 font-mono text-xs text-zinc-500">
                {order.id}
              </td>
              <td className="px-5 py-3 font-medium text-zinc-900">
                {order.customer_name}
              </td>
              <td className="px-5 py-3 text-zinc-600">
                {order.flower_arrangement}
              </td>
              <td className="px-5 py-3 text-zinc-500">
                {formatDate(order.created_at)}
              </td>
              <td className="px-5 py-3 text-right font-semibold text-rose-600">
                {formatRupiah(order.total_price)}
              </td>
              <td className="px-5 py-3 text-right">
                {onReprint && (
                  <button
                    type="button"
                    onClick={() => onReprint(order)}
                    className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    Cetak Ulang
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
