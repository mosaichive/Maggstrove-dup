import InfoPage from "@/components/layout/InfoPage";

const DeliveryPage = () => (
  <InfoPage title="Delivery Info">
    <h2 className="text-xl font-semibold text-foreground mb-3">Delivery Options</h2>
    <ul className="space-y-2 text-muted-foreground">
      <li><strong>Standard Delivery:</strong> 3–5 business days — GH₵15.00</li>
      <li><strong>Express Delivery:</strong> 1–2 business days — GH₵30.00</li>
      <li><strong>Free Delivery:</strong> On orders over GH₵200.00</li>
    </ul>
    <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Tracking Your Order</h2>
    <p className="text-muted-foreground leading-relaxed">Once your order has shipped, you'll receive an email with tracking details. You can also check your order status from your profile dashboard.</p>
  </InfoPage>
);

export default DeliveryPage;
