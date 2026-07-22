export type Order = {
  id: string;
  customer_name: string;
  pic_order: string;
  vendor_name: string;
  flower_arrangement: string;
  total_price: number;
  created_at: string;
};

export const mockOrders: Order[] = [];

export const mockIncome = {
  today: 0,
  thisWeek: 0,
  thisMonth: 0,
};

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

export const mockWeeklyIncome: WeeklyPoint[] = [
  { label: "Sen", amount: 0 },
  { label: "Sel", amount: 0 },
  { label: "Rab", amount: 0 },
  { label: "Kam", amount: 0 },
  { label: "Jum", amount: 0 },
  { label: "Sab", amount: 0 },
  { label: "Min", amount: 0 },
];
