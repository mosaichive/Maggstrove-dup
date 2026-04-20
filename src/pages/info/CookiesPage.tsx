import InfoPage from "@/components/layout/InfoPage";

const CookiesPage = () => (
  <InfoPage title="Cookie Policy">
    <p className="text-muted-foreground leading-relaxed">Maggs Trove uses cookies to enhance your browsing experience, analyse site traffic, and personalise content.</p>
    <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">What Are Cookies?</h2>
    <p className="text-muted-foreground leading-relaxed">Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and improve functionality.</p>
    <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Managing Cookies</h2>
    <p className="text-muted-foreground leading-relaxed">You can manage or disable cookies through your browser settings. Please note that disabling cookies may affect your experience on our website.</p>
  </InfoPage>
);

export default CookiesPage;
