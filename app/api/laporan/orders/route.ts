import { MockOrdersRepository } from "@/lib/repositories/orders-repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repo = new MockOrdersRepository();
  const orders = await repo.list({
    q: searchParams.get("q") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
  });

  const totalIncome = orders.reduce((s, o) => s + o.totalPrice, 0);
  const totalVendor = orders.reduce((s, o) => s + o.vendorCost, 0);

  return Response.json({
    orders,
    summary: { totalIncome, totalVendor, count: orders.length },
  });
}
