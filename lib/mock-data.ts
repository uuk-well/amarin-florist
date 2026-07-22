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
  today: 1200000,
  thisWeek: 4675000,
  thisMonth: 18450000,
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
  { label: "Sen", amount: 950000 },
  { label: "Sel", amount: 1250000 },
  { label: "Rab", amount: 620000 },
  { label: "Kam", amount: 1480000 },
  { label: "Jum", amount: 2100000 },
  { label: "Sab", amount: 1745000 },
  { label: "Min", amount: 0 },
];
