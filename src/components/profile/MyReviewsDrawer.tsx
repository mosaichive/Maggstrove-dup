import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Review {
  id: string;
  product_id: string;
  category: string;
  rating: number;
  review_text: string | null;
  status: string;
  created_at: string;
}

interface OrderedProduct {
  product_id: string;
  product_name: string;
  brand: string;
  image: string | null;
  category?: string;
}

interface MyReviewsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MyReviewsDrawer = ({ open, onOpenChange }: MyReviewsDrawerProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orderedProducts, setOrderedProducts] = useState<OrderedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [reviewingProduct, setReviewingProduct] = useState<OrderedProduct | null>(null);
  const [newRating, setNewRating] = useState(0);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && user) fetchData();
  }, [open, user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    // Fetch reviews
    const { data: reviewData } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setReviews((reviewData as any as Review[]) || []);

    // Fetch all ordered items
    const { data: orders } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", user.id);

    if (orders && orders.length > 0) {
      const orderIds = orders.map((o: any) => o.id);
      const { data: items } = await supabase
        .from("order_items")
        .select("product_id, product_name, brand, image")
        .in("order_id", orderIds);

      // Deduplicate by product_id
      const seen = new Set<string>();
      const unique: OrderedProduct[] = [];
      (items || []).forEach((item: any) => {
        if (!seen.has(item.product_id)) {
          seen.add(item.product_id);
          unique.push(item);
        }
      });
      setOrderedProducts(unique);
    }
    setLoading(false);
  };

  const handleSubmitReview = async (productId: string) => {
    if (!user || newRating === 0) { toast.error("Please select a rating"); return; }
    setSubmitting(true);
    try {
      await supabase.from("product_reviews").insert({
        product_id: productId,
        category: "general",
        user_id: user.id,
        rating: newRating,
        review_text: newText || null,
      } as any);
      toast.success("Review submitted! Pending approval.");
      setReviewingProduct(null);
      setNewRating(0);
      setNewText("");
      fetchData();
    } catch {
      toast.error("Failed to submit review");
    }
    setSubmitting(false);
  };

  const reviewedProductIds = new Set(reviews.map(r => r.product_id));
  const unreviewed = orderedProducts.filter(p => !reviewedProductIds.has(p.product_id));

  const statusColor = (s: string) => {
    switch (s) {
      case "approved": return "bg-accent/10 text-accent";
      case "rejected": return "bg-destructive/10 text-destructive";
      default: return "bg-amber-500/10 text-amber-600";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[420px] flex flex-col p-0 bg-background">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4" /> Ratings & Reviews
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
          ) : (
            <>
              {/* Items to review */}
              {unreviewed.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Items to Review</h3>
                  {unreviewed.map((p) => (
                    <div key={p.product_id} className="p-3 bg-secondary/50 border border-border flex items-center gap-3">
                      {p.image && <img src={p.image} alt={p.product_name} className="w-12 h-16 object-cover rounded flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">{p.brand}</p>
                        <p className="text-sm font-medium truncate">{p.product_name}</p>
                      </div>
                      {reviewingProduct?.product_id === p.product_id ? (
                        <div className="w-full mt-2 space-y-2">
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <button key={s} onClick={() => setNewRating(s)} className="cursor-pointer hover:scale-110">
                                <Star className={cn("w-5 h-5", s <= newRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
                              </button>
                            ))}
                          </div>
                          <Textarea placeholder="Write your review..." value={newText} onChange={(e) => setNewText(e.target.value)} rows={2} className="text-sm" />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleSubmitReview(p.product_id)} disabled={submitting || newRating === 0}>
                              {submitting && <Loader2 className="w-3 h-3 animate-spin mr-1" />} Submit
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => { setReviewingProduct(null); setNewRating(0); setNewText(""); }}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setReviewingProduct(p)}>Rate</Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Existing reviews */}
              {reviews.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Reviews</h3>
                  {reviews.map((r) => (
                    <div key={r.id} className="p-3 bg-secondary/50 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={cn("w-4 h-4", s <= r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
                          ))}
                        </div>
                        <span className={cn("text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5", statusColor(r.status))}>
                          {r.status}
                        </span>
                      </div>
                      {r.review_text && <p className="text-sm text-foreground mb-1">{r.review_text}</p>}
                      <p className="text-xs text-muted-foreground">
                        {r.category} · {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {reviews.length === 0 && unreviewed.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Purchase products to leave ratings and reviews!
                </p>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MyReviewsDrawer;
