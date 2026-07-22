"use client";

import { useState } from "react";
import { NewOrderForm, type NewOrderDraft } from "./new-order-form";
import { OrderPreview } from "./order-preview";
import { Toast } from "../components/ui/toast";
import { AppHeader } from "../components/layout/app-header";
import { RequireAuth } from "../components/auth/require-auth";

const emptyDraft: NewOrderDraft = {
  greetingMessage: "",
  senderName: "",
  recipientPhone: "",
  deliveryAddress: "",
  deliveryDate: "",
  deliveryTime: "",
  productPhoto: null,
  totalPrice: 0,
  vendorCost: 0,
};

export default function NewOrderPage() {
  const [draft, setDraft] = useState<NewOrderDraft>(emptyDraft);
  const [saved, setSaved] = useState(false);

  function handleChange<K extends keyof NewOrderDraft>(
    key: K,
    value: NewOrderDraft[K]
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    setDraft(emptyDraft);
  }

  async function handleSaved() {
    const savedOrders = JSON.parse(
      localStorage.getItem("amarin_orders") || "[]"
    );
    const newOrder = {
      id: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(savedOrders.length + 1).padStart(2, "0")}`,
      senderName: draft.senderName,
      greetingMessage: draft.greetingMessage,
      deliveryAddress: draft.deliveryAddress,
      deliveryPhone: draft.recipientPhone,
      deliveryDateTime: draft.deliveryDate
        ? `${draft.deliveryDate} ${draft.deliveryTime}`
        : "",
      totalPrice: draft.totalPrice,
      vendorCost: draft.vendorCost,
      createdAt: new Date().toISOString(),
    };
    savedOrders.unshift(newOrder);
    localStorage.setItem("amarin_orders", JSON.stringify(savedOrders));

    // Juga simpan ke server (best-effort)
    await fetch("/api/pesanan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    }).catch(() => {});

    setSaved(true);
  }

  return (
    <RequireAuth>
      <main className="min-h-screen bg-zinc-50">
        <AppHeader />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-1 text-2xl font-bold text-zinc-900">Pesanan Baru</h1>
        <p className="mb-8 text-sm text-zinc-500">
          Isi detail pesanan, lalu pratinjau &amp; cetak invoice dan surat jalan.
        </p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <NewOrderForm
            draft={draft}
            onChange={handleChange}
            onReset={handleReset}
            onSaved={handleSaved}
          />
          <OrderPreview draft={draft} />
        </div>
      </div>

      {saved && (
        <Toast
          message="Pesanan berhasil disimpan"
          onClose={() => setSaved(false)}
        />
      )}
      </main>
    </RequireAuth>
  );
}
