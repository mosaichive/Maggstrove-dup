import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  review_text: string | null;
  status: string;
  created_at: string;
  user_id: string;
}

interface ProductReviewsProps {
  productId: string;
  category: string;
}

const StarRating = ({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => interactive && onRate?.(star)}
        className={cn("transition-colors", interactive && "cursor-pointer hover:scale-110")}
        disabled={!interactive}
      >
        <Star
          className={cn(
            "w-5 h-5",
            star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
          )}
        />
      </button>
    ))}
  </div>
);

const ProductReviews = ({ productId, category }: ProductReviewsProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(0);
  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);

  useEffect(() => {
    fetchReviews();
    if (user) checkPurchaseHistory();
  }, [productId, user]);

  const checkPurchaseHistory = async () => {
    if (!user) return;
    setCheckingPurchase(true);
    const { data } = await supabase
      .from("order_items")
      .select("id, order_id")
      .eq("product_id", productId);
    
    if (data && data.length > 0) {
      // Check if any of these orders belong to this user
      const orderIds = data.map((d: any) => d.order_id);
      const { data: orders } = await supabase
        .from("orders")
        .select("id")
        .eq("user_id", user.id)
        .in("id", orderIds);
      setHasPurchased((orders || []).length > 0);
    }
    setCheckingPurchase(false);
  };

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    const approved = (data || []).filter((r: any) => r.status === "approved" || r.user_id === user?.id);
    setReviews(approved as any as Review[]);

    if (user) {
      const mine = (data || []).find((r: any) => r.user_id === user.id);
      if (mine) {
        setUserReview(mine as any as Review);
        setNewRating((mine as any).rating);
        setNewText((mine as any).review_text || "");
      }
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!user) { toast.error("Please log in to leave a review"); return; }
    if (!hasPurchased) { toast.error("You can only review products you've purchased"); return; }
    if (newRating === 0) { toast.error("Please select a rating"); return; }

    setSubmitting(true);
    try {
      if (userReview) {
        await supabase.from("product_reviews")
          .update({ rating: newRating, review_text: newText || null, status: "pending", updated_at: new Date().toISOString() } as any)
          .eq("id", userReview.id);
      } else {
        await supabase.from("product_reviews")
          .insert({ product_id: productId, category, user_id: user.id, rating: newRating, review_text: newText || null } as any);
      }
      toast.success(userReview ? "Review updated! Pending approval." : "Review submitted! Pending approval.");
      fetchReviews();
    } catch {
      toast.error("Failed to submit review");
    }
    setSubmitting(false);
  };

  const approvedReviews = reviews.filter(r => r.status === "approved");
  const avgRating = approvedReviews.length > 0
    ? approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Reviews</h2>
        {approvedReviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(avgRating)} />
            <span className="text-sm text-muted-foreground">({approvedReviews.length})</span>
          </div>
        )}
      </div>

      {/* Write Review - only for purchasers */}
      {user && hasPurchased && (
        <div className="bg-secondary/50 border border-border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <p className="text-sm font-semibold">{userReview ? "Update your review" : "Write a review"}</p>
            <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">Verified Purchase</span>
          </div>
          {userReview?.status === "pending" && (
            <p className="text-xs text-amber-600 bg-amber-500/10 px-2 py-1 rounded inline-block">Your review is pending approval</p>
          )}
          <StarRating rating={newRating} onRate={setNewRating} interactive />
          <Textarea
            placeholder="Share your experience with this product..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows={3}
            className="text-sm"
          />
          <Button size="sm" onClick={handleSubmit} disabled={submitting || newRating === 0}>
            {submitting && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
            {userReview ? "Update Review" : "Submit Review"}
          </Button>
        </div>
      )}

      {user && !hasPurchased && !checkingPurchase && (
        <p className="text-sm text-muted-foreground bg-secondary/50 border border-border p-3">
          Only verified purchasers can leave reviews for this product.
        </p>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : approvedReviews.length > 0 ? (
        <div className="space-y-4">
          {approvedReviews.map((review) => (
            <div key={review.id} className="border-b border-border pb-4">
              <div className="flex items-center gap-3 mb-2">
                <StarRating rating={review.rating} />
                <span className="text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold">Verified</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              {review.review_text && <p className="text-sm text-foreground">{review.review_text}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-6">No reviews yet. Be the first to review this product!</p>
      )}
    </div>
  );
};

export default ProductReviews;
