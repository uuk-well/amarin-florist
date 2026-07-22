import { getTodaysOrders } from "@/lib/services/todays-orders";
import { MockOrdersRepository } from "@/lib/repositories/orders-repository";

export async function GET() {
  const repo = new MockOrdersRepository();
  const orders = await getTodaysOrders(repo);
  return Response.json({ orders });
}
