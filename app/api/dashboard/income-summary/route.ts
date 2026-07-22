import { getIncomeSummary } from "@/lib/services/income-summary";
import { MockOrdersRepository } from "@/lib/repositories/orders-repository";

export async function GET() {
  const repo = new MockOrdersRepository();
  const summary = await getIncomeSummary(repo);
  return Response.json(summary);
}
