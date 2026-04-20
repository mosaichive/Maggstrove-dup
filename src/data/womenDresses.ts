/**
 * Women's Dresses — Product Catalogue
 *
 * Prices auto-assigned between GH₵85–GH₵150 based on visual complexity scoring.
 * Score 1–10. Final price = 85 + (score / 10) * 65
 */

import dress1 from "@/assets/dresses/dress-1.jpg";
import dress2 from "@/assets/dresses/dress-2.jpg";
import dress3 from "@/assets/dresses/dress-3.jpg";
import dress4 from "@/assets/dresses/dress-4.jpg";
import dress5 from "@/assets/dresses/dress-5.jpg";
import dress6 from "@/assets/dresses/dress-6.jpg";
import dress7 from "@/assets/dresses/dress-7.jpg";
import dress8 from "@/assets/dresses/dress-8.jpg";
import dress9 from "@/assets/dresses/dress-9.jpg";
import dress10 from "@/assets/dresses/dress-10.jpg";
import dress11 from "@/assets/dresses/dress-11.jpg";
import dress12 from "@/assets/dresses/dress-12.jpg";
import dress13 from "@/assets/dresses/dress-13.jpg";
import dress14 from "@/assets/dresses/dress-14.jpg";
import dress15 from "@/assets/dresses/dress-15.jpg";
import dress16 from "@/assets/dresses/dress-16.jpg";
import dress17 from "@/assets/dresses/dress-17.jpg";
import dress18 from "@/assets/dresses/dress-18.jpg";
import dress19 from "@/assets/dresses/dress-19.jpg";
import dress20 from "@/assets/dresses/dress-20.jpg";
import dress21 from "@/assets/dresses/dress-21.jpg";
import dress21Hover from "@/assets/dresses/dress-21-hover.jpg";
import dress22 from "@/assets/dresses/dress-22.jpg";
import dress23 from "@/assets/dresses/dress-23.jpg";
import dress24 from "@/assets/dresses/dress-24.jpg";
import dress25 from "@/assets/dresses/dress-25.jpg";
import dress26 from "@/assets/dresses/dress-26.jpg";
import dress27 from "@/assets/dresses/dress-27.jpg";
import dress28 from "@/assets/dresses/dress-28.jpg";
import dress29 from "@/assets/dresses/dress-29.jpg";
import dress30 from "@/assets/dresses/dress-30.jpg";
import dress31 from "@/assets/dresses/dress-31.jpg";
import dress32 from "@/assets/dresses/dress-32.jpg";
import dress33 from "@/assets/dresses/dress-33.jpg";
import dress34 from "@/assets/dresses/dress-34.jpg";
import dress35 from "@/assets/dresses/dress-35.jpg";
import dress36 from "@/assets/dresses/dress-36.jpg";
import dress37 from "@/assets/dresses/dress-37.jpg";
import dress38 from "@/assets/dresses/dress-38.jpg";
import dress39 from "@/assets/dresses/dress-39.jpg";
import dress40 from "@/assets/dresses/dress-40.jpg";
import dress41 from "@/assets/dresses/dress-41.jpg";
import dress42 from "@/assets/dresses/dress-42.jpg";
import dress43 from "@/assets/dresses/dress-43.jpg";
import dress44 from "@/assets/dresses/dress-44.jpg";
import dress45 from "@/assets/dresses/dress-45.jpg";
import dress46 from "@/assets/dresses/dress-46.jpg";

export interface DressProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  isNew?: boolean;
  isSale?: boolean;
  complexityScore: number;
  style: string;
  fabric: string;
  adminOverride?: boolean;
}

export const womenDresses: DressProduct[] = [
  {
    id: "dress-001",
    name: "Ruched Metallic Mini Dress",
    brand: "MAGGS COLLECTION",
    complexityScore: 7.4,
    style: "Cocktail",
    fabric: "Metallic Jersey",
    price: 133.10,
    image: dress1,
    isNew: true,
  },
  {
    id: "dress-002",
    name: "Draped Cowl Maxi Dress",
    brand: "MAGGS LUXE",
    complexityScore: 8.1,
    style: "Formal",
    fabric: "Stretch Crepe",
    price: 137.65,
    image: dress2,
    isNew: true,
  },
  {
    id: "dress-003",
    name: "Textured Halter Bodycon",
    brand: "MAGGS COLLECTION",
    complexityScore: 8.6,
    style: "Cocktail",
    fabric: "Textured Knit",
    price: 140.90,
    image: dress3,
  },
  {
    id: "dress-004",
    name: "Sheer Ruched Asymmetric Dress",
    brand: "MAGGS LUXE",
    complexityScore: 8.9,
    style: "Cocktail",
    fabric: "Mesh / Jersey",
    price: 142.85,
    image: dress4,
  },
  {
    id: "dress-005",
    name: "Strapless Pleated Midi",
    brand: "MAGGS COLLECTION",
    complexityScore: 9.1,
    style: "Formal",
    fabric: "Chiffon Mesh",
    price: 144.15,
    image: dress5,
    isNew: true,
  },
  {
    id: "dress-006",
    name: "Leopard Print Cut-Out Maxi",
    brand: "MAGGS LUXE",
    complexityScore: 9.5,
    style: "Statement",
    fabric: "Printed Satin",
    price: 146.75,
    image: dress6,
  },
  {
    id: "dress-007",
    name: "Strapless Ruched Mini",
    brand: "MAGGS BASICS",
    complexityScore: 4.2,
    style: "Casual",
    fabric: "Stretch Cotton",
    price: 112.30,
    image: dress7,
    isSale: true,
    originalPrice: 125.00,
  },
  {
    id: "dress-008",
    name: "Smocked Wrap Mini Dress",
    brand: "MAGGS TAILORING",
    complexityScore: 8.3,
    style: "Smart Casual",
    fabric: "Satin / Smocked",
    price: 138.95,
    image: dress8,
  },
  {
    id: "dress-009",
    name: "Glitter Wrap Party Dress",
    brand: "MAGGS LUXE",
    complexityScore: 9.3,
    style: "Formal",
    fabric: "Glitter Jersey",
    price: 145.45,
    image: dress9,
    isNew: true,
  },
  {
    id: "dress-010",
    name: "Velvet Corset Mini Dress",
    brand: "MAGGS COLLECTION",
    complexityScore: 9.7,
    style: "Cocktail",
    fabric: "Velvet / Mesh",
    price: 148.05,
    image: dress10,
  },
  {
    id: "dress-011",
    name: "Argyle Polo Mini Dress",
    brand: "MAGGS COLLECTION",
    complexityScore: 6.8,
    style: "Smart Casual",
    fabric: "Printed Stretch Knit",
    price: 129.20,
    image: dress11,
    isNew: true,
  },
  {
    id: "dress-012",
    name: "Zebra Print Cut-Out Mini",
    brand: "MAGGS LUXE",
    complexityScore: 8.4,
    style: "Statement",
    fabric: "Printed Jersey",
    price: 139.60,
    image: dress12,
  },
  {
    id: "dress-013",
    name: "Ribbed Cami Bodycon Dress",
    brand: "MAGGS BASICS",
    complexityScore: 3.5,
    style: "Casual",
    fabric: "Ribbed Cotton Blend",
    price: 107.75,
    image: dress13,
  },
  {
    id: "dress-014",
    name: "Starfish Embellished Halter Maxi",
    brand: "MAGGS LUXE",
    complexityScore: 9.4,
    style: "Formal",
    fabric: "Textured Chiffon / Beaded",
    price: 146.10,
    image: dress14,
    isNew: true,
  },
  {
    id: "dress-015",
    name: "Ruched Strapless Mini – Emerald",
    brand: "MAGGS COLLECTION",
    complexityScore: 5.2,
    style: "Cocktail",
    fabric: "Stretch Jersey",
    price: 118.80,
    image: dress15,
    isSale: true,
    originalPrice: 130.00,
  },
  {
    id: "dress-016",
    name: "Twist-Knot Textured Midi",
    brand: "MAGGS TAILORING",
    complexityScore: 7.6,
    style: "Smart Casual",
    fabric: "Waffle Knit",
    price: 134.40,
    image: dress16,
  },
  {
    id: "dress-017",
    name: "Eyelet Ruffle Babydoll Dress",
    brand: "MAGGS COLLECTION",
    complexityScore: 6.1,
    style: "Casual",
    fabric: "Cotton Eyelet Lace",
    price: 124.65,
    image: dress17,
  },
  {
    id: "dress-018",
    name: "Colour Block Strappy Midi",
    brand: "MAGGS COLLECTION",
    complexityScore: 5.8,
    style: "Casual",
    fabric: "Printed Cotton Sateen",
    price: 122.70,
    image: dress18,
  },
  {
    id: "dress-019",
    name: "Gold Metallic Draped Mini",
    brand: "MAGGS LUXE",
    complexityScore: 9.6,
    style: "Cocktail",
    fabric: "Metallic Lamé",
    price: 147.40,
    image: dress19,
    isNew: true,
  },
  {
    id: "dress-020",
    name: "Floral Halter Maxi – Sunset",
    brand: "MAGGS LUXE",
    complexityScore: 8.7,
    style: "Statement",
    fabric: "Printed Chiffon / Mesh",
    price: 141.55,
    image: dress20,
  },
  {
    id: "dress-021",
    name: "Floral Ruched Strapless Mini – Lilac",
    brand: "MAGGS COLLECTION",
    complexityScore: 6.3,
    style: "Casual",
    fabric: "Ribbed Printed Cotton",
    price: 125.95,
    image: dress21,
    hoverImage: dress21Hover,
    isNew: true,
  },
  {
    id: "dress-022",
    name: "Black Glitter Halter Bodycon",
    brand: "MAGGS LUXE",
    complexityScore: 8.2,
    style: "Cocktail",
    fabric: "Glitter Ribbed Jersey",
    price: 138.30,
    image: dress22,
  },
  {
    id: "dress-023",
    name: "White Ribbed Halter Tunic Dress",
    brand: "MAGGS BASICS",
    complexityScore: 3.8,
    style: "Casual",
    fabric: "Textured Ribbed Cotton",
    price: 109.70,
    image: dress23,
  },
  {
    id: "dress-024",
    name: "Floral Balloon Sleeve Mini – Sky Blue",
    brand: "MAGGS COLLECTION",
    complexityScore: 8.8,
    style: "Smart Casual",
    fabric: "Printed Cotton Sateen",
    price: 142.20,
    image: dress24,
    isNew: true,
  },
  {
    id: "dress-025",
    name: "Bold Floral One-Shoulder Mini",
    brand: "MAGGS LUXE",
    complexityScore: 9.2,
    style: "Statement",
    fabric: "Printed Satin",
    price: 144.80,
    image: dress25,
  },
  {
    id: "dress-026",
    name: "Gold Metallic Twist-Front Mini",
    brand: "MAGGS LUXE",
    complexityScore: 9.0,
    style: "Cocktail",
    fabric: "Metallic Lamé",
    price: 143.50,
    image: dress26,
    isNew: true,
  },
  {
    id: "dress-027",
    name: "White Strapless Bow Midi Dress",
    brand: "MAGGS TAILORING",
    complexityScore: 5.5,
    style: "Smart Casual",
    fabric: "Cotton Crepe",
    price: 120.75,
    image: dress27,
  },
  {
    id: "dress-028",
    name: "Zebra Print Strapless Cut-Out Mini",
    brand: "MAGGS COLLECTION",
    complexityScore: 7.8,
    style: "Statement",
    fabric: "Printed Stretch Jersey",
    price: 135.70,
    image: dress28,
  },
  {
    id: "dress-029",
    name: "Rust Wrap Halter Midi Dress",
    brand: "MAGGS COLLECTION",
    complexityScore: 6.0,
    style: "Casual",
    fabric: "Matte Jersey",
    price: 124.00,
    image: dress29,
  },
  {
    id: "dress-030",
    name: "White Knit Front-Twist Midi",
    brand: "MAGGS BASICS",
    complexityScore: 6.2,
    style: "Smart Casual",
    fabric: "Textured Knit",
    price: 125.30,
    image: dress30,
  },
  {
    id: "dress-031",
    name: "Floral Lace-Up Front Mini",
    brand: "MAGGS COLLECTION",
    complexityScore: 7.5,
    style: "Casual",
    fabric: "Printed Cotton",
    price: 133.75,
    image: dress31,
  },
  {
    id: "dress-032",
    name: "Cream Textured One-Shoulder Midi",
    brand: "MAGGS LUXE",
    complexityScore: 6.8,
    style: "Smart Casual",
    fabric: "Textured Stretch Knit",
    price: 129.20,
    image: dress32,
  },
  {
    id: "dress-033",
    name: "Pink Ruffle Tier Mini Dress",
    brand: "MAGGS COLLECTION",
    complexityScore: 8.5,
    style: "Cocktail",
    fabric: "Crepe / Ruffles",
    price: 140.25,
    image: dress33,
    isNew: true,
  },
  {
    id: "dress-034",
    name: "Brown Ribbed V-Neck Midi Bodycon",
    brand: "MAGGS BASICS",
    complexityScore: 4.0,
    style: "Casual",
    fabric: "Ribbed Knit",
    price: 111.00,
    image: dress34,
  },
  {
    id: "dress-035",
    name: "Red High-Neck Side Cut-Out Bodycon",
    brand: "MAGGS LUXE",
    complexityScore: 8.9,
    style: "Statement",
    fabric: "Stretch Jersey",
    price: 142.85,
    image: dress35,
  },
  {
    id: "dress-036",
    name: "Light Blue Ruched Spaghetti Strap Midi",
    brand: "MAGGS COLLECTION",
    complexityScore: 7.1,
    style: "Cocktail",
    fabric: "Stretch Mesh / Jersey",
    price: 131.15,
    image: dress36,
  },
  {
    id: "dress-037",
    name: "Pink Tie-Dye Puff Sleeve Mini",
    brand: "MAGGS LUXE",
    complexityScore: 8.0,
    style: "Casual",
    fabric: "Printed Chiffon",
    price: 137.00,
    image: dress37,
    isNew: true,
  },
  {
    id: "dress-038",
    name: "Maroon Square-Neck Slit Mini",
    brand: "MAGGS TAILORING",
    complexityScore: 5.5,
    style: "Smart Casual",
    fabric: "Crepe",
    price: 120.75,
    image: dress38,
  },
  {
    id: "dress-039",
    name: "Leopard Print Halter Ruffle Mini",
    brand: "MAGGS LUXE",
    complexityScore: 8.8,
    style: "Statement",
    fabric: "Printed Mesh",
    price: 142.20,
    image: dress39,
  },
  {
    id: "dress-040",
    name: "Tropical Print Ruched One-Shoulder",
    brand: "MAGGS LUXE",
    complexityScore: 9.1,
    style: "Statement",
    fabric: "Printed Satin",
    price: 144.15,
    image: dress40,
    isNew: true,
  },
  {
    id: "dress-041",
    name: "Playing Cards Print Midi Dress",
    brand: "MAGGS COLLECTION",
    complexityScore: 7.9,
    style: "Casual",
    fabric: "Printed Cotton Blend",
    price: 136.35,
    image: dress41,
  },
  {
    id: "dress-042",
    name: "Black Rhinestone One-Shoulder Midi",
    brand: "MAGGS LUXE",
    complexityScore: 8.6,
    style: "Formal",
    fabric: "Stretch Crepe",
    price: 140.90,
    image: dress42,
  },
  {
    id: "dress-043",
    name: "Black Shimmer Fringed Midi",
    brand: "MAGGS LUXE",
    complexityScore: 9.5,
    style: "Formal",
    fabric: "Textured Sequin Mesh",
    price: 146.75,
    image: dress43,
  },
  {
    id: "dress-044",
    name: "Black Caped Maxi Gown",
    brand: "MAGGS LUXE",
    complexityScore: 8.3,
    style: "Formal",
    fabric: "Matte Jersey / Chiffon",
    price: 138.95,
    image: dress44,
  },
  {
    id: "dress-045",
    name: "Champagne Satin Slip Dress",
    brand: "MAGGS COLLECTION",
    complexityScore: 6.5,
    style: "Cocktail",
    fabric: "Satin",
    price: 127.25,
    image: dress45,
  },
  {
    id: "dress-046",
    name: "Burgundy Floral Smocked Mini",
    brand: "MAGGS BASICS",
    complexityScore: 5.5,
    style: "Casual",
    fabric: "Printed Rayon",
    price: 120.75,
    image: dress46,
  },
];
