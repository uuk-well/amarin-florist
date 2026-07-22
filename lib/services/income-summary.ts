import type { OrdersRepository } from "../repositories/orders-repository";

export type IncomeSummary = {
  today: number;
  thisWeek: number;
  thisMonth: number;
};

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d: Date): Date {
  const x = new Date(d);
  const day = x.getDay();
  const diff = (day + 6) % 7;
  x.setDate(x.getDate() - diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

export async function getIncomeSummary(
  repo: OrdersRepository,
  now: Date = new Date()
): Promise<IncomeSummary> {
  const orders = await repo.list();
  const dayStart = startOfDay(now);
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  let today = 0;
  let thisWeek = 0;
  let thisMonth = 0;

  for (const order of orders) {
    const created = new Date(order.createdAt);
    const amount = Number(order.totalPrice) || 0;
    if (created >= monthStart) thisMonth += amount;
    if (created >= weekStart) thisWeek += amount;
    if (created >= dayStart) today += amount;
  }

  return { today, thisWeek, thisMonth };
}
