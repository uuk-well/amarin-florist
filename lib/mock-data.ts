export type Order = {
  id: string;
  customer_name: string;
  pic_order: string;
  vendor_name: string;
  flower_arrangement: string;
  total_price: number;
  created_at: string;
};

export const mockOrders: Order[] = [
  {
    id: "INV-20260719-01",
    customer_name: "Ibu Sari",
    pic_order: "Bapak Andre",
    vendor_name: "Bunga Asri",
    flower_arrangement: "Buket Mawar Merah",
    total_price: 350000,
    created_at: "2026-07-19T08:30:00.000Z",
  },
  {
    id: "INV-20260719-02",
    customer_name: "Bapak Budi",
    pic_order: "Ibu Budi",
    vendor_name: "Florist Cempaka",
    flower_arrangement: "Standing Flower Papan Duka",
    total_price: 850000,
    created_at: "2026-07-19T10:15:00.000Z",
  },
  {
    id: "INV-20260718-07",
    customer_name: "Ibu Rina",
    pic_order: "Bapak Rian",
    vendor_name: "Toko Anggrek",
    flower_arrangement: "Buket Lily Putih",
    total_price: 275000,
    created_at: "2026-07-18T13:45:00.000Z",
  },
  {
    id: "INV-20260717-04",
    customer_name: "Ibu Nina",
    pic_order: "Bapak Nina",
    vendor_name: "Bunga Asri",
    flower_arrangement: "Buket Sunflower",
    total_price: 420000,
    created_at: "2026-07-17T11:20:00.000Z",
  },
  {
    id: "INV-20260715-03",
    customer_name: "Kantor Notaris A",
    pic_order: "Ibu Wati",
    vendor_name: "Florist Cempaka",
    flower_arrangement: "Bunga Meja Dekorasi",
    total_price: 1200000,
    created_at: "2026-07-15T09:00:00.000Z",
  },
];

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

export const mockVendorSummaries: VendorSummary[] = [
  { vendorId: "V-001", vendorName: "Bunga Asri", total: 770000, orderCount: 2 },
  { vendorId: "V-002", vendorName: "Florist Cempaka", total: 2050000, orderCount: 2 },
  { vendorId: "V-003", vendorName: "Toko Anggrek", total: 275000, orderCount: 1 },
];

export const mockReportOrders: Order[] = [
  {
    id: "INV-20260719-01",
    customer_name: "Ibu Sari",
    pic_order: "Bapak Andre",
    vendor_name: "Bunga Asri",
    flower_arrangement: "Buket Mawar Merah",
    total_price: 350000,
    created_at: "2026-07-19T08:30:00.000Z",
  },
  {
    id: "INV-20260719-02",
    customer_name: "Bapak Budi",
    pic_order: "Ibu Budi",
    vendor_name: "Florist Cempaka",
    flower_arrangement: "Standing Flower Papan Duka",
    total_price: 850000,
    created_at: "2026-07-19T10:15:00.000Z",
  },
  {
    id: "INV-20260717-04",
    customer_name: "Ibu Nina",
    pic_order: "Bapak Nina",
    vendor_name: "Bunga Asri",
    flower_arrangement: "Buket Sunflower",
    total_price: 420000,
    created_at: "2026-07-17T11:20:00.000Z",
  },
  {
    id: "INV-20260715-03",
    customer_name: "Kantor Notaris A",
    pic_order: "Ibu Wati",
    vendor_name: "Florist Cempaka",
    flower_arrangement: "Bunga Meja Dekorasi",
    total_price: 1200000,
    created_at: "2026-07-15T09:00:00.000Z",
  },
];

export type Vendor = {
  id: string;
  vendor_name: string;
  pic_name: string;
};

export const mockVendors: Vendor[] = [
  { id: "V-001", vendor_name: "Bunga Asri", pic_name: "Ibu Asri" },
  { id: "V-002", vendor_name: "Florist Cempaka", pic_name: "Bapak Candra" },
  { id: "V-003", vendor_name: "Toko Anggrek", pic_name: "Ibu Dewi" },
];

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
