-- Migration: tabel pengguna (profil aplikasi)
-- Fase 4: Autentikasi — profil pengguna di sisi aplikasi.
-- Kredensial & sesi ditangani Supabase Auth (auth.users).
-- Tabel ini menyimpan data profil (name) terkait akun terautentikasi.

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  created_at timestamptz not null default now()
);

create index if not exists users_email_idx on public.users (email);

alter table public.users enable row level security;

-- Hanya pemilik akun yang boleh melihat/mengubah profilnya.
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);
