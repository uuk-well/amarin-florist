"use client";

import { useState } from "react";
import type { NewOrderDraft } from "./new-order-form";
import { generateInvoicePdf } from "@/lib/services/pdf-client";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

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
        totalPrice: 0,
        vendorCost: 0,
        greetingMessage: draft.greetingMessage,
        deliveryAddress: draft.deliveryAddress,
        deliveryPhone: draft.recipientPhone,
        customerEmail: null,
        shippingCost: 0,
        productPhoto: null,
        createdAt: new Date().toISOString(),
        senderName: draft.senderName,
        deliveryDateTime: draft.deliveryDateTime,
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
          <div className="space-y-5 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-base font-bold text-white">
                  A
                </span>
                <div>
                  <p className="font-bold text-zinc-900">AMARIN FLORIST</p>
                  <p className="text-xs text-zinc-500">www.bungatangerang.com</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">INVOICE</p>
                <p className="text-xs text-zinc-500">{id}</p>
              </div>
            </div>

            <hr className="border-t border-dashed border-zinc-300" />

            <div>
              <p className="font-medium text-zinc-500">Ucapan :</p>
              <p className="whitespace-pre-wrap text-zinc-900">
                {draft.greetingMessage || "—"}
              </p>
            </div>

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
              <p className="whitespace-pre-wrap text-zinc-900">
                {draft.deliveryAddress || "—"}
              </p>
            </div>

            <div>
              <p className="font-medium text-zinc-500">Tgl &amp; Jam kirim :</p>
              <p className="text-zinc-900">{draft.deliveryDateTime || "—"}</p>
            </div>

            <hr className="border-t border-dashed border-zinc-300" />

            <div className="rounded-lg bg-rose-50 p-4">
              <p className="font-medium text-rose-700">Payment</p>
              <p className="mt-1 text-zinc-700">
                BCA = 2290294323 / a.n. Doni Candra Nugroho
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-base font-bold text-white">
                  A
                </span>
                <div>
                  <p className="font-bold text-zinc-900">AMARIN FLORIST</p>
                  <p className="text-xs text-zinc-500">www.bungatangerang.com</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">SURAT JALAN</p>
                <p className="text-xs text-zinc-500">{id}</p>
              </div>
            </div>

            <hr className="border-t border-dashed border-zinc-300" />

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
              <p className="whitespace-pre-wrap text-zinc-900">
                {draft.deliveryAddress || "—"}
              </p>
            </div>

            <div>
              <p className="font-medium text-zinc-500">Tgl &amp; Jam kirim :</p>
              <p className="text-zinc-900">{draft.deliveryDateTime || "—"}</p>
            </div>

            <div>
              <p className="font-medium text-zinc-500">Ucapan :</p>
              <p className="whitespace-pre-wrap text-zinc-900">
                {draft.greetingMessage || "—"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
