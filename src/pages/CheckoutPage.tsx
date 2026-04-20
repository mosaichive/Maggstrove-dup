import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useShippingLocations } from "@/hooks/useShippingLocations";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Lock, CreditCard, Banknote, Smartphone, Star, ShieldCheck, Package, MapPin, Tag } from "lucide-react";
import { toast } from "sonner";
import mtnLogo from "@/assets/momo-mtn.png";
import telecelLogo from "@/assets/momo-telecel.png";
import airteltigoLogo from "@/assets/momo-airteltigo.png";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface SavedPayment {
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

const NETWORK_LOGOS: Record<string, string> = { mtn: mtnLogo, telecel: telecelLogo, airteltigo: airteltigoLogo };
const NETWORK_LABELS: Record<string, string> = { mtn: "MTN", telecel: "Telecel", airteltigo: "AirtelTigo" };

const CheckoutPage = () => {
  const { cartItems, cartCount, clearCart } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    cityId: "",
    region: "",
    regionId: "",
    country: "Ghana",
  });

  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [fulfillmentType, setFulfillmentType] = useState<"delivery" | "pickup">("delivery");
  const [savedPayments, setSavedPayments] = useState<SavedPayment[]>([]);
  const [selectedSavedPayment, setSelectedSavedPayment] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paystackPublicKey, setPaystackPublicKey] = useState<string | null>(null);
  const [paystackError, setPaystackError] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [applyingVoucher, setApplyingVoucher] = useState(false);

  const {
    regions,
    cities,
    loadingRegions,
    loadingCities,
    fetchCitiesByRegion,
    getShippingFee,
  } = useShippingLocations();

  // Load Paystack V2 script dynamically
  useEffect(() => {
    const existingV1 = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
    if (existingV1) existingV1.remove();

    if (!document.querySelector('script[src="https://js.paystack.co/v2/inline.js"]')) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v2/inline.js";
      script.async = true;
      script.onload = () => console.log("Paystack V2 script loaded");
      script.onerror = () => console.error("Failed to load Paystack script");
      document.head.appendChild(script);
    }
  }, []);

  // Load Paystack config
  useEffect(() => {
    supabase.functions
      .invoke("verify-paystack", { body: { action: "get_config" } })
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to load Paystack config:", error);
          setPaystackError("Paystack is not available yet. Deploy the Supabase verify-paystack function and add both PAYSTACK_PUBLIC_KEY and PAYSTACK_SECRET_KEY.");
          return;
        }

        if (data?.configured && data?.publicKey) {
          setPaystackPublicKey(data.publicKey);
          setPaystackError(null);
          return;
        }

        setPaystackError(
          "Paystack is not fully configured. Add PAYSTACK_PUBLIC_KEY and PAYSTACK_SECRET_KEY to your Supabase Edge Function secrets.",
        );
      });
  }, []);

  // Load saved payment methods
  useEffect(() => {
    if (user) {
      supabase
        .from("payment_methods")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .then(({ data }) => {
          if (data && data.length > 0) {
            setSavedPayments(data as SavedPayment[]);
          }
        });
    }
  }, [user]);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  // Dynamic shipping cost based on selected region/city and fulfillment type
  const shippingCost = (() => {
    if (fulfillmentType === "pickup") return 0; // No shipping for pickup
    if (subtotal >= 500) return 0; // Free shipping over GH₵500
    if (shipping.regionId && shipping.cityId) {
      return getShippingFee(shipping.regionId, shipping.cityId);
    }
    if (shipping.regionId) {
      const region = regions.find((r) => r.id === shipping.regionId);
      return region?.default_shipping_fee ?? 15;
    }
    return 15; // default
  })();

  const discountAmount = voucherApplied ? Math.round((subtotal * voucherDiscount) / 100 * 100) / 100 : 0;
  const total = subtotal + shippingCost - discountAmount;

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setApplyingVoucher(true);
    const { data } = await supabase
      .from("vouchers")
      .select("*")
      .eq("code", voucherCode.trim().toUpperCase())
      .eq("is_active", true)
      .maybeSingle();

    if (!data) {
      toast.error("Invalid or expired voucher code");
      setApplyingVoucher(false);
      return;
    }

    const voucher = data as any;
    if (voucher.max_uses && voucher.used_count >= voucher.max_uses) {
      toast.error("This voucher has reached its usage limit");
      setApplyingVoucher(false);
      return;
    }
    if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
      toast.error("This voucher has expired");
      setApplyingVoucher(false);
      return;
    }
    if (voucher.min_order_amount && subtotal < voucher.min_order_amount) {
      toast.error(`Minimum order of GH₵${voucher.min_order_amount} required`);
      setApplyingVoucher(false);
      return;
    }

    setVoucherDiscount(voucher.discount_percent);
    setVoucherApplied(true);
    toast.success(`${voucher.discount_percent}% discount applied!`);
    setApplyingVoucher(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Your bag is empty</h1>
            <p className="text-muted-foreground text-sm">Add some items before checking out.</p>
            <Button onClick={() => navigate("/women/dresses")} className="uppercase tracking-wider text-xs font-bold">
              Shop Now
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleRegionChange = (regionId: string) => {
    const region = regions.find((r) => r.id === regionId);
    setShipping((prev) => ({
      ...prev,
      regionId,
      region: region?.name || "",
      cityId: "",
      city: "",
    }));
    fetchCitiesByRegion(regionId);
  };

  const handleCityChange = (cityId: string) => {
    const city = cities.find((c) => c.id === cityId);
    setShipping((prev) => ({
      ...prev,
      cityId,
      city: city?.name || "",
    }));
  };

  const saveOrder = async (paymentRef: string, paymentChannel: string) => {
    const orderNumber = `MG-${Date.now().toString(36).toUpperCase()}`;

    if (user) {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          subtotal,
          shipping_cost: shippingCost,
          total,
          status: "pending",
          payment_method: `paystack:${paymentChannel}`,
          shipping_name: shipping.fullName,
          shipping_email: shipping.email,
          shipping_phone: shipping.phone,
          shipping_address: fulfillmentType === "pickup" ? "Pickup" : shipping.address,
          shipping_city: fulfillmentType === "pickup" ? "Pickup" : shipping.city,
          shipping_region: fulfillmentType === "pickup" ? null : shipping.region,
          shipping_country: shipping.country,
          fulfillment_type: fulfillmentType,
          voucher_code: voucherApplied ? voucherCode.toUpperCase() : null,
          discount_amount: discountAmount,
        } as any)
        .select("id")
        .single();

      if (orderError) throw orderError;

      // Increment voucher used_count
      if (voucherApplied && voucherCode) {
        const { data: v } = await supabase.from("vouchers").select("used_count").eq("code", voucherCode.toUpperCase()).single();
        if (v) {
          await supabase.from("vouchers").update({ used_count: (v as any).used_count + 1 } as any).eq("code", voucherCode.toUpperCase());
        }
      }

      const items = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        brand: item.brand,
        image: item.image,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(items);
      if (itemsError) throw itemsError;
    }

    // Send notifications (non-blocking)
    try {
      await supabase.functions.invoke("order-notification", {
        body: {
          orderNumber,
          customerEmail: shipping.email,
          customerName: shipping.fullName,
          items: cartItems.map((i) => ({
            product_name: i.name,
            brand: i.brand,
            size: i.size,
            quantity: i.quantity,
            price: i.price,
          })),
          subtotal,
          shippingCost,
          total,
          paymentMethod: `paystack:${paymentChannel}`,
          shippingAddress: `${shipping.address}, ${shipping.city}${shipping.region ? `, ${shipping.region}` : ""}, ${shipping.country}`,
        },
      });
    } catch {
      console.warn("Notification failed, order still placed");
    }

    return orderNumber;
  };

  const validateShipping = () => {
    if (!shipping.fullName || !shipping.email || !shipping.phone) {
      toast.error("Please fill in name, email, and phone");
      return false;
    }
    if (fulfillmentType === "delivery" && (!shipping.address || !shipping.regionId || !shipping.cityId)) {
      toast.error("Please fill in all shipping fields including region and city");
      return false;
    }
    return true;
  };

  const handlePaystackPayment = async () => {
    if (!validateShipping()) return;

    if (!paystackPublicKey || paystackError) {
      toast.error(paystackError || "Payment system is loading, please try again");
      return;
    }

    setIsSubmitting(true);

    const waitForPaystack = (): Promise<boolean> => {
      if (window.PaystackPop) return Promise.resolve(true);
      return new Promise((resolve) => {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (window.PaystackPop) {
            clearInterval(interval);
            resolve(true);
          } else if (attempts > 20) {
            clearInterval(interval);
            resolve(false);
          }
        }, 200);
      });
    };

    const paystackReady = await waitForPaystack();
    if (!paystackReady) {
      toast.error("Payment system failed to load. Please refresh the page.");
      setIsSubmitting(false);
      return;
    }

    try {
      const paystack = new window.PaystackPop();
      paystack.newTransaction({
        key: paystackPublicKey,
        email: shipping.email,
        amount: Math.round(total * 100),
        currency: "GHS",
        channels: ["mobile_money", "card"],
        ref: "MG-" + Date.now().toString(36).toUpperCase(),
        metadata: {
          custom_fields: [
            { display_name: "Customer Name", variable_name: "customer_name", value: shipping.fullName },
            { display_name: "Phone", variable_name: "phone", value: shipping.phone },
            { display_name: "Address", variable_name: "address", value: `${shipping.address}, ${shipping.city}` },
          ],
        },
        onSuccess: async (response: { reference: string }) => {
          try {
            const { data: verification } = await supabase.functions.invoke("verify-paystack", {
              body: {
                action: "verify",
                reference: response.reference,
                expectedAmount: total,
                expectedCurrency: "GHS",
              },
            });

            if (verification?.verified) {
              const orderNumber = await saveOrder(response.reference, verification.channel || "paystack");
              clearCart();
              navigate("/order-confirmation", {
                state: {
                  orderNumber,
                  items: cartItems,
                  subtotal,
                  shippingCost,
                  total,
                  shipping,
                  paymentMethod: `Paystack (${verification.channel || "Online"})`,
                  paymentReference: response.reference,
                },
              });
            } else {
              toast.error(verification?.message || "Payment verification failed");
              setIsSubmitting(false);
            }
          } catch (err: any) {
            toast.error(err.message || "Payment verification failed");
            setIsSubmitting(false);
          }
        },
        onCancel: () => {
          setIsSubmitting(false);
        },
      });
    } catch (err: any) {
      toast.error("Failed to open payment popup. Please try again.");
      console.error("Paystack setup error:", err);
      setIsSubmitting(false);
    }
  };

  const handleCashOnDelivery = async () => {
    if (!validateShipping()) return;

    setIsSubmitting(true);
    try {
      const orderNumber = await saveOrder("cash", "cash_on_delivery");
      clearCart();
      navigate("/order-confirmation", {
        state: {
          orderNumber,
          items: cartItems,
          subtotal,
          shippingCost,
          total,
          shipping,
          paymentMethod: "Cash on Delivery",
        },
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "paystack") {
      handlePaystackPayment();
    } else if (paymentMethod === "cash") {
      handleCashOnDelivery();
    }
  };

  const updateField = (field: string, value: string) =>
    setShipping((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Left — Forms */}
              <div className="lg:col-span-3 space-y-8">
                {/* Fulfillment Type */}
                <section className="space-y-5">
                  <h2 className="text-sm font-bold uppercase tracking-widest">Fulfillment Method</h2>
                  <Separator />
                  <RadioGroup value={fulfillmentType} onValueChange={(v) => setFulfillmentType(v as "delivery" | "pickup")} className="flex gap-4">
                    <label className={`flex-1 flex items-center gap-3 border p-4 cursor-pointer transition-colors ${fulfillmentType === "delivery" ? "border-foreground bg-secondary" : "border-border hover:border-muted-foreground"}`}>
                      <RadioGroupItem value="delivery" />
                      <Package className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Delivery</p>
                        <p className="text-xs text-muted-foreground">We deliver to your address</p>
                      </div>
                    </label>
                    <label className={`flex-1 flex items-center gap-3 border p-4 cursor-pointer transition-colors ${fulfillmentType === "pickup" ? "border-foreground bg-secondary" : "border-border hover:border-muted-foreground"}`}>
                      <RadioGroupItem value="pickup" />
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Pickup</p>
                        <p className="text-xs text-muted-foreground">Pick up from our store</p>
                      </div>
                    </label>
                  </RadioGroup>
                  {fulfillmentType === "pickup" && (
                    <div className="p-3 bg-accent/10 border border-accent/20 text-sm text-accent font-medium">
                      No delivery fee — pick up your order from our store!
                    </div>
                  )}
                </section>

                {/* Shipping Info */}
                <section className="space-y-5">
                  <h2 className="text-sm font-bold uppercase tracking-widest">
                    {fulfillmentType === "delivery" ? "Shipping Information" : "Contact Information"}
                  </h2>
                  <Separator />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input id="fullName" required value={shipping.fullName} onChange={(e) => updateField("fullName", e.target.value)} placeholder="Maame Nyarkoah" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" required value={shipping.email} onChange={(e) => updateField("email", e.target.value)} placeholder="you@email.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input id="phone" type="tel" required value={shipping.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+233 XX XXX XXXX" />
                    </div>

                    {fulfillmentType === "delivery" && (
                      <>
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="address">Address *</Label>
                          <Input id="address" required value={shipping.address} onChange={(e) => updateField("address", e.target.value)} placeholder="Street address" />
                        </div>
                        <div className="space-y-2">
                          <Label>Region *</Label>
                          <Select value={shipping.regionId} onValueChange={handleRegionChange}>
                            <SelectTrigger>
                              <SelectValue placeholder={loadingRegions ? "Loading..." : "Select region"} />
                            </SelectTrigger>
                            <SelectContent>
                              {regions.map((r) => (
                                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>City *</Label>
                          <Select value={shipping.cityId} onValueChange={handleCityChange} disabled={!shipping.regionId}>
                            <SelectTrigger>
                              <SelectValue placeholder={loadingCities ? "Loading..." : shipping.regionId ? "Select city" : "Select region first"} />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map((c) => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>

                  {fulfillmentType === "delivery" && shipping.regionId && (
                    <div className="p-3 bg-secondary/50 border border-border rounded text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Delivery fee to {shipping.city || shipping.region}:</span>
                        <span className="font-semibold">
                          {subtotal >= 500 ? (
                            <span className="text-accent">FREE (Order over GH₵500)</span>
                          ) : (
                            `GH₵${shippingCost.toFixed(2)}`
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </section>

                {/* Payment */}
                <section className="space-y-5">
                  <h2 className="text-sm font-bold uppercase tracking-widest">Payment Method</h2>
                  <Separator />

                  <RadioGroup value={paymentMethod} onValueChange={(v) => { setPaymentMethod(v); setSelectedSavedPayment(null); }} className="space-y-3">
                    <label
                      className={`flex items-center gap-4 border p-4 cursor-pointer transition-colors ${
                        paymentMethod === "paystack" ? "border-foreground bg-secondary" : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <RadioGroupItem value="paystack" />
                      <ShieldCheck className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Pay with Paystack</p>
                        <p className="text-xs text-muted-foreground">Mobile Money (MTN, Telecel, AirtelTigo) or Card (Visa, Mastercard)</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <img src={mtnLogo} alt="MTN" className="w-5 h-5 rounded-full object-cover" />
                        <img src={telecelLogo} alt="Telecel" className="w-5 h-5 rounded-full object-cover" />
                        <img src={airteltigoLogo} alt="AirtelTigo" className="w-5 h-5 rounded-full object-cover" />
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-4 border p-4 cursor-pointer transition-colors ${
                        paymentMethod === "cash" ? "border-foreground bg-secondary" : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <RadioGroupItem value="cash" />
                      <Banknote className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Cash on Delivery</p>
                        <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
                      </div>
                    </label>
                  </RadioGroup>

                  {paymentMethod === "paystack" && (
                    <>
                      <div className="flex items-center gap-2 p-3 bg-secondary/50 border border-border rounded text-xs text-muted-foreground">
                        <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>You'll be securely redirected to Paystack to complete your payment via Mobile Money or Card.</span>
                      </div>
                      {paystackError ? (
                        <div className="rounded border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                          {paystackError}
                        </div>
                      ) : null}
                    </>
                  )}
                </section>
              </div>

              {/* Right — Order Summary */}
              <div className="lg:col-span-2">
                <div className="bg-secondary p-6 space-y-5 sticky top-32">
                  <h2 className="text-sm font-bold uppercase tracking-widest">
                    Order Summary ({cartCount} {cartCount === 1 ? "item" : "items"})
                  </h2>
                  <Separator />

                  <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-3">
                        <div className="w-16 h-20 bg-background flex-shrink-0 overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.brand}</p>
                          <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Size: {item.size} · Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold whitespace-nowrap">
                          GH₵{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Voucher Code */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> Discount Code
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter voucher code"
                        value={voucherCode}
                        onChange={(e) => { setVoucherCode(e.target.value); if (voucherApplied) { setVoucherApplied(false); setVoucherDiscount(0); } }}
                        className="text-sm uppercase"
                        disabled={applyingVoucher}
                      />
                      <Button type="button" size="sm" variant="outline" onClick={handleApplyVoucher} disabled={applyingVoucher || !voucherCode.trim()}>
                        Apply
                      </Button>
                    </div>
                    {voucherApplied && (
                      <p className="text-xs text-accent font-medium">✓ {voucherDiscount}% discount applied!</p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">GH₵{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {fulfillmentType === "pickup" ? "Pickup" : shippingCost === 0 ? "FREE" : `GH₵${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-accent">
                        <span>Discount ({voucherDiscount}%)</span>
                        <span className="font-medium">−GH₵{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>GH₵{total.toFixed(2)}</span>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-sm font-bold uppercase tracking-wider"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Processing…
                      </span>
                    ) : paymentMethod === "paystack" ? (
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Pay GH₵{total.toFixed(2)} with Paystack
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Place Order
                      </span>
                    )}
                  </Button>

                  <p className="text-[11px] text-muted-foreground text-center">
                    Your payment information is secure and encrypted
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
