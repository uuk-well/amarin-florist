"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { NewOrderForm, type NewOrderDraft } from "./new-order-form";
import { OrderPreview } from "./order-preview";
import { Toast } from "../components/ui/toast";
import { AppHeader } from "../components/layout/app-header";
import { RequireAuth } from "../components/auth/require-auth";

type SavedOrder = {
  id: string;
  senderName: string;
  greetingMessage: string;
  deliveryAddress: string;
  deliveryPhone: string;
  deliveryDateTime: string;
  totalPrice: number;
  vendorCost: number;
  productPhoto?: string | null;
  vendorId: string;
  vendorName: string;
  createdAt: string;
};

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
  vendorId: "",
  vendorName: "",
};

function savedToDraft(order: SavedOrder): NewOrderDraft {
  let deliveryDate = "";
  let deliveryTime = "";
  if (order.deliveryDateTime) {
    const parts = order.deliveryDateTime.split(" ");
    deliveryDate = parts[0] || "";
    deliveryTime = parts[1] || "";
  }
  return {
    greetingMessage: order.greetingMessage,
    senderName: order.senderName,
    recipientPhone: order.deliveryPhone || "",
    deliveryAddress: order.deliveryAddress || "",
    deliveryDate,
    deliveryTime,
    productPhoto: order.productPhoto || null,
    totalPrice: order.totalPrice || 0,
    vendorCost: order.vendorCost || 0,
    vendorId: order.vendorId || "",
    vendorName: order.vendorName || "",
  };
}

function draftToSaved(draft: NewOrderDraft, id: string, index: number): SavedOrder {
  return {
    id,
    senderName: draft.senderName,
    greetingMessage: draft.greetingMessage,
    deliveryAddress: draft.deliveryAddress,
    deliveryPhone: draft.recipientPhone,
    deliveryDateTime: draft.deliveryDate
      ? `${draft.deliveryDate} ${draft.deliveryTime}`
      : "",
    totalPrice: draft.totalPrice,
    vendorCost: draft.vendorCost,
    productPhoto: draft.productPhoto,
    vendorId: draft.vendorId,
    vendorName: draft.vendorName,
    createdAt: new Date().toISOString(),
  };
}

function NewOrderPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("id");

  const [draft, setDraft] = useState<NewOrderDraft>(emptyDraft);
  const [saved, setSaved] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (!editId) return;
    const stored: SavedOrder[] = JSON.parse(
      localStorage.getItem("amarin_orders") || "[]"
    );
    const found = stored.find((o) => o.id === editId);
    if (found) {
      setDraft(savedToDraft(found));
      setIsEdit(true);
    }
  }, [editId]);

  function handleChange<K extends keyof NewOrderDraft>(
    key: K,
    value: NewOrderDraft[K]
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    setDraft(emptyDraft);
    setIsEdit(false);
    router.replace("/pesanan-baru");
  }

  function handleSaved() {
    const stored: SavedOrder[] = JSON.parse(
      localStorage.getItem("amarin_orders") || "[]"
    );

    if (isEdit && editId) {
      const idx = stored.findIndex((o) => o.id === editId);
      if (idx !== -1) {
        stored[idx] = {
          ...draftToSaved(draft, editId, idx),
          createdAt: stored[idx].createdAt,
        };
        localStorage.setItem("amarin_orders", JSON.stringify(stored));
        setSaved(true);
        return;
      }
    }

    const newId = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(stored.length + 1).padStart(2, "0")}`;
    const newOrder = draftToSaved(draft, newId, stored.length);
    stored.unshift(newOrder);
    localStorage.setItem("amarin_orders", JSON.stringify(stored));

    fetch("/api/pesanan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    }).catch(() => {});

    setSaved(true);
    if (isEdit) router.replace("/pesanan-baru");
  }

  return (
    <RequireAuth>
      <main className="min-h-screen bg-zinc-50">
        <AppHeader />

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-1 flex items-center gap-4">
            <h1 className="text-2xl font-bold text-zinc-900">
              {isEdit ? "Edit Pesanan" : "Pesanan Baru"}
            </h1>
            {isEdit && (
              <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-medium text-amber-700">
                Edit Mode
              </span>
            )}
          </div>
          <p className="mb-8 text-sm text-zinc-500">
            {isEdit
              ? "Ubah detail pesanan, lalu simpan perubahan."
              : "Isi detail pesanan, lalu pratinjau & cetak invoice dan surat jalan."}
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
            message={isEdit ? "Pesanan berhasil diperbarui" : "Pesanan berhasil disimpan"}
            onClose={() => setSaved(false)}
          />
        )}
      </main>
    </RequireAuth>
  );
}

export default function NewOrderPage() {
  return (
    <Suspense>
      <NewOrderPageInner />
    </Suspense>
  );
}
