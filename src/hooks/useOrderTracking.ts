import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TrackingEntry {
  id: string;
  order_id: string;
  status: string;
  note: string | null;
  created_at: string;
}

export const DELIVERY_STATUSES = [
  { value: "pending", label: "Order Placed", icon: "📦" },
  { value: "confirmed", label: "Confirmed", icon: "✅" },
  { value: "processing", label: "Processing", icon: "⚙️" },
  { value: "shipped", label: "Shipped", icon: "🚚" },
  { value: "out_for_delivery", label: "Out for Delivery", icon: "🏍️" },
  { value: "delivered", label: "Delivered", icon: "✅" },
] as const;

export const PICKUP_STATUSES = [
  { value: "pending", label: "Order Placed", icon: "📦" },
  { value: "confirmed", label: "Confirmed", icon: "✅" },
  { value: "processing", label: "Processing", icon: "⚙️" },
  { value: "ready_for_pickup", label: "Ready for Pickup", icon: "🏬" },
  { value: "delivered", label: "Picked Up", icon: "✅" },
] as const;

// Keep ORDER_STATUSES as alias for delivery (backward compat)
export const ORDER_STATUSES = DELIVERY_STATUSES;

export const getStatusesForFulfillment = (fulfillmentType: string) =>
  fulfillmentType === "pickup" ? PICKUP_STATUSES : DELIVERY_STATUSES;

export const useOrderTracking = (orderId?: string) => {
  const [tracking, setTracking] = useState<TrackingEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderId) fetchTracking(orderId);
  }, [orderId]);

  const fetchTracking = async (oid: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("order_tracking")
      .select("*")
      .eq("order_id", oid)
      .order("created_at", { ascending: true });
    setTracking((data as any as TrackingEntry[]) || []);
    setLoading(false);
  };

  const getCurrentStageIndex = (fulfillmentType: string = "delivery"): number => {
    const statuses = getStatusesForFulfillment(fulfillmentType);
    if (tracking.length === 0) return 0;
    const lastStatus = tracking[tracking.length - 1].status;
    const idx = statuses.findIndex((s) => s.value === lastStatus);
    return idx >= 0 ? idx : 0;
  };

  return { tracking, loading, fetchTracking, getCurrentStageIndex };
};
