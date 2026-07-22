import { formatRupiah } from "@/lib/utils/currency";

export type VendorPayment = {
  name: string;
  count: number;
  total: number;
};

export function VendorPaymentsList({ items }: { items: VendorPayment[] }) {
  const totalKewajiban = items.reduce((s, v) => s + v.total, 0);

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-5 py-3">Vendor</th>
            <th className="px-5 py-3 text-right">Jumlah Pesanan</th>
            <th className="px-5 py-3 text-right">Total Nilai</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {items.map((v) => (
            <tr key={v.name}>
              <td className="px-5 py-3 font-medium text-zinc-900">{v.name}</td>
              <td className="px-5 py-3 text-right text-zinc-600">{v.count}</td>
              <td className="px-5 py-3 text-right font-semibold text-rose-600">
                {formatRupiah(v.total)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-zinc-200 bg-zinc-50">
            <td className="px-5 py-3 text-sm font-semibold text-zinc-900" colSpan={2}>
              Total Kewajiban Vendor
            </td>
            <td className="px-5 py-3 text-right text-sm font-semibold text-rose-600">
              {formatRupiah(totalKewajiban)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
