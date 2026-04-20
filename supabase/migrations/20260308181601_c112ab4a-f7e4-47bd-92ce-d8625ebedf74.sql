ALTER TABLE public.payment_methods ADD COLUMN momo_network text DEFAULT NULL;
ALTER TABLE public.payment_methods ADD COLUMN phone_number text DEFAULT NULL;
ALTER TABLE public.payment_methods ALTER COLUMN expiry_month DROP NOT NULL;
ALTER TABLE public.payment_methods ALTER COLUMN expiry_year DROP NOT NULL;
ALTER TABLE public.payment_methods ALTER COLUMN last_four DROP NOT NULL;