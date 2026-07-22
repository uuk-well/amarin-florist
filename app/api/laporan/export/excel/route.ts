import { MockOrdersRepository } from "@/lib/repositories/orders-repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repo = new MockOrdersRepository();
  const orders = await repo.list({
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
  });

  const totalIncome = orders.reduce((s, o) => s + o.totalPrice, 0);
  const totalVendor = orders.reduce((s, o) => s + o.vendorCost, 0);

  const vendorMap = new Map<string, { name: string; total: number; count: number }>();
  for (const o of orders) {
    const key = o.vendorId ?? "tanpa-vendor";
    const entry = vendorMap.get(key) ?? { name: key, total: 0, count: 0 };
    entry.total += o.totalPrice;
    entry.count += 1;
    vendorMap.set(key, entry);
  }

  const periodLabel = searchParams.get("from") || searchParams.get("to")
    ? `Periode ${searchParams.get("from") ?? "-"} s/d ${searchParams.get("to") ?? "-"}`
    : "Semua Periode";

  // Excel (CSV) di-generate di sisi klien (browser).
  // Endpoint ini mengembalikan payload laporan yang dibutuhkan generator CSV.
  return Response.json({
    report: {
      periodLabel,
      totalIncome,
      totalVendor,
      vendorPayments: [...vendorMap.values()],
      orders: orders.map((o) => ({
        id: o.id,
        customerName: o.customerName,
        vendorName: o.vendorId ?? "-",
        total: o.totalPrice,
      })),
    },
  });
}
