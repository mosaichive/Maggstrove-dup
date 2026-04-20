import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";
import { GHANA_CITIES_BY_REGION, GHANA_REGION_NAMES } from "@/data/ghanaShipping";

interface AddAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onAdded: () => void;
}

const AddAddressDialog = ({ open, onOpenChange, userId, onAdded }: AddAddressDialogProps) => {
  const [form, setForm] = useState({
    label: "Home",
    full_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Ghana",
    phone: "",
    is_default: false,
    gps_lat: null as number | null,
    gps_lng: null as number | null,
  });
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    if (form.state && GHANA_CITIES_BY_REGION[form.state]) {
      setAvailableCities(GHANA_CITIES_BY_REGION[form.state]);
    } else {
      setAvailableCities([]);
    }
  }, [form.state]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm(f => ({
          ...f,
          gps_lat: position.coords.latitude,
          gps_lng: position.coords.longitude,
        }));
        toast.success("Location pinned successfully!");
        setLocating(false);
      },
      (error) => {
        toast.error("Failed to get location. Please enable location access.");
        setLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.address_line1.trim() || !form.city.trim()) {
      toast.error("Address and city are required");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("shipping_addresses").insert({
        user_id: userId,
        label: form.label.trim(),
        full_name: form.full_name.trim() || null,
        address_line1: form.address_line1.trim(),
        address_line2: form.address_line2.trim() || null,
        city: form.city.trim(),
        state: form.state.trim() || null,
        postal_code: form.postal_code.trim() || null,
        country: form.country.trim(),
        phone: form.phone.trim() || null,
        is_default: form.is_default,
        gps_lat: form.gps_lat,
        gps_lng: form.gps_lng,
      } as any);
      if (error) throw error;
      toast.success("Address added!");
      onAdded();
      onOpenChange(false);
      setForm({
        label: "Home", full_name: "", address_line1: "", address_line2: "",
        city: "", state: "", postal_code: "", country: "Ghana", phone: "", is_default: false,
        gps_lat: null, gps_lng: null,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to add address");
    } finally {
      setSaving(false);
    }
  };

  const set = (key: string, val: string | boolean) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-background max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">Add Shipping Address</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold uppercase tracking-wider">Label</Label>
              <Input value={form.label} onChange={(e) => set("label", e.target.value)} placeholder="Home" className="h-10 bg-secondary border-border" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold uppercase tracking-wider">Full Name</Label>
              <Input value={form.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="Recipient name" className="h-10 bg-secondary border-border" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold uppercase tracking-wider">Address Line 1 *</Label>
            <Input value={form.address_line1} onChange={(e) => set("address_line1", e.target.value)} placeholder="Street address" className="h-10 bg-secondary border-border" required />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold uppercase tracking-wider">Address Line 2</Label>
            <Input value={form.address_line2} onChange={(e) => set("address_line2", e.target.value)} placeholder="Apartment, suite, etc." className="h-10 bg-secondary border-border" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
                <Label className="text-xs font-semibold uppercase tracking-wider">Region *</Label>
              <Select value={form.state} onValueChange={(v) => { set("state", v); set("city", ""); }}>
                <SelectTrigger className="h-10 bg-secondary border-border"><SelectValue placeholder="Select region" /></SelectTrigger>
                <SelectContent>
                  {GHANA_REGION_NAMES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold uppercase tracking-wider">City *</Label>
              {availableCities.length > 0 ? (
                <Select value={form.city} onValueChange={(v) => set("city", v)}>
                  <SelectTrigger className="h-10 bg-secondary border-border"><SelectValue placeholder="Select city" /></SelectTrigger>
                  <SelectContent>
                    {availableCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="City" className="h-10 bg-secondary border-border" required />
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold uppercase tracking-wider">Postal Code</Label>
              <Input value={form.postal_code} onChange={(e) => set("postal_code", e.target.value)} placeholder="00233" className="h-10 bg-secondary border-border" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold uppercase tracking-wider">Country</Label>
              <Input value={form.country} onChange={(e) => set("country", e.target.value)} className="h-10 bg-secondary border-border" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold uppercase tracking-wider">Phone</Label>
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+233 XX XXX XXXX" className="h-10 bg-secondary border-border" />
          </div>

          {/* GPS Location */}
          <div className="space-y-2 p-3 bg-secondary/50 border border-border rounded-lg">
            <Label className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3" /> GPS Location
            </Label>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" size="sm" onClick={handleGetLocation} disabled={locating} className="gap-1">
                <Navigation className="w-3 h-3" />
                {locating ? "Locating..." : "Pin My Location"}
              </Button>
              {form.gps_lat && form.gps_lng && (
                <span className="text-xs text-accent font-medium">
                  📍 {form.gps_lat.toFixed(6)}, {form.gps_lng.toFixed(6)}
                </span>
              )}
            </div>
            {form.gps_lat && form.gps_lng && (
              <div className="mt-2 rounded overflow-hidden border border-border">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${form.gps_lng - 0.005},${form.gps_lat - 0.005},${form.gps_lng + 0.005},${form.gps_lat + 0.005}&layer=mapnik&marker=${form.gps_lat},${form.gps_lng}`}
                  className="w-full h-[150px] border-0"
                  title="Location Map"
                />
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.is_default} onChange={(e) => set("is_default", e.target.checked)} className="accent-primary" />
            Set as default address
          </label>
          <Button type="submit" disabled={saving} className="w-full h-12 text-sm font-bold uppercase tracking-wider">
            {saving ? "Saving..." : "Save Address"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAddressDialog;
