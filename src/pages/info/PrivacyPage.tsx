import InfoPage from "@/components/layout/InfoPage";

const PrivacyPage = () => (
  <InfoPage title="Privacy Policy">
    <p className="text-muted-foreground leading-relaxed">Your privacy is important to us. This policy outlines how Maggs Trove collects, uses, and protects your personal information.</p>
    <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Information We Collect</h2>
    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
      <li>Name, email address, and phone number when you create an account</li>
      <li>Shipping and billing addresses for order fulfilment</li>
      <li>Payment information (processed securely through our payment partners)</li>
      <li>Browsing activity and preferences to improve your shopping experience</li>
    </ul>
    <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">How We Use Your Data</h2>
    <p className="text-muted-foreground leading-relaxed">We use your data to process orders, personalise your experience, and communicate relevant updates. We never sell your personal information to third parties.</p>
  </InfoPage>
);

export default PrivacyPage;
