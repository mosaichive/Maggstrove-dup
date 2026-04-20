import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useShop } from "@/context/ShopContext";
import { womenDresses, DressProduct } from "@/data/womenDresses";
import { Heart, ShoppingBag, ChevronLeft, Check, Truck, Shield, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const SIZES = ["XS", "S", "M", "L", "XL"] as const;

const DressDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart, toggleFavorite, isFavorite } = useShop();
  const [selectedSize, setSelectedSize] = useState<string>("M");

  const product = womenDresses.find((d) => d.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
            <Link to="/women/dresses" className="text-sm text-accent hover:underline">
              ← Back to Dresses
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const inCart = isInCart(product.id);
  const liked = isFavorite(product.id);
  const inStock = true; // all current products are in stock

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product);
  };

  // Find related dresses (same style, excluding current)
  const related = womenDresses
    .filter((d) => d.id !== product.id)
    .sort((a, b) => Math.abs(a.complexityScore - product.complexityScore) - Math.abs(b.complexityScore - product.complexityScore))
    .slice(0, 4);

  const description = getDescription(product);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/women" className="hover:text-foreground transition-colors">Women</Link>
            <span>/</span>
            <Link to="/women/dresses" className="hover:text-foreground transition-colors">Dresses</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>

        {/* Product Detail */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            {/* Image */}
            <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isNew && <span className="badge-new">New</span>}
              {product.isSale && <span className="badge-sale">Sale</span>}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-6 py-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{product.brand}</p>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{product.name}</h1>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                {product.originalPrice ? (
                  <>
                    <span className="text-2xl font-bold text-destructive">GH₵{product.price.toFixed(2)}</span>
                    <span className="text-lg text-muted-foreground line-through">GH₵{product.originalPrice.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-foreground">GH₵{product.price.toFixed(2)}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-secondary px-3 py-2.5">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Fabric</span>
                  <p className="font-medium text-foreground mt-0.5">{product.fabric}</p>
                </div>
                <div className="bg-secondary px-3 py-2.5">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Style</span>
                  <p className="font-medium text-foreground mt-0.5">{product.style}</p>
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  inStock ? "bg-accent" : "bg-destructive"
                )} />
                <span className="text-sm font-medium text-foreground">
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Size Selector */}
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

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold uppercase tracking-wider transition-colors",
                    inCart
                      ? "bg-accent text-accent-foreground"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  )}
                >
                  {inCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  {inCart ? "Added to Bag" : "Add to Bag"}
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className={cn(
                    "w-14 flex items-center justify-center border transition-colors",
                    liked
                      ? "bg-accent/10 border-accent text-accent"
                      : "border-border text-foreground hover:border-foreground"
                  )}
                  aria-label={liked ? "Remove from favourites" : "Add to favourites"}
                >
                  <Heart className={cn("w-5 h-5", liked && "fill-accent")} />
                </button>
              </div>

              {/* Trust Badges */}
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

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="text-xl font-bold text-foreground mb-6">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to={`/women/dresses/${r.id}`}
                    className="group block"
                  >
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

/** Generate a short description based on product attributes */
function getDescription(p: DressProduct): string {
  const descs: Record<string, string> = {
    "dress-001": "A head-turning ruched mini in metallic jersey that catches the light with every move. Perfect for evening events and nights out.",
    "dress-002": "Elegant draped cowl neckline meets floor-length silhouette in luxurious stretch crepe. A timeless choice for formal occasions.",
    "dress-003": "Textured halter bodycon with intricate knit detailing. The deep blue hue and figure-hugging fit make it ideal for cocktail parties.",
    "dress-004": "Sheer mesh panels meet ruched jersey in this daring asymmetric design. A lavender statement piece for the fashion-forward.",
    "dress-005": "Strapless pleated midi with flowing chiffon mesh layers. The bold royal blue colour commands attention at any event.",
    "dress-006": "Bold leopard print cut-out maxi with long sleeves and a plunging neckline. A statement piece that exudes confidence.",
    "dress-007": "Simple strapless ruched mini in stretch cotton. An everyday essential that transitions effortlessly from day to night.",
    "dress-008": "Wrap-front mini with smocked waist detail and billowy satin sleeves. A sophisticated mix of textures in deep emerald.",
    "dress-009": "Sparkling glitter jersey wrap dress with elegant draping. The perfect party dress for celebrations and special occasions.",
    "dress-010": "Luxurious velvet corset mini with sheer mesh sleeves and bow-detail straps. An unforgettable cocktail dress in deep emerald.",
  };
  return descs[p.id] || `A beautiful ${p.style.toLowerCase()} dress crafted from ${p.fabric.toLowerCase()}. Designed for the modern woman.`;
}

export default DressDetailPage;
