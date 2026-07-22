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

  // --- Header kiri: logo + info toko ---
  doc.setFillColor(225, 29, 72);
  doc.circle(margin + 6, 18, 6, "F");
  doc.setTextColor(255);
  doc.setFontSize(12);
  doc.text("A", margin + 6, 22, { align: "center" });

  doc.setTextColor(0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(STORE.name, margin + 16, 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90);
  doc.text(STORE.address, margin + 16, 22);
  doc.text(`Telp. ${STORE.phone}`, margin + 16, 27);
  doc.text(STORE.web, margin + 16, 32);

  // --- Header kanan: judul invoice + detail ---
  doc.setTextColor(0);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", right, 18, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90);
  doc.text(`No. Invoice: ${order.id}`, right, 26, { align: "right" });
  doc.text(`Tanggal: ${formatDate(order.createdAt)}`, right, 31, {
    align: "right",
  });

  doc.setDrawColor(0);
  doc.setLineDashPattern([1, 1], 0);
  doc.line(margin, 44, right, 44);

  // --- Info pelanggan ---
  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Kepada Yth,", margin, 54);
  doc.setFont("helvetica", "normal");
  doc.text(order.customerName || "", margin, 60);

  if (order.deliveryPhone) {
    doc.setTextColor(90);
    doc.setFontSize(9);
    doc.text(`No. HP Penerima: ${order.deliveryPhone}`, right, 54, { align: "right" });
  }

  doc.setDrawColor(0);
  doc.line(margin, 68, right, 68);

  // --- Foto + deskripsi ---
  const photoX = margin;
  const photoY = 74;
  const photoW = 50;
  const photoH = 65;
  doc.setDrawColor(200);
  doc.rect(photoX, photoY, photoW, photoH);
  if (order.productPhoto) {
    try {
      doc.addImage(order.productPhoto, "JPEG", photoX, photoY, photoW, photoH);
    } catch {
      doc.setTextColor(160);
      doc.setFontSize(8);
      doc.text("Foto Produk", photoX + photoW / 2, photoY + photoH / 2, { align: "center" });
    }
  } else {
    doc.setTextColor(160);
    doc.setFontSize(8);
    doc.text("Foto Produk", photoX + photoW / 2, photoY + photoH / 2, { align: "center" });
  }

  const descX = photoX + photoW + 10;
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("KETERANGAN", descX, photoY + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const msg = order.greetingMessage || "—";
  const msgLines = doc.splitTextToSize(msg.toUpperCase(), right - descX);
  doc.text(msgLines, descX, photoY + 11);
  let dy = photoY + 11 + msgLines.length * 5;

  if (order.senderName) {
    doc.text(`Pengirim: ${order.senderName}`, descX, dy + 4);
    dy += 7;
  }
  if (order.deliveryDateTime) {
    doc.text(`Tgl/Jam kirim: ${order.deliveryDateTime}`, descX, dy + 4);
    dy += 7;
  }
  doc.text(`Alamat: ${order.deliveryAddress || "—"}`, descX, dy + 4);
  dy += 12;

  // --- Harga ---
  if (order.totalPrice > 0) {
    doc.setDrawColor(200);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const priceY = dy + 4;
    doc.line(margin, priceY, right, priceY);
    doc.text("Harga Jual", margin, priceY + 6);
    doc.setFont("helvetica", "bold");
    doc.text(formatRupiah(order.totalPrice), right, priceY + 6, { align: "right" });
    doc.setFont("helvetica", "normal");
    dy = priceY + 10;

    if (order.vendorCost > 0) {
      doc.text("Harga Vendor", margin, dy);
      doc.text(formatRupiah(order.vendorCost), right, dy, { align: "right" });
      dy += 6;
    }

    if (order.vendorCost > 0) {
      doc.setDrawColor(200);
      doc.line(margin, dy, right, dy);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(225, 29, 72);
      doc.text("Laba", margin, dy + 6);
      doc.text(formatRupiah(order.totalPrice - order.vendorCost), right, dy + 6, { align: "right" });
      doc.setTextColor(0);
      dy += 10;
    }
  }

  // --- Footer: pembayaran ---
  const footY = Math.max(dy + 30, 170);
  doc.setDrawColor(0);
  doc.line(margin, footY, right, footY);
  doc.setTextColor(0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Payment", margin, footY + 8);
  doc.setFont("helvetica", "normal");
  doc.text(`BCA = 2290294323 / a.n. Doni Candra Nugroho`, margin, footY + 14);

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
