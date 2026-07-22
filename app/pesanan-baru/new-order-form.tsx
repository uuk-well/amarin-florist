"use client";

import { useState } from "react";
import { useVendors } from "@/app/components/vendor/vendors-provider";

export type NewOrderDraft = {
  customerName: string;
  picOrder: string;
  flowerArrangement: string;
  quantity: number;
  totalPrice: number;
  vendorCost: number;
  vendorId: string;
  greetingMessage: string;
  deliveryAddress: string;
  deliveryPhone: string;
  customerEmail: string;
  shippingCost: number;
  productPhoto: string | null;
};

const emptyDraft: NewOrderDraft = {
  customerName: "",
  picOrder: "",
  flowerArrangement: "",
  quantity: 1,
  totalPrice: 0,
  vendorCost: 0,
  vendorId: "",
  greetingMessage: "",
  deliveryAddress: "",
  deliveryPhone: "",
  customerEmail: "",
  shippingCost: 0,
  productPhoto: null,
};

type Errors = Partial<Record<keyof NewOrderDraft, string>>;

function validate(draft: NewOrderDraft): Errors {
  const errors: Errors = {};
  if (!draft.customerName.trim()) errors.customerName = "Nama pelanggan wajib diisi.";
  if (!draft.flowerArrangement.trim())
    errors.flowerArrangement = "Rangkaian bunga wajib diisi.";
  if (!draft.quantity || draft.quantity < 1)
    errors.quantity = "Jumlah minimal 1.";
  if (draft.totalPrice <= 0) errors.totalPrice = "Total harga harus lebih dari 0.";
  if (draft.vendorCost < 0) errors.vendorCost = "Biaya vendor tidak boleh negatif.";
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
  const { vendors } = useVendors();

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
    // TODO: simpan ke backend (task backend berikutnya)
    console.log("Draft pesanan valid:", draft);
    onSaved();
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nama Pelanggan" error={errors.customerName}>
          <input
            type="text"
            value={draft.customerName}
            onChange={(e) => update("customerName", e.target.value)}
            className="input"
            placeholder="cth. Ibu Sari"
          />
        </Field>
        <Field label="PIC Pesanan" error={errors.picOrder}>
          <input
            type="text"
            value={draft.picOrder}
            onChange={(e) => update("picOrder", e.target.value)}
            className="input"
            placeholder="cth. Bapak Budi"
          />
        </Field>
      </div>

      <Field label="Rangkaian Bunga" error={errors.flowerArrangement}>
        <input
          type="text"
          value={draft.flowerArrangement}
          onChange={(e) => update("flowerArrangement", e.target.value)}
          className="input"
          placeholder="cth. Buket Mawar Merah"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Jumlah" error={errors.quantity}>
          <input
            type="number"
            min={1}
            value={draft.quantity}
            onChange={(e) => update("quantity", Number(e.target.value))}
            className="input"
          />
        </Field>
        <Field label="Total Harga (Rp)" error={errors.totalPrice}>
          <input
            type="number"
            min={0}
            value={draft.totalPrice}
            onChange={(e) => update("totalPrice", Number(e.target.value))}
            className="input"
          />
        </Field>
        <Field label="Biaya Vendor (Rp)" error={errors.vendorCost}>
          <input
            type="number"
            min={0}
            value={draft.vendorCost}
            onChange={(e) => update("vendorCost", Number(e.target.value))}
            className="input"
          />
        </Field>
      </div>

      <Field label="Vendor Perangkai">
        <select
          value={draft.vendorId}
          onChange={(e) => update("vendorId", e.target.value)}
          className="input"
        >
          <option value="">— Pilih vendor —</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.vendor_name} ({v.pic_name})
            </option>
          ))}
        </select>
      </Field>

      <Field label="Teks Kartu Ucapan">
        <textarea
          rows={3}
          value={draft.greetingMessage}
          onChange={(e) => update("greetingMessage", e.target.value)}
          className="input"
          placeholder="cth. Selamat ulang tahun, semoga bahagia selalu"
        />
      </Field>

      <Field label="Alamat Pengiriman">
        <textarea
          rows={3}
          value={draft.deliveryAddress}
          onChange={(e) => update("deliveryAddress", e.target.value)}
          className="input"
          placeholder="cth. Jl. Mawar No. 10, Jakarta Selatan"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Telepon Pelanggan">
          <input
            type="text"
            value={draft.deliveryPhone}
            onChange={(e) => update("deliveryPhone", e.target.value)}
            className="input"
            placeholder="cth. 0812xxxx"
          />
        </Field>
        <Field label="Email Pelanggan">
          <input
            type="email"
            value={draft.customerEmail}
            onChange={(e) => update("customerEmail", e.target.value)}
            className="input"
            placeholder="nama@email.com"
          />
        </Field>
      </div>

      <Field label="Biaya Kirim (Rp)">
        <input
          type="number"
          min={0}
          value={draft.shippingCost}
          onChange={(e) => update("shippingCost", Number(e.target.value))}
          className="input"
        />
      </Field>

      <Field label="Foto Produk">
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
            alt="Pratinjau produk"
            className="mt-2 h-32 w-32 rounded border border-zinc-200 object-cover"
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
