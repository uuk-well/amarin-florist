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

  if (!body.senderName?.toString().trim()) {
    return Response.json(
      { error: "Pengirim wajib diisi." },
      { status: 400 }
    );
  }
  if (!body.greetingMessage?.toString().trim()) {
    return Response.json(
      { error: "Ucapan wajib diisi." },
      { status: 400 }
    );
  }
  if (!body.deliveryAddress?.toString().trim()) {
    return Response.json(
      { error: "Alamat kirim wajib diisi." },
      { status: 400 }
    );
  }

  const input: OrderInput = {
    id: body.id?.toString().trim() || generateInvoiceId(),
    customerName: body.senderName,
    flowerArrangement: body.greetingMessage ?? "",
    totalPrice: 0,
    vendorId: null,
    picOrder: null,
    quantity: 1,
    vendorCost: 0,
    greetingMessage: body.greetingMessage ?? null,
    deliveryAddress: body.deliveryAddress ?? null,
    deliveryPhone: body.deliveryPhone ?? null,
    senderName: body.senderName ?? null,
    deliveryDateTime: body.deliveryDateTime ?? null,
    productPhoto: body.productPhoto ?? null,
  };

  const repo = new MockOrdersRepository();
  const order = await repo.create(input);

  return Response.json({ order }, { status: 201 });
}
