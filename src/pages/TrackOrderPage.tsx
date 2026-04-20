import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OrderTrackingTimeline from "@/components/tracking/OrderTrackingTimeline";
import { useOrderTracking } from "@/hooks/useOrderTracking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Search, Package, Loader2 } from "lucide-react";
import { toast } from "sonner";

const TrackOrderPage = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [foundOrder, setFoundOrder] = useState<any>(null);
  const { tracking, loading: trackingLoading, fetchTracking, getCurrentStageIndex } = useOrderTracking();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !email.trim()) {
      toast.error("Please enter both order number and email");
      return;
    }

    setSearching(true);
    setFoundOrder(null);

    const { data, error } = await supabase
      .from("orders")
      .select("id, order_number, status, total, created_at, shipping_name, shipping_city, shipping_region")
      .eq("order_number", orderNumber.trim())
      .eq("shipping_email", email.trim())
      .maybeSingle();

    if (error || !data) {
      toast.error("Order not found. Please check your order number and email.");
      setSearching(false);
      return;
    }

    setFoundOrder(data);
    await fetchTracking(data.id);
    setSearching(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 md:py-16 max-w-2xl">
          <div className="text-center mb-8">
            <Package className="w-10 h-10 mx-auto text-primary mb-3" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Track Your Order</h1>
            <p className="text-muted-foreground text-sm mt-2">
              Enter your order number and email to see the latest status.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4 mb-8">
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number</Label>
              <Input
                id="orderNumber"
                placeholder="e.g. MG-M1ABC23"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trackEmail">Email Address</Label>
              <Input
                id="trackEmail"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={searching}>
              {searching ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Track Order
            </Button>
          </form>

          {foundOrder && (
            <div className="border border-border p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Order</p>
                  <p className="text-lg font-bold">{foundOrder.order_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {new Date(foundOrder.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="font-semibold">GH₵{Number(foundOrder.total).toFixed(2)}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Delivery Progress</h3>
                {trackingLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <OrderTrackingTimeline
                    tracking={tracking}
                    currentStageIndex={getCurrentStageIndex()}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackOrderPage;
