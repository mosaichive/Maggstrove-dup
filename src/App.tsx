import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ShopProvider } from "@/context/ShopContext";
import { AuthProvider } from "@/context/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Women from "./pages/Women";
import Men from "./pages/Men";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import DressDetailPage from "./pages/DressDetailPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import Favorites from "./pages/Favorites";
import ProfilePage from "./pages/ProfilePage";
import SalePage from "./pages/SalePage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import AboutPage from "./pages/info/AboutPage";
import CareersPage from "./pages/info/CareersPage";
import SustainabilityPage from "./pages/info/SustainabilityPage";
import PressPage from "./pages/info/PressPage";
import SupportPage from "./pages/info/SupportPage";
import DeliveryPage from "./pages/info/DeliveryPage";
import ReturnsPage from "./pages/info/ReturnsPage";
import SizeGuidePage from "./pages/info/SizeGuidePage";
import PrivacyPage from "./pages/info/PrivacyPage";
import TermsPage from "./pages/info/TermsPage";
import CookiesPage from "./pages/info/CookiesPage";
import MenJeansTrousersPage from "./pages/MenJeansTrousersPage";
import MenTwoPiecePage from "./pages/MenTwoPiecePage";
import MenTshirtsVestsPage from "./pages/MenTshirtsVestsPage";
import WomenDressesPage from "./pages/WomenDressesPage";
import WomenTopsPage from "./pages/WomenTopsPage";
import AdminDashboard from "./pages/AdminDashboard";
import AuthCallback from "./pages/AuthCallback";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <ShopProvider>
          <TooltipProvider>
            <ScrollToTop />
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/admin/login" element={<AuthPage requireAdmin />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/account" element={<ProfilePage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/women" element={<Women />} />
              <Route path="/women/tops" element={<WomenTopsPage />} />
              <Route path="/women/dresses" element={<WomenDressesPage />} />
              <Route path="/women/dresses/:id" element={<DressDetailPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/women/jumpers-cardigans" element={<CategoryPage title="Jumpers & Cardigans" parentLabel="Women" parentHref="/women" />} />
              <Route path="/women/coats-jackets" element={<CategoryPage title="Coats & Jackets" parentLabel="Women" parentHref="/women" />} />
              <Route path="/women/trousers-leggings" element={<CategoryPage title="Trousers & Leggings" parentLabel="Women" parentHref="/women" />} />
              <Route path="/women/jeans" element={<CategoryPage title="Jeans" parentLabel="Women" parentHref="/women" />} />
              <Route path="/women/lingerie-nightwear" element={<CategoryPage title="Lingerie & Nightwear" parentLabel="Women" parentHref="/women" />} />
              <Route path="/women/loungewear" element={<CategoryPage title="Loungewear" parentLabel="Women" parentHref="/women" />} />
              <Route path="/women/activewear" element={<CategoryPage title="Activewear" parentLabel="Women" parentHref="/women" />} />
              <Route path="/women/blouses" element={<CategoryPage title="Blouses" parentLabel="Women" parentHref="/women" />} />
              <Route path="/men" element={<Men />} />
              <Route path="/men/tshirts-vests" element={<MenTshirtsVestsPage />} />
              <Route path="/men/hoodies-sweatshirts" element={<CategoryPage title="Hoodies & Sweatshirts" parentLabel="Men" parentHref="/men" />} />
              <Route path="/men/jeans-trousers" element={<MenJeansTrousersPage />} />
              <Route path="/men/2-piece" element={<MenTwoPiecePage />} />
              <Route path="/men/underwear" element={<CategoryPage title="Underwear" parentLabel="Men" parentHref="/men" />} />
              <Route path="/men/coats-jackets" element={<CategoryPage title="Coats & Jackets" parentLabel="Men" parentHref="/men" />} />
              <Route path="/men/jumpers" element={<CategoryPage title="Jumpers" parentLabel="Men" parentHref="/men" />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/track-order" element={<TrackOrderPage />} />
              <Route path="/sale" element={<SalePage />} />
              <Route path="/new-in" element={<SalePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/sustainability" element={<SustainabilityPage />} />
              <Route path="/press" element={<PressPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/delivery" element={<DeliveryPage />} />
              <Route path="/returns" element={<ReturnsPage />} />
              <Route path="/size-guide" element={<SizeGuidePage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
