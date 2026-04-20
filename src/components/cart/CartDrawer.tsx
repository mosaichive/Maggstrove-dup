import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartDrawer = ({ open, onOpenChange }: CartDrawerProps) => {
  const { cartItems, cartCount, updateQuantity, removeFromCart } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onOpenChange(false);
    if (!user) {
      // Will redirect after login — for now just go to checkout
    }
    navigate("/checkout");
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[420px] flex flex-col p-0 bg-background">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            My Bag ({cartCount})
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Your bag is empty</p>
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
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 pb-4 border-b border-border last:border-0">
                  <div className="w-20 h-28 bg-secondary flex-shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {item.brand}
                        </p>
                        <h4 className="text-sm font-medium text-foreground line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Size: {item.size}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1.5 hover:bg-secondary transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1.5 hover:bg-secondary transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">
                        GH₵{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sub-total</span>
                <span className="text-sm font-bold">GH₵{subtotal.toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Shipping and taxes calculated at checkout
              </p>
              <Button onClick={handleCheckout} className="w-full h-12 text-sm font-bold uppercase tracking-wider">
                Checkout
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

export default CartDrawer;
