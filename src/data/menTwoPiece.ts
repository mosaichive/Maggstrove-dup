/**
 * Men's 2 Piece Matching Sets — Product Catalogue
 *
 * Prices auto-assigned between GH₵85–GH₵150 based on visual complexity scoring.
 * Score 1–10. Final price = 85 + (score / 10) * 65
 */

import set1 from "@/assets/2piece/2piece-1.jpg";
import set2 from "@/assets/2piece/2piece-2.jpg";
import set3 from "@/assets/2piece/2piece-3.jpg";
import set4 from "@/assets/2piece/2piece-4.jpg";
import set5 from "@/assets/2piece/2piece-5.jpg";
import set6 from "@/assets/2piece/2piece-6.jpg";
import set7 from "@/assets/2piece/2piece-7.jpg";
import set8 from "@/assets/2piece/2piece-8.jpg";
import set9 from "@/assets/2piece/2piece-9.jpg";
import set10 from "@/assets/2piece/2piece-10.jpg";
import set11 from "@/assets/2piece/2piece-11.jpg";
import set12 from "@/assets/2piece/2piece-12.jpg";
import set13 from "@/assets/2piece/2piece-13.jpg";
import set14 from "@/assets/2piece/2piece-14.jpg";
import set15 from "@/assets/2piece/2piece-15.jpg";
import set16 from "@/assets/2piece/2piece-16.jpg";
import set17 from "@/assets/2piece/2piece-17.jpg";
import set18 from "@/assets/2piece/2piece-18.jpg";
import set19 from "@/assets/2piece/2piece-19.jpg";
import set20 from "@/assets/2piece/2piece-20.jpg";

export interface TwoPieceProduct {
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

export const menTwoPiece: TwoPieceProduct[] = [
  {
    id: "2piece-001",
    name: "ZARA Pocket Tee & Shorts Set – White",
    brand: "ZARA",
    complexityScore: 5.8,
    style: "Casual",
    fabric: "Cotton Jersey",
    price: p(5.8),
    image: set1,
    isNew: true,
  },
  {
    id: "2piece-002",
    name: "NR Chevron Polo & Shorts Set – Navy",
    brand: "NR",
    complexityScore: 8.4,
    style: "Smart Casual",
    fabric: "Textured Piqué",
    price: p(8.4),
    image: set2,
    isNew: true,
  },
  {
    id: "2piece-003",
    name: "Panthers Graphic Polo & Shorts – Teal",
    brand: "PANTHERS",
    complexityScore: 9.2,
    style: "Streetwear",
    fabric: "Premium Cotton Blend",
    price: p(9.2),
    image: set3,
  },
  {
    id: "2piece-004",
    name: "Panthers Graphic Polo & Shorts – Olive",
    brand: "PANTHERS",
    complexityScore: 9.0,
    style: "Streetwear",
    fabric: "Premium Cotton Blend",
    price: p(9.0),
    image: set4,
  },
  {
    id: "2piece-005",
    name: "NR Chevron Polo & Shorts Set – Green",
    brand: "NR",
    complexityScore: 8.6,
    style: "Smart Casual",
    fabric: "Textured Piqué",
    price: p(8.6),
    image: set5,
  },
  {
    id: "2piece-006",
    name: "Sinkronz Racing Polo & Shorts – Blue",
    brand: "SINKRONZ",
    complexityScore: 9.5,
    style: "Streetwear",
    fabric: "Performance Poly",
    price: p(9.5),
    image: set6,
    isNew: true,
  },
  {
    id: "2piece-007",
    name: "NR Chevron Polo & Shorts Set – Beige",
    brand: "NR",
    complexityScore: 7.6,
    style: "Smart Casual",
    fabric: "Textured Piqué",
    price: p(7.6),
    image: set7,
  },
  {
    id: "2piece-008",
    name: "FNANKG Tie-Dye Tee & Shorts Set – Aqua",
    brand: "FNANKG",
    complexityScore: 8.1,
    style: "Casual",
    fabric: "Dip-Dyed Cotton",
    price: p(8.1),
    image: set8,
  },
  {
    id: "2piece-009",
    name: "NR Chevron Polo & Shorts Set – Red",
    brand: "NR",
    complexityScore: 8.3,
    style: "Smart Casual",
    fabric: "Textured Piqué",
    price: p(8.3),
    image: set9,
  },
  {
    id: "2piece-010",
    name: "ZARA Classic Polo & Shorts Set – Black",
    brand: "ZARA",
    complexityScore: 6.5,
    style: "Minimal",
    fabric: "Smooth Cotton Piqué",
    price: p(6.5),
    image: set10,
  },
  {
    id: "2piece-011",
    name: "Striped Button-Down Shirt & Shorts – Brown",
    brand: "MAGGS COLLECTION",
    complexityScore: 7.9,
    style: "Resort",
    fabric: "Woven Cotton",
    price: p(7.9),
    image: set11,
    isNew: true,
  },
  {
    id: "2piece-012",
    name: "Sinkronz Racing Polo & Shorts – Cream",
    brand: "SINKRONZ",
    complexityScore: 9.1,
    style: "Streetwear",
    fabric: "Performance Poly",
    price: p(9.1),
    image: set12,
  },
  {
    id: "2piece-013",
    name: "Panthers Graphic Polo & Shorts – Navy",
    brand: "PANTHERS",
    complexityScore: 9.3,
    style: "Streetwear",
    fabric: "Premium Cotton Blend",
    price: p(9.3),
    image: set13,
  },
  {
    id: "2piece-014",
    name: "NR Chevron Polo & Shorts Set – Grey",
    brand: "NR",
    complexityScore: 7.7,
    style: "Smart Casual",
    fabric: "Textured Piqué",
    price: p(7.7),
    image: set14,
  },
  {
    id: "2piece-015",
    name: "ZARA Pocket Tee & Shorts Set – Brown",
    brand: "ZARA",
    complexityScore: 6.2,
    style: "Casual",
    fabric: "Cotton Jersey",
    price: p(6.2),
    image: set15,
  },
  {
    id: "2piece-016",
    name: "Floral Print Shirt & Shorts – Black",
    brand: "MAGGS COLLECTION",
    complexityScore: 8.8,
    style: "Statement",
    fabric: "Ribbed Cotton",
    price: p(8.8),
    image: set16,
    isNew: true,
  },
  {
    id: "2piece-017",
    name: "Striped Button-Down Shirt & Shorts – Cream",
    brand: "MAGGS COLLECTION",
    complexityScore: 6.8,
    style: "Resort",
    fabric: "Lightweight Linen Blend",
    price: p(6.8),
    image: set17,
  },
  {
    id: "2piece-018",
    name: "Striped Button-Down Shirt & Shorts – Caramel",
    brand: "MAGGS COLLECTION",
    complexityScore: 7.4,
    style: "Resort",
    fabric: "Woven Cotton",
    price: p(7.4),
    image: set18,
  },
  {
    id: "2piece-019",
    name: "Floral Print Shirt & Shorts – White",
    brand: "MAGGS COLLECTION",
    complexityScore: 8.5,
    style: "Statement",
    fabric: "Ribbed Cotton",
    price: p(8.5),
    image: set19,
  },
  {
    id: "2piece-020",
    name: "Floral Print Shirt & Shorts – Mustard",
    brand: "MAGGS COLLECTION",
    complexityScore: 8.9,
    style: "Statement",
    fabric: "Ribbed Cotton",
    price: p(8.9),
    image: set20,
    isNew: true,
  },
];
