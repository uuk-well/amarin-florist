"use client";

import { useState } from "react";
import type { Order as MockOrder } from "@/lib/mock-data";
import type { Order } from "@/lib/models/order";
import {
  generateInvoicePdf,
  generateSuratJalanPdf,
} from "@/lib/services/pdf-client";

type DocType = "invoice" | "surat";

function toModelOrder(o: MockOrder): Order {
  return {
    id: o.id,
    vendorId: null,
    customerName: o.customer_name,
    picOrder: o.pic_order,
    flowerArrangement: o.flower_arrangement,
    quantity: 1,
    totalPrice: o.total_price,
    vendorCost: 0,
    greetingMessage: null,
    deliveryAddress: null,
    createdAt: o.created_at,
  };
}

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ReprintModal({
  order,
  onClose,
}: {
  order: MockOrder;
  onClose: () => void;
}) {
  const [doc, setDoc] = useState<DocType>("invoice");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3 no-print">
          <h3 className="text-sm font-semibold text-zinc-900">Cetak Ulang</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <div className="flex border-b border-zinc-200 no-print">
          <button
            type="button"
            onClick={() => setDoc("invoice")}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              doc === "invoice"
                ? "border-b-2 border-rose-500 text-rose-600"
                : "text-zinc-500"
            }`}
          >
            Invoice
          </button>
          <button
            type="button"
            onClick={() => setDoc("surat")}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              doc === "surat"
                ? "border-b-2 border-rose-500 text-rose-600"
                : "text-zinc-500"
            }`}
          >
            Surat Jalan
          </button>
        </div>

        <div className="space-y-3 p-6 text-sm print-area">
          {doc === "invoice" ? (
            <>
              <div className="flex justify-between">
                <span className="text-lg font-bold text-zinc-900">INVOICE</span>
                <span className="text-zinc-500">{order.id}</span>
              </div>
              <Row label="Pelanggan" value={order.customer_name} />
              <Row label="PIC Pesanan" value={order.pic_order} />
              <Row label="Rangkaian Bunga" value={order.flower_arrangement} />
              <Row label="Vendor" value={order.vendor_name} />
              <div className="border-t border-zinc-200 pt-3">
                <Row label="Total Harga" value={formatRupiah(order.total_price)} strong />
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-lg font-bold text-zinc-900">SURAT JALAN</span>
                <span className="text-zinc-500">{order.id}</span>
              </div>
              <Row label="Pelanggan" value={order.customer_name} />
              <Row label="PIC Pesanan" value={order.pic_order} />
              <Row label="Rangkaian Bunga" value={order.flower_arrangement} />
              <Row label="Vendor" value={order.vendor_name} />
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-zinc-200 px-5 py-3 no-print">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              const model = toModelOrder(order);
              if (doc === "invoice") {
                generateInvoicePdf(model, order.vendor_name);
              } else {
                generateSuratJalanPdf(model);
              }
            }}
            className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
          >
            Cetak PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-zinc-500">{label}</span>
      <span className={`text-right text-zinc-900 ${strong ? "font-semibold" : ""}`}>
        {value}
      </span>
    </div>
  );
}
