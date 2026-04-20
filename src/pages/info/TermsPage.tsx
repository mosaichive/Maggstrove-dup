import InfoPage from "@/components/layout/InfoPage";

const TermsPage = () => (
  <InfoPage title="Terms of Service">
    <p className="text-muted-foreground leading-relaxed">By using the Maggs Trove website, you agree to the following terms and conditions.</p>
    <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">General</h2>
    <p className="text-muted-foreground leading-relaxed">All products listed on our website are subject to availability. Prices are displayed in Ghanaian Cedis (GH₵) and are inclusive of applicable taxes unless stated otherwise.</p>
    <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Orders</h2>
    <p className="text-muted-foreground leading-relaxed">Placing an order constitutes an offer to purchase. We reserve the right to refuse or cancel orders at our discretion. You will be notified if your order is cancelled.</p>
    <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Intellectual Property</h2>
    <p className="text-muted-foreground leading-relaxed">All content on this website, including images, text, and logos, is the property of Maggs Trove and may not be reproduced without permission.</p>
  </InfoPage>
);

export default TermsPage;
