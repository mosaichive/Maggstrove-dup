import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getFallbackCitiesForRegion,
  getFallbackRegion,
  getFallbackShippingRegions,
} from "@/data/ghanaShipping";

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
    void fetchRegions();
  }, []);

  const fetchRegions = async () => {
    setLoadingRegions(true);
    const { data, error } = await supabase
      .from("shipping_regions")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) {
      console.error("Failed to load shipping regions, using Ghana fallback data", error);
      setRegions(getFallbackShippingRegions() as ShippingRegion[]);
      setLoadingRegions(false);
      return;
    }

    if (data?.length) {
      setRegions((data as any as ShippingRegion[]) || []);
    } else {
      setRegions(getFallbackShippingRegions() as ShippingRegion[]);
    }

    setLoadingRegions(false);
  };

  const fetchCitiesByRegion = async (regionId: string) => {
    setLoadingCities(true);
    const { data, error } = await supabase
      .from("shipping_cities")
      .select("*")
      .eq("region_id", regionId)
      .eq("is_active", true)
      .order("sort_order");

    if (error) {
      console.error("Failed to load shipping cities, using Ghana fallback data", error);
    }

    if (data?.length) {
      setCities((data as any as ShippingCity[]) || []);
      setLoadingCities(false);
      return;
    }

    const selectedRegion = regions.find((region) => region.id === regionId);
    const fallbackCities = getFallbackCitiesForRegion(regionId, selectedRegion?.name);
    setCities(fallbackCities as ShippingCity[]);
    setLoadingCities(false);
  };

  const getShippingFee = (regionId: string, cityId: string): number => {
    const city = cities.find((c) => c.id === cityId);
    if (city?.shipping_fee !== null && city?.shipping_fee !== undefined) {
      return city.shipping_fee;
    }
    const region = regions.find((r) => r.id === regionId);
    if (region?.default_shipping_fee !== undefined && region?.default_shipping_fee !== null) {
      return region.default_shipping_fee;
    }

    const fallbackRegion = getFallbackRegion(regionId);
    return fallbackRegion?.default_shipping_fee ?? 15;
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
