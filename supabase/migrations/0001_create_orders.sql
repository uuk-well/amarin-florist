-- Migration: create orders table
-- Fase 1: Dasbor — tabel inti pesanan (orders)
-- Referensi skema ER di PRD Amarin Florist.
-- vendors & users dibuat di migrasi terpisah (Fase 2 & 4).

create table if not exists public.orders (
  id text primary key,
  vendor_id text references public.vendors (id) on delete set null,
  customer_name text not null,
  pic_order text,
  flower_arrangement text not null,
  quantity integer not null default 1,
  total_price numeric(12, 2) not null default 0,
  vendor_cost numeric(12, 2) default 0,
  greeting_message text,
  delivery_address text,
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_vendor_id_idx on public.orders (vendor_id);

-- Enable Row Level Security (akses diatur saat auth Fase 4)
alter table public.orders enable row level security;
