/**
 * Women's Tops — Product Catalogue
 *
 * Prices auto-assigned between GH₵85–GH₵150 based on visual complexity scoring.
 * Score 1–10. Final price = 85 + (score / 10) * 65
 */

import top1 from "@/assets/tops/top-1.jpg";
import top2 from "@/assets/tops/top-2.jpg";
import top3 from "@/assets/tops/top-3.jpg";
import top4 from "@/assets/tops/top-4.jpg";
import top5 from "@/assets/tops/top-5.jpg";
import top6 from "@/assets/tops/top-6.jpg";
import top7 from "@/assets/tops/top-7.jpg";
import top8 from "@/assets/tops/top-8.jpg";
import top9 from "@/assets/tops/top-9.jpg";
import top10 from "@/assets/tops/top-10.jpg";
import top11 from "@/assets/tops/top-11.jpg";
import top12 from "@/assets/tops/top-12.jpg";
import top13 from "@/assets/tops/top-13.jpg";
import top14 from "@/assets/tops/top-14.jpg";
import top15 from "@/assets/tops/top-15.jpg";
import top16 from "@/assets/tops/top-16.jpg";
import top17 from "@/assets/tops/top-17.jpg";
import top18 from "@/assets/tops/top-18.jpg";

export interface TopProduct {
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

export const womenTops: TopProduct[] = [
  {
    id: "top-001",
    name: "Leopard Print Balloon Sleeve Top",
    brand: "MAGGS LUXE",
    complexityScore: 8.2,
    style: "Statement",
    fabric: "Printed Satin",
    price: 138.30,
    image: top1,
    isNew: true,
  },
  {
    id: "top-002",
    name: "Black Embellished Halter Top",
    brand: "MAGGS LUXE",
    complexityScore: 9.1,
    style: "Formal",
    fabric: "Embellished Mesh",
    price: 144.15,
    image: top2,
  },
  {
    id: "top-003",
    name: "White Textured Puff Sleeve Crop",
    brand: "MAGGS COLLECTION",
    complexityScore: 7.8,
    style: "Smart Casual",
    fabric: "Textured Cotton",
    price: 135.70,
    image: top3,
    isNew: true,
  },
  {
    id: "top-004",
    name: "Denim Corset Bustier Top",
    brand: "MAGGS TAILORING",
    complexityScore: 8.5,
    style: "Smart Casual",
    fabric: "Denim / Structured",
    price: 140.25,
    image: top4,
  },
  {
    id: "top-005",
    name: "Red Ribbed Halter Crop Top",
    brand: "MAGGS BASICS",
    complexityScore: 5.4,
    style: "Casual",
    fabric: "Ribbed Cotton Blend",
    price: 120.10,
    image: top5,
  },
  {
    id: "top-006",
    name: "White Button-Front Peplum Shirt",
    brand: "MAGGS TAILORING",
    complexityScore: 7.3,
    style: "Smart Casual",
    fabric: "Cotton Poplin",
    price: 132.45,
    image: top6,
  },
  {
    id: "top-007",
    name: "Mesh Overlay Long Sleeve Top",
    brand: "MAGGS COLLECTION",
    complexityScore: 8.7,
    style: "Cocktail",
    fabric: "Sheer Mesh / Jersey",
    price: 141.55,
    image: top7,
    isNew: true,
  },
  {
    id: "top-008",
    name: "Beige Tie-Front Crop Top",
    brand: "MAGGS BASICS",
    complexityScore: 4.8,
    style: "Casual",
    fabric: "Cotton Blend",
    price: 116.20,
    image: top8,
  },
  {
    id: "top-009",
    name: "Floral Ruched One-Shoulder Top",
    brand: "MAGGS COLLECTION",
    complexityScore: 8.9,
    style: "Statement",
    fabric: "Printed Satin",
    price: 142.85,
    image: top9,
  },
  {
    id: "top-010",
    name: "Pink Tie-Dye Wrap Crop Top",
    brand: "MAGGS COLLECTION",
    complexityScore: 6.7,
    style: "Casual",
    fabric: "Printed Jersey",
    price: 128.55,
    image: top10,
    isNew: true,
  },
  {
    id: "top-011",
    name: "Monochrome Pleated Neck Blouse",
    brand: "MAGGS COLLECTION",
    complexityScore: 7.6,
    style: "Smart Casual",
    fabric: "Pleated Chiffon",
    price: 134.40,
    image: top11,
    isNew: true,
  },
  {
    id: "top-012",
    name: "Crystal Trim Evening Corset Top",
    brand: "MAGGS LUXE",
    complexityScore: 9.4,
    style: "Formal",
    fabric: "Structured Satin",
    price: 146.10,
    image: top12,
  },
  {
    id: "top-013",
    name: "Relaxed Cotton Knot Tee",
    brand: "MAGGS BASICS",
    complexityScore: 5.2,
    style: "Casual",
    fabric: "Soft Cotton Jersey",
    price: 118.80,
    image: top13,
  },
  {
    id: "top-014",
    name: "Wrap Waist Poplin Shirt",
    brand: "MAGGS TAILORING",
    complexityScore: 6.9,
    style: "Smart Casual",
    fabric: "Cotton Poplin",
    price: 130.20,
    image: top14,
  },
  {
    id: "top-015",
    name: "Lace Panel High-Neck Blouse",
    brand: "MAGGS COLLECTION",
    complexityScore: 8.4,
    style: "Cocktail",
    fabric: "Lace / Crepe Blend",
    price: 139.60,
    image: top15,
  },
  {
    id: "top-016",
    name: "Minimal Ribbed Sleeveless Top",
    brand: "MAGGS BASICS",
    complexityScore: 5.9,
    style: "Casual",
    fabric: "Ribbed Knit",
    price: 122.95,
    image: top16,
  },
  {
    id: "top-017",
    name: "Beaded Organza Statement Top",
    brand: "MAGGS LUXE",
    complexityScore: 9.8,
    style: "Statement",
    fabric: "Organza / Hand Beading",
    price: 148.35,
    image: top17,
    isNew: true,
  },
  {
    id: "top-018",
    name: "Printed Tie-Front Day Blouse",
    brand: "MAGGS COLLECTION",
    complexityScore: 6.4,
    style: "Casual",
    fabric: "Printed Viscose",
    price: 126.75,
    image: top18,
  },
];
