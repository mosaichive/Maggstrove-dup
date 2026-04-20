
-- Add product_status column to product_overrides for available/sold tracking
ALTER TABLE public.product_overrides 
ADD COLUMN IF NOT EXISTS product_status text NOT NULL DEFAULT 'available';

-- Change default order status from 'confirmed' to 'pending'
ALTER TABLE public.orders 
ALTER COLUMN status SET DEFAULT 'pending';
