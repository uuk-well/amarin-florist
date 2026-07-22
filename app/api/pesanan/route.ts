import { MockOrdersRepository } from "@/lib/repositories/orders-repository";
import type { OrderInput } from "@/lib/models/order";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repo = new MockOrdersRepository();
  const orders = await repo.list({
    q: searchParams.get("q") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
  });
  return Response.json({ orders });
}


function generateInvoiceId(date = new Date()): string {
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(Math.random() * 90 + 10);
  return `INV-${ymd}-${rand}`;
}

export async function POST(request: Request) {
  let body: Partial<OrderInput>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  if (!body.customerName?.toString().trim()) {
    return Response.json(
      { error: "Nama pelanggan wajib diisi." },
      { status: 400 }
    );
  }
  if (!body.flowerArrangement?.toString().trim()) {
    return Response.json(
      { error: "Rangkaian bunga wajib diisi." },
      { status: 400 }
    );
  }
  if (!body.totalPrice || body.totalPrice <= 0) {
    return Response.json(
      { error: "Total harga harus lebih dari 0." },
      { status: 400 }
    );
  }

  const input: OrderInput = {
    id: body.id?.toString().trim() || generateInvoiceId(),
    vendorId: body.vendorId ?? null,
    customerName: body.customerName,
    picOrder: body.picOrder ?? null,
    flowerArrangement: body.flowerArrangement,
    quantity: body.quantity ?? 1,
    totalPrice: Number(body.totalPrice),
    vendorCost: Number(body.vendorCost ?? 0),
    greetingMessage: body.greetingMessage ?? null,
    deliveryAddress: body.deliveryAddress ?? null,
  };

  const repo = new MockOrdersRepository();
  const order = await repo.create(input);

  return Response.json({ order }, { status: 201 });
}
