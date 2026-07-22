-- Migration: create vendors table
-- Fase 2: Manajemen Pesanan & Vendor — tabel vendor (direktori perangkai/suplier)
-- Relasi: orders.vendor_id -> vendors.id (FK, on delete set null)

create table if not exists public.vendors (
  id text primary key,
  vendor_name text not null,
  pic_name text not null,
  created_at timestamptz not null default now()
);

create index if not exists vendors_name_idx on public.vendors (vendor_name);

alter table public.vendors enable row level security;
