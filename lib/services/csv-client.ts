import type { FinanceReportData } from "./pdf-client";

function escapeCsv(value: string | number): string {
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function generateFinanceReportCsv(data: FinanceReportData): void {
  const rows: (string | number)[][] = [];

  rows.push(["Laporan Keuangan", data.periodLabel]);
  rows.push([]);
  rows.push(["Total Pendapatan", data.totalIncome]);
  rows.push(["Total Bayar Vendor", data.totalVendor]);
  rows.push([]);
  rows.push(["Pembayaran Vendor"]);
  rows.push(["Vendor", "Jumlah Pesanan", "Total Nilai"]);
  for (const v of data.vendorPayments) {
    rows.push([v.name, v.count, v.total]);
  }
  rows.push([]);
  rows.push(["Detail Pesanan"]);
  rows.push(["No. Invoice", "Pelanggan", "Vendor", "Total"]);
  for (const o of data.orders) {
    rows.push([o.id, o.customerName, o.vendorName, o.total]);
  }

  const csv = rows
    .map((row) => row.map(escapeCsv).join(","))
    .join("\r\n");

  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "laporan-keuangan.csv";
  link.click();
  URL.revokeObjectURL(url);
}
