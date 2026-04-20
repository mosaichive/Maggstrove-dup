import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// Import images
import categoryTops from "@/assets/category-tops.jpg";
import categoryDresses from "@/assets/category-dresses.jpg";
import categoryJeans from "@/assets/category-jeans.jpg";
import categoryActivewear from "@/assets/category-activewear.jpg";
import categoryAccessories from "@/assets/category-accessories.jpg";
import categoryBeauty from "@/assets/category-beauty.jpg";
import product1 from "@/assets/product-1.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";
import { womenDresses } from "@/data/womenDresses";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  isNew?: boolean;
  isSale?: boolean;
}

interface CategorySection {
  name: string;
  slug: string;
  heroImage: string;
  products: Product[];
}

const categories: CategorySection[] = [
  {
    name: "Tops",
    slug: "tops",
    heroImage: categoryTops,
    products: [
      { id: "t1", name: "Silk Button-Up Blouse", brand: "MAGGS ESSENTIALS", price: 69.00, image: product3, isNew: true },
      { id: "t2", name: "Oversized Cotton Shirt", brand: "MAGGS BASICS", price: 45.00, image: product3 },
      { id: "t3", name: "Ribbed Knit Top", brand: "MAGGS COZY", price: 39.00, originalPrice: 55.00, image: product7, isSale: true },
      { id: "t4", name: "Classic White Tee", brand: "MAGGS BASICS", price: 29.00, image: product3 },
    ],
  },
  {
    name: "Dresses",
    slug: "dresses",
    heroImage: categoryDresses,
    products: womenDresses.slice(0, 4).map((d) => ({
      id: d.id,
      name: d.name,
      brand: d.brand,
      price: d.price,
      originalPrice: d.originalPrice,
      image: d.image,
      isNew: d.isNew,
      isSale: d.isSale,
    })),
  },
  {
    name: "Jeans & Trousers",
    slug: "jeans-trousers",
    heroImage: categoryJeans,
    products: [
      { id: "j1", name: "High-Rise Straight Leg", brand: "MAGGS DENIM", price: 79.00, image: categoryJeans, isNew: true },
      { id: "j2", name: "Wide-Leg Trousers", brand: "MAGGS TAILORING", price: 89.00, image: categoryJeans },
      { id: "j3", name: "Vintage Wash Mom Jeans", brand: "MAGGS DENIM", price: 69.00, originalPrice: 89.00, image: categoryJeans, isSale: true },
      { id: "j4", name: "Pleated Palazzo Pants", brand: "MAGGS TAILORING", price: 95.00, image: categoryJeans },
    ],
  },
  {
    name: "Activewear",
    slug: "activewear",
    heroImage: categoryActivewear,
    products: [
      { id: "a1", name: "High-Waist Leggings", brand: "MAGGS ACTIVE", price: 55.00, image: categoryActivewear, isNew: true },
      { id: "a2", name: "Seamless Sports Bra", brand: "MAGGS ACTIVE", price: 39.00, image: categoryActivewear },
      { id: "a3", name: "Running Shorts", brand: "MAGGS ACTIVE", price: 35.00, originalPrice: 45.00, image: categoryActivewear, isSale: true },
      { id: "a4", name: "Cropped Hoodie", brand: "MAGGS ACTIVE", price: 65.00, image: categoryActivewear },
    ],
  },
  {
    name: "Accessories",
    slug: "accessories",
    heroImage: categoryAccessories,
    products: [
      { id: "ac1", name: "Chain Strap Crossbody", brand: "MAGGS ACCESSORIES", price: 89.00, image: product8, isNew: true },
      { id: "ac2", name: "Leather Tote Bag", brand: "MAGGS ACCESSORIES", price: 129.00, image: categoryAccessories },
      { id: "ac3", name: "Gold Hoop Earrings", brand: "MAGGS JEWELRY", price: 35.00, originalPrice: 45.00, image: categoryAccessories, isSale: true },
      { id: "ac4", name: "Silk Scarf", brand: "MAGGS ACCESSORIES", price: 49.00, image: categoryAccessories },
    ],
  },
  {
    name: "Beauty & Body",
    slug: "beauty-body",
    heroImage: categoryBeauty,
    products: [
      { id: "b1", name: "Hydrating Face Serum", brand: "MAGGS BEAUTY", price: 45.00, image: categoryBeauty, isNew: true },
      { id: "b2", name: "Rose Body Lotion", brand: "MAGGS BEAUTY", price: 28.00, image: categoryBeauty },
      { id: "b3", name: "Vitamin C Moisturizer", brand: "MAGGS BEAUTY", price: 38.00, originalPrice: 52.00, image: categoryBeauty, isSale: true },
      { id: "b4", name: "Lip Gloss Set", brand: "MAGGS BEAUTY", price: 25.00, image: categoryBeauty },
    ],
  },
];

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link to={product.id.startsWith("dress-") ? `/women/dresses/${product.id}` : `/product/${product.id}`} className="group cursor-pointer block">
      <div className="relative overflow-hidden bg-secondary aspect-[3/4]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        
        {product.isNew && (
          <span className="badge-new">New</span>
        )}
        {product.isSale && (
          <span className="badge-sale">Sale</span>
        )}

        <button
          className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground py-3 text-sm font-medium uppercase tracking-wide translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          Quick Add
        </button>
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.brand}</p>
        <h3 className="text-sm font-medium text-foreground line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2">
          {product.originalPrice ? (
            <>
            <span className="price-sale">GH₵{product.price.toFixed(2)}</span>
              <span className="price-original">GH₵{product.originalPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="price-tag">GH₵{product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

const CategorySectionComponent = ({ category }: { category: CategorySection }) => {
  return (
    <section className="py-12 md:py-16 border-b border-border last:border-b-0">
      <div className="container mx-auto px-4">
        {/* Category Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Category Hero Image */}
          <Link 
            to={`/women/${category.slug}`}
            className="group relative w-full md:w-1/3 aspect-square overflow-hidden"
          >
            <img
              src={category.heroImage}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                {category.name}
              </h2>
              <span className="flex items-center text-sm text-primary-foreground/90 font-medium">
                Shop All <ChevronRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </Link>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {category.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Women = () => {
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
              <span className="text-foreground">Women</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Women's Fashion</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our curated collection of styles for every occasion. From everyday essentials to statement pieces.
            </p>
          </div>
        </div>

        {/* Quick Category Links */}
        <div className="border-b border-border sticky top-[104px] bg-background z-40">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-6 md:gap-10 py-4 overflow-x-auto">
              {categories.map((category) => (
                <a
                  key={category.slug}
                  href={`#${category.slug}`}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors"
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Category Sections */}
        {categories.map((category) => (
          <div key={category.slug} id={category.slug}>
            <CategorySectionComponent category={category} />
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default Women;
