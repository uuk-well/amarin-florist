"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IncomeSummary } from "./components/dashboard/income-summary";
import { TodayOrdersList } from "./components/dashboard/today-orders-list";
import { WeeklyIncomeChart } from "./components/dashboard/weekly-income-chart";
import { AppHeader } from "./components/layout/app-header";
import { RequireAuth } from "./components/auth/require-auth";
import type { WeeklyPoint } from "@/lib/mock-data";

type SavedOrder = {
  id: string;
  senderName: string;
  greetingMessage: string;
  deliveryAddress: string;
  deliveryPhone: string;
  deliveryDateTime: string;
  createdAt: string;
  totalPrice: number;
  vendorCost: number;
};

function getWeekStart(d: Date): Date {
  const start = new Date(d);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getMonthStart(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function DashboardPage() {
  const [todayIncome, setTodayIncome] = useState(0);
  const [weekIncome, setWeekIncome] = useState(0);
  const [monthIncome, setMonthIncome] = useState(0);
  const [weeklyData, setWeeklyData] = useState<WeeklyPoint[]>(
    DAY_LABELS.map((label) => ({ label, amount: 0 }))
  );

  useEffect(() => {
    const stored: SavedOrder[] = JSON.parse(
      localStorage.getItem("amarin_orders") || "[]"
    );

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = getWeekStart(now);
    const monthStart = getMonthStart(now);

    let todaySum = 0;
    let weekSum = 0;
    let monthSum = 0;
    const dayTotals = DAY_LABELS.map(() => 0);

    for (const order of stored) {
      const createdAt = new Date(order.createdAt);
      const price = order.totalPrice || 0;

      if (createdAt >= todayStart) todaySum += price;
      if (createdAt >= weekStart) weekSum += price;
      if (createdAt >= monthStart) monthSum += price;

      if (!isNaN(createdAt.getTime()) && createdAt >= weekStart) {
        const dayIdx = createdAt.getDay();
        dayTotals[dayIdx] += price;
      }
    }

    setTodayIncome(todaySum);
    setWeekIncome(weekSum);
    setMonthIncome(monthSum);
    setWeeklyData(DAY_LABELS.map((label, i) => ({ label, amount: dayTotals[i] })));
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
            today={todayIncome}
            thisWeek={weekIncome}
            thisMonth={monthIncome}
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
