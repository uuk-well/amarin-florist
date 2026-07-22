"use client";

import { useState } from "react";
import type { Vendor } from "@/lib/mock-data";
import { useVendors } from "@/app/components/vendor/vendors-provider";
import { AddVendorForm } from "@/app/components/vendor/add-vendor-form";
import { EditVendorForm } from "@/app/components/vendor/edit-vendor-form";
import { AppHeader } from "@/app/components/layout/app-header";
import { RequireAuth } from "@/app/components/auth/require-auth";

export default function VendorsPage() {
  const { vendors, addVendor, updateVendor } = useVendors();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);

  function handleAdd(vendor: Vendor) {
    addVendor(vendor);
  }

  function handleSave(updated: Vendor) {
    updateVendor(updated);
  }

  return (
    <RequireAuth>
      <main className="min-h-screen bg-zinc-50">
        <AppHeader />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Daftar Vendor</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Direktori mitra perangkai dan suplier bunga.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
          >
            + Tambah Vendor
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <p className="font-semibold text-zinc-900">{vendor.vendor_name}</p>
              <p className="mt-1 text-sm text-zinc-500">PIC: {vendor.pic_name}</p>
              <p className="mt-2 font-mono text-xs text-zinc-400">{vendor.id}</p>
              <button
                type="button"
                onClick={() => setEditing(vendor)}
                className="mt-3 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {adding && (
        <AddVendorForm onAdd={handleAdd} onClose={() => setAdding(false)} />
      )}

      {editing && (
        <EditVendorForm
          vendor={editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
      </main>
    </RequireAuth>
  );
}
