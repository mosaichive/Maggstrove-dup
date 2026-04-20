import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroCarousel from "@/components/home/HeroCarousel";
import ProductGrid from "@/components/home/ProductGrid";
import CategoryGrid from "@/components/home/CategoryGrid";
import StyleFeed from "@/components/home/StyleFeed";
import FeatureBanner from "@/components/home/FeatureBanner";
import PromoBanner from "@/components/home/PromoBanner";

// Import images
// Hero images are now handled by HeroCarousel component
import categoryTops from "@/assets/category-tops.jpg";
import categoryDresses from "@/assets/category-dresses.jpg";
import categoryJeans from "@/assets/category-jeans.jpg";
import categoryActivewear from "@/assets/category-activewear.jpg";
import categoryAccessories from "@/assets/category-accessories.jpg";
import categoryBeauty from "@/assets/category-beauty.jpg";
import promoLeft from "@/assets/promo-left.png";
import promoRight from "@/assets/promo-right.png";
import style1 from "@/assets/style-1.jpg";
import style2 from "@/assets/style-2.jpg";
import style3 from "@/assets/style-3.jpg";
import product1 from "@/assets/product-1.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

import { womenDresses } from "@/data/womenDresses";

const categories = [
  { name: "Tops", image: categoryTops, link: "/women/tops" },
  { name: "Dresses", image: categoryDresses, link: "/women/dresses" },
  { name: "Jeans", image: categoryJeans, link: "/women/jeans" },
  { name: "Activewear", image: categoryActivewear, link: "/women/activewear" },
  { name: "Accessories", image: categoryAccessories, link: "/accessories" },
  { name: "Beauty", image: categoryBeauty, link: "/beauty" },
];

const newArrivals = womenDresses.filter(d => d.isNew).slice(0, 4);

const trending = womenDresses.filter(d => ['dress-011', 'dress-015', 'dress-020', 'dress-026'].includes(d.id));

const stylePosts = [
  {
    id: "1",
    image: style1,
    title: "Street Style Edit",
    description: "Bold outerwear and layered looks to conquer the urban jungle.",
    link: "/style/street-style",
  },
  {
    id: "2",
    image: style2,
    title: "Vacation Ready",
    description: "Essential pieces for your next getaway.",
    link: "/style/vacation",
  },
  {
    id: "3",
    image: style3,
    title: "Capsule Wardrobe",
    description: "Build your perfect minimalist wardrobe with these timeless pieces.",
    link: "/style/capsule",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Banner */}
        <HeroCarousel />

        {/* Feature Banner */}
        <FeatureBanner />

        {/* Category Grid */}
        <CategoryGrid title="Shop by Category" categories={categories} />

        {/* New Arrivals */}
        <ProductGrid
          title="New Arrivals"
          products={newArrivals}
          viewAllLink="/new-in"
        />

        {/* Promo Banners */}
        <PromoBanner
          leftImage={promoLeft}
          leftTitle="New Season"
          leftCta="Shop Now"
          leftLink="/new-in"
          rightImage={promoRight}
          rightTitle="Shop Now"
          rightCta="Discover"
          rightLink="/sale"
        />

        {/* Trending Now */}
        <ProductGrid
          title="Trending Now"
          products={trending}
          viewAllLink="/trending"
        />

        {/* Style Feed */}
        <StyleFeed posts={stylePosts} />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
