"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { Vendor } from "@/lib/mock-data";
import { mockVendors } from "@/lib/mock-data";

type VendorsContextValue = {
  vendors: Vendor[];
  addVendor: (vendor: Vendor) => void;
  updateVendor: (vendor: Vendor) => void;
};

const VendorsContext = createContext<VendorsContextValue | null>(null);

export function VendorsProvider({ children }: { children: ReactNode }) {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);

  function addVendor(vendor: Vendor) {
    setVendors((prev) => [...prev, vendor]);
  }

  function updateVendor(updated: Vendor) {
    setVendors((prev) =>
      prev.map((v) => (v.id === updated.id ? updated : v))
    );
  }

  return (
    <VendorsContext.Provider value={{ vendors, addVendor, updateVendor }}>
      {children}
    </VendorsContext.Provider>
  );
}

export function useVendors(): VendorsContextValue {
  const ctx = useContext(VendorsContext);
  if (!ctx) {
    throw new Error("useVendors harus dipakai di dalam VendorsProvider");
  }
  return ctx;
}
