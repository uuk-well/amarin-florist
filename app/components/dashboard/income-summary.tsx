import { SummaryCard, type PeriodFinance } from "./summary-card";

type IncomeSummaryProps = {
  today: PeriodFinance;
  thisWeek: PeriodFinance;
  thisMonth: PeriodFinance;
  thisYear: PeriodFinance;
  overrides: Set<string>;
  onChange: (period: "today" | "thisWeek" | "thisMonth" | "thisYear", value: PeriodFinance) => void;
  onReset: (period: "today" | "thisWeek" | "thisMonth" | "thisYear") => void;
};

export function IncomeSummary({ today, thisWeek, thisMonth, thisYear, overrides, onChange, onReset }: IncomeSummaryProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        label="Hari Ini"
        finance={today}
        onChange={(v) => onChange("today", v)}
        onReset={() => onReset("today")}
        overridden={overrides.has("today")}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        }
      />
      <SummaryCard
        label="Minggu Ini"
        finance={thisWeek}
        onChange={(v) => onChange("thisWeek", v)}
        onReset={() => onReset("thisWeek")}
        overridden={overrides.has("thisWeek")}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
          </svg>
        }
      />
      <SummaryCard
        label="Bulan Ini"
        finance={thisMonth}
        onChange={(v) => onChange("thisMonth", v)}
        onReset={() => onReset("thisMonth")}
        overridden={overrides.has("thisMonth")}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        }
      />
      <SummaryCard
        label="Tahun Ini"
        finance={thisYear}
        onChange={(v) => onChange("thisYear", v)}
        onReset={() => onReset("thisYear")}
        overridden={overrides.has("thisYear")}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
          </svg>
        }
      />
    </section>
  );
}
