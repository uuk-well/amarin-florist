"use client";

import { useState } from "react";

export type NewOrderDraft = {
  greetingMessage: string;
  senderName: string;
  recipientPhone: string;
  deliveryAddress: string;
  deliveryDateTime: string;
};

const emptyDraft: NewOrderDraft = {
  greetingMessage: "",
  senderName: "",
  recipientPhone: "",
  deliveryAddress: "",
  deliveryDateTime: "",
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
          <input
            type="text"
            value={draft.deliveryDateTime}
            onChange={(e) => update("deliveryDateTime", e.target.value)}
            className="input"
            placeholder="cth. Rabu, 22 Juli 2026, Pagi"
          />
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
