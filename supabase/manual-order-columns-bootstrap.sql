alter table public.orders
  add column if not exists fulfillment_type text not null default 'delivery';

alter table public.orders
  add column if not exists voucher_code text default null;

alter table public.orders
  add column if not exists discount_amount numeric not null default 0;
