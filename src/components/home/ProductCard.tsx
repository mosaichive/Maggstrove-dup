import { Heart, ShoppingBag, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShop, Product } from "@/context/ShopContext";
import { cn } from "@/lib/utils";

interface ProductCardProps extends Product {}

const ProductCard = (props: ProductCardProps) => {
  const { id, name, brand, price, originalPrice, image, hoverImage, isNew, isSale } = props;
  const navigate = useNavigate();
  const { addToCart, isInCart, toggleFavorite, isFavorite } = useShop();

  const inCart = isInCart(id);
  const liked = isFavorite(id);

  const handleCardClick = () => {
    // Navigate to product detail page
    if (id.startsWith("dress-")) {
      navigate(`/women/dresses/${id}`);
    } else {
      navigate(`/product/${id}`);
    }
  };

  const handleAddToBag = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(props);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(props);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Route dress products to dress detail page
    if (id.startsWith("dress-")) {
      navigate(`/women/dresses/${id}`);
    } else {
      navigate(`/product/${id}`);
    }
  };

  return (
    <div className="group cursor-pointer block" onClick={handleCardClick}>
      {/* Image Container */}
      <div className="product-card-image">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        {hoverImage && (
          <img
            src={hoverImage}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

        {/* Badges */}
        {isNew && <span className="badge-new">New</span>}
        {isSale && <span className="badge-sale">Sale</span>}

        {/* In-cart indicator */}
        {inCart && (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 flex items-center gap-1">
            <ShoppingBag className="w-3 h-3" /> In Bag
          </span>
        )}

        {/* Favorite Button */}
        <button
          className={cn(
            "absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white",
            liked && "opacity-100 bg-white"
          )}
          onClick={handleFavorite}
          aria-label={liked ? "Remove from favourites" : "Add to favourites"}
        >
          <Heart
            className={cn("w-4 h-4 transition-colors", liked ? "fill-accent text-accent" : "text-foreground")}
          />
        </button>

        {/* Bottom Overlay Actions */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex">
          {/* Add to Bag */}
          <button
            className={cn(
              "flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors",
              inCart
                ? "bg-accent text-accent-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            onClick={handleAddToBag}
            aria-label="Add to bag"
          >
            {inCart ? "Added to Bag" : "Add to Bag"}
          </button>

          {/* View Details */}
          <button
            className="px-3 py-3 bg-secondary text-foreground border-l border-border hover:bg-muted transition-colors"
            onClick={handleViewDetails}
            aria-label="View details"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-3 space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{brand}</p>
        <h3 className="text-sm font-medium text-foreground line-clamp-2">{name}</h3>
        <div className="flex items-center gap-2">
          {originalPrice ? (
            <>
              <span className="price-sale">GH₵{price.toFixed(2)}</span>
              <span className="price-original">GH₵{originalPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="price-tag">GH₵{price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
