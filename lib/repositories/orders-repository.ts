import type { Order, OrderInput } from "../models/order";

export type OrderFilter = {
  q?: string;
  from?: string;
  to?: string;
};

export interface OrdersRepository {
  list(filter?: OrderFilter): Promise<Order[]>;
  getById(id: string): Promise<Order | null>;
  create(input: OrderInput): Promise<Order>;
}

// Global store agar data persist antar request (filesystem/write-read di Vercel terbatas)
const globalOrders: Order[] = [];

export function addSavedOrder(order: Order) {
  globalOrders.unshift(order);
}

export function getSavedOrders(): Order[] {
  return [...globalOrders];
}

export class MockOrdersRepository implements OrdersRepository {
  async list(filter?: OrderFilter): Promise<Order[]> {
    let orders = [...getSavedOrders()];

    if (filter?.q) {
      const q = filter.q.toLowerCase();
      orders = orders.filter((o) =>
        [o.customerName, o.picOrder ?? "", o.flowerArrangement]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    if (filter?.from) {
      const from = new Date(filter.from);
      orders = orders.filter((o) => new Date(o.createdAt) >= from);
    }
    if (filter?.to) {
      const to = new Date(filter.to);
      to.setHours(23, 59, 59, 999);
      orders = orders.filter((o) => new Date(o.createdAt) <= to);
    }

    return orders;
  }

  async getById(id: string): Promise<Order | null> {
    const all = getSavedOrders();
    return all.find((o) => o.id === id) ?? null;
  }

  async create(input: OrderInput): Promise<Order> {
    const order: Order = {
      id: input.id,
      vendorId: input.vendorId ?? null,
      customerName: input.customerName,
      picOrder: input.picOrder ?? null,
      flowerArrangement: input.flowerArrangement,
      quantity: input.quantity ?? 1,
      totalPrice: input.totalPrice,
      vendorCost: input.vendorCost ?? 0,
      greetingMessage: input.greetingMessage ?? null,
      deliveryAddress: input.deliveryAddress ?? null,
      deliveryPhone: input.deliveryPhone ?? null,
      customerEmail: input.customerEmail ?? null,
      shippingCost: input.shippingCost ?? null,
      productPhoto: input.productPhoto ?? null,
      senderName: input.senderName ?? null,
      deliveryDateTime: input.deliveryDateTime ?? null,
      createdAt: new Date().toISOString(),
    };
    addSavedOrder(order);
    return order;
  }
}
