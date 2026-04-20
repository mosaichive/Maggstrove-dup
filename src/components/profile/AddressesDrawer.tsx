import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import AddAddressDialog from "./AddAddressDialog";

interface Address {
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
  is_default: boolean | null;
}

interface AddressesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddressesDrawer = ({ open, onOpenChange }: AddressesDrawerProps) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const fetchAddresses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("shipping_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAddresses();
    }
  }, [open]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("shipping_addresses")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Address deleted");
      fetchAddresses();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete address");
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-[420px] flex flex-col p-0 bg-background">
          <SheetHeader className="px-6 py-4 border-b border-border">
            <SheetTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Saved Addresses ({addresses.length})
            </SheetTitle>
          </SheetHeader>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
              <MapPin className="w-16 h-16 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No saved addresses</p>
              <Button
                variant="outline"
                className="uppercase tracking-wider text-xs font-bold"
                onClick={() => setAddDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="pb-4 border-b border-border last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider">{address.label}</p>
                        {address.is_default && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="p-1 text-muted-foreground hover:text-destructive"
                        aria-label="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {address.full_name && (
                      <p className="text-sm font-medium">{address.full_name}</p>
                    )}
                    <p className="text-sm text-muted-foreground">{address.address_line1}</p>
                    {address.address_line2 && (
                      <p className="text-sm text-muted-foreground">{address.address_line2}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {address.city}
                      {address.state && `, ${address.state}`}
                      {address.postal_code && ` ${address.postal_code}`}
                    </p>
                    <p className="text-sm text-muted-foreground">{address.country}</p>
                    {address.phone && (
                      <p className="text-sm text-muted-foreground mt-1">{address.phone}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-border px-6 py-4">
                <Button
                  variant="outline"
                  className="w-full h-11 text-xs font-bold uppercase tracking-wider"
                  onClick={() => setAddDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Address
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {user && (
        <AddAddressDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          userId={user.id}
          onAdded={() => {
            fetchAddresses();
            setAddDialogOpen(false);
          }}
        />
      )}
    </>
  );
};

export default AddressesDrawer;
