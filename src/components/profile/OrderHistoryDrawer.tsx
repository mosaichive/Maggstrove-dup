import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Package, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  total: number;
  status: string;
  items_count?: number;
}

interface OrderHistoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderHistoryDrawer = ({ open, onOpenChange }: OrderHistoryDrawerProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          order_number,
          created_at,
          total,
          status
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchOrders();
    }
  }, [open]);

  const goToProfile = () => {
    onOpenChange(false);
    navigate("/profile");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500/10 text-green-600";
      case "processing":
        return "bg-blue-500/10 text-blue-600";
      case "shipped":
        return "bg-purple-500/10 text-purple-600";
      case "delivered":
        return "bg-green-500/10 text-green-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[420px] flex flex-col p-0 bg-background">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4" />
            Order History ({orders.length})
          </SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <Package className="w-16 h-16 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No orders yet</p>
            <Button
              variant="outline"
              className="uppercase tracking-wider text-xs font-bold"
              onClick={() => onOpenChange(false)}
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="pb-4 border-b border-border last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {order.order_number}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm font-bold">GH₵{order.total.toFixed(2)}</p>
                    <button
                      onClick={goToProfile}
                      className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      View Details
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-6 py-4">
              <Button
                variant="outline"
                className="w-full h-11 text-xs font-bold uppercase tracking-wider"
                onClick={goToProfile}
              >
                View All Orders
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default OrderHistoryDrawer;
