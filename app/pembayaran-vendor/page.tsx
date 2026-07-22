"use client";

import { VendorPaymentsList } from "@/app/components/finance/vendor-payments-list";
import { AppHeader } from "@/app/components/layout/app-header";
import { RequireAuth } from "@/app/components/auth/require-auth";
import { mockVendorSummaries } from "@/lib/mock-data";

export default function PembayaranVendorPage() {
  return (
    <RequireAuth>
      <main className="min-h-screen bg-zinc-50">
        <AppHeader />

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-1 text-2xl font-bold text-zinc-900">
            Pembayaran Vendor
          </h1>
          <p className="mb-8 text-sm text-zinc-500">
            Rekap pembayaran ke mitra perangkai dan suplier bunga.
          </p>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <VendorPaymentsList
              items={mockVendorSummaries.map((v) => ({
                name: v.vendorName,
                count: v.orderCount,
                total: v.total,
              }))}
            />
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}
