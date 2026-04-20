alter table public.orders
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.orders
  add column if not exists order_number text;

alter table public.orders
  add column if not exists subtotal numeric not null default 0;

alter table public.orders
  add column if not exists shipping_cost numeric not null default 0;

alter table public.orders
  add column if not exists total numeric not null default 0;

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

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'orders'
      and column_name = 'vendor_id'
  ) then
    execute 'alter table public.orders alter column vendor_id drop not null';
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'orders'
      and constraint_name = 'orders_payment_method_check'
  ) then
    execute 'alter table public.orders drop constraint orders_payment_method_check';
  end if;
end $$;
