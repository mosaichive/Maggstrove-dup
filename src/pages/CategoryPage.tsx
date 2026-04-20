import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import ProductCard from "@/components/home/ProductCard";
import product1 from "@/assets/product-1.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";

interface CategoryPageProps {
  title: string;
  parentLabel: string;
  parentHref: string;
}

const placeholderProducts = [
  { id: "cat-1", name: "Classic Essential", brand: "MAGGS ESSENTIALS", price: 59.00, image: product1, isNew: true },
  { id: "cat-2", name: "Premium Staple", brand: "MAGGS BASICS", price: 45.00, image: product3 },
  { id: "cat-3", name: "Tailored Piece", brand: "MAGGS TAILORING", price: 89.00, image: product4, isNew: true },
  { id: "cat-4", name: "Everyday Comfort", brand: "MAGGS COZY", price: 69.00, image: product5 },
  { id: "cat-5", name: "Seasonal Pick", brand: "MAGGS ESSENTIALS", price: 79.00, image: product1 },
  { id: "cat-6", name: "Trending Style", brand: "MAGGS BASICS", price: 55.00, image: product3 },
  { id: "cat-7", name: "Weekend Ready", brand: "MAGGS WEEKEND", price: 49.00, originalPrice: 65.00, image: product4 },
  { id: "cat-8", name: "Smart Casual", brand: "MAGGS TAILORING", price: 99.00, image: product5 },
];

const CategoryPage = ({ title, parentLabel, parentHref }: CategoryPageProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-secondary py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <nav className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link to={parentHref} className="hover:text-foreground transition-colors">{parentLabel}</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{title}</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{title}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our {title.toLowerCase()} collection. Quality pieces for every occasion.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-muted-foreground">{placeholderProducts.length} products</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {placeholderProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
