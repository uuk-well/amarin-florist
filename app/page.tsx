import Link from "next/link";
import { IncomeSummary } from "./components/dashboard/income-summary";
import { TodayOrdersList } from "./components/dashboard/today-orders-list";
import { WeeklyIncomeChart } from "./components/dashboard/weekly-income-chart";
import { AppHeader } from "./components/layout/app-header";
import { RequireAuth } from "./components/auth/require-auth";
import { mockIncome, mockWeeklyIncome } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <main className="min-h-screen bg-zinc-50">
        <AppHeader />

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-zinc-900">Dasbor</h1>
            <Link
              href="/pesanan-baru"
              className="rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-600"
            >
              + Pesanan Baru
            </Link>
          </div>

          <IncomeSummary
            today={mockIncome.today}
            thisWeek={mockIncome.thisWeek}
            thisMonth={mockIncome.thisMonth}
          />

          <section className="mt-6">
            <WeeklyIncomeChart data={mockWeeklyIncome} />
          </section>

          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900">Pesanan Hari Ini</h2>
              <Link
                href="/daftar-pesanan"
                className="text-sm font-medium text-rose-600 hover:text-rose-700"
              >
                Lihat Semua &rarr;
              </Link>
            </div>
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
              <TodayOrdersList />
            </div>
          </section>
        </div>
      </main>
    </RequireAuth>
  );
}
