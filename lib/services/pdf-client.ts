"use client";

import { jsPDF } from "jspdf";
import type { Order } from "../models/order";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const STORE = {
  name: "AMARIN FLORIST",
  address: "Jl. Kemandoran II No. 25E, Jakarta Selatan",
  phone: "08111234547",
  web: "www.bungatangerang.com",
  bank: "BCA",
  accountName: "Doni Candra Nugroho",
  accountNo: "2290294323",
};

export function generateInvoicePdf(order: Order, _vendorName: string | null): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 16;
  const right = 210 - margin;

  // Header
  doc.setFillColor(225, 29, 72);
  doc.circle(margin + 5, 15, 5, "F");
  doc.setTextColor(255);
  doc.setFontSize(10);
  doc.text("A", margin + 5, 18, { align: "center" });
  doc.setTextColor(0);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(STORE.name, margin + 14, 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(90);
  doc.text(STORE.address, margin + 14, 19);
  doc.text(`Telp. ${STORE.phone}`, margin + 14, 24);
  doc.text(STORE.web, margin + 14, 29);

  doc.setTextColor(0);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", right, 14, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(90);
  doc.text(order.id, right, 20, { align: "right" });
  doc.text(formatDate(order.createdAt), right, 25, { align: "right" });

  doc.setDrawColor(0);
  doc.setLineDashPattern([1, 1], 0);
  doc.line(margin, 38, right, 38);

  // Body
  let y = 48;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Ucapan :", margin, y);
  doc.setFont("helvetica", "normal");
  y += 5;
  const greet = order.greetingMessage ?? order.flowerArrangement ?? "—";
  const greetLines = doc.splitTextToSize(greet, right - margin);
  doc.text(greetLines, margin, y);
  y += greetLines.length * 5 + 6;

  if (order.senderName) {
    doc.setFont("helvetica", "bold");
    doc.text("Pengirim :", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(order.senderName, margin + 40, y);
    y += 7;
  }

  if (order.deliveryPhone) {
    doc.setFont("helvetica", "bold");
    doc.text("No. HP Penerima :", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(order.deliveryPhone, margin + 55, y);
    y += 7;
  }

  if (order.deliveryDateTime) {
    doc.setFont("helvetica", "bold");
    doc.text("Tgl & Jam kirim :", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(order.deliveryDateTime, margin + 50, y);
    y += 7;
  }

  doc.setFont("helvetica", "bold");
  doc.text("Alamat kirim :", margin, y);
  doc.setFont("helvetica", "normal");
  y += 5;
  const addr = order.deliveryAddress ?? "—";
  const addrLines = doc.splitTextToSize(addr, right - margin);
  doc.text(addrLines, margin, y);
  y += addrLines.length * 5 + 8;

  // Payment info
  doc.setDrawColor(0);
  doc.line(margin, y, right, y);
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.text("Payment", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  y += 5;
  doc.text("BCA = 2290294323 / a.n. Doni Candra Nugroho", margin, y);

  doc.save(`invoice-${order.id}.pdf`);
}

export function generateSuratJalanPdf(order: Order): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 16;

  doc.setFontSize(20);
  doc.text("SURAT JALAN", margin, 24);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`No. ${order.id}`, margin, 31);
  doc.text(formatDate(order.createdAt), 210 - margin, 31, { align: "right" });

  doc.setTextColor(0);
  doc.setFontSize(11);
  doc.text("Pelanggan:", margin, 60);
  doc.text(order.customerName, margin + 35, 60);
  doc.text("PIC Pesanan:", margin, 67);
  doc.text(order.picOrder ?? "-", margin + 35, 67);
  doc.text("Rangkaian Bunga:", margin, 74);
  doc.text(order.flowerArrangement, margin + 35, 74);
  doc.text("Jumlah:", margin, 81);
  doc.text(String(order.quantity), margin + 35, 81);
  doc.text("Alamat Pengiriman:", margin, 88);
  doc.text(order.deliveryAddress ?? "-", margin + 35, 88);

  if (order.greetingMessage) {
    doc.text("Ucapan:", margin, 102);
    doc.text(order.greetingMessage, margin + 35, 102);
  }

  doc.save(`surat-jalan-${order.id}.pdf`);
}

export type FinanceReportData = {
  periodLabel: string;
  totalIncome: number;
  totalVendor: number;
  vendorPayments: { name: string; count: number; total: number }[];
  orders: { id: string; customerName: string; vendorName: string; total: number }[];
};

export function generateFinanceReportPdf(data: FinanceReportData): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 16;

  doc.setFontSize(18);
  doc.text("Laporan Keuangan", margin, 22);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(data.periodLabel, margin, 29);

  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text("Total Pendapatan", margin, 45);
  doc.text(formatRupiah(data.totalIncome), 210 - margin, 45, { align: "right" });
  doc.text("Total Bayar Vendor", margin, 53);
  doc.text(formatRupiah(data.totalVendor), 210 - margin, 53, { align: "right" });

  doc.setFontSize(13);
  doc.text("Pembayaran Vendor", margin, 70);

  let y = 78;
  doc.setFontSize(10);
  for (const v of data.vendorPayments) {
    doc.text(v.name, margin, y);
    doc.text(`${v.count} pesanan`, 110, y);
    doc.text(formatRupiah(v.total), 210 - margin, y, { align: "right" });
    y += 7;
  }

  y += 6;
  doc.setFontSize(13);
  doc.text("Detail Pesanan", margin, y);
  y += 8;
  doc.setFontSize(9);
  for (const o of data.orders) {
    doc.text(o.id, margin, y);
    doc.text(o.customerName, 55, y);
    doc.text(o.vendorName, 120, y);
    doc.text(formatRupiah(o.total), 210 - margin, y, { align: "right" });
    y += 6;
  }

  doc.save("laporan-keuangan.pdf");
}
