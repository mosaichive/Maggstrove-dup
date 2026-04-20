import { Truck, RotateCcw, Shield, CreditCard } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over GH₵500",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "3-day return policy",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure checkout",
  },
  {
    icon: CreditCard,
    title: "Buy Now, Enjoy Bonus On Next Purchase",
    description: "Flexible payment options",
  },
];

const FeatureBanner = () => {
  return (
    <section className="py-8 md:py-12 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <feature.icon className="w-8 h-8 text-foreground" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureBanner;
