import type { WeeklyPoint } from "@/lib/mock-data";

function formatRupiahShort(value: number): string {
  if (value >= 1_000_000) {
    return `Rp${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}jt`;
  }
  if (value >= 1_000) {
    return `Rp${(value / 1_000).toFixed(0)}rb`;
  }
  return `Rp${value}`;
}

export function WeeklyIncomeChart({ data }: { data: WeeklyPoint[] }) {
  const max = Math.max(...data.map((d) => d.amount), 1);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-zinc-700">
        Tren Penghasilan Mingguan
      </h3>
      <div className="flex h-44 items-end gap-2">
        {data.map((point) => {
          const height = `${(point.amount / max) * 100}%`;
          return (
            <div
              key={point.label}
              className="flex flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="text-[10px] font-medium text-zinc-500">
                {point.amount > 0 ? formatRupiahShort(point.amount) : ""}
              </span>
              <div
                className="w-full rounded-t-md bg-rose-400 transition-all hover:bg-rose-500"
                style={{ height }}
                title={formatRupiahShort(point.amount)}
              />
              <span className="text-xs text-zinc-500">{point.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
