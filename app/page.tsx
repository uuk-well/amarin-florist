"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { IncomeSummary } from "./components/dashboard/income-summary";
import { TodayOrdersList } from "./components/dashboard/today-orders-list";
import { WeeklyIncomeChart } from "./components/dashboard/weekly-income-chart";
import { AppHeader } from "./components/layout/app-header";
import { RequireAuth } from "./components/auth/require-auth";
import type { PeriodFinance } from "./components/dashboard/summary-card";
import type { WeeklyPoint } from "@/lib/mock-data";

const STORAGE_KEY = "amarin_finance";

type FinanceData = {
  today: PeriodFinance;
  thisWeek: PeriodFinance;
  thisMonth: PeriodFinance;
  thisYear: PeriodFinance;
};

function defaultFinance(): FinanceData {
  return {
    today: { income: 0, vendorExpense: 0 },
    thisWeek: { income: 0, vendorExpense: 0 },
    thisMonth: { income: 0, vendorExpense: 0 },
    thisYear: { income: 0, vendorExpense: 0 },
  };
}

function loadFinance(): FinanceData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultFinance();
}

function saveFinance(data: FinanceData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function DashboardPage() {
  const [finance, setFinance] = useState<FinanceData>(defaultFinance);
  const [weeklyData, setWeeklyData] = useState<WeeklyPoint[]>(
    DAY_LABELS.map((label) => ({ label, amount: 0 }))
  );

  useEffect(() => {
    setFinance(loadFinance());

    const stored: { totalPrice?: number; createdAt: string }[] = JSON.parse(
      localStorage.getItem("amarin_orders") || "[]"
    );

    const now = new Date();
    const weekStart = new Date(now);
    const day = weekStart.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    weekStart.setDate(weekStart.getDate() + diff);
    weekStart.setHours(0, 0, 0, 0);

    const dayTotals = DAY_LABELS.map(() => 0);

    for (const order of stored) {
      const createdAt = new Date(order.createdAt);
      if (!isNaN(createdAt.getTime()) && createdAt >= weekStart) {
        const dayIdx = createdAt.getDay();
        dayTotals[dayIdx] += order.totalPrice || 0;
      }
    }

    setWeeklyData(DAY_LABELS.map((label, i) => ({ label, amount: dayTotals[i] })));
  }, []);

  const handleFinanceChange = useCallback(
    (period: keyof FinanceData, value: PeriodFinance) => {
      setFinance((prev) => {
        const next = { ...prev, [period]: value };
        saveFinance(next);
        return next;
      });
    },
    []
  );

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
