import { formatRupiah } from "@/lib/utils/currency";

export function TotalIncomeCard({
  label,
  amount,
  variant = "default",
}: {
  label: string;
  amount: number;
  variant?: "default" | "vendor";
}) {
  const valueClass =
    variant === "vendor"
      ? "mt-1 text-xl font-semibold text-rose-600"
      : "mt-1 text-xl font-semibold text-zinc-900";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <span className="text-sm font-medium text-zinc-500">{label}</span>
      <p className={valueClass}>{formatRupiah(amount)}</p>
    </div>
  );
}
