type SummaryCardProps = {
  label: string;
  amount: number;
  icon: React.ReactNode;
};

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function SummaryCard({ label, amount, icon }: SummaryCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-zinc-500">{label}</span>
        <span className="text-xl font-semibold text-zinc-900">
          {formatRupiah(amount)}
        </span>
      </div>
    </div>
  );
}
