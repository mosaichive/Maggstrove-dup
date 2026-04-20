/**
 * Men's T-Shirts & Vests — Product Catalogue
 *
 * Prices auto-assigned between GH₵85–GH₵150 based on visual complexity scoring.
 * Score 1–10. Final price = 85 + (score / 10) * 65
 */

import tshirt1 from "@/assets/tshirts/tshirt-1.jpg";
import tshirt2 from "@/assets/tshirts/tshirt-2.jpg";
import tshirt3 from "@/assets/tshirts/tshirt-3.jpg";
import tshirt4 from "@/assets/tshirts/tshirt-4.jpg";
import tshirt5 from "@/assets/tshirts/tshirt-5.jpg";
import tshirt6 from "@/assets/tshirts/tshirt-6.jpg";
import tshirt7 from "@/assets/tshirts/tshirt-7.jpg";
import tshirt8 from "@/assets/tshirts/tshirt-8.jpg";
import tshirt9 from "@/assets/tshirts/tshirt-9.jpg";
import tshirt10 from "@/assets/tshirts/tshirt-10.jpg";
import tshirt11 from "@/assets/tshirts/tshirt-11.jpg";
import tshirt12 from "@/assets/tshirts/tshirt-12.jpg";
import tshirt13 from "@/assets/tshirts/tshirt-13.jpg";
import tshirt14 from "@/assets/tshirts/tshirt-14.jpg";
import tshirt15 from "@/assets/tshirts/tshirt-15.jpg";
import tshirt16 from "@/assets/tshirts/tshirt-16.jpg";
import tshirt17 from "@/assets/tshirts/tshirt-17.jpg";
import tshirt18 from "@/assets/tshirts/tshirt-18.jpg";
import tshirt19 from "@/assets/tshirts/tshirt-19.jpg";
import tshirt20 from "@/assets/tshirts/tshirt-20.jpg";

export interface TshirtProduct {
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

const p = (score: number) => Math.round((85 + (score / 10) * 65) * 100) / 100;

export const menTshirts: TshirtProduct[] = [
  {
    id: "tshirt-001",
    name: "Ribbed V-Neck Polo – Burgundy",
    brand: "TREND",
    complexityScore: 6.4,
    style: "Smart Casual",
    fabric: "Ribbed Cotton",
    price: p(6.4),
    image: tshirt1,
    isNew: true,
  },
  {
    id: "tshirt-002",
    name: "Ribbed V-Neck Polo – Beige",
    brand: "TREND",
    complexityScore: 5.9,
    style: "Smart Casual",
    fabric: "Ribbed Cotton",
    price: p(5.9),
    image: tshirt2,
  },
  {
    id: "tshirt-003",
    name: "Contrast Trim V-Neck Polo – Black",
    brand: "TREND",
    complexityScore: 7.2,
    style: "Smart Casual",
    fabric: "Ribbed Cotton Blend",
    price: p(7.2),
    image: tshirt3,
  },
  {
    id: "tshirt-004",
    name: "Saint 98 Cross Pattern Jersey – Purple",
    brand: "SAINT",
    complexityScore: 9.6,
    style: "Streetwear",
    fabric: "Mesh Polyester",
    price: p(9.6),
    image: tshirt4,
    isNew: true,
  },
  {
    id: "tshirt-005",
    name: "Winner 38 Raglan Jersey – Cream",
    brand: "WINNER",
    complexityScore: 8.7,
    style: "Streetwear",
    fabric: "Performance Mesh",
    price: p(8.7),
    image: tshirt5,
  },
  {
    id: "tshirt-006",
    name: "Faithful 00 Eagle Jersey – Grey",
    brand: "FAITHFUL",
    complexityScore: 9.1,
    style: "Streetwear",
    fabric: "Premium Mesh",
    price: p(9.1),
    image: tshirt6,
  },
  {
    id: "tshirt-007",
    name: "Brandname Houndstooth Jersey – Burgundy",
    brand: "BRANDNAME",
    complexityScore: 9.8,
    style: "Statement",
    fabric: "Printed Mesh Poly",
    price: p(9.8),
    image: tshirt7,
  },
  {
    id: "tshirt-008",
    name: "Brandname Houndstooth Jersey – White",
    brand: "BRANDNAME",
    complexityScore: 9.3,
    style: "Statement",
    fabric: "Printed Mesh Poly",
    price: p(9.3),
    image: tshirt8,
  },
  {
    id: "tshirt-009",
    name: "Faithful 00 Eagle Jersey – Sky Blue",
    brand: "FAITHFUL",
    complexityScore: 8.5,
    style: "Streetwear",
    fabric: "Premium Mesh",
    price: p(8.5),
    image: tshirt9,
  },
  {
    id: "tshirt-010",
    name: "Faithful 00 Eagle Jersey – Black/Pink",
    brand: "FAITHFUL",
    complexityScore: 9.4,
    style: "Streetwear",
    fabric: "Premium Mesh",
    price: p(9.4),
    image: tshirt10,
    isNew: true,
  },
  {
    id: "tshirt-011",
    name: "Saint 98 Cross Pattern Jersey – Black/Red",
    brand: "SAINT",
    complexityScore: 9.7,
    style: "Streetwear",
    fabric: "Mesh Polyester",
    price: p(9.7),
    image: tshirt11,
    isNew: true,
  },
  {
    id: "tshirt-012",
    name: "Faithful 00 Eagle Jersey – Royal Blue",
    brand: "FAITHFUL",
    complexityScore: 8.9,
    style: "Streetwear",
    fabric: "Premium Mesh",
    price: p(8.9),
    image: tshirt12,
  },
  {
    id: "tshirt-013",
    name: "Brandname Houndstooth Jersey – White/Grey",
    brand: "BRANDNAME",
    complexityScore: 9.0,
    style: "Statement",
    fabric: "Printed Mesh Poly",
    price: p(9.0),
    image: tshirt13,
  },
  {
    id: "tshirt-014",
    name: "Love Is Good Rhinestone Jersey – Black",
    brand: "MAGGS COLLECTION",
    complexityScore: 8.2,
    style: "Statement",
    fabric: "Sparkle Mesh",
    price: p(8.2),
    image: tshirt14,
  },
  {
    id: "tshirt-015",
    name: "Saint 98 Cross Pattern Jersey – Grey",
    brand: "SAINT",
    complexityScore: 9.2,
    style: "Streetwear",
    fabric: "Mesh Polyester",
    price: p(9.2),
    image: tshirt15,
  },
  {
    id: "tshirt-016",
    name: "Saint 98 Cross Pattern Jersey – Lime",
    brand: "SAINT",
    complexityScore: 9.5,
    style: "Streetwear",
    fabric: "Mesh Polyester",
    price: p(9.5),
    image: tshirt16,
    isNew: true,
  },
  {
    id: "tshirt-017",
    name: "Saint 98 Cross Pattern Jersey – Ice Blue",
    brand: "SAINT",
    complexityScore: 8.8,
    style: "Streetwear",
    fabric: "Mesh Polyester",
    price: p(8.8),
    image: tshirt17,
  },
  {
    id: "tshirt-018",
    name: "Brandname Houndstooth Jersey – Black/Red",
    brand: "BRANDNAME",
    complexityScore: 9.9,
    style: "Statement",
    fabric: "Printed Mesh Poly",
    price: p(9.9),
    image: tshirt18,
  },
  {
    id: "tshirt-019",
    name: "Faithful 00 Eagle Jersey – Forest Green",
    brand: "FAITHFUL",
    complexityScore: 8.6,
    style: "Streetwear",
    fabric: "Premium Mesh",
    price: p(8.6),
    image: tshirt19,
  },
  {
    id: "tshirt-020",
    name: "Love Is Good Rhinestone Jersey – White",
    brand: "MAGGS COLLECTION",
    complexityScore: 7.8,
    style: "Statement",
    fabric: "Sparkle Mesh",
    price: p(7.8),
    image: tshirt20,
  },
];
