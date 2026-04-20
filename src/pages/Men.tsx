import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import product1 from "@/assets/product-1.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

const categories = [
  { name: "T-Shirts & Vests", slug: "tshirts-vests", image: product1 },
  { name: "Hoodies & Sweatshirts", slug: "hoodies-sweatshirts", image: product7 },
  { name: "Jeans & Trousers", slug: "jeans-trousers", image: product4 },
  { name: "2 Piece", slug: "2-piece", image: product3 },
  { name: "Underwear", slug: "underwear", image: product5 },
  { name: "Coats & Jackets", slug: "coats-jackets", image: product8 },
  { name: "Jumpers", slug: "jumpers", image: product8 },
];

const Men = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-secondary py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <nav className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Men</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Men's Fashion</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our curated collection of men's styles for every occasion.
            </p>
          </div>
        </div>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/men/${cat.slug}`}
                  className="group relative aspect-square overflow-hidden"
                >
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm md:text-base font-semibold text-primary-foreground uppercase tracking-wider text-center px-2">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Men;
