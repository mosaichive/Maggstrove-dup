import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
  isNew?: boolean;
  isSale?: boolean;
}

const ProductGallery = ({ images, name, isNew, isSale }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (idx: number) => {
    if (idx >= 0 && idx < images.length) setActiveIndex(idx);
  };

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
        <img
          src={images[activeIndex]}
          alt={`${name} - View ${activeIndex + 1}`}
          className="w-full h-full object-cover"
        />
        {isNew && <span className="badge-new">New</span>}
        {isSale && <span className="badge-sale">Sale</span>}

        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo(activeIndex - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors disabled:opacity-30"
              disabled={activeIndex === 0}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => goTo(activeIndex + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors disabled:opacity-30"
              disabled={activeIndex === images.length - 1}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    i === activeIndex ? "bg-foreground" : "bg-foreground/30"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "w-16 h-20 flex-shrink-0 overflow-hidden border-2 transition-colors",
                i === activeIndex ? "border-foreground" : "border-transparent hover:border-muted-foreground"
              )}
            >
              <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
