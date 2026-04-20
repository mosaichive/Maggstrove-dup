import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { useNavigate } from "react-router-dom";

interface FavoritesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FavoritesDrawer = ({ open, onOpenChange }: FavoritesDrawerProps) => {
  const { favorites, favoritesCount, toggleFavorite, addToCart, isInCart } = useShop();
  const navigate = useNavigate();

  const goTo = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[420px] flex flex-col p-0 bg-background">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4" />
            My Wishlist ({favoritesCount})
          </SheetTitle>
        </SheetHeader>

        {favorites.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <Heart className="w-16 h-16 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Your wishlist is empty</p>
            <Button
              variant="outline"
              className="uppercase tracking-wider text-xs font-bold"
              onClick={() => onOpenChange(false)}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {favorites.map((product) => {
                const inCart = isInCart(product.id);
                return (
                  <div key={product.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                    <div
                      className="w-20 h-28 bg-secondary flex-shrink-0 overflow-hidden cursor-pointer"
                      onClick={() => {
                        if (product.id.startsWith("dress-")) {
                          goTo(`/women/dresses/${product.id}`);
                        }
                      }}
                    >
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {product.brand}
                          </p>
                          <h4 className="text-sm font-medium text-foreground line-clamp-1">{product.name}</h4>
                        </div>
                        <button
                          onClick={() => toggleFavorite(product)}
                          className="p-1 text-muted-foreground hover:text-destructive"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold mt-1">GH₵{product.price.toFixed(2)}</p>
                      <Button
                        size="sm"
                        variant={inCart ? "secondary" : "default"}
                        className="mt-2 h-8 text-[10px] uppercase tracking-wider font-bold w-full"
                        onClick={() => addToCart(product)}
                      >
                        {inCart ? (
                          <>
                            <ShoppingBag className="w-3 h-3 mr-1" />
                            In Bag
                          </>
                        ) : (
                          "Add to Bag"
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-6 py-4 space-y-3">
              <Button
                variant="outline"
                className="w-full h-11 text-xs font-bold uppercase tracking-wider"
                onClick={() => goTo("/favorites")}
              >
                View Full Wishlist
              </Button>
              <button
                onClick={() => onOpenChange(false)}
                className="w-full text-center text-xs font-medium underline text-muted-foreground hover:text-foreground"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default FavoritesDrawer;
