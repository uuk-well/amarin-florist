"use client";

import { useState } from "react";
import type { NewOrderDraft } from "./new-order-form";
import { mockVendors } from "@/lib/mock-data";
import type { Order } from "@/lib/models/order";
import {
  generateInvoicePdf,
  generateSuratJalanPdf,
} from "@/lib/services/pdf-client";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function vendorName(id: string): string {
  return mockVendors.find((v) => v.id === id)?.vendor_name ?? "—";
}

function draftToOrder(draft: NewOrderDraft): Order {
  return {
    id: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`,
    vendorId: draft.vendorId || null,
    customerName: draft.customerName,
    picOrder: draft.picOrder || null,
    flowerArrangement: draft.flowerArrangement,
    quantity: draft.quantity,
    totalPrice: draft.totalPrice,
    vendorCost: draft.vendorCost,
    greetingMessage: draft.greetingMessage || null,
    deliveryAddress: draft.deliveryAddress || null,
    productPhoto: draft.productPhoto || null,
    createdAt: new Date().toISOString(),
  };
}

export function OrderPreview({ draft }: { draft: NewOrderDraft }) {
  const [tab, setTab] = useState<"invoice" | "surat">("invoice");

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex border-b border-zinc-200 no-print">
        <button
          type="button"
          onClick={() => setTab("invoice")}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            tab === "invoice"
              ? "border-b-2 border-rose-500 text-rose-600"
              : "text-zinc-500"
          }`}
        >
          Invoice
        </button>
        <button
          type="button"
          onClick={() => setTab("surat")}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            tab === "surat"
              ? "border-b-2 border-rose-500 text-rose-600"
              : "text-zinc-500"
          }`}
        >
          Surat Jalan
        </button>
      </div>

      <div className="flex justify-end gap-2 p-4 no-print">
        <button
          type="button"
          onClick={() => generateSuratJalanPdf(draftToOrder(draft))}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Unduh Surat Jalan
        </button>
        <button
          type="button"
          onClick={() =>
            generateInvoicePdf(draftToOrder(draft), vendorName(draft.vendorId))
          }
          className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
        >
          Unduh Invoice
        </button>
      </div>

       <div className="p-6 print-area">
        {tab === "invoice" ? (
          <div className="text-sm text-zinc-900">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-lg font-bold text-white">
                  A
                </span>
                <div>
                  <p className="text-base font-bold">AMARIN FLORIST</p>
                  <p className="text-xs text-zinc-500">
                    Jl. Kemandoran II No. 25E, Jakarta Selatan
                  </p>
                  <p className="text-xs text-zinc-500">Telp. 08111234547</p>
                  <p className="text-xs text-zinc-500">www.bungatangerang.com</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">INVOICE</p>
                <p className="text-xs text-zinc-500">
                  No. Invoice: INV-{new Date().toISOString().slice(0, 10).replace(/-/g, "")}
                </p>
                <p className="text-xs text-zinc-500">
                  Tanggal: {new Date().toLocaleDateString("id-ID")}
                </p>
                <p className="text-xs text-zinc-500">
                  No. Pesanan: SPK-{new Date().toISOString().slice(0, 10).replace(/-/g, "")}
                </p>
              </div>
            </div>

            <hr className="my-4 border-t border-dashed border-zinc-400" />

            {/* Pelanggan */}
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Kepada Yth,</p>
                <p>{draft.customerName || "—"}</p>
                {draft.picOrder && <p className="text-zinc-500">{draft.picOrder}</p>}
              </div>
              <div className="text-right text-xs text-zinc-500">
                <p>Telepon: {draft.deliveryPhone || "-"}</p>
                <p>Email: {draft.customerEmail || "-"}</p>
              </div>
            </div>

            <hr className="my-4 border-t border-dashed border-zinc-400" />

            {/* Foto + deskripsi */}
            <div className="flex gap-4">
              {draft.productPhoto ? (
                <img
                  src={draft.productPhoto}
                  alt="Produk"
                  className="h-40 w-32 shrink-0 rounded border border-zinc-300 object-cover"
                />
              ) : (
                <div className="flex h-40 w-32 shrink-0 items-center justify-center border border-zinc-300 text-xs text-zinc-400">
                  Foto Produk
                </div>
              )}
              <div className="flex-1 space-y-2">
                <p className="font-bold">KETERANGAN</p>
                <p className="uppercase">{draft.flowerArrangement || "—"}</p>
                {draft.greetingMessage && (
                  <p className="text-zinc-600">{draft.greetingMessage}</p>
                )}
                {draft.vendorId && (
                  <p className="text-zinc-600">Vendor Perangkai: {vendorName(draft.vendorId)}</p>
                )}
                <p>
                  Qty: {draft.quantity} | Harga: {formatRupiah(draft.totalPrice)}
                </p>
                <p className="font-bold">
                  Jumlah Harga: {formatRupiah(draft.totalPrice)}
                </p>
              </div>
            </div>

            <hr className="my-4 border-t border-dashed border-zinc-400" />

            {/* Footer */}
            <div className="flex justify-between">
              <div className="space-y-1 text-xs text-zinc-600">
                <p>Pembayaran: Transfer / Cek / Giro</p>
                <p>BCA, A/N: Doni Candra Nugroho</p>
                <p>No. Rek: 2290294323</p>
                <p className="text-zinc-400">
                  Mohon cantumkan no. invoice saat pembayaran.
                </p>
              </div>
              <div className="space-y-1 text-right text-xs">
                <div className="flex justify-between gap-6">
                  <span className="text-zinc-500">Biaya Kirim (Rp)</span>
                  <span>{formatRupiah(draft.shippingCost ?? 0)}</span>
                </div>
                <div className="flex justify-between gap-6 font-bold">
                  <span>Grand Total (Rp)</span>
                  <span>{formatRupiah(draft.totalPrice + (draft.shippingCost ?? 0))}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <div className="text-center">
                <div className="mb-6 h-px w-40 border-t border-zinc-800" />
                <p className="text-xs">(AMARIN FLORIST)</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-zinc-900">SURAT JALAN</span>
              <span className="text-zinc-500">INV-{new Date().toISOString().slice(0, 10)}</span>
            </div>
            <Row label="Pelanggan" value={draft.customerName || "—"} />
            <Row label="PIC Pesanan" value={draft.picOrder || "—"} />
            <Row label="Rangkaian Bunga" value={draft.flowerArrangement || "—"} />
            <Row label="Jumlah" value={String(draft.quantity)} />
            <Row
              label="Alamat Pengiriman"
              value={draft.deliveryAddress || "—"}
            />
            <Row
              label="Ucapan"
              value={draft.greetingMessage || "—"}
            />
          </div>
        )}
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
      <span
        className={`text-right text-zinc-900 ${strong ? "font-semibold" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
