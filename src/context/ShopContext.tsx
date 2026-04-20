import { createContext, useContext, useState, useCallback, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  isNew?: boolean;
  isSale?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  size: string;
}

interface ShopContextValue {
  // Cart
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  isInCart: (id: string) => boolean;
  clearCart: () => void;

  // Favorites
  favorites: Product[];
  favoritesCount: number;
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: string) => boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ShopContext = createContext<ShopContextValue | null>(null);

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("maggs-cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [favorites, setFavorites] = useState<Product[]>(() => {
    const saved = localStorage.getItem("maggs-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // ── Cart actions ──────────────────────────────────────────────────────────

  // Persist cart to localStorage whenever it changes
  const persistCart = (items: CartItem[]) => {
    localStorage.setItem("maggs-cart", JSON.stringify(items));
    return items;
  };

  const addToCart = useCallback((product: Product, size = "M") => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.size === size);
      let next: CartItem[];
      if (existing) {
        next = prev.map((i) =>
          i.id === product.id && i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        next = [...prev, { ...product, quantity: 1, size }];
      }
      return persistCart(next);
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => persistCart(prev.filter((i) => i.id !== id)));
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCartItems((prev) =>
      persistCart(
        prev
          .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
          .filter((i) => i.quantity > 0)
      )
    );
  }, []);

  const isInCart = useCallback(
    (id: string) => cartItems.some((i) => i.id === id),
    [cartItems]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem("maggs-cart");
  }, []);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  // ── Favorites actions ─────────────────────────────────────────────────────

  const toggleFavorite = useCallback((product: Product) => {
    setFavorites((prev) => {
      const isFav = prev.some((f) => f.id === product.id);
      const newFavs = isFav 
        ? prev.filter((f) => f.id !== product.id)
        : [...prev, product];
      
      localStorage.setItem("maggs-favorites", JSON.stringify(newFavs));
      return newFavs;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites]
  );

  const favoritesCount = favorites.length;

  return (
    <ShopContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        isInCart,
        clearCart,
        favorites,
        favoritesCount,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
