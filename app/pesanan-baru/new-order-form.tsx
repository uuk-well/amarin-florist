"use client";

import { useState } from "react";

export type NewOrderDraft = {
  greetingMessage: string;
  senderName: string;
  recipientPhone: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  productPhoto: string | null;
  totalPrice: number;
  vendorCost: number;
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
};

type Errors = Partial<Record<keyof NewOrderDraft, string>>;

function validate(draft: NewOrderDraft): Errors {
  const errors: Errors = {};
  if (!draft.greetingMessage.trim())
    errors.greetingMessage = "Ucapan wajib diisi.";
  if (!draft.senderName.trim()) errors.senderName = "Pengirim wajib diisi.";
  if (!draft.deliveryAddress.trim())
    errors.deliveryAddress = "Alamat kirim wajib diisi.";
  return errors;
}

export function NewOrderForm({
  draft,
  onChange,
  onReset,
  onSaved,
}: {
  draft: NewOrderDraft;
  onChange: (key: keyof NewOrderDraft, value: NewOrderDraft[keyof NewOrderDraft]) => void;
  onReset: () => void;
  onSaved: () => void;
}) {
  const [errors, setErrors] = useState<Errors>({});

  function update<K extends keyof NewOrderDraft>(key: K, value: NewOrderDraft[K]) {
    onChange(key, value);
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(draft);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    onSaved();
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-base font-semibold text-zinc-900">
        Format Pemesanan Bunga &#x1F338;
      </h2>

      <Field label="Ucapan :" error={errors.greetingMessage}>
        <textarea
          rows={4}
          value={draft.greetingMessage}
          onChange={(e) => update("greetingMessage", e.target.value)}
          className="input"
          placeholder="cth. Selamat Jalan menuju Rumah Bapa di Sorga&#x0a;alm. Bpk. Yohanes Wong Kwet Khiong"
        />
      </Field>

      <Field label="Pengirim :" error={errors.senderName}>
        <input
          type="text"
          value={draft.senderName}
          onChange={(e) => update("senderName", e.target.value)}
          className="input"
          placeholder="cth. Ibu Gembala Pdt. Ernie Santosa &amp; segenap Jemaat"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="No. HP Penerima :">
          <input
            type="text"
            value={draft.recipientPhone}
            onChange={(e) => update("recipientPhone", e.target.value)}
            className="input"
            placeholder="cth. Johan / Ester"
          />
        </Field>
        <Field label="Tgl &amp; Jam kirim :">
          <div className="flex gap-2">
            <input
              type="date"
              value={draft.deliveryDate}
              onChange={(e) => update("deliveryDate", e.target.value)}
              className="input flex-1"
            />
            <input
              type="time"
              value={draft.deliveryTime}
              onChange={(e) => update("deliveryTime", e.target.value)}
              className="input w-28"
            />
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const tz = now.toLocaleDateString("id-ID").split("/").reverse().join("-");
                const dateParts = now.toLocaleDateString("id-ID").split("/");
                const yyyy = dateParts[2];
                const mm = dateParts[1].padStart(2, "0");
                const dd = dateParts[0].padStart(2, "0");
                update("deliveryDate", `${yyyy}-${mm}-${dd}`);
                update(
                  "deliveryTime",
                  `${String(now.getHours()).padStart(2, "0")}:${String(
                    now.getMinutes()
                  ).padStart(2, "0")}`
                );
              }}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
            >
              Sekarang
            </button>
          </div>
        </Field>
      </div>

      <Field label="Alamat kirim :" error={errors.deliveryAddress}>
        <textarea
          rows={3}
          value={draft.deliveryAddress}
          onChange={(e) => update("deliveryAddress", e.target.value)}
          className="input"
          placeholder="cth. BTB Ruang ... (menyusul)"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Harga Jual (Rp)">
          <input
            type="number"
            min={0}
            value={draft.totalPrice || ""}
            onChange={(e) => update("totalPrice", Number(e.target.value) || 0)}
            className="input"
            placeholder="0"
          />
        </Field>
        <Field label="Harga Vendor (Rp)">
          <input
            type="number"
            min={0}
            value={draft.vendorCost || ""}
            onChange={(e) => update("vendorCost", Number(e.target.value) || 0)}
            className="input"
            placeholder="0"
          />
        </Field>
      </div>

      <div className="rounded-lg border border-rose-100 bg-rose-50 p-4 text-sm text-zinc-700">
        <p className="font-medium text-rose-700">Payment</p>
        <p className="mt-1">BCA = 2290294323 / a.n. Doni Candra Nugroho</p>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="space-y-1">
          {Object.values(errors).map(
            (msg) => msg && <p key={msg} className="text-xs text-red-500">{msg}</p>
          )}
        </div>
      )}

      <Field label="Foto Produk (opsional)">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => update("productPhoto", reader.result as string);
            reader.readAsDataURL(file);
          }}
          className="input"
        />
        {draft.productPhoto && (
          <img
            src={draft.productPhoto}
            alt="Pratinjau"
            className="mt-2 h-24 w-24 rounded border border-zinc-200 object-cover"
          />
        )}
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            onReset();
            setErrors({});
          }}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Reset
        </button>
        <button
          type="submit"
          className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
        >
          Simpan &amp; Cetak
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}
