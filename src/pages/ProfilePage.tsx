import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useOrderTracking } from "@/hooks/useOrderTracking";
import OrderTrackingTimeline from "@/components/tracking/OrderTrackingTimeline";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EditProfileDialog from "@/components/profile/EditProfileDialog";
import AddAddressDialog from "@/components/profile/AddAddressDialog";
import PaymentMethodsCard, { PaymentMethod } from "@/components/profile/PaymentMethodsCard";
import MyReviewsDrawer from "@/components/profile/MyReviewsDrawer";
import AccountSettings from "@/components/profile/AccountSettings";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  User, Mail, Phone, MapPin, Heart, ShoppingBag,
  CreditCard, LogOut, Edit, Plus, Camera, Package, Eye, Truck, Loader2, Star, Settings,
} from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface ShippingAddress {
  id: string;
  label: string;
  full_name: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  postal_code: string | null;
  country: string;
  phone: string | null;
  is_default: boolean;
  gps_lat?: number | null;
  gps_lng?: number | null;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  items_count?: number;
}

const ProfilePage = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { tracking, loading: trackingLoading, fetchTracking, getCurrentStageIndex } = useOrderTracking();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login?next=/account", { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchAddresses();
      fetchOrders();
      fetchPaymentMethods();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user!.id)
      .single();
    if (data) setProfile(data as Profile);
  };

  const fetchAddresses = async () => {
    const { data } = await supabase
      .from("shipping_addresses")
      .select("*")
      .eq("user_id", user!.id)
      .order("is_default", { ascending: false });
    if (data) setAddresses(data as ShippingAddress[]);
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("id, order_number, status, total, created_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setOrders(data as Order[]);
  };

  const fetchPaymentMethods = async () => {
    const { data } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", user!.id)
      .order("is_default", { ascending: false });
    if (data) setPaymentMethods(data as PaymentMethod[]);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      await supabase
        .from("profiles")
        .update({ avatar_url: urlData.publicUrl, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      
      setProfile((p) => p ? { ...p, avatar_url: urlData.publicUrl } : p);
      toast.success("Profile photo updated!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleDeleteAddress = async (id: string) => {
    await supabase.from("shipping_addresses").delete().eq("id", id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Address removed");
  };

  const handleTrackOrder = async (order: Order) => {
    setTrackingOrderId(order.id);
    await fetchTracking(order.id);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Order Placed",
      processing: "Processing",
      confirmed: "Confirmed",
      shipped: "Shipped",
      out_for_delivery: "Out for Delivery",
      ready_for_pickup: "Ready for Pickup",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-accent/10 text-accent";
      case "shipped":
      case "out_for_delivery":
      case "ready_for_pickup": return "bg-blue-500/10 text-blue-600";
      case "processing":
      case "confirmed": return "bg-yellow-500/10 text-yellow-600";
      case "cancelled": return "bg-red-500/10 text-red-600";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading || !user || !profile) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading profile...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-secondary/30">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Profile Header */}
          <div className="bg-background border border-border p-6 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-secondary border-2 border-border overflow-hidden flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-primary/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-5 h-5 text-primary-foreground" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
                </label>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold tracking-tight">{profile.full_name || "Welcome!"}</h1>
                <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" />{profile.email}</span>
                  {profile.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" />{profile.phone}</span>}
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                  <Edit className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Order History with Tracking */}
            <DashboardCard icon={Package} title="Order History">
              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="p-3 bg-secondary/50 border border-border text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs tracking-wider">{order.order_number}</span>
                        <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>{new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                        <span className="font-semibold text-foreground">GH₵{Number(order.total).toFixed(2)}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 w-full text-xs gap-1"
                        onClick={() => handleTrackOrder(order)}
                      >
                        <Truck className="w-3 h-3" /> Track Order
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">No orders yet. Start shopping!</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate("/women")}>Browse Products</Button>
                </>
              )}
              <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => navigate("/track-order")}>
                <Package className="w-4 h-4 mr-1" /> Track by Order Number
              </Button>
            </DashboardCard>

            {/* Ratings & Reviews */}
            <DashboardCard icon={Star} title="Ratings & Reviews">
              <p className="text-sm text-muted-foreground mb-3">Rate and review products you've purchased.</p>
              <Button variant="outline" size="sm" onClick={() => setReviewsOpen(true)}>
                <Star className="w-4 h-4 mr-1" /> View Reviews
              </Button>
            </DashboardCard>

            {/* Wishlist */}
            <DashboardCard icon={Heart} title="Wishlist">
              <Button variant="outline" size="sm" onClick={() => navigate("/favorites")}>View Wishlist</Button>
            </DashboardCard>

            {/* Shipping Addresses */}
            <DashboardCard icon={MapPin} title="Saved Addresses">
              {addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="p-3 bg-secondary/50 border border-border text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs uppercase tracking-wider">
                          {addr.label}
                          {addr.is_default && <span className="ml-2 text-accent text-[10px]">DEFAULT</span>}
                        </span>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="text-xs text-destructive hover:underline">Remove</button>
                      </div>
                      <p className="text-muted-foreground">
                        {addr.address_line1}{addr.address_line2 && `, ${addr.address_line2}`}<br />
                        {addr.city}{addr.state && `, ${addr.state}`} {addr.postal_code}<br />{addr.country}
                      </p>
                      {addr.gps_lat && addr.gps_lng && (
                        <div className="mt-2">
                          <p className="text-xs text-accent mb-1">📍 GPS: {addr.gps_lat.toFixed(4)}, {addr.gps_lng.toFixed(4)}</p>
                          <iframe
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${addr.gps_lng - 0.003},${addr.gps_lat - 0.003},${addr.gps_lng + 0.003},${addr.gps_lat + 0.003}&layer=mapnik&marker=${addr.gps_lat},${addr.gps_lng}`}
                            className="w-full h-[100px] border-0 rounded"
                            title="Address location"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No saved addresses.</p>
              )}
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setAddressOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> Add Address
              </Button>
            </DashboardCard>

            {/* Payment Methods */}
            <DashboardCard icon={CreditCard} title="Payment Methods">
              <PaymentMethodsCard userId={user.id} methods={paymentMethods} onRefresh={fetchPaymentMethods} />
            </DashboardCard>
          </div>
        </div>
      </main>
      <Footer />

      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} profile={profile} onUpdated={fetchProfile} />
      <AddAddressDialog open={addressOpen} onOpenChange={setAddressOpen} userId={user.id} onAdded={fetchAddresses} />
      <MyReviewsDrawer open={reviewsOpen} onOpenChange={setReviewsOpen} />
      <AccountSettings open={settingsOpen} onOpenChange={setSettingsOpen} />

      {/* Tracking Modal */}
      <Dialog open={!!trackingOrderId} onOpenChange={(open) => !open && setTrackingOrderId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" /> Order Tracking
            </DialogTitle>
          </DialogHeader>
          {trackingLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <OrderTrackingTimeline tracking={tracking} currentStageIndex={getCurrentStageIndex()} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const DashboardCard = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div className="bg-background border border-border p-6">
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-5 h-5 text-muted-foreground" />
      <h2 className="text-sm font-bold uppercase tracking-wider">{title}</h2>
    </div>
    {children}
  </div>
);

export default ProfilePage;
