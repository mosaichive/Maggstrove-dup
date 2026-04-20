import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ProductOverrideData {
  product_id: string;
  category: string;
  name: string | null;
  brand: string | null;
  price: number | null;
  original_price: number | null;
  image_url: string | null;
  style: string | null;
  fabric: string | null;
  is_new: boolean | null;
  is_sale: boolean | null;
  product_status: string;
}

/**
 * Fetches product overrides and returns a map + helper to check visibility.
 * Products marked as "sold" should be hidden from customers.
 */
export const useProductOverrides = () => {
  const [overridesMap, setOverridesMap] = useState<Record<string, ProductOverrideData>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("product_overrides").select("*");
      if (data) {
        const map: Record<string, ProductOverrideData> = {};
        data.forEach((o: any) => { map[o.product_id] = o; });
        setOverridesMap(map);
      }
      setLoaded(true);
    };
    fetch();
  }, []);

  const isAvailable = (productId: string) => {
    const override = overridesMap[productId];
    return !override || override.product_status !== "sold";
  };

  const getOverride = (productId: string) => overridesMap[productId] ?? null;

  return { overridesMap, loaded, isAvailable, getOverride };
};
