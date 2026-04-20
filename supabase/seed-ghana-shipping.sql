-- Creates and seeds Ghana delivery regions and cities for checkout/admin shipping.
-- Safe to re-run.

CREATE TABLE IF NOT EXISTS public.shipping_regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  default_shipping_fee numeric NOT NULL DEFAULT 15.00,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shipping_cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id uuid NOT NULL REFERENCES public.shipping_regions(id) ON DELETE CASCADE,
  name text NOT NULL,
  shipping_fee numeric DEFAULT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(region_id, name)
);

ALTER TABLE public.shipping_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_cities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active regions" ON public.shipping_regions;
CREATE POLICY "Anyone can read active regions"
ON public.shipping_regions
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Anyone can read active cities" ON public.shipping_cities;
CREATE POLICY "Anyone can read active cities"
ON public.shipping_cities
FOR SELECT
TO anon, authenticated
USING (true);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'has_role'
  ) THEN
    DROP POLICY IF EXISTS "Admins can manage regions" ON public.shipping_regions;
    CREATE POLICY "Admins can manage regions"
    ON public.shipping_regions
    FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::public.app_role))
    WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

    DROP POLICY IF EXISTS "Admins can manage cities" ON public.shipping_cities;
    CREATE POLICY "Admins can manage cities"
    ON public.shipping_cities
    FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'::public.app_role))
    WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

WITH region_seed(name, default_shipping_fee, sort_order) AS (
  VALUES
    ('Greater Accra', 15.00, 1),
    ('Ashanti', 20.00, 2),
    ('Central', 18.00, 3),
    ('Eastern', 18.00, 4),
    ('Western', 20.00, 5),
    ('Western North', 22.00, 6),
    ('Volta', 20.00, 7),
    ('Oti', 22.00, 8),
    ('Northern', 25.00, 9),
    ('Savannah', 27.00, 10),
    ('North East', 27.00, 11),
    ('Upper East', 28.00, 12),
    ('Upper West', 28.00, 13),
    ('Bono', 22.00, 14),
    ('Bono East', 22.00, 15),
    ('Ahafo', 22.00, 16)
)
INSERT INTO public.shipping_regions (name, default_shipping_fee, sort_order, is_active, updated_at)
SELECT name, default_shipping_fee, sort_order, true, now()
FROM region_seed
ON CONFLICT (name) DO UPDATE
SET
  default_shipping_fee = EXCLUDED.default_shipping_fee,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = now();

WITH city_seed(region_name, city_name, shipping_fee, sort_order) AS (
  VALUES
    ('Greater Accra', 'Accra', 15.00, 1),
    ('Greater Accra', 'Tema', 15.00, 2),
    ('Greater Accra', 'Madina', 15.00, 3),
    ('Greater Accra', 'Adenta', 15.00, 4),
    ('Greater Accra', 'Ashaiman', 15.00, 5),
    ('Greater Accra', 'East Legon', 15.00, 6),
    ('Ashanti', 'Kumasi', 20.00, 1),
    ('Ashanti', 'Obuasi', 22.00, 2),
    ('Ashanti', 'Ejisu', 20.00, 3),
    ('Ashanti', 'Mampong', 22.00, 4),
    ('Central', 'Cape Coast', 18.00, 1),
    ('Central', 'Kasoa', 18.00, 2),
    ('Central', 'Winneba', 18.00, 3),
    ('Central', 'Elmina', 18.00, 4),
    ('Eastern', 'Koforidua', 18.00, 1),
    ('Eastern', 'Akosombo', 18.00, 2),
    ('Eastern', 'Nkawkaw', 20.00, 3),
    ('Eastern', 'Akim Oda', 20.00, 4),
    ('Western', 'Sekondi-Takoradi', 20.00, 1),
    ('Western', 'Tarkwa', 22.00, 2),
    ('Western', 'Axim', 24.00, 3),
    ('Western North', 'Sefwi Wiawso', 22.00, 1),
    ('Western North', 'Bibiani', 24.00, 2),
    ('Western North', 'Juaboso', 24.00, 3),
    ('Volta', 'Ho', 20.00, 1),
    ('Volta', 'Hohoe', 22.00, 2),
    ('Volta', 'Keta', 22.00, 3),
    ('Volta', 'Aflao', 22.00, 4),
    ('Oti', 'Dambai', 22.00, 1),
    ('Oti', 'Nkwanta', 24.00, 2),
    ('Oti', 'Kadjebi', 24.00, 3),
    ('Northern', 'Tamale', 25.00, 1),
    ('Northern', 'Savelugu', 25.00, 2),
    ('Northern', 'Yendi', 26.00, 3),
    ('Savannah', 'Damongo', 27.00, 1),
    ('Savannah', 'Bole', 27.00, 2),
    ('Savannah', 'Salaga', 28.00, 3),
    ('North East', 'Nalerigu', 27.00, 1),
    ('North East', 'Walewale', 27.00, 2),
    ('North East', 'Gambaga', 28.00, 3),
    ('Upper East', 'Bolgatanga', 28.00, 1),
    ('Upper East', 'Navrongo', 28.00, 2),
    ('Upper East', 'Bawku', 30.00, 3),
    ('Upper West', 'Wa', 28.00, 1),
    ('Upper West', 'Lawra', 30.00, 2),
    ('Upper West', 'Jirapa', 30.00, 3),
    ('Bono', 'Sunyani', 22.00, 1),
    ('Bono', 'Berekum', 22.00, 2),
    ('Bono', 'Dormaa Ahenkro', 24.00, 3),
    ('Bono East', 'Techiman', 22.00, 1),
    ('Bono East', 'Kintampo', 24.00, 2),
    ('Bono East', 'Atebubu', 24.00, 3),
    ('Ahafo', 'Goaso', 22.00, 1),
    ('Ahafo', 'Bechem', 22.00, 2),
    ('Ahafo', 'Kenyasi', 24.00, 3)
)
INSERT INTO public.shipping_cities (region_id, name, shipping_fee, sort_order, is_active, updated_at)
SELECT regions.id, city_seed.city_name, city_seed.shipping_fee, city_seed.sort_order, true, now()
FROM city_seed
JOIN public.shipping_regions regions ON regions.name = city_seed.region_name
ON CONFLICT (region_id, name) DO UPDATE
SET
  shipping_fee = EXCLUDED.shipping_fee,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = now();
