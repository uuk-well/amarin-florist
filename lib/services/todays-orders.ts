import type { OrdersRepository } from "../repositories/orders-repository";
import type { Order } from "../models/order";

export async function getTodaysOrders(
  repo: OrdersRepository,
  now: Date = new Date()
): Promise<Order[]> {
  const orders = await repo.list();
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);

  return orders
    .filter((order) => new Date(order.createdAt) >= dayStart)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
