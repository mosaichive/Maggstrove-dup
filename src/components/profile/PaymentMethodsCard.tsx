import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Star } from "lucide-react";
import { toast } from "sonner";
import mtnLogo from "@/assets/momo-mtn.png";
import telecelLogo from "@/assets/momo-telecel.png";
import airteltigoLogo from "@/assets/momo-airteltigo.png";

export interface PaymentMethod {
  id: string;
  label: string;
  card_type: string;
  last_four: string;
  expiry_month: number;
  expiry_year: number;
  holder_name: string;
  is_default: boolean;
  momo_network?: string | null;
  phone_number?: string | null;
}

interface Props {
  userId: string;
  methods: PaymentMethod[];
  onRefresh: () => void;
}

const MOMO_NETWORKS = [
  { value: "mtn", label: "MTN", logo: mtnLogo },
  { value: "telecel", label: "Telecel", logo: telecelLogo },
  { value: "airteltigo", label: "AirtelTigo", logo: airteltigoLogo },
];

const CARD_TYPES = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "momo", label: "Mobile Money" },
];

const PaymentMethodsCard = ({ userId, methods, onRefresh }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [form, setForm] = useState({
    label: "My Card",
    card_type: "visa",
    last_four: "",
    expiry_month: "",
    expiry_year: "",
    holder_name: "",
    is_default: false,
    momo_network: "",
    phone_number: "",
  });
  const [saving, setSaving] = useState(false);

  const isMomo = form.card_type === "momo";

  const resetForm = () => {
    setForm({ label: "My Card", card_type: "visa", last_four: "", expiry_month: "", expiry_year: "", holder_name: "", is_default: false, momo_network: "", phone_number: "" });
    setEditingMethod(null);
  };

  const openAdd = () => { resetForm(); setDialogOpen(true); };

  const openEdit = (m: PaymentMethod) => {
    setEditingMethod(m);
    setForm({
      label: m.label,
      card_type: m.card_type,
      last_four: m.last_four || "",
      expiry_month: m.expiry_month ? String(m.expiry_month) : "",
      expiry_year: m.expiry_year ? String(m.expiry_year) : "",
      holder_name: m.holder_name,
      is_default: m.is_default,
      momo_network: m.momo_network || "",
      phone_number: m.phone_number || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (isMomo) {
      if (!form.momo_network) { toast.error("Please select a network"); return; }
      if (!form.phone_number || form.phone_number.length < 10) { toast.error("Please enter a valid phone number"); return; }
      if (!form.holder_name) { toast.error("Please enter account holder name"); return; }
    } else {
      if (!form.last_four || form.last_four.length !== 4 || !form.holder_name || !form.expiry_month || !form.expiry_year) {
        toast.error("Please fill all required fields correctly"); return;
      }
    }

    setSaving(true);
    try {
      const payload: any = {
        user_id: userId,
        label: form.label.trim() || (isMomo ? "My MoMo" : "My Card"),
        card_type: form.card_type,
        holder_name: form.holder_name.trim(),
        is_default: form.is_default,
        updated_at: new Date().toISOString(),
        momo_network: isMomo ? form.momo_network : null,
        phone_number: isMomo ? form.phone_number.trim() : null,
        last_four: isMomo ? form.phone_number.trim().slice(-4) : form.last_four,
        expiry_month: isMomo ? null : parseInt(form.expiry_month),
        expiry_year: isMomo ? null : parseInt(form.expiry_year),
      };

      if (form.is_default) {
        await supabase.from("payment_methods").update({ is_default: false, updated_at: new Date().toISOString() }).eq("user_id", userId);
      }

      if (editingMethod) {
        const { error } = await supabase.from("payment_methods").update(payload).eq("id", editingMethod.id);
        if (error) throw error;
        toast.success("Payment method updated");
      } else {
        const { error } = await supabase.from("payment_methods").insert(payload);
        if (error) throw error;
        toast.success("Payment method added");
      }

      setDialogOpen(false);
      resetForm();
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("payment_methods").delete().eq("id", id);
    toast.success("Payment method removed");
    onRefresh();
  };

  const handleSetDefault = async (id: string) => {
    await supabase.from("payment_methods").update({ is_default: false, updated_at: new Date().toISOString() }).eq("user_id", userId);
    await supabase.from("payment_methods").update({ is_default: true, updated_at: new Date().toISOString() }).eq("id", id);
    toast.success("Default payment method updated");
    onRefresh();
  };

  const getNetworkLogo = (network: string) => MOMO_NETWORKS.find((n) => n.value === network)?.logo;
  const getNetworkLabel = (network: string) => MOMO_NETWORKS.find((n) => n.value === network)?.label || network;

  return (
    <>
      {methods.length > 0 ? (
        <div className="space-y-3">
          {methods.map((m) => (
            <div key={m.id} className="p-3 bg-secondary/50 border border-border text-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  {m.card_type === "momo" && m.momo_network ? (
                    <img src={getNetworkLogo(m.momo_network) || ""} alt={m.momo_network} className="w-5 h-5 rounded-full object-cover" />
                  ) : m.card_type === "momo" ? "📱" : "💳"}
                  {" "}{m.label}
                  {m.is_default && <span className="text-accent text-[10px]">DEFAULT</span>}
                </span>
                <div className="flex items-center gap-2">
                  {!m.is_default && (
                    <button onClick={() => handleSetDefault(m.id)} className="text-xs text-muted-foreground hover:text-foreground" title="Set as default">
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={() => openEdit(m)} className="text-xs text-muted-foreground hover:text-foreground">Edit</button>
                  <button onClick={() => handleDelete(m.id)} className="text-xs text-destructive hover:underline">Remove</button>
                </div>
              </div>
              {m.card_type === "momo" ? (
                <>
                  <p className="text-muted-foreground">
                    {getNetworkLabel(m.momo_network || "")} MoMo · {m.phone_number || `•••• ${m.last_four}`}
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5">{m.holder_name}</p>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">
                    {m.card_type.toUpperCase()} •••• {m.last_four} · Exp {String(m.expiry_month).padStart(2, "0")}/{m.expiry_year}
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5">{m.holder_name}</p>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No saved payment methods.</p>
      )}
      <Button variant="outline" size="sm" className="mt-3" onClick={openAdd}>
        <Plus className="w-4 h-4 mr-1" /> Add Payment Method
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-wider">
              {editingMethod ? "Edit Payment Method" : "Add Payment Method"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder={isMomo ? "My MoMo" : "My Visa Card"} />
            </div>
            <div className="space-y-2">
              <Label>Payment Type</Label>
              <Select value={form.card_type} onValueChange={(v) => setForm({ ...form, card_type: v, label: v === "momo" ? "My MoMo" : "My Card" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CARD_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* MoMo-specific fields */}
            {isMomo && (
              <>
                <div className="space-y-2">
                  <Label>Select Network *</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {MOMO_NETWORKS.map((net) => (
                      <button
                        key={net.value}
                        type="button"
                        onClick={() => setForm({ ...form, momo_network: net.value })}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-lg shadow-sm transition-all ${
                          form.momo_network === net.value
                            ? "border-2 border-foreground bg-secondary shadow-md scale-[1.02]"
                            : "border border-border bg-card hover:shadow-md hover:border-muted-foreground"
                        }`}
                      >
                        <img src={net.logo} alt={net.label} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-[11px] font-medium">{net.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    value={form.phone_number}
                    onChange={(e) => setForm({ ...form, phone_number: e.target.value.replace(/[^\d+\s-]/g, "").slice(0, 15) })}
                    placeholder="0XX XXX XXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Holder Name *</Label>
                  <Input value={form.holder_name} onChange={(e) => setForm({ ...form, holder_name: e.target.value })} placeholder="Full name on MoMo account" />
                </div>
              </>
            )}

            {/* Card-specific fields */}
            {!isMomo && (
              <>
                <div className="space-y-2">
                  <Label>Last 4 Digits *</Label>
                  <Input value={form.last_four} onChange={(e) => setForm({ ...form, last_four: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="1234" maxLength={4} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Expiry Month *</Label>
                    <Input type="number" min={1} max={12} value={form.expiry_month} onChange={(e) => setForm({ ...form, expiry_month: e.target.value })} placeholder="MM" />
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry Year *</Label>
                    <Input type="number" min={2024} max={2040} value={form.expiry_year} onChange={(e) => setForm({ ...form, expiry_year: e.target.value })} placeholder="YYYY" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cardholder Name *</Label>
                  <Input value={form.holder_name} onChange={(e) => setForm({ ...form, holder_name: e.target.value })} placeholder="Full name on card" />
                </div>
              </>
            )}

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} className="rounded border-border" />
              Set as default payment method
            </label>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Saving…" : editingMethod ? "Update" : "Add Payment Method"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentMethodsCard;
