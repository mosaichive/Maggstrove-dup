import InfoPage from "@/components/layout/InfoPage";

const ReturnsPage = () => (
  <InfoPage title="Returns & Exchanges">
    <p className="text-muted-foreground leading-relaxed">We want you to love your purchase. If something isn't quite right, we're happy to help.</p>
    <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Return Policy</h2>
    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
      <li>Items can be returned within 30 days of delivery</li>
      <li>Items must be unworn, unwashed, and in original packaging with tags attached</li>
      <li>Sale items are final sale and cannot be returned</li>
    </ul>
    <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">How to Return</h2>
    <p className="text-muted-foreground leading-relaxed">Contact our support team at <strong>support@maggstrove.com</strong> to initiate a return. We'll provide a prepaid return label and process your refund within 5–7 business days of receiving the item.</p>
  </InfoPage>
);

export default ReturnsPage;
