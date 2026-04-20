import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ShippingRegion {
  id: string;
  name: string;
  default_shipping_fee: number;
  is_active: boolean;
}

export interface ShippingCity {
  id: string;
  region_id: string;
  name: string;
  shipping_fee: number | null;
  is_active: boolean;
}

export const useShippingLocations = () => {
  const [regions, setRegions] = useState<ShippingRegion[]>([]);
  const [cities, setCities] = useState<ShippingCity[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    setLoadingRegions(true);
    const { data } = await supabase
      .from("shipping_regions")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    setRegions((data as any as ShippingRegion[]) || []);
    setLoadingRegions(false);
  };

  const fetchCitiesByRegion = async (regionId: string) => {
    setLoadingCities(true);
    const { data } = await supabase
      .from("shipping_cities")
      .select("*")
      .eq("region_id", regionId)
      .eq("is_active", true)
      .order("sort_order");
    setCities((data as any as ShippingCity[]) || []);
    setLoadingCities(false);
  };

  const getShippingFee = (regionId: string, cityId: string): number => {
    const city = cities.find((c) => c.id === cityId);
    if (city?.shipping_fee !== null && city?.shipping_fee !== undefined) {
      return city.shipping_fee;
    }
    const region = regions.find((r) => r.id === regionId);
    return region?.default_shipping_fee ?? 15;
  };

  return {
    regions,
    cities,
    loadingRegions,
    loadingCities,
    fetchRegions,
    fetchCitiesByRegion,
    getShippingFee,
  };
};
