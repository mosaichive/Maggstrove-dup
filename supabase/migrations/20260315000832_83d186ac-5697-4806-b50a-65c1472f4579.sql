
-- Add GPS coordinates to shipping_addresses
ALTER TABLE public.shipping_addresses
  ADD COLUMN IF NOT EXISTS gps_lat double precision,
  ADD COLUMN IF NOT EXISTS gps_lng double precision;

-- Add fulfillment_type to orders if not there already (it exists)
-- We need to ensure order_tracking supports pickup statuses - no schema change needed, it's just a text column
