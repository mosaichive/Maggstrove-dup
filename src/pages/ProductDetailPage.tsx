import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { womenDresses } from "@/data/womenDresses";
import { womenTops } from "@/data/womenTops";
import { menTshirts } from "@/data/menTshirts";
import { menTrousers } from "@/data/menTrousers";
import { menTwoPiece } from "@/data/menTwoPiece";
import ProductGallery from "@/components/product/ProductGallery";
import ProductReviews from "@/components/product/ProductReviews";
import { Heart, ShoppingBag, Check, Truck, Shield, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const SIZES = ["XS", "S", "M", "L", "XL"] as const;

const allProducts = [
  ...womenDresses.map(p => ({ ...p, category: "dresses", categoryLabel: "Dresses", categoryPath: "/women/dresses" })),
  ...womenTops.map(p => ({ ...p, category: "tops", categoryLabel: "Tops", categoryPath: "/women/tops" })),
  ...menTshirts.map(p => ({ ...p, category: "tshirts", categoryLabel: "T-Shirts", categoryPath: "/men/tshirts-vests" })),
  ...menTrousers.map(p => ({ ...p, category: "trousers", categoryLabel: "Trousers", categoryPath: "/men/jeans-trousers" })),
  ...menTwoPiece.map(p => ({ ...p, category: "2piece", categoryLabel: "2-Piece", categoryPath: "/men/2-piece" })),
];

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart, toggleFavorite, isFavorite } = useShop();
  const { user } = useAuth();
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [override, setOverride] = useState<any>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const product = allProducts.find((p) => p.id === id);

  useEffect(() => {
    if (id) {
      // Fetch override
      supabase.from("product_overrides").select("*").eq("product_id", id).maybeSingle()
        .then(({ data }) => { if (data) setOverride(data); });
      // Fetch gallery images
      supabase.from("product_images").select("*").eq("product_id", id).order("sort_order")
        .then(({ data }) => {
          if (data && data.length > 0) setGalleryImages(data.map((img: any) => img.image_url));
        });
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
            <Link to="/" className="text-sm text-accent hover:underline">← Back to Home</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const displayName = override?.name || product.name;
  const displayBrand = override?.brand || product.brand;
  const displayPrice = override?.price ?? product.price;
  const displayOriginalPrice = override?.original_price ?? product.originalPrice;
  const displayImage = override?.image_url || product.image;
  const displayFabric = override?.fabric || (product as any).fabric || "Premium Fabric";
  const displayStyle = override?.style || (product as any).style || "Modern";
  const isNew = override?.is_new ?? product.isNew;
  const isSale = override?.is_sale ?? product.isSale;

  const images = galleryImages.length > 0 ? galleryImages : [displayImage];
  const inCart = isInCart(product.id);
  const liked = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart({ ...product, name: displayName, price: displayPrice, image: displayImage }, selectedSize);
  };

  // Find related products
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const parentGender = product.category === "dresses" || product.category === "tops" ? "Women" : "Men";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to={`/${parentGender.toLowerCase()}`} className="hover:text-foreground transition-colors">{parentGender}</Link>
            <span>/</span>
            <Link to={product.categoryPath} className="hover:text-foreground transition-colors">{product.categoryLabel}</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{displayName}</span>
          </nav>
        </div>

        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            <ProductGallery images={images} name={displayName} isNew={isNew} isSale={isSale} />

            <div className="flex flex-col gap-6 py-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{displayBrand}</p>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{displayName}</h1>
              </div>

              <div className="flex items-baseline gap-3">
                {displayOriginalPrice ? (
                  <>
                    <span className="text-2xl font-bold text-destructive">GH₵{displayPrice.toFixed(2)}</span>
                    <span className="text-lg text-muted-foreground line-through">GH₵{displayOriginalPrice.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-foreground">GH₵{displayPrice.toFixed(2)}</span>
                )}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                A beautiful {displayStyle.toLowerCase()} piece crafted from {displayFabric.toLowerCase()}. Designed for the modern fashion-forward individual.
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-secondary px-3 py-2.5">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Fabric</span>
                  <p className="font-medium text-foreground mt-0.5">{displayFabric}</p>
                </div>
                <div className="bg-secondary px-3 py-2.5">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Style</span>
                  <p className="font-medium text-foreground mt-0.5">{displayStyle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-sm font-medium text-foreground">In Stock</span>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Select Size</p>
                <div className="flex gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "w-12 h-10 border text-sm font-medium transition-colors",
                        selectedSize === size
                          ? "bg-foreground text-background border-foreground"
                          : "border-border text-foreground hover:border-foreground"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold uppercase tracking-wider transition-colors",
                    inCart ? "bg-accent text-accent-foreground" : "bg-foreground text-background hover:bg-foreground/90"
                  )}
                >
                  {inCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  {inCart ? "Added to Bag" : "Add to Bag"}
                </button>
                <button
                  onClick={() => toggleFavorite({ ...product, name: displayName, price: displayPrice, image: displayImage })}
                  className={cn(
                    "w-14 flex items-center justify-center border transition-colors",
                    liked ? "bg-accent/10 border-accent text-accent" : "border-border text-foreground hover:border-foreground"
                  )}
                >
                  <Heart className={cn("w-5 h-5", liked && "fill-accent")} />
                </button>
              </div>

              <div className="border-t border-border pt-5 grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center gap-1.5">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Easy Returns</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Quality Assured</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16">
            <ProductReviews productId={product.id} category={product.category} />
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="text-xl font-bold text-foreground mb-6">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {related.map((r) => (
                  <Link key={r.id} to={`/product/${r.id}`} className="group block">
                    <div className="aspect-[3/4] bg-secondary overflow-hidden">
                      <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="mt-2 space-y-0.5">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">{r.brand}</p>
                      <h3 className="text-sm font-medium text-foreground line-clamp-1">{r.name}</h3>
                      <p className="text-sm font-semibold text-foreground">GH₵{r.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
