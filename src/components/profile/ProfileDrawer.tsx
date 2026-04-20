import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { supabase } from "@/integrations/supabase/client";
import { AppProfile, loadUserProfile, upsertUserProfile } from "@/lib/profile";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, Heart, ShoppingBag, Package,
  LogOut, Edit, MapPin, ChevronRight, Camera, Shield,
  MessageCircle, Star, Settings,
} from "lucide-react";
import { toast } from "sonner";
import EditProfileSheet from "./EditProfileSheet";
import AddressesDrawer from "./AddressesDrawer";
import OrderHistoryDrawer from "./OrderHistoryDrawer";
import FavoritesDrawer from "../favorites/FavoritesDrawer";
import SupportChat from "../support/SupportChat";
import MyReviewsDrawer from "./MyReviewsDrawer";
import AccountSettings from "./AccountSettings";

interface ProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RecentOrder {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
}

const ProfileDrawer = ({ open, onOpenChange }: ProfileDrawerProps) => {
  const { user, signOut, isAdmin } = useAuth();
  const { favoritesCount, cartCount } = useShop();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [uploading, setUploading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addressesOpen, setAddressesOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (open && user) {
      fetchProfile();
      fetchRecentOrders();
    }
  }, [open, user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { profile: nextProfile } = await loadUserProfile(user);
    setProfile(nextProfile);
  };

  const fetchRecentOrders = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("orders")
      .select("id, order_number, status, total, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3);
    if (data) setRecentOrders(data as RecentOrder[]);
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
      const { data: profileData, error: profileError } = await upsertUserProfile(user, {
        avatar_url: urlData.publicUrl,
      });
      if (profileError) throw profileError;

      setProfile((p) => profileData ?? (p ? { ...p, avatar_url: urlData.publicUrl } : p));
      toast.success("Profile photo updated!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const goTo = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  const handleSignOut = async () => {
    onOpenChange(false);
    await signOut();
    navigate("/");
  };

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[420px] flex flex-col p-0 bg-background">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" />
            My Account
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Profile Summary */}
          <div className="px-6 py-5 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-16 h-16 rounded-full bg-secondary border-2 border-border overflow-hidden flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-7 h-7 text-muted-foreground" />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-primary/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-4 h-4 text-primary-foreground" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground truncate">
                  {profile?.full_name || "Welcome!"}
                </h3>
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {profile?.email}
                </p>
                {profile?.phone && (
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" />
                    {profile.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 border-b border-border">
            <button
              onClick={() => goTo("/favorites")}
              className="flex flex-col items-center gap-1 py-4 hover:bg-secondary/50 transition-colors"
            >
              <Heart className="w-5 h-5 text-muted-foreground" />
              <span className="text-lg font-bold">{favoritesCount}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Wishlist</span>
            </button>
            <button
              onClick={() => goTo("/profile")}
              className="flex flex-col items-center gap-1 py-4 hover:bg-secondary/50 transition-colors border-x border-border"
            >
              <Package className="w-5 h-5 text-muted-foreground" />
              <span className="text-lg font-bold">{recentOrders.length}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Orders</span>
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="flex flex-col items-center gap-1 py-4 hover:bg-secondary/50 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-muted-foreground" />
              <span className="text-lg font-bold">{cartCount}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">In Bag</span>
            </button>
          </div>

          {/* Menu Links */}
          <div className="py-2">
            {/* Admin Dashboard - Only shown to admins */}
            {isAdmin && (
              <button
                onClick={() => goTo("/admin")}
                className="flex items-center justify-between w-full px-6 py-3.5 bg-accent/10 hover:bg-accent/20 transition-colors border-y border-accent/20"
              >
                <span className="flex items-center gap-3 text-sm font-bold text-accent">
                  <Shield className="w-4 h-4" />
                  Admin Dashboard
                </span>
                <ChevronRight className="w-4 h-4 text-accent" />
              </button>
            )}

            <button
              onClick={() => setOrdersOpen(true)}
              className="flex items-center justify-between w-full px-6 py-3.5 hover:bg-secondary/50 transition-colors"
            >
              <span className="flex items-center gap-3 text-sm font-medium">
                <Package className="w-4 h-4 text-muted-foreground" />
                Order History
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => setFavoritesOpen(true)}
              className="flex items-center justify-between w-full px-6 py-3.5 hover:bg-secondary/50 transition-colors"
            >
              <span className="flex items-center gap-3 text-sm font-medium">
                <Heart className="w-4 h-4 text-muted-foreground" />
                My Wishlist
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => setAddressesOpen(true)}
              className="flex items-center justify-between w-full px-6 py-3.5 hover:bg-secondary/50 transition-colors"
            >
              <span className="flex items-center gap-3 text-sm font-medium">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Saved Addresses
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center justify-between w-full px-6 py-3.5 hover:bg-secondary/50 transition-colors"
            >
              <span className="flex items-center gap-3 text-sm font-medium">
                <Edit className="w-4 h-4 text-muted-foreground" />
                Edit Profile
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => setReviewsOpen(true)}
              className="flex items-center justify-between w-full px-6 py-3.5 hover:bg-secondary/50 transition-colors"
            >
              <span className="flex items-center gap-3 text-sm font-medium">
                <Star className="w-4 h-4 text-muted-foreground" />
                Ratings & Reviews
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => setSupportOpen(true)}
              className="flex items-center justify-between w-full px-6 py-3.5 hover:bg-secondary/50 transition-colors"
            >
              <span className="flex items-center gap-3 text-sm font-medium">
                <MessageCircle className="w-4 h-4 text-muted-foreground" />
                Help & Support
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center justify-between w-full px-6 py-3.5 hover:bg-secondary/50 transition-colors"
            >
              <span className="flex items-center gap-3 text-sm font-medium">
                <Settings className="w-4 h-4 text-muted-foreground" />
                Account Settings
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Recent Orders */}
          {recentOrders.length > 0 && (
            <div className="px-6 py-4 border-t border-border">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Recent Orders
              </h4>
              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-3 bg-secondary/50 border border-border text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs tracking-wider">{order.order_number}</span>
                      <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 ${
                        order.status === "confirmed" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>{new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                      <span className="font-semibold text-foreground">GH₵{Number(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 space-y-3">
          <Button
            variant="outline"
            className="w-full h-11 text-xs font-bold uppercase tracking-wider"
            onClick={() => goTo("/profile")}
          >
            View Full Profile
          </Button>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 text-xs font-medium text-destructive hover:text-destructive/80 transition-colors py-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </SheetContent>

      {profile && (
        <EditProfileSheet
          open={editOpen}
          onOpenChange={setEditOpen}
          profile={profile}
          onUpdated={fetchProfile}
        />
      )}
      
      <AddressesDrawer open={addressesOpen} onOpenChange={setAddressesOpen} />
      <OrderHistoryDrawer open={ordersOpen} onOpenChange={setOrdersOpen} />
      <FavoritesDrawer open={favoritesOpen} onOpenChange={setFavoritesOpen} />
      <SupportChat open={supportOpen} onOpenChange={setSupportOpen} />
      <MyReviewsDrawer open={reviewsOpen} onOpenChange={setReviewsOpen} />
      <AccountSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </Sheet>
  );
};

export default ProfileDrawer;
