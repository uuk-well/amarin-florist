-- Migration: create order_items table
-- Fase 2: Daftar Pesanan — normalisasi item pesanan (line items per order)
-- Relasi: order_items.order_id -> orders.id (FK, on delete cascade)

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id text not null references public.orders (id) on delete cascade,
  flower_arrangement text not null,
  quantity integer not null default 1,
  unit_price numeric(12, 2) not null default 0
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

alter table public.order_items enable row level security;
