-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.available_dates (
  id uuid primary key default gen_random_uuid(),
  available_date date not null,
  experience_type text not null check (experience_type in ('trail_ride', 'lesson')),
  created_at timestamptz not null default now(),
  unique (available_date, experience_type)
);

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  email text not null,
  phone text,
  party_size integer not null check (party_size > 0 and party_size <= 20),
  experience_type text not null check (experience_type in ('trail_ride', 'lesson')),
  chosen_date date not null,
  notes text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists available_dates_type_date_idx
  on public.available_dates (experience_type, available_date);

create index if not exists booking_requests_created_idx
  on public.booking_requests (created_at desc);

alter table public.available_dates enable row level security;
alter table public.booking_requests enable row level security;

drop policy if exists "Public read available dates" on public.available_dates;
create policy "Public read available dates"
  on public.available_dates for select
  to anon, authenticated
  using (true);

drop policy if exists "No direct public writes to availability" on public.available_dates;
-- Writes go through API using service role only.

drop policy if exists "No direct public booking inserts" on public.booking_requests;
-- Inserts go through API using service role only.
