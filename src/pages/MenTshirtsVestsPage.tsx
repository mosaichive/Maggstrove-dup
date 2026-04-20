import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import ProductCard from "@/components/home/ProductCard";
import { menTshirts, TshirtProduct } from "@/data/menTshirts";
import { useProductOverrides } from "@/hooks/useProductOverrides";
import { Pencil, Check, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminPriceEditor = ({
  product,
  onSave,
}: {
  product: TshirtProduct & { price: number };
  onSave: (id: string, newPrice: number) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(product.price.toFixed(2));

  const handleSave = () => {
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed >= 85 && parsed <= 150) {
      onSave(product.id, parsed);
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setValue(product.price.toFixed(2));
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-1 mt-1">
      {editing ? (
        <>
          <span className="text-xs text-muted-foreground">GH₵</span>
          <input
            type="number"
            min={85}
            max={150}
            step={0.01}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-20 border border-border rounded px-1.5 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring bg-background text-foreground"
            autoFocus
          />
          <button onClick={handleSave} className="p-0.5 text-accent hover:text-accent/80 transition-colors" title="Save price">
            <Check className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleCancel} className="p-0.5 text-muted-foreground hover:text-destructive transition-colors" title="Cancel">
            <X className="w-3.5 h-3.5" />
          </button>
        </>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors group"
          title="Admin: Override price"
        >
          <Pencil className="w-3 h-3" />
          <span className="group-hover:underline">{product.adminOverride ? "Admin override" : "Edit price"}</span>
        </button>
      )}
    </div>
  );
};

const PriceBadge = ({ score }: { score: number }) => {
  const tier =
    score >= 8
      ? { label: "Premium", cls: "bg-accent/10 text-accent" }
      : score >= 6
        ? { label: "Mid-range", cls: "bg-secondary text-muted-foreground" }
        : { label: "Everyday", cls: "bg-muted text-muted-foreground" };

  return (
    <span className={cn("text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5", tier.cls)}>
      {tier.label}
    </span>
  );
};

const MenTshirtsVestsPage = () => {
  const { isAdmin } = useAuth();
  const { isAvailable } = useProductOverrides();
  const [products, setProducts] = useState<TshirtProduct[]>(menTshirts);
  const [adminMode, setAdminMode] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "complexity">("default");
  const visibleProducts = isAdmin ? products : products.filter(p => isAvailable(p.id));

  const handlePriceOverride = (id: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: newPrice, adminOverride: true } : p))
    );
  };

  const sorted = [...visibleProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "complexity") return b.complexityScore - a.complexityScore;
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-secondary py-10 md:py-14">
          <div className="container mx-auto px-4 text-center">
            <nav className="text-sm text-muted-foreground mb-3">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/men" className="hover:text-foreground transition-colors">Men</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">T-Shirts & Vests</span>
            </nav>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">T-Shirts & Vests</h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              Statement tees, ribbed polos, and oversized jerseys for every vibe.
            </p>
          </div>
        </div>

        <div className="border-b border-border bg-background sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">{visibleProducts.length} products</p>
              {isAdmin && (
                <button
                  onClick={() => setAdminMode(!adminMode)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs px-3 py-1.5 border transition-colors font-medium",
                    adminMode
                      ? "bg-accent text-accent-foreground border-accent"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                  )}
                >
                  <Pencil className="w-3 h-3" />
                  {adminMode ? "Exit Admin Mode" : "Admin: Edit Prices"}
                </button>
              )}
              {adminMode && (
                <span className="flex items-center gap-1 text-xs text-accent">
                  <Info className="w-3 h-3" />
                  Click <strong>Edit price</strong> below any item to override
                </span>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-border bg-background text-foreground px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="complexity">By Design Complexity</option>
            </select>
          </div>
        </div>

        <div className="bg-muted/50 border-b border-border">
          <div className="container mx-auto px-4 py-2.5 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Auto-pricing active.</strong> Each item is priced between{" "}
              <strong className="text-foreground">GH₵85 – GH₵150</strong> based on visual complexity score
              (fabric type, design detail, pattern, and perceived finish). Admins can override any price.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {sorted.map((product) => (
              <div key={product.id} className="flex flex-col">
                <ProductCard {...product} />
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <PriceBadge score={product.complexityScore} />
                  <span className="text-[10px] text-muted-foreground">Score: {product.complexityScore}/10</span>
                  {product.adminOverride && (
                    <span className="text-[9px] text-accent uppercase tracking-wider font-semibold">✎ Admin</span>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {product.style} · {product.fabric}
                </div>
                {adminMode && <AdminPriceEditor product={product} onSave={handlePriceOverride} />}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MenTshirtsVestsPage;
