export type Order = {
  id: string;
  customer_name: string;
  pic_order: string;
  vendor_name: string;
  flower_arrangement: string;
  total_price: number;
  vendor_cost?: number;
  created_at: string;
};

export const mockOrders: Order[] = [];

export type VendorSummary = {
  vendorId: string;
  vendorName: string;
  total: number;
  orderCount: number;
};

export const mockVendorSummaries: VendorSummary[] = [];

export const mockReportOrders: Order[] = [];

export type Vendor = {
  id: string;
  vendor_name: string;
  pic_name: string;
};

export const mockVendors: Vendor[] = [];

export type WeeklyPoint = {
  label: string;
  amount: number;
};


