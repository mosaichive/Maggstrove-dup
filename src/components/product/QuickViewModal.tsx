import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useShop, Product } from "@/context/ShopContext";
import { supabase } from "@/integrations/supabase/client";
import { Heart, ShoppingBag, Check, Expand } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZES = ["XS", "S", "M", "L", "XL"] as const;

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickViewModal = ({ product, open, onOpenChange }: QuickViewModalProps) => {
  const navigate = useNavigate();
  const { addToCart, isInCart, toggleFavorite, isFavorite } = useShop();
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [override, setOverride] = useState<any>(null);

  useEffect(() => {
    if (product?.id) {
      supabase.from("product_overrides").select("*").eq("product_id", product.id).maybeSingle()
        .then(({ data }) => setOverride(data));
    }
  }, [product?.id]);

  if (!product) return null;

  const displayName = override?.name || product.name;
  const displayPrice = override?.price ?? product.price;
  const displayImage = override?.image_url || product.image;
  const inCart = isInCart(product.id);
  const liked = isFavorite(product.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="aspect-[3/4] bg-secondary overflow-hidden">
            <img src={displayImage} alt={displayName} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{product.brand}</p>
              <h2 className="text-lg font-bold text-foreground mt-1">{displayName}</h2>
            </div>
            <p className="text-xl font-bold text-foreground">GH₵{displayPrice.toFixed(2)}</p>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Size</p>
              <div className="flex gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "w-10 h-9 border text-xs font-medium transition-colors",
                      selectedSize === size ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => addToCart({ ...product, name: displayName, price: displayPrice, image: displayImage }, selectedSize)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors",
                  inCart ? "bg-accent text-accent-foreground" : "bg-foreground text-background hover:bg-foreground/90"
                )}
              >
                {inCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                {inCart ? "Added" : "Add to Bag"}
              </button>
              <button
                onClick={() => toggleFavorite({ ...product, name: displayName, price: displayPrice, image: displayImage })}
                className={cn(
                  "w-11 flex items-center justify-center border transition-colors",
                  liked ? "bg-accent/10 border-accent text-accent" : "border-border hover:border-foreground"
                )}
              >
                <Heart className={cn("w-4 h-4", liked && "fill-accent")} />
              </button>
            </div>

            <button
              onClick={() => { onOpenChange(false); navigate(`/product/${product.id}`); }}
              className="flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              <Expand className="w-3.5 h-3.5" /> View Full Details
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
