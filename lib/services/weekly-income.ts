import type { OrdersRepository } from "../repositories/orders-repository";
import type { WeeklyPoint } from "../mock-data";

const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function mondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getWeeklyIncome(
  repo: OrdersRepository,
  now: Date = new Date()
): Promise<WeeklyPoint[]> {
  const orders = await repo.list();
  const weekStart = mondayOf(now);

  const points: WeeklyPoint[] = DAY_LABELS.map((label) => ({ label, amount: 0 }));

  for (const order of orders) {
    const created = new Date(order.createdAt);
    if (created < weekStart) continue;
    const dayIndex = (created.getDay() + 6) % 7;
    points[dayIndex].amount += Number(order.totalPrice) || 0;
  }

  return points;
}
