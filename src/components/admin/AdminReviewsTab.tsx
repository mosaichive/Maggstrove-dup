import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  product_id: string;
  category: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  status: string;
  created_at: string;
}

const AdminReviewsTab = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");

  useEffect(() => { fetchReviews(); }, []);

  // Real-time reviews subscription
  useEffect(() => {
    const channel = supabase
      .channel('admin-reviews-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_reviews' }, () => {
        fetchReviews();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("product_reviews")
      .select("*")
      .order("created_at", { ascending: false });
    setReviews((data as any as Review[]) || []);
    setLoading(false);
  };

  const handleUpdateStatus = async (reviewId: string, newStatus: string) => {
    const { error } = await supabase
      .from("product_reviews")
      .update({ status: newStatus, updated_at: new Date().toISOString() } as any)
      .eq("id", reviewId);
    if (error) { toast.error("Failed to update"); } 
    else { toast.success(`Review ${newStatus}`); fetchReviews(); }
  };

  const filtered = statusFilter === "all" ? reviews : reviews.filter(r => r.status === statusFilter);
  const pendingCount = reviews.filter(r => r.status === "pending").length;

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      {pendingCount > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-center gap-3">
          <Star className="w-5 h-5 text-amber-600" />
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">{pendingCount} review{pendingCount !== 1 ? "s" : ""} pending approval</p>
        </div>
      )}

      <div className="flex gap-3 items-center">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews ({reviews.length})</SelectItem>
            <SelectItem value="pending">Pending ({pendingCount})</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{filtered.length} review{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="space-y-3">
        {filtered.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={cn("w-4 h-4", s <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
                      ))}
                    </div>
                    <Badge className={cn("text-xs",
                      review.status === "approved" ? "bg-accent/10 text-accent" :
                      review.status === "rejected" ? "bg-destructive/10 text-destructive" :
                      "bg-amber-500/10 text-amber-600"
                    )}>{review.status}</Badge>
                  </div>
                  {review.review_text && <p className="text-sm text-foreground">{review.review_text}</p>}
                  <p className="text-xs text-muted-foreground">
                    Product: {review.product_id} · {review.category} · {new Date(review.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {review.status !== "approved" && (
                    <Button size="sm" variant="outline" className="gap-1 text-accent border-accent" onClick={() => handleUpdateStatus(review.id, "approved")}>
                      <CheckCircle2 className="w-3 h-3" /> Approve
                    </Button>
                  )}
                  {review.status !== "rejected" && (
                    <Button size="sm" variant="outline" className="gap-1 text-destructive border-destructive" onClick={() => handleUpdateStatus(review.id, "rejected")}>
                      <XCircle className="w-3 h-3" /> Reject
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No reviews found</p>}
      </div>
    </div>
  );
};

export default AdminReviewsTab;
