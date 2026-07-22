import type { Vendor, VendorInput } from "../models/vendor";
import { mockVendors } from "../mock-data";

export interface VendorsRepository {
  list(): Promise<Vendor[]>;
  create(input: VendorInput): Promise<Vendor>;
  update(id: string, input: VendorInput): Promise<Vendor | null>;
}

function toModel(v: (typeof mockVendors)[number]): Vendor {
  return {
    id: v.id,
    vendorName: v.vendor_name,
    picName: v.pic_name,
    createdAt: new Date().toISOString(),
  };
}

export class MockVendorsRepository implements VendorsRepository {
  async list(): Promise<Vendor[]> {
    return mockVendors.map(toModel);
  }

  async create(input: VendorInput): Promise<Vendor> {
    return {
      id: input.id,
      vendorName: input.vendorName,
      picName: input.picName,
      createdAt: new Date().toISOString(),
    };
  }

  async update(id: string, input: VendorInput): Promise<Vendor | null> {
    return {
      id,
      vendorName: input.vendorName,
      picName: input.picName,
      createdAt: new Date().toISOString(),
    };
  }
}
