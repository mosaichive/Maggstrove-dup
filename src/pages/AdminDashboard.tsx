import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OrderTrackingTimeline from "@/components/tracking/OrderTrackingTimeline";
import { useOrderTracking, ORDER_STATUSES, DELIVERY_STATUSES, PICKUP_STATUSES, getStatusesForFulfillment } from "@/hooks/useOrderTracking";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Package, DollarSign, ShoppingCart, Search,
  Loader2, Upload, ImageIcon, Edit2, Pencil,
  Eye, EyeOff, Plus, Trash2, TrendingUp, Clock,
  CheckCircle2, XCircle, Truck, AlertCircle, BarChart3, Users,
  MapPin, Navigation, Star, Tag, MessageCircle, Image
} from "lucide-react";

// ─── Data imports ─────────────────────────────────────────────────────────────
import { womenDresses } from "@/data/womenDresses";
import { womenTops } from "@/data/womenTops";
import { menTshirts } from "@/data/menTshirts";
import { menTrousers } from "@/data/menTrousers";
import { menTwoPiece } from "@/data/menTwoPiece";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  shipping_name: string;
  shipping_email: string;
  shipping_phone: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_region: string | null;
  payment_method: string;
  fulfillment_type: string;
  created_at: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: string;
  product_name: string;
  brand: string;
  price: number;
  quantity: number;
  size: string;
  image: string | null;
}

interface CatalogueProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  isNew?: boolean;
  isSale?: boolean;
  style: string;
  fabric: string;
  category: string;
}

interface ProductOverride {
  product_id: string;
  category: string;
  name: string | null;
  brand: string | null;
  price: number | null;
  original_price: number | null;
  image_url: string | null;
  style: string | null;
  fabric: string | null;
  is_new: boolean | null;
  is_sale: boolean | null;
  product_status: string;
}

interface ShippingRegion {
  id: string;
  name: string;
  default_shipping_fee: number;
  is_active: boolean;
  sort_order: number;
}

interface ShippingCity {
  id: string;
  region_id: string;
  name: string;
  shipping_fee: number | null;
  is_active: boolean;
  sort_order: number;
}

// ─── Build full catalogue ─────────────────────────────────────────────────────
const buildCatalogue = (): CatalogueProduct[] => [
  ...womenDresses.map(p => ({ ...p, category: "dresses" })),
  ...womenTops.map(p => ({ ...p, category: "tops" })),
  ...menTshirts.map(p => ({ ...p, category: "tshirts" })),
  ...menTrousers.map(p => ({ ...p, category: "trousers" })),
  ...menTwoPiece.map(p => ({ ...p, category: "2piece" })),
];

// ─── Edit Product Modal ───────────────────────────────────────────────────────
interface EditProductModalProps {
  product: CatalogueProduct;
  override: ProductOverride | null;
  onClose: () => void;
  onSaved: () => void;
}

const EditProductModal = ({ product, override, onClose, onSaved }: EditProductModalProps) => {
  const [name, setName] = useState(override?.name ?? product.name);
  const [brand, setBrand] = useState(override?.brand ?? product.brand);
  const [price, setPrice] = useState(String(override?.price ?? product.price));
  const [originalPrice, setOriginalPrice] = useState(String(override?.original_price ?? product.originalPrice ?? ""));
  const [style, setStyle] = useState(override?.style ?? product.style);
  const [fabric, setFabric] = useState(override?.fabric ?? product.fabric);
  const [isNew, setIsNew] = useState(override?.is_new ?? product.isNew ?? false);
  const [isSale, setIsSale] = useState(override?.is_sale ?? product.isSale ?? false);
  const [imageUrl, setImageUrl] = useState(override?.image_url ?? "");
  const [previewSrc, setPreviewSrc] = useState<string>(override?.image_url || product.image);
  const [productStatus, setProductStatus] = useState(override?.product_status ?? "available");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${product.category}/${product.id}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
      setPreviewSrc(data.publicUrl);
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: ProductOverride = {
        product_id: product.id,
        category: product.category,
        name: name || null,
        brand: brand || null,
        price: price ? parseFloat(price) : null,
        original_price: originalPrice ? parseFloat(originalPrice) : null,
        image_url: imageUrl || null,
        style: style || null,
        fabric: fabric || null,
        is_new: isNew,
        is_sale: isSale,
        product_status: productStatus,
      };

      const { error } = await supabase
        .from("product_overrides")
        .upsert(payload as any, { onConflict: "product_id" });

      if (error) throw error;
      toast.success("Product saved!");
      onSaved();
      onClose();
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("product_overrides")
      .delete()
      .eq("product_id", product.id);
    if (error) {
      toast.error("Failed to reset product");
    } else {
      toast.success("Product reset to defaults");
      onSaved();
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Pencil className="w-4 h-4" /> Edit Product</DialogTitle>
          <DialogDescription>Update product information, photo, and availability status.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="p-4 rounded-lg border-2 border-dashed space-y-3">
            <Label className="text-sm font-semibold">Availability Status</Label>
            <div className="flex items-center gap-4">
              <Button type="button" variant={productStatus === "available" ? "default" : "outline"} size="sm" className="gap-2" onClick={() => setProductStatus("available")}>
                <Eye className="w-4 h-4" /> Available
              </Button>
              <Button type="button" variant={productStatus === "sold" ? "destructive" : "outline"} size="sm" className="gap-2" onClick={() => setProductStatus("sold")}>
                <EyeOff className="w-4 h-4" /> Sold
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Product Photo</Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden border bg-muted flex items-center justify-center flex-shrink-0">
                {previewSrc ? <img src={previewSrc} alt="preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-muted-foreground" />}
              </div>
              <div className="space-y-2 flex-1">
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Uploading…" : "Upload new photo"}
                </Button>
                <Input placeholder="Or paste image URL" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setPreviewSrc(e.target.value); }} className="text-xs" />
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Product Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="space-y-1"><Label>Brand</Label><Input value={brand} onChange={(e) => setBrand(e.target.value)} /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Price (GH₵)</Label><Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
            <div className="space-y-1"><Label>Original Price (GH₵)</Label><Input type="number" placeholder="Leave blank if no sale" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Style</Label><Input value={style} onChange={(e) => setStyle(e.target.value)} /></div>
            <div className="space-y-1"><Label>Fabric</Label><Input value={fabric} onChange={(e) => setFabric(e.target.value)} /></div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2"><Switch id="isNew" checked={isNew} onCheckedChange={setIsNew} /><Label htmlFor="isNew">New</Label></div>
            <div className="flex items-center gap-2"><Switch id="isSale" checked={isSale} onCheckedChange={setIsSale} /><Label htmlFor="isSale">Sale</Label></div>
          </div>
        </div>

        <DialogFooter className="flex items-center gap-2 pt-2">
          {override && <Button variant="ghost" size="sm" className="text-destructive mr-auto gap-1" onClick={handleDelete}><Trash2 className="w-3 h-3" /> Reset</Button>}
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || uploading}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Products Management ──────────────────────────────────────────────────────
const ProductsTab = () => {
  const [overridesMap, setOverridesMap] = useState<Record<string, ProductOverride>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingProduct, setEditingProduct] = useState<CatalogueProduct | null>(null);
  const [imagesProduct, setImagesProduct] = useState<CatalogueProduct | null>(null);

  const catalogue = buildCatalogue();

  useEffect(() => { fetchOverrides(); }, []);

  const fetchOverrides = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("product_overrides").select("*");
    if (error) { toast.error("Failed to load overrides"); }
    else {
      const map: Record<string, ProductOverride> = {};
      (data || []).forEach((o: any) => { map[o.product_id] = o as ProductOverride; });
      setOverridesMap(map);
    }
    setLoading(false);
  };

  const toggleProductStatus = async (product: CatalogueProduct) => {
    const override = overridesMap[product.id];
    const currentStatus = override?.product_status ?? "available";
    const newStatus = currentStatus === "available" ? "sold" : "available";
    const { error } = await supabase.from("product_overrides").upsert({ product_id: product.id, category: product.category, product_status: newStatus } as any, { onConflict: "product_id" });
    if (error) { toast.error("Failed to update status"); } else { toast.success(`Product marked as ${newStatus}`); fetchOverrides(); }
  };

  const categoryLabels: Record<string, string> = { dresses: "Dresses", tops: "Tops", tshirts: "T-Shirts", trousers: "Trousers", "2piece": "2-Piece" };

  const filtered = catalogue.filter((p) => {
    const q = searchQuery.toLowerCase();
    const override = overridesMap[p.id];
    const name = override?.name ?? p.name;
    const brand = override?.brand ?? p.brand;
    const matchesSearch = !q || name.toLowerCase().includes(q) || brand.toLowerCase().includes(q) || p.id.includes(q);
    const matchesCat = categoryFilter === "all" || p.category === categoryFilter;
    const productStatus = override?.product_status ?? "available";
    const matchesStatus = statusFilter === "all" || productStatus === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const availableCount = catalogue.filter(p => (overridesMap[p.id]?.product_status ?? "available") === "available").length;
  const soldCount = catalogue.filter(p => overridesMap[p.id]?.product_status === "sold").length;

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => setStatusFilter("all")} className={`p-3 rounded-lg border text-left transition-colors ${statusFilter === "all" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
          <p className="text-2xl font-bold">{catalogue.length}</p><p className="text-xs text-muted-foreground">Total Products</p>
        </button>
        <button onClick={() => setStatusFilter("available")} className={`p-3 rounded-lg border text-left transition-colors ${statusFilter === "available" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
          <p className="text-2xl font-bold text-green-600">{availableCount}</p><p className="text-xs text-muted-foreground">Available</p>
        </button>
        <button onClick={() => setStatusFilter("sold")} className={`p-3 rounded-lg border text-left transition-colors ${statusFilter === "sold" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
          <p className="text-2xl font-bold text-red-600">{soldCount}</p><p className="text-xs text-muted-foreground">Sold / Hidden</p>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search products…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(categoryLabels).map(([val, label]) => <SelectItem key={val} value={val}>{label}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{filtered.length} products</span>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((product) => {
          const override = overridesMap[product.id];
          const displayName = override?.name ?? product.name;
          const displayBrand = override?.brand ?? product.brand;
          const displayPrice = override?.price ?? product.price;
          const displayImage = override?.image_url || product.image;
          const isModified = !!override;
          const isSold = override?.product_status === "sold";

          return (
            <Card key={product.id} className={`group overflow-hidden transition-all ${isSold ? "opacity-60" : "hover:shadow-md"}`}>
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <img src={displayImage} alt={displayName} className={`w-full h-full object-cover transition-transform duration-300 ${isSold ? "grayscale" : "group-hover:scale-105"}`} />
                <button onClick={() => setEditingProduct(product)} className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-background rounded-full p-2 shadow-lg"><Edit2 className="w-4 h-4" /></div>
                </button>
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {isSold && <Badge variant="destructive" className="text-xs">Sold</Badge>}
                  {!isSold && isModified && <Badge className="text-xs bg-primary text-primary-foreground">Edited</Badge>}
                  {(override?.is_new ?? product.isNew) && <Badge className="text-xs bg-blue-500/90 text-white">New</Badge>}
                  {(override?.is_sale ?? product.isSale) && <Badge className="text-xs bg-red-500/90 text-white">Sale</Badge>}
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleProductStatus(product); }} className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${isSold ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"}`} title={isSold ? "Mark as Available" : "Mark as Sold"}>
                  {isSold ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <CardContent className="p-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{displayBrand}</p>
                <p className="text-sm font-medium truncate">{displayName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-semibold">GH₵{displayPrice.toFixed(2)}</p>
                  {(override?.original_price ?? product.originalPrice) && <p className="text-xs text-muted-foreground line-through">GH₵{(override?.original_price ?? product.originalPrice)!.toFixed(2)}</p>}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">{categoryLabels[product.category]}</p>
                  <div className="flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); setImagesProduct(product); }} className="text-[10px] text-muted-foreground hover:text-foreground underline" title="Manage images">
                      <Image className="w-3 h-3 inline mr-0.5" />imgs
                    </button>
                    <Badge variant={isSold ? "destructive" : "secondary"} className="text-[10px]">{isSold ? "Sold" : "Available"}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No products match your filters.</p>}
      {editingProduct && <EditProductModal product={editingProduct} override={overridesMap[editingProduct.id] ?? null} onClose={() => setEditingProduct(null)} onSaved={fetchOverrides} />}
      {imagesProduct && <AdminProductImages productId={imagesProduct.id} category={imagesProduct.category} open={!!imagesProduct} onClose={() => setImagesProduct(null)} />}
    </div>
  );
};

// ─── Orders Management ────────────────────────────────────────────────────────
const OrdersTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [trackingNote, setTrackingNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const { tracking, loading: trackingLoading, fetchTracking, getCurrentStageIndex } = useOrderTracking();

  useEffect(() => { fetchOrders(false); }, []);

  // Real-time orders subscription (silent refresh)
  useEffect(() => {
    const channel = supabase
      .channel('admin-orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders(true);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchOrders = async (silent: boolean) => {
    if (!silent) setLoading(true);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) { if (!silent) toast.error("Failed to load orders"); } else { setOrders(data || []); }
    if (!silent) setLoading(false);
  };

  const fetchOrderItems = async (orderId: string) => {
    const { data } = await supabase.from("order_items").select("*").eq("order_id", orderId);
    return data || [];
  };

  const handleViewOrder = async (order: Order) => {
    const items = await fetchOrderItems(order.id);
    setSelectedOrder({ ...order, items });
    await fetchTracking(order.id);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true);
    
    // Update the order status
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) { toast.error("Failed to update status"); setUpdatingStatus(false); return; }

    // Add tracking entry
    const { error: trackError } = await supabase.from("order_tracking").insert({
      order_id: orderId,
      status: newStatus,
      note: trackingNote || null,
    } as any);
    if (trackError) console.error("Failed to add tracking entry:", trackError);

    // Send email notification for key statuses
    const order = selectedOrder || orders.find(o => o.id === orderId);
    if (order && ["out_for_delivery", "delivered"].includes(newStatus)) {
      try {
        await supabase.functions.invoke("order-status-notification", {
          body: {
            orderNumber: order.order_number,
            customerEmail: order.shipping_email,
            customerName: order.shipping_name,
            newStatus,
            items: order.items?.map(i => ({ product_name: i.product_name, brand: i.brand, quantity: i.quantity })) || [],
          },
        });
      } catch { console.warn("Status notification email failed"); }
    }

    toast.success(`Order status updated to ${newStatus}`);
    setTrackingNote("");
    fetchOrders(true);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      await fetchTracking(orderId);
    }
    setUpdatingStatus(false);
  };

  const filteredOrders = statusFilter === "all" ? orders : orders.filter(o => o.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "confirmed": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "processing": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "shipped": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "out_for_delivery": return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
      case "ready_for_pickup": return "bg-teal-500/10 text-teal-600 border-teal-500/20";
      case "delivered": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "cancelled": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "confirmed": return <CheckCircle2 className="w-4 h-4" />;
      case "processing": return <Loader2 className="w-4 h-4" />;
      case "shipped": return <Truck className="w-4 h-4" />;
      case "out_for_delivery": return <Navigation className="w-4 h-4" />;
      case "ready_for_pickup": return <Package className="w-4 h-4" />;
      case "delivered": return <CheckCircle2 className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const pendingCount = orders.filter(o => o.status === "pending").length;
  const confirmedCount = orders.filter(o => o.status === "confirmed").length;

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      {pendingCount > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">{pendingCount} pending order{pendingCount !== 1 ? "s" : ""} awaiting confirmation</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Review and confirm or update these orders.</p>
          </div>
          <Button size="sm" variant="outline" className="border-amber-300" onClick={() => setStatusFilter("pending")}>View Pending</Button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter by status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders ({orders.length})</SelectItem>
            <SelectItem value="pending">Pending ({pendingCount})</SelectItem>
            <SelectItem value="confirmed">Confirmed ({confirmedCount})</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filteredOrders.map((order) => (
            <Card key={order.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedOrder?.id === order.id ? "ring-2 ring-primary" : ""} ${order.status === "pending" ? "border-amber-300 dark:border-amber-700" : ""}`} onClick={() => handleViewOrder(order)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">{getStatusIcon(order.status)}<p className="font-semibold">{order.order_number}</p></div>
                    <p className="text-sm text-muted-foreground">{order.shipping_name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    <p className="text-sm font-semibold">GH₵{order.total.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredOrders.length === 0 && <p className="text-center text-muted-foreground py-8">No orders found</p>}
        </div>

        {selectedOrder && (
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{selectedOrder.order_number}</CardTitle>
                <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
              </div>
              <CardDescription>Placed on {new Date(selectedOrder.created_at).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2"><Users className="w-4 h-4" /> Customer</h4>
                <p className="text-sm">{selectedOrder.shipping_name}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.shipping_email}</p>
                {selectedOrder.shipping_phone && <p className="text-sm text-muted-foreground">{selectedOrder.shipping_phone}</p>}
                <p className="text-sm text-muted-foreground">{selectedOrder.shipping_address}, {selectedOrder.shipping_city}{selectedOrder.shipping_region && `, ${selectedOrder.shipping_region}`}</p>
                <p className="text-sm">Payment: <span className="font-medium">{selectedOrder.payment_method}</span></p>
                <p className="text-sm">Fulfillment: <span className="font-medium capitalize">{selectedOrder.fulfillment_type || "delivery"}</span></p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-secondary/50 rounded p-2">
                      {item.image && <img src={item.image} alt={item.product_name} className="w-12 h-12 object-cover rounded" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">{item.brand} · Size {item.size}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">GH₵{item.price.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Tracking Timeline */}
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2"><Truck className="w-4 h-4" /> Tracking History</h4>
                {trackingLoading ? (
                  <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin" /></div>
                ) : (
                  <OrderTrackingTimeline tracking={tracking} currentStageIndex={getCurrentStageIndex(selectedOrder.fulfillment_type || "delivery")} fulfillmentType={selectedOrder.fulfillment_type || "delivery"} />
                )}
              </div>

              <Separator />

              {/* Update Status */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Update Status</h4>
                <div className="space-y-2">
                  <Textarea placeholder="Add a note (optional)" value={trackingNote} onChange={(e) => setTrackingNote(e.target.value)} className="text-sm" rows={2} />
                  <Select onValueChange={(v) => handleUpdateStatus(selectedOrder.id, v)} disabled={updatingStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder={updatingStatus ? "Updating..." : "Change status to..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {getStatusesForFulfillment(selectedOrder.fulfillment_type || "delivery").map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.icon} {s.label}</SelectItem>
                      ))}
                      <SelectItem value="cancelled">❌ Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />
              <div className="flex justify-between font-semibold"><span>Total</span><span>GH₵{selectedOrder.total.toFixed(2)}</span></div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// ─── Shipping Management ──────────────────────────────────────────────────────
const ShippingTab = () => {
  const [regions, setRegions] = useState<ShippingRegion[]>([]);
  const [cities, setCities] = useState<ShippingCity[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<ShippingRegion | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingCity, setEditingCity] = useState<ShippingCity | null>(null);
  const [newCityName, setNewCityName] = useState("");
  const [newCityFee, setNewCityFee] = useState("");
  const [editRegionFee, setEditRegionFee] = useState("");
  const [addingCity, setAddingCity] = useState(false);

  useEffect(() => { fetchRegions(); }, []);

  const fetchRegions = async () => {
    setLoading(true);
    const { data } = await supabase.from("shipping_regions").select("*").order("sort_order");
    setRegions((data as any as ShippingRegion[]) || []);
    setLoading(false);
  };

  const fetchCities = async (regionId: string) => {
    const { data } = await supabase.from("shipping_cities").select("*").eq("region_id", regionId).order("sort_order");
    setCities((data as any as ShippingCity[]) || []);
  };

  const handleSelectRegion = async (region: ShippingRegion) => {
    setSelectedRegion(region);
    setEditRegionFee(String(region.default_shipping_fee));
    await fetchCities(region.id);
  };

  const handleUpdateRegionFee = async () => {
    if (!selectedRegion) return;
    const fee = parseFloat(editRegionFee);
    if (isNaN(fee)) { toast.error("Invalid fee"); return; }
    const { error } = await supabase.from("shipping_regions").update({ default_shipping_fee: fee } as any).eq("id", selectedRegion.id);
    if (error) { toast.error("Failed to update"); } else { toast.success("Region fee updated"); fetchRegions(); setSelectedRegion({ ...selectedRegion, default_shipping_fee: fee }); }
  };

  const handleAddCity = async () => {
    if (!selectedRegion || !newCityName.trim()) { toast.error("Enter city name"); return; }
    setAddingCity(true);
    const { error } = await supabase.from("shipping_cities").insert({
      region_id: selectedRegion.id,
      name: newCityName.trim(),
      shipping_fee: newCityFee ? parseFloat(newCityFee) : null,
    } as any);
    if (error) { toast.error("Failed to add city"); } else { toast.success("City added"); setNewCityName(""); setNewCityFee(""); fetchCities(selectedRegion.id); }
    setAddingCity(false);
  };

  const handleUpdateCityFee = async (city: ShippingCity, fee: string) => {
    const parsedFee = fee === "" ? null : parseFloat(fee);
    const { error } = await supabase.from("shipping_cities").update({ shipping_fee: parsedFee } as any).eq("id", city.id);
    if (error) { toast.error("Failed to update"); } else { toast.success("City fee updated"); if (selectedRegion) fetchCities(selectedRegion.id); }
  };

  const handleDeleteCity = async (cityId: string) => {
    const { error } = await supabase.from("shipping_cities").delete().eq("id", cityId);
    if (error) { toast.error("Failed to delete"); } else { toast.success("City removed"); if (selectedRegion) fetchCities(selectedRegion.id); }
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Regions List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2"><MapPin className="w-4 h-4" /> Regions ({regions.length})</h3>
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {regions.map((region) => (
            <Card
              key={region.id}
              className={`cursor-pointer transition-all hover:shadow-md ${selectedRegion?.id === region.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => handleSelectRegion(region)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{region.name}</p>
                  <p className="text-xs text-muted-foreground">Default fee: GH₵{region.default_shipping_fee.toFixed(2)}</p>
                </div>
                <Badge variant={region.is_active ? "secondary" : "destructive"} className="text-xs">
                  {region.is_active ? "Active" : "Inactive"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Region Detail / Cities */}
      {selectedRegion ? (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{selectedRegion.name}</CardTitle>
              <CardDescription>Manage shipping fees and cities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Default Region Fee */}
              <div className="flex items-end gap-3">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Default Shipping Fee (GH₵)</Label>
                  <Input type="number" value={editRegionFee} onChange={(e) => setEditRegionFee(e.target.value)} />
                </div>
                <Button size="sm" onClick={handleUpdateRegionFee}>Save</Button>
              </div>

              <Separator />

              {/* Cities */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Cities & Towns</h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {cities.map((city) => (
                    <div key={city.id} className="flex items-center gap-2 p-2 bg-secondary/50 rounded">
                      <span className="flex-1 text-sm font-medium">{city.name}</span>
                      <Input
                        type="number"
                        placeholder="Region default"
                        className="w-28 text-xs"
                        defaultValue={city.shipping_fee ?? ""}
                        onBlur={(e) => handleUpdateCityFee(city, e.target.value)}
                      />
                      <Button variant="ghost" size="sm" className="text-destructive h-8 w-8 p-0" onClick={() => handleDeleteCity(city.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Add City */}
                <div className="flex items-end gap-2 mt-3 pt-3 border-t">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">New City</Label>
                    <Input placeholder="City name" value={newCityName} onChange={(e) => setNewCityName(e.target.value)} />
                  </div>
                  <div className="w-28 space-y-1">
                    <Label className="text-xs">Fee (GH₵)</Label>
                    <Input type="number" placeholder="Optional" value={newCityFee} onChange={(e) => setNewCityFee(e.target.value)} />
                  </div>
                  <Button size="sm" onClick={handleAddCity} disabled={addingCity}>
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground py-12">
          <p className="text-sm">Select a region to manage its cities and fees</p>
        </div>
      )}
    </div>
  );
};

// ─── Admin Tab Imports ─────────────────────────────────────────────────────────
import AdminReviewsTab from "@/components/admin/AdminReviewsTab";
import AdminVouchersTab from "@/components/admin/AdminVouchersTab";
import AdminSupportTab from "@/components/admin/AdminSupportTab";
import AdminProductImages from "@/components/admin/AdminProductImages";

// ─── Stats Overview ───────────────────────────────────────────────────────────
const StatsOverview = () => {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, pending: 0, products: 0, soldProducts: 0 });

  const fetchStats = async () => {
    const [ordersRes, overridesRes] = await Promise.all([
      supabase.from("orders").select("total, status"),
      supabase.from("product_overrides").select("product_id, product_status"),
    ]);
    const orders = ordersRes.data || [];
    const revenue = orders
      .filter(o => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const pending = orders.filter(o => o.status === "pending").length;
    const overrides = overridesRes.data || [];
    const soldProducts = overrides.filter((o: any) => o.product_status === "sold").length;
    setStats({ orders: orders.length, revenue, pending, products: overrides.length, soldProducts });
  };

  useEffect(() => { fetchStats(); }, []);

  // Real-time stats refresh
  useEffect(() => {
    const channel = supabase
      .channel('admin-stats-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchStats();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_reviews' }, () => {
        fetchStats();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const statCards = [
    { label: "Total Orders", value: stats.orders, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: "Revenue", value: `GH₵${stats.revenue.toFixed(0)}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-500/10" },
    { label: "Pending Orders", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-500/10" },
    { label: "Sold / Hidden", value: stats.soldProducts, icon: EyeOff, color: "text-red-600", bg: "bg-red-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((s) => (
        <Card key={s.label}>
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${s.bg}`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
            <div><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      navigate("/admin/login?next=/admin", { replace: true });
      return;
    }

    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/account", { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage inventory, orders, shipping, and tracking</p>
        </div>

        <StatsOverview />

        <Tabs defaultValue="orders" className="mt-8">
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="orders" className="gap-2"><ShoppingCart className="w-4 h-4" /> Orders</TabsTrigger>
            <TabsTrigger value="products" className="gap-2"><Package className="w-4 h-4" /> Inventory</TabsTrigger>
            <TabsTrigger value="shipping" className="gap-2"><MapPin className="w-4 h-4" /> Shipping</TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2"><Star className="w-4 h-4" /> Reviews</TabsTrigger>
            <TabsTrigger value="vouchers" className="gap-2"><Tag className="w-4 h-4" /> Vouchers</TabsTrigger>
            <TabsTrigger value="support" className="gap-2"><MessageCircle className="w-4 h-4" /> Support</TabsTrigger>
          </TabsList>

          <TabsContent value="orders"><OrdersTab /></TabsContent>
          <TabsContent value="products"><ProductsTab /></TabsContent>
          <TabsContent value="shipping"><ShippingTab /></TabsContent>
          <TabsContent value="reviews"><AdminReviewsTab /></TabsContent>
          <TabsContent value="vouchers"><AdminVouchersTab /></TabsContent>
          <TabsContent value="support"><AdminSupportTab /></TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
