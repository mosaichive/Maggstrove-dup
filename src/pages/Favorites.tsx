import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useShop } from "@/context/ShopContext";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Favorites = () => {
  const { favorites, toggleFavorite, addToCart, isInCart } = useShop();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 md:py-16 max-w-7xl">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-6 h-6 md:w-8 md:h-8" />
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-wider">
            Your Favorites
          </h1>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-24 bg-secondary/30 rounded-lg border border-border/50">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-bold mb-2">You haven't added any favorites yet.</h2>
            <p className="text-muted-foreground mb-8">
              Keep track of items you love by clicking the heart icon on any product.
            </p>
            <Button onClick={() => navigate("/")} className="uppercase font-bold tracking-wider rounded-none px-8">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {favorites.map((product) => {
              const inCart = isInCart(product.id);
              
              return (
                <div key={product.id} className="group flex flex-col">
                  <div 
                    className="relative aspect-[3/4] mb-4 overflow-hidden cursor-pointer"
                    onClick={() => {
                      if (product.id.startsWith("dress-")) {
                        navigate(`/women/dresses/${product.id}`);
                      } else {
                        navigate(`/product/${product.id}`);
                      }
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full opacity-100 shadow-sm hover:scale-110 transition-transform duration-200"
                      aria-label="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col flex-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{product.brand}</p>
                    <div className="mt-auto mb-4">
                      <p className="text-sm font-medium">GH₵{product.price.toFixed(2)}</p>
                    </div>
                    
                    <Button 
                      onClick={() => addToCart(product)}
                      variant={inCart ? "secondary" : "default"}
                      className="w-full uppercase font-bold tracking-wider text-[11px] h-10 rounded-none"
                    >
                      {inCart ? (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 mr-2" />
                          Added to Bag
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
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;