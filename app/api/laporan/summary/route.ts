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

  const byVendor = new Map<string, { name: string; total: number; count: number }>();
  // vendor relation belum ada di mock model; agregasi via vendorId yang tersedia.
  for (const o of orders) {
    const key = o.vendorId ?? "tanpa-vendor";
    const entry = byVendor.get(key) ?? { name: key, total: 0, count: 0 };
    entry.total += o.totalPrice;
    entry.count += 1;
    byVendor.set(key, entry);
  }

  return Response.json({
    summary: {
      totalIncome,
      totalVendor,
      count: orders.length,
    },
    vendorPayments: [...byVendor.values()],
  });
}
