import { MockOrdersRepository } from "@/lib/repositories/orders-repository";

const PAGE_SIZE = 5;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));

  const repo = new MockOrdersRepository();
  const all = await repo.list({
    q: searchParams.get("q") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
  });

  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const orders = all.slice(start, start + PAGE_SIZE);

  return Response.json({
    orders,
    page,
    totalPages,
    total,
  });
}
