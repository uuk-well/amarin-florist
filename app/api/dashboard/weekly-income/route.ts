import { getWeeklyIncome } from "@/lib/services/weekly-income";
import { MockOrdersRepository } from "@/lib/repositories/orders-repository";

export async function GET() {
  const repo = new MockOrdersRepository();
  const data = await getWeeklyIncome(repo);
  return Response.json({ data });
}
