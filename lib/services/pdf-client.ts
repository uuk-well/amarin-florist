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

export function generateInvoicePdf(order: Order, vendorName: string | null): void {
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
  doc.text(`No. Invoice : ${order.id}`, right, 26, { align: "right" });
  doc.text(`Tanggal     : ${formatDate(order.createdAt)}`, right, 31, {
    align: "right",
  });
  doc.text(`No. Pesanan : SPK-${order.id}`, right, 36, { align: "right" });

  doc.setDrawColor(0);
  doc.setLineDashPattern([1, 1], 0);
  doc.line(margin, 44, right, 44);

  // --- Info pelanggan ---
  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.text("Kepada Yth,", margin, 54);
  doc.setFont("helvetica", "bold");
  doc.text(order.customerName, margin, 60);
  doc.setFont("helvetica", "normal");
  if (order.picOrder) {
    doc.text(order.picOrder, margin, 65);
  }

  doc.setTextColor(90);
  doc.setFontSize(9);
  doc.text(`Telepon: ${order.deliveryPhone ?? "-"}`, right, 54, { align: "right" });
  doc.text(`Email: ${order.customerEmail ?? "-"}`, right, 59, { align: "right" });

  doc.setDrawColor(0);
  doc.line(margin, 72, right, 72);

  // --- Foto produk (placeholder) + deskripsi ---
  const photoX = margin;
  const photoY = 78;
  const photoW = 50;
  const photoH = 70;
  doc.setDrawColor(200);
  doc.rect(photoX, photoY, photoW, photoH);
  if (order.productPhoto) {
    try {
      doc.addImage(order.productPhoto, "JPEG", photoX, photoY, photoW, photoH);
    } catch {
      doc.setTextColor(160);
      doc.setFontSize(8);
      doc.text("Foto Produk", photoX + photoW / 2, photoY + photoH / 2, {
        align: "center",
      });
    }
  } else {
    doc.setTextColor(160);
    doc.setFontSize(8);
    doc.text("Foto Produk", photoX + photoW / 2, photoY + photoH / 2, {
      align: "center",
    });
  }

  const descX = photoX + photoW + 10;
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("KETERANGAN", descX, photoY + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const descLines = doc.splitTextToSize(order.flowerArrangement.toUpperCase(), right - descX);
  doc.text(descLines, descX, photoY + 11);
  let dy = photoY + 11 + descLines.length * 5;

  if (order.greetingMessage) {
    const greetLines = doc.splitTextToSize(
      order.greetingMessage,
      right - descX
    );
    doc.text(greetLines, descX, dy + 4);
    dy += 4 + greetLines.length * 5;
  }

  if (vendorName) {
    doc.text(`Vendor Perangkai: ${vendorName}`, descX, dy + 4);
    dy += 9;
  }

  doc.text(`Qty: ${order.quantity}  |  Harga: ${formatRupiah(order.totalPrice)}`, descX, dy + 4);
  doc.setFont("helvetica", "bold");
  doc.text(`Jumlah Harga: ${formatRupiah(order.totalPrice)}`, descX, dy + 11);
  doc.setFont("helvetica", "normal");

  // --- Footer: pembayaran + total + tanda tangan ---
  const footY = 200;
  doc.setDrawColor(0);
  doc.line(margin, footY, right, footY);

  doc.setTextColor(0);
  doc.setFontSize(9);
  doc.text(`Pembayaran: Transfer / Cek / Giro`, margin, footY + 8);
  doc.text(`${STORE.bank}, A/N: ${STORE.accountName}`, margin, footY + 13);
  doc.text(`No. Rek: ${STORE.accountNo}`, margin, footY + 18);
  doc.setTextColor(120);
  doc.setFontSize(8);
  doc.text("Mohon cantumkan no. invoice saat pembayaran.", margin, footY + 24);

  doc.setTextColor(0);
  doc.setFontSize(9);
  const shipCost = order.shippingCost ?? 0;
  const grandTotal = order.totalPrice + shipCost;
  doc.text(`Biaya Kirim (Rp)`, right - 50, footY + 8);
  doc.text(formatRupiah(shipCost), right, footY + 8, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.text(`Grand Total (Rp)`, right - 50, footY + 15);
  doc.text(formatRupiah(grandTotal), right, footY + 15, { align: "right" });
  doc.setFont("helvetica", "normal");

  // tanda tangan
  doc.setDrawColor(0);
  const sigY = footY + 45;
  doc.line(right - 55, sigY, right, sigY);
  doc.setFontSize(9);
  doc.text(`(${STORE.name})`, right - 27, sigY + 5, { align: "center" });

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
