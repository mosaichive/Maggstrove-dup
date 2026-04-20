export interface GhanaShippingCitySeed {
  id: string;
  name: string;
  shipping_fee: number | null;
  sort_order: number;
}

export interface GhanaShippingRegionSeed {
  id: string;
  name: string;
  default_shipping_fee: number;
  sort_order: number;
  cities: GhanaShippingCitySeed[];
}

export const GHANA_SHIPPING_REGIONS: GhanaShippingRegionSeed[] = [
  {
    id: "greater-accra",
    name: "Greater Accra",
    default_shipping_fee: 15,
    sort_order: 1,
    cities: [
      { id: "accra", name: "Accra", shipping_fee: 15, sort_order: 1 },
      { id: "tema", name: "Tema", shipping_fee: 15, sort_order: 2 },
      { id: "madina", name: "Madina", shipping_fee: 15, sort_order: 3 },
      { id: "adenta", name: "Adenta", shipping_fee: 15, sort_order: 4 },
      { id: "ashaiman", name: "Ashaiman", shipping_fee: 15, sort_order: 5 },
      { id: "east-legon", name: "East Legon", shipping_fee: 15, sort_order: 6 },
    ],
  },
  {
    id: "ashanti",
    name: "Ashanti",
    default_shipping_fee: 20,
    sort_order: 2,
    cities: [
      { id: "kumasi", name: "Kumasi", shipping_fee: 20, sort_order: 1 },
      { id: "obuasi", name: "Obuasi", shipping_fee: 22, sort_order: 2 },
      { id: "ejisu", name: "Ejisu", shipping_fee: 20, sort_order: 3 },
      { id: "mampong", name: "Mampong", shipping_fee: 22, sort_order: 4 },
    ],
  },
  {
    id: "central",
    name: "Central",
    default_shipping_fee: 18,
    sort_order: 3,
    cities: [
      { id: "cape-coast", name: "Cape Coast", shipping_fee: 18, sort_order: 1 },
      { id: "kasoa", name: "Kasoa", shipping_fee: 18, sort_order: 2 },
      { id: "winneba", name: "Winneba", shipping_fee: 18, sort_order: 3 },
      { id: "elmina", name: "Elmina", shipping_fee: 18, sort_order: 4 },
    ],
  },
  {
    id: "eastern",
    name: "Eastern",
    default_shipping_fee: 18,
    sort_order: 4,
    cities: [
      { id: "koforidua", name: "Koforidua", shipping_fee: 18, sort_order: 1 },
      { id: "akosombo", name: "Akosombo", shipping_fee: 18, sort_order: 2 },
      { id: "nkawkaw", name: "Nkawkaw", shipping_fee: 20, sort_order: 3 },
      { id: "akim-oda", name: "Akim Oda", shipping_fee: 20, sort_order: 4 },
    ],
  },
  {
    id: "western",
    name: "Western",
    default_shipping_fee: 20,
    sort_order: 5,
    cities: [
      { id: "sekondi-takoradi", name: "Sekondi-Takoradi", shipping_fee: 20, sort_order: 1 },
      { id: "tarkwa", name: "Tarkwa", shipping_fee: 22, sort_order: 2 },
      { id: "axim", name: "Axim", shipping_fee: 24, sort_order: 3 },
    ],
  },
  {
    id: "western-north",
    name: "Western North",
    default_shipping_fee: 22,
    sort_order: 6,
    cities: [
      { id: "sefwi-wiawso", name: "Sefwi Wiawso", shipping_fee: 22, sort_order: 1 },
      { id: "bibiani", name: "Bibiani", shipping_fee: 24, sort_order: 2 },
      { id: "juaboso", name: "Juaboso", shipping_fee: 24, sort_order: 3 },
    ],
  },
  {
    id: "volta",
    name: "Volta",
    default_shipping_fee: 20,
    sort_order: 7,
    cities: [
      { id: "ho", name: "Ho", shipping_fee: 20, sort_order: 1 },
      { id: "hohoe", name: "Hohoe", shipping_fee: 22, sort_order: 2 },
      { id: "keta", name: "Keta", shipping_fee: 22, sort_order: 3 },
      { id: "aflao", name: "Aflao", shipping_fee: 22, sort_order: 4 },
    ],
  },
  {
    id: "oti",
    name: "Oti",
    default_shipping_fee: 22,
    sort_order: 8,
    cities: [
      { id: "dambai", name: "Dambai", shipping_fee: 22, sort_order: 1 },
      { id: "kwanta", name: "Nkwanta", shipping_fee: 24, sort_order: 2 },
      { id: "kadjebi", name: "Kadjebi", shipping_fee: 24, sort_order: 3 },
    ],
  },
  {
    id: "northern",
    name: "Northern",
    default_shipping_fee: 25,
    sort_order: 9,
    cities: [
      { id: "tamale", name: "Tamale", shipping_fee: 25, sort_order: 1 },
      { id: "savelugu", name: "Savelugu", shipping_fee: 25, sort_order: 2 },
      { id: "yendi", name: "Yendi", shipping_fee: 26, sort_order: 3 },
    ],
  },
  {
    id: "savannah",
    name: "Savannah",
    default_shipping_fee: 27,
    sort_order: 10,
    cities: [
      { id: "damongo", name: "Damongo", shipping_fee: 27, sort_order: 1 },
      { id: "bole", name: "Bole", shipping_fee: 27, sort_order: 2 },
      { id: "salaga", name: "Salaga", shipping_fee: 28, sort_order: 3 },
    ],
  },
  {
    id: "north-east",
    name: "North East",
    default_shipping_fee: 27,
    sort_order: 11,
    cities: [
      { id: "nalerigu", name: "Nalerigu", shipping_fee: 27, sort_order: 1 },
      { id: "walewale", name: "Walewale", shipping_fee: 27, sort_order: 2 },
      { id: "gambaga", name: "Gambaga", shipping_fee: 28, sort_order: 3 },
    ],
  },
  {
    id: "upper-east",
    name: "Upper East",
    default_shipping_fee: 28,
    sort_order: 12,
    cities: [
      { id: "bolgatanga", name: "Bolgatanga", shipping_fee: 28, sort_order: 1 },
      { id: "navrongo", name: "Navrongo", shipping_fee: 28, sort_order: 2 },
      { id: "bawku", name: "Bawku", shipping_fee: 30, sort_order: 3 },
    ],
  },
  {
    id: "upper-west",
    name: "Upper West",
    default_shipping_fee: 28,
    sort_order: 13,
    cities: [
      { id: "wa", name: "Wa", shipping_fee: 28, sort_order: 1 },
      { id: "lawra", name: "Lawra", shipping_fee: 30, sort_order: 2 },
      { id: "jirapa", name: "Jirapa", shipping_fee: 30, sort_order: 3 },
    ],
  },
  {
    id: "bono",
    name: "Bono",
    default_shipping_fee: 22,
    sort_order: 14,
    cities: [
      { id: "sunyani", name: "Sunyani", shipping_fee: 22, sort_order: 1 },
      { id: "berekum", name: "Berekum", shipping_fee: 22, sort_order: 2 },
      { id: "dormaa-ahenkro", name: "Dormaa Ahenkro", shipping_fee: 24, sort_order: 3 },
    ],
  },
  {
    id: "bono-east",
    name: "Bono East",
    default_shipping_fee: 22,
    sort_order: 15,
    cities: [
      { id: "techiman", name: "Techiman", shipping_fee: 22, sort_order: 1 },
      { id: "kintampo", name: "Kintampo", shipping_fee: 24, sort_order: 2 },
      { id: "atebubu", name: "Atebubu", shipping_fee: 24, sort_order: 3 },
    ],
  },
  {
    id: "ahafo",
    name: "Ahafo",
    default_shipping_fee: 22,
    sort_order: 16,
    cities: [
      { id: "goaso", name: "Goaso", shipping_fee: 22, sort_order: 1 },
      { id: "bechem", name: "Bechem", shipping_fee: 22, sort_order: 2 },
      { id: "kenyasi", name: "Kenyasi", shipping_fee: 24, sort_order: 3 },
    ],
  },
];

export const GHANA_REGION_NAMES = GHANA_SHIPPING_REGIONS.map((region) => region.name);

export const GHANA_CITIES_BY_REGION = Object.fromEntries(
  GHANA_SHIPPING_REGIONS.map((region) => [region.name, region.cities.map((city) => city.name)]),
) as Record<string, string[]>;

export const getFallbackShippingRegions = () =>
  GHANA_SHIPPING_REGIONS.map((region) => ({
    id: region.id,
    name: region.name,
    default_shipping_fee: region.default_shipping_fee,
    is_active: true,
    sort_order: region.sort_order,
  }));

export const getFallbackRegion = (regionId?: string | null, regionName?: string | null) =>
  GHANA_SHIPPING_REGIONS.find(
    (region) =>
      (regionId && region.id === regionId) ||
      (regionName && region.name.toLowerCase() === regionName.toLowerCase()),
  );

export const getFallbackCitiesForRegion = (regionId?: string | null, regionName?: string | null) => {
  const region = getFallbackRegion(regionId, regionName);

  return (region?.cities || []).map((city) => ({
    id: city.id,
    region_id: region!.id,
    name: city.name,
    shipping_fee: city.shipping_fee,
    is_active: true,
    sort_order: city.sort_order,
  }));
};
