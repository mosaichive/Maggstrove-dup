import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Package } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import type { CartItem } from "@/context/ShopContext";

interface OrderState {
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shipping: { fullName: string; email: string; address: string; city: string; region: string; country: string };
  paymentMethod: string;
}

const paymentLabels: Record<string, string> = {
  mobile_money: "Mobile Money",
  card: "Credit / Debit Card",
  cash: "Cash on Delivery",
  cash_on_delivery: "Cash on Delivery",
  "paystack:mobile_money": "Paystack Mobile Money",
  "paystack:card": "Paystack Card",
  "paystack:bank_transfer": "Paystack Bank Transfer",
};

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useShop();
  const order = location.state as OrderState | undefined;

  // Clear the cart after arriving on confirmation
  useEffect(() => {
    if (order) {
      cartItems.forEach((item) => removeFromCart(item.id));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">No order found</h1>
            <Button onClick={() => navigate("/")} className="uppercase tracking-wider text-xs font-bold">
              Back to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 md:py-16 max-w-3xl">
          {/* Success Header */}
          <div className="text-center space-y-4 mb-10">
            <CheckCircle2 className="w-14 h-14 mx-auto text-accent" />
            <h1 className="text-2xl md:text-3xl font-bold">Thank You for Your Order!</h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              A confirmation email has been sent to <span className="font-medium text-foreground">{order.shipping.email}</span>
            </p>
          </div>

          {/* Order Details Card */}
          <div className="border border-border p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Order Number</p>
                <p className="text-lg font-bold tracking-wide">{order.orderNumber}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4" />
                <span>Estimated delivery: 3–7 business days</span>
              </div>
            </div>

            <Separator />

            {/* Items */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest">Items Ordered</h2>
              {order.items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="w-16 h-20 bg-secondary flex-shrink-0 overflow-hidden">
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

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>GH₵{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shippingCost === 0 ? "FREE" : `GH₵${order.shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <span>{paymentLabels[order.paymentMethod] || order.paymentMethod}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between text-base font-bold">
              <span>Total Paid</span>
              <span>GH₵{order.total.toFixed(2)}</span>
            </div>

            {/* Shipping Address */}
            <Separator />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-2">Shipping To</h2>
              <p className="text-sm text-muted-foreground">
                {order.shipping.fullName}<br />
                {order.shipping.address}<br />
                {order.shipping.city}{order.shipping.region ? `, ${order.shipping.region}` : ""}<br />
                {order.shipping.country}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <Button asChild className="uppercase tracking-wider text-xs font-bold h-12 px-10">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
