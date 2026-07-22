"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { IncomeSummary } from "./components/dashboard/income-summary";
import { TodayOrdersList } from "./components/dashboard/today-orders-list";
import { WeeklyIncomeChart } from "./components/dashboard/weekly-income-chart";
import { AppHeader } from "./components/layout/app-header";
import { RequireAuth } from "./components/auth/require-auth";
import type { WeeklyPoint } from "@/lib/mock-data";

type Period = "today" | "thisWeek" | "thisMonth" | "thisYear";

type SavedOrder = {
  totalPrice?: number;
  vendorCost?: number;
  createdAt: string;
};

type PeriodFinance = { income: number; vendorExpense: number };

function calcFromOrders(orders: SavedOrder[]): Record<Period, PeriodFinance> {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now);
  const day = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() + (day === 0 ? -6 : 1 - day));
  weekStart.setHours(0, 0, 0, 0);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const sum: Record<Period, PeriodFinance> = {
    today: { income: 0, vendorExpense: 0 },
    thisWeek: { income: 0, vendorExpense: 0 },
    thisMonth: { income: 0, vendorExpense: 0 },
    thisYear: { income: 0, vendorExpense: 0 },
  };

  for (const o of orders) {
    const d = new Date(o.createdAt);
    if (isNaN(d.getTime())) continue;
    const inc = Number(o.totalPrice) || 0;
    const exp = Number(o.vendorCost) || 0;
    if (d >= todayStart) { sum.today.income += inc; sum.today.vendorExpense += exp; }
    if (d >= weekStart) { sum.thisWeek.income += inc; sum.thisWeek.vendorExpense += exp; }
    if (d >= monthStart) { sum.thisMonth.income += inc; sum.thisMonth.vendorExpense += exp; }
    if (d >= yearStart) { sum.thisYear.income += inc; sum.thisYear.vendorExpense += exp; }
  }
  return sum;
}

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function DashboardPage() {
  const [finance, setFinance] = useState<Record<Period, PeriodFinance>>({
    today: { income: 0, vendorExpense: 0 },
    thisWeek: { income: 0, vendorExpense: 0 },
    thisMonth: { income: 0, vendorExpense: 0 },
    thisYear: { income: 0, vendorExpense: 0 },
  });
  const [weeklyData, setWeeklyData] = useState<WeeklyPoint[]>(
    DAY_LABELS.map((label) => ({ label, amount: 0 }))
  );

  useEffect(() => {
    const stored: SavedOrder[] = JSON.parse(
      localStorage.getItem("amarin_orders") || "[]"
    );

    const fromOrders = calcFromOrders(stored);

    setFinance(fromOrders);

    // Chart mingguan
    const now = new Date();
    const weekStart = new Date(now);
    const day = weekStart.getDay();
    weekStart.setDate(weekStart.getDate() + (day === 0 ? -6 : 1 - day));
    weekStart.setHours(0, 0, 0, 0);
    const dayTotals = DAY_LABELS.map(() => 0);
    for (const o of stored) {
      const d = new Date(o.createdAt);
      if (!isNaN(d.getTime()) && d >= weekStart) {
        dayTotals[d.getDay()] += o.totalPrice || 0;
      }
    }
    setWeeklyData(DAY_LABELS.map((label, i) => ({ label, amount: dayTotals[i] })));
  }, []);

  const handleFinanceChange = useCallback(
    (period: Period, value: PeriodFinance) => {
      setFinance((prev) => ({ ...prev, [period]: value }));
    },
    []
  );

  const handleFinanceReset = useCallback((period: Period) => {
    const stored: SavedOrder[] = JSON.parse(
      localStorage.getItem("amarin_orders") || "[]"
    );
    const fromOrders = calcFromOrders(stored);
    setFinance((prev) => ({ ...prev, [period]: fromOrders[period] }));
  }, []);

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
            today={finance.today}
            thisWeek={finance.thisWeek}
            thisMonth={finance.thisMonth}
            thisYear={finance.thisYear}
            onChange={handleFinanceChange}
          />

          <section className="mt-6">
            <WeeklyIncomeChart data={weeklyData} />
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
