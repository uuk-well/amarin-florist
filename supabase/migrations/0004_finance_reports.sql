-- Migration: dukungan laporan keuangan
-- Fase 3: Laporan Keuangan — index & view agregasi untuk laporan.
-- Skema orders/vendors (0001-0003) sudah memadai; migration ini
-- menambah index tanggal (filter periode) dan view rekap per vendor.

-- Index tambahan untuk filter periode laporan (created_at sudah diindex di 0001,
-- ini mengcover kombinasi dengan vendor untuk laporan pembayaran vendor).
create index if not exists orders_vendor_created_idx
  on public.orders (vendor_id, created_at desc);

-- View rekap pembayaran vendor per periode (dipakai laporan keuangan).
create or replace view public.vendor_payment_summary as
select
  v.id as vendor_id,
  v.vendor_name,
  count(o.id) as order_count,
  coalesce(sum(o.total_price), 0) as total_price,
  coalesce(sum(o.vendor_cost), 0) as total_vendor_cost
from public.vendors v
left join public.orders o on o.vendor_id = v.id
group by v.id, v.vendor_name;

-- View rekap pendapatan harian (dipakai ringkasan laporan).
create or replace view public.daily_income_summary as
select
  date_trunc('day', created_at) as day,
  count(*) as order_count,
  coalesce(sum(total_price), 0) as total_price
from public.orders
group by date_trunc('day', created_at);
