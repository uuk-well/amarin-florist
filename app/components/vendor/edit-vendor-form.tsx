"use client";

import { useState } from "react";
import type { Vendor } from "@/lib/mock-data";

export function EditVendorForm({
  vendor,
  onSave,
  onClose,
}: {
  vendor: Vendor;
  onSave: (vendor: Vendor) => void;
  onClose: () => void;
}) {
  const [vendorName, setVendorName] = useState(vendor.vendor_name);
  const [picName, setPicName] = useState(vendor.pic_name);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!vendorName.trim() || !picName.trim()) {
      setError("Nama vendor dan PIC wajib diisi.");
      return;
    }
    onSave({
      ...vendor,
      vendor_name: vendorName.trim(),
      pic_name: picName.trim(),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-lg"
      >
        <h3 className="text-sm font-semibold text-zinc-900">Edit Vendor</h3>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700">Nama Vendor</span>
          <input
            type="text"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            className="input"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-700">Nama PIC</span>
          <input
            type="text"
            value={picName}
            onChange={(e) => setPicName(e.target.value)}
            className="input"
          />
        </label>

        {error && <span className="text-xs text-red-500">{error}</span>}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Batal
          </button>
          <button
            type="submit"
            className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
