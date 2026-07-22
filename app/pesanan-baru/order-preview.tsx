"use client";

import { useState } from "react";
import type { NewOrderDraft } from "./new-order-form";
import { generateInvoicePdf } from "@/lib/services/pdf-client";

export function OrderPreview({ draft }: { draft: NewOrderDraft }) {
  const [tab, setTab] = useState<"invoice" | "surat">("invoice");
  const id = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;

  function handlePrintInvoice() {
    generateInvoicePdf(
      {
        id,
        vendorId: null,
        customerName: draft.senderName,
        picOrder: null,
        flowerArrangement: draft.greetingMessage,
        quantity: 1,
        totalPrice: draft.totalPrice,
        vendorCost: draft.vendorCost,
        greetingMessage: draft.greetingMessage,
        deliveryAddress: draft.deliveryAddress,
        deliveryPhone: draft.recipientPhone,
        customerEmail: null,
        shippingCost: 0,
        productPhoto: draft.productPhoto,
        createdAt: new Date().toISOString(),
        senderName: draft.senderName,
        deliveryDateTime: draft.deliveryDate
          ? `${draft.deliveryDate} ${draft.deliveryTime}`
          : "",
      },
      null
    );
  }

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
          onClick={handlePrintInvoice}
          className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
        >
          Unduh Invoice
        </button>
      </div>

      <div className="p-6 print-area">
        {tab === "invoice" ? (
          <div className="space-y-4 text-sm">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-lg font-bold text-white">
                  A
                </span>
                <div>
                  <p className="text-base font-bold">AMARIN FLORIST</p>
                  <p className="text-xs text-zinc-500">Jl. Kemandoran II No. 25E, Jakarta Selatan</p>
                  <p className="text-xs text-zinc-500">Telp. 08111234547</p>
                  <p className="text-xs text-zinc-500">www.bungatangerang.com</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">INVOICE</p>
                <p className="text-xs text-zinc-500">No. Invoice: {id}</p>
                <p className="text-xs text-zinc-500">Tanggal: {new Date().toLocaleDateString("id-ID")}</p>
              </div>
            </div>

            <hr className="border-t border-dashed border-zinc-400" />

            {/* Info pelanggan */}
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Kepada Yth,</p>
                <p>{draft.senderName || "—"}</p>
              </div>
              {draft.recipientPhone && (
                <div className="text-right text-xs text-zinc-500">
                  <p>No. HP Penerima: {draft.recipientPhone}</p>
                </div>
              )}
            </div>

            <hr className="border-t border-dashed border-zinc-400" />

            {/* Deskripsi */}
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
              <div className="flex-1 space-y-1">
                <p className="font-bold">KETERANGAN</p>
                <p className="uppercase">{draft.greetingMessage || "—"}</p>
                {draft.senderName && <p>Pengirim: {draft.senderName}</p>}
                {(draft.deliveryDate || draft.deliveryTime) && (
                  <p>Tgl/Jam kirim: {draft.deliveryDate || "—"} {draft.deliveryTime || ""}</p>
                )}
                <p>Alamat: {draft.deliveryAddress || "—"}</p>
              </div>
            </div>

            <hr className="border-t border-dashed border-zinc-400" />

            {/* Payment */}
            <div>
              <p className="font-semibold">Payment</p>
              <p className="text-xs">BCA = 2290294323 / a.n. Doni Candra Nugroho</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-lg font-bold text-white">
                  A
                </span>
                <div>
                  <p className="text-base font-bold">AMARIN FLORIST</p>
                  <p className="text-xs text-zinc-500">Jl. Kemandoran II No. 25E, Jakarta Selatan</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">SURAT JALAN</p>
                <p className="text-xs text-zinc-500">No. {id}</p>
              </div>
            </div>

            <hr className="border-t border-dashed border-zinc-400" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-zinc-500">Pengirim :</p>
                <p className="text-zinc-900">{draft.senderName || "—"}</p>
              </div>
              <div>
                <p className="font-medium text-zinc-500">No. HP Penerima :</p>
                <p className="text-zinc-900">{draft.recipientPhone || "—"}</p>
              </div>
            </div>

            <div>
              <p className="font-medium text-zinc-500">Alamat kirim :</p>
              <p className="whitespace-pre-wrap text-zinc-900">{draft.deliveryAddress || "—"}</p>
            </div>

            <div>
              <p className="font-medium text-zinc-500">Tgl &amp; Jam kirim :</p>
              <p className="text-zinc-900">{draft.deliveryDate || "—"} {draft.deliveryTime || ""}</p>
            </div>

            <div>
              <p className="font-medium text-zinc-500">Ucapan :</p>
              <p className="whitespace-pre-wrap text-zinc-900">{draft.greetingMessage || "—"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
