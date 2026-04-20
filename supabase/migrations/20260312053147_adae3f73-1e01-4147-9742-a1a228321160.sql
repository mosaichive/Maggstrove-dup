
-- Ghana shipping regions table
CREATE TABLE public.shipping_regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  default_shipping_fee numeric NOT NULL DEFAULT 15.00,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Ghana shipping cities table
CREATE TABLE public.shipping_cities (
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

-- Order tracking history table
CREATE TABLE public.order_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  note text,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shipping_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tracking ENABLE ROW LEVEL SECURITY;

-- Shipping regions: public read, admin write
CREATE POLICY "Anyone can read active regions" ON public.shipping_regions
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage regions" ON public.shipping_regions
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Shipping cities: public read, admin write
CREATE POLICY "Anyone can read active cities" ON public.shipping_cities
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage cities" ON public.shipping_cities
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Order tracking: users read own, admins read/write all
CREATE POLICY "Users can read own order tracking" ON public.order_tracking
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_tracking.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "Admins can read all tracking" ON public.order_tracking
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert tracking" ON public.order_tracking
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
