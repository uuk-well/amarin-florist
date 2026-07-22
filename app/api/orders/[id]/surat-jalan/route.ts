import { MockOrdersRepository } from "@/lib/repositories/orders-repository";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/orders/[id]/surat-jalan">
) {
  const { id } = await ctx.params;
  const repo = new MockOrdersRepository();
  const order = await repo.getById(id);

  if (!order) {
    return Response.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  }

  // PDF di-generate di sisi klien (browser) via jsPDF.
  // Endpoint ini mengembalikan data pesanan yang dibutuhkan generator PDF.
  return Response.json({ order });
}
