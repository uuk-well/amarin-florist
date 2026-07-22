import { IncomeSummary } from "./components/dashboard/income-summary";
import { TodayOrdersList } from "./components/dashboard/today-orders-list";
import { WeeklyIncomeChart } from "./components/dashboard/weekly-income-chart";
import { AppHeader } from "./components/layout/app-header";
import { RequireAuth } from "./components/auth/require-auth";
import { mockIncome, mockOrders, mockWeeklyIncome } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <main className="min-h-screen bg-zinc-50">
        <AppHeader />

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <IncomeSummary
            today={mockIncome.today}
            thisWeek={mockIncome.thisWeek}
            thisMonth={mockIncome.thisMonth}
          />

          <section className="mt-6">
            <WeeklyIncomeChart data={mockWeeklyIncome} />
          </section>

          <section className="mt-10">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900">Pesanan Hari Ini</h2>
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
              <TodayOrdersList orders={mockOrders} />
            </div>
          </section>
        </div>
      </main>
    </RequireAuth>
  );
}
