import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tag, Plus, Trash2, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";

interface Voucher {
  id: string;
  code: string;
  discount_percent: number;
  is_active: boolean;
  max_uses: number | null;
  used_count: number;
  min_order_amount: number;
  expires_at: string | null;
  created_at: string;
}

const generateCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "MAGGS";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

const AdminVouchersTab = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState(generateCode());
  const [newDiscount, setNewDiscount] = useState("20");
  const [newMaxUses, setNewMaxUses] = useState("");
  const [newMinOrder, setNewMinOrder] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => { fetchVouchers(); }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    const { data } = await supabase.from("vouchers").select("*").order("created_at", { ascending: false });
    setVouchers((data as any as Voucher[]) || []);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newCode.trim()) { toast.error("Enter a voucher code"); return; }
    setCreating(true);
    const { error } = await supabase.from("vouchers").insert({
      code: newCode.trim().toUpperCase(),
      discount_percent: parseFloat(newDiscount) || 20,
      max_uses: newMaxUses ? parseInt(newMaxUses) : null,
      min_order_amount: newMinOrder ? parseFloat(newMinOrder) : 0,
    } as any);
    if (error) { toast.error(error.message.includes("duplicate") ? "Code already exists" : "Failed to create"); }
    else { toast.success("Voucher created!"); setNewCode(generateCode()); fetchVouchers(); }
    setCreating(false);
  };

  const handleToggle = async (v: Voucher) => {
    await supabase.from("vouchers").update({ is_active: !v.is_active } as any).eq("id", v.id);
    fetchVouchers();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("vouchers").delete().eq("id", id);
    toast.success("Voucher deleted");
    fetchVouchers();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied: ${code}`);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      {/* Create New Voucher */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2"><Tag className="w-5 h-5" /> Create Voucher</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Code</Label>
              <div className="flex gap-1">
                <Input value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())} className="text-sm font-mono" />
                <Button size="sm" variant="ghost" onClick={() => setNewCode(generateCode())} title="Generate new code">🔄</Button>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Discount %</Label>
              <Input type="number" value={newDiscount} onChange={(e) => setNewDiscount(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Max Uses</Label>
              <Input type="number" placeholder="Unlimited" value={newMaxUses} onChange={(e) => setNewMaxUses(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Min Order (GH₵)</Label>
              <Input type="number" placeholder="0" value={newMinOrder} onChange={(e) => setNewMinOrder(e.target.value)} />
            </div>
          </div>
          <Button onClick={handleCreate} disabled={creating} className="gap-2">
            <Plus className="w-4 h-4" /> Create Voucher
          </Button>
        </CardContent>
      </Card>

      {/* Vouchers List */}
      <div className="space-y-3">
        {vouchers.map((v) => (
          <Card key={v.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold tracking-wider">{v.code}</span>
                  <button onClick={() => copyCode(v.code)} className="text-muted-foreground hover:text-foreground"><Copy className="w-3.5 h-3.5" /></button>
                  <Badge className={v.is_active ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}>
                    {v.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {v.discount_percent}% off · Used {v.used_count}{v.max_uses ? `/${v.max_uses}` : ""} times
                  {v.min_order_amount > 0 ? ` · Min GH₵${v.min_order_amount}` : ""}
                </p>
              </div>
              <Switch checked={v.is_active} onCheckedChange={() => handleToggle(v)} />
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(v.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
        {vouchers.length === 0 && <p className="text-center text-muted-foreground py-8">No vouchers yet. Create one above!</p>}
      </div>
    </div>
  );
};

export default AdminVouchersTab;
