import InfoPage from "@/components/layout/InfoPage";

const SupportPage = () => (
  <InfoPage title="Customer Support">
    <p className="text-muted-foreground leading-relaxed">We're here to help! If you have any questions about your order, products, or account, our team is ready to assist.</p>
    <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Contact Us</h2>
    <ul className="space-y-2 text-muted-foreground">
      <li><strong>Email:</strong> support@maggstrove.com</li>
      <li><strong>Phone:</strong> +233 (0) 30 000 0000</li>
      <li><strong>Hours:</strong> Monday – Friday, 9 AM – 6 PM GMT</li>
    </ul>
    <p className="text-muted-foreground leading-relaxed mt-4">We aim to respond to all enquiries within 24 hours.</p>
  </InfoPage>
);

export default SupportPage;
