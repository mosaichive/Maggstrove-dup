/**
 * Men's Jeans & Trousers — Product Catalogue
 *
 * Prices auto-assigned between GH₵85–GH₵150 based on visual complexity scoring.
 * Score 1–10. Final price = 85 + (score / 10) * 65
 */

import trouser1 from "@/assets/trousers/trouser-1.jpg";
import trouser2 from "@/assets/trousers/trouser-2.jpg";
import trouser3 from "@/assets/trousers/trouser-3.jpg";
import trouser4 from "@/assets/trousers/trouser-4.jpg";
import trouser5 from "@/assets/trousers/trouser-5.jpg";
import trouser6 from "@/assets/trousers/trouser-6.jpg";
import trouser7 from "@/assets/trousers/trouser-7.jpg";
import trouser8 from "@/assets/trousers/trouser-8.jpg";
import trouser9 from "@/assets/trousers/trouser-9.jpg";
import trouser10 from "@/assets/trousers/trouser-10.jpg";

export interface TrouserProduct {
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

/** price = 85 + (score / 10) * 65, rounded to 2 dp */
const p = (score: number) => Math.round((85 + (score / 10) * 65) * 100) / 100;

export const menTrousers: TrouserProduct[] = [
  {
    id: "trouser-001",
    name: "Perfect Logo Tape Joggers – Olive",
    brand: "PERFECT",
    complexityScore: 7.8,
    style: "Casual",
    fabric: "Heavyweight Cotton Blend",
    price: p(7.8),
    image: trouser1,
    isNew: true,
  },
  {
    id: "trouser-002",
    name: "Perfect Crest Tape Track Pants – Black",
    brand: "PERFECT",
    complexityScore: 8.2,
    style: "Athleisure",
    fabric: "Premium Polyester",
    price: p(8.2),
    image: trouser2,
    isNew: true,
  },
  {
    id: "trouser-003",
    name: "VIA Monogram Side-Stripe Joggers – Khaki",
    brand: "VIA",
    complexityScore: 8.7,
    style: "Casual",
    fabric: "Brushed French Terry",
    price: p(8.7),
    image: trouser3,
  },
  {
    id: "trouser-004",
    name: "VALOTIN Logo Cuffed Joggers – Black",
    brand: "VALOTIN",
    complexityScore: 9.1,
    style: "Athleisure",
    fabric: "Scuba Knit",
    price: p(9.1),
    image: trouser4,
  },
  {
    id: "trouser-005",
    name: "Perfect Logo Tape Joggers – Olive (Tapered)",
    brand: "PERFECT",
    complexityScore: 7.5,
    style: "Casual",
    fabric: "Heavyweight Cotton Blend",
    price: p(7.5),
    image: trouser5,
  },
  {
    id: "trouser-006",
    name: "Perfect Crest Wide-Leg Track Pants – Navy",
    brand: "PERFECT",
    complexityScore: 8.0,
    style: "Athleisure",
    fabric: "Premium Polyester",
    price: p(8.0),
    image: trouser6,
  },
  {
    id: "trouser-007",
    name: "VIA Monogram Side-Stripe Joggers – Olive",
    brand: "VIA",
    complexityScore: 8.5,
    style: "Casual",
    fabric: "Brushed French Terry",
    price: p(8.5),
    image: trouser7,
  },
  {
    id: "trouser-008",
    name: "VLTN Tape Tapered Joggers – Brown",
    brand: "VLTN",
    complexityScore: 9.3,
    style: "Premium Casual",
    fabric: "Heavy French Terry",
    price: p(9.3),
    image: trouser8,
  },
  {
    id: "trouser-009",
    name: "VLTN Tape Tapered Joggers – Dark Brown",
    brand: "VLTN",
    complexityScore: 9.0,
    style: "Premium Casual",
    fabric: "Heavy French Terry",
    price: p(9.0),
    image: trouser9,
  },
  {
    id: "trouser-010",
    name: "TB Monogram Tape Joggers – Brown/Green",
    brand: "TB",
    complexityScore: 9.5,
    style: "Premium Casual",
    fabric: "Luxury Fleece",
    price: p(9.5),
    image: trouser10,
    isNew: true,
  },
];
