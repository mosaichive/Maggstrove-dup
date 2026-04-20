import { useState, useMemo } from "react";
import { Tag } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/home/ProductCard";
import { womenDresses } from "@/data/womenDresses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = "highest-discount" | "lowest-price" | "newest";

// Generate sale products from existing catalogue — assign random discounts
const saleProducts = womenDresses.map((dress, i) => {
  const discountPercent = [15, 20, 25, 30, 35, 40, 45, 50][i % 8];
  const originalPrice = dress.originalPrice ?? dress.price;
  const salePrice = Math.round(originalPrice * (1 - discountPercent / 100) * 100) / 100;
  return {
    ...dress,
    originalPrice,
    price: salePrice,
    isSale: true,
    discountPercent,
  };
});

const SalePage = () => {
  const [sort, setSort] = useState<SortOption>("highest-discount");

  const sorted = useMemo(() => {
    const items = [...saleProducts];
    switch (sort) {
      case "highest-discount":
        return items.sort((a, b) => b.discountPercent - a.discountPercent);
      case "lowest-price":
        return items.sort((a, b) => a.price - b.price);
      case "newest":
        return items.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
  }, [sort]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Sale Banner */}
        <section className="relative bg-destructive text-destructive-foreground">
          <div className="container mx-auto px-4 py-14 md:py-20 text-center">
            <Tag className="w-10 h-10 mx-auto mb-4 opacity-80" />
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
              Big Sale – Limited Time Offers
            </h1>
            <p className="text-base md:text-lg opacity-90 max-w-xl mx-auto">
              Up to 50% off on selected styles. Don't miss out!
            </p>
          </div>
        </section>

        {/* Toolbar */}
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {sorted.length} items on sale
          </p>
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highest-discount">Highest Discount</SelectItem>
              <SelectItem value="lowest-price">Lowest Price</SelectItem>
              <SelectItem value="newest">Newest Items</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Grid */}
        <section className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sorted.map((product) => (
              <div key={product.id} className="relative">
                {/* Discount badge */}
                <span className="absolute top-2 right-12 z-10 bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                  -{product.discountPercent}%
                </span>
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SalePage;
