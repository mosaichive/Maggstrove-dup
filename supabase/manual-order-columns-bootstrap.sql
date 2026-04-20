alter table public.orders
  add column if not exists status text not null default 'pending';

alter table public.orders
  add column if not exists payment_method text not null default 'cash_on_delivery';

alter table public.orders
  add column if not exists shipping_name text not null default '';

alter table public.orders
  add column if not exists shipping_email text not null default '';

alter table public.orders
  add column if not exists shipping_phone text;

alter table public.orders
  add column if not exists shipping_address text not null default '';

alter table public.orders
  add column if not exists shipping_city text not null default '';

alter table public.orders
  add column if not exists shipping_region text;

alter table public.orders
  add column if not exists shipping_country text not null default 'Ghana';

alter table public.orders
  add column if not exists fulfillment_type text not null default 'delivery';

alter table public.orders
  add column if not exists voucher_code text default null;

alter table public.orders
  add column if not exists discount_amount numeric not null default 0;
