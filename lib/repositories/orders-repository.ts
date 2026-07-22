import type { Order, OrderInput } from "../models/order";
import { mockOrders, type Order as RawOrder } from "../mock-data";

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

function toModel(o: RawOrder): Order {
  return {
    id: o.id,
    vendorId: null,
    customerName: o.customer_name,
    picOrder: o.pic_order,
    flowerArrangement: o.flower_arrangement,
    quantity: 1,
    totalPrice: o.total_price,
    vendorCost: 0,
    greetingMessage: null,
    deliveryAddress: null,
    createdAt: o.created_at,
  };
}

export class MockOrdersRepository implements OrdersRepository {
  async list(filter?: OrderFilter): Promise<Order[]> {
    let orders = mockOrders.map(toModel);

    if (filter?.q) {
      const q = filter.q.toLowerCase();
      orders = orders.filter((o) =>
        [o.customerName, o.picOrder ?? "", o.vendorId ?? ""]
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
    const all = mockOrders.map(toModel);
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
      createdAt: new Date().toISOString(),
    };
    return order;
  }
}
