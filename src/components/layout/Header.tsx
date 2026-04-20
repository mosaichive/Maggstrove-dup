import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import AuthDialog from "@/components/auth/AuthDialog";
import CartDrawer from "@/components/cart/CartDrawer";
import ProfileDrawer from "@/components/profile/ProfileDrawer";
import FavoritesDrawer from "@/components/favorites/FavoritesDrawer";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const womenSubNav = [
  { label: "Tops", href: "/women/tops" },
  { label: "Dresses", href: "/women/dresses" },
  { label: "Jumpers & Cardigans", href: "/women/jumpers-cardigans" },
  { label: "Coats & Jackets", href: "/women/coats-jackets" },
  { label: "Trousers & Leggings", href: "/women/trousers-leggings" },
  { label: "Jeans", href: "/women/jeans" },
  { label: "Lingerie & Nightwear", href: "/women/lingerie-nightwear" },
  { label: "Loungewear", href: "/women/loungewear" },
  { label: "Activewear", href: "/women/activewear" },
  { label: "Blouses", href: "/women/blouses" },
];

const menSubNav = [
  { label: "T-Shirts & Vests", href: "/men/tshirts-vests" },
  { label: "Hoodies & Sweatshirts", href: "/men/hoodies-sweatshirts" },
  { label: "Jeans & Trousers", href: "/men/jeans-trousers" },
  { label: "2 Piece", href: "/men/2-piece" },
  { label: "Underwear", href: "/men/underwear" },
  { label: "Coats & Jackets", href: "/men/coats-jackets" },
  { label: "Jumpers", href: "/men/jumpers" },
];

interface NavItemWithSub {
  label: string;
  href: string;
  subItems?: { label: string; href: string }[];
  accent?: boolean;
}

const navItems: NavItemWithSub[] = [
  { label: "Women", href: "/women", subItems: womenSubNav },
  { label: "Men", href: "/men", subItems: menSubNav },
  { label: "Sale", href: "/sale", accent: true },
];

const DropdownNav = ({ item }: { item: NavItemWithSub }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!item.subItems) {
    return (
      <Link
        to={item.href}
        className={`text-[13px] font-bold uppercase tracking-[3px] py-5 border-b-2 border-transparent hover:border-primary-foreground transition-all duration-200 ${
          item.accent ? "text-accent" : "text-primary-foreground"
        }`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={`text-[13px] font-bold uppercase tracking-[3px] py-5 border-b-2 border-transparent hover:border-primary-foreground transition-all duration-200 text-primary-foreground ${
          open ? "border-primary-foreground" : ""
        }`}
      >
        {item.label}
      </button>
      {open && (
        <div className="absolute top-full left-0 bg-background border border-border shadow-xl min-w-[240px] py-3 z-50 animate-fade-in">
          <Link
            to={item.href}
            className="block px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-secondary transition-colors"
            onClick={() => setOpen(false)}
          >
            Shop All {item.label}
          </Link>
          <div className="border-t border-border my-2 mx-6" />
          {item.subItems.map((sub) => (
            <Link
              key={sub.href}
              to={sub.href}
              className="block px-6 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              onClick={() => setOpen(false)}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const { cartCount, favoritesCount } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("avatar_url").eq("id", user.id).maybeSingle()
        .then(({ data }) => { if (data?.avatar_url) setAvatarUrl(data.avatar_url); });
    } else {
      setAvatarUrl(null);
    }
  }, [user]);
  return (
    <>
      <header className="sticky top-0 z-50">
        {/* Promo Banner */}
        <div className="bg-accent text-accent-foreground text-center py-1.5 text-[11px] font-medium tracking-wider uppercase">
          Free delivery on orders over GH₵50 | Use code: MAGGS20 for 20% off
        </div>

        {/* Main Header - Dark bar */}
        <div className="bg-primary">
          <div className="container mx-auto px-4">
            <div className="flex items-center h-[60px] gap-6">
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 -ml-2 text-primary-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Logo */}
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-[15px] sm:text-lg md:text-xl font-black tracking-[2px] sm:tracking-[4px] uppercase text-primary-foreground">
                  Maggs Trove
                </h1>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-6">
                {navItems.map((item) => (
                  <DropdownNav key={item.label} item={item} />
                ))}
              </nav>

              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-xl ml-auto">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search for items and brands"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-4 pr-10 text-sm bg-primary-foreground text-foreground rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5" aria-label="Search">
                    <Search className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-0.5 sm:gap-1 ml-auto md:ml-0 -mr-1 sm:mr-0">
                <button className="p-2 md:hidden text-primary-foreground" aria-label="Search">
                  <Search className="w-5 h-5" />
                </button>
                <button
                  onClick={() => user ? setProfileOpen(true) : setAuthOpen(true)}
                  className="p-2 text-primary-foreground hover:text-primary-foreground/70 transition-colors"
                  aria-label="Account"
                >
                  {user && avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-6 h-6 rounded-full object-cover border border-primary-foreground/30" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => setFavoritesOpen(true)}
                  className="p-2 text-primary-foreground hover:text-primary-foreground/70 transition-colors relative" 
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                      {favoritesCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setCartOpen(true)}
                  className="p-2 relative text-primary-foreground hover:text-primary-foreground/70 transition-colors"
                  aria-label="Shopping bag"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden bg-background border-t border-border animate-fade-in">
            <div className="px-4 py-3 border-b border-border">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for items and brands"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-4 pr-10 text-sm bg-secondary rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Search">
                  <Search className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
            <div className="container mx-auto px-4 py-2">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.subItems ? (
                    <>
                      <button
                        className={`flex items-center justify-between w-full py-3.5 text-sm font-bold uppercase tracking-wider border-b border-border ${item.accent ? "text-accent" : ""}`}
                        onClick={() => setExpandedMobile(expandedMobile === item.label ? null : item.label)}
                      >
                        {item.label}
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedMobile === item.label ? "rotate-180" : ""}`} />
                      </button>
                      {expandedMobile === item.label && (
                        <div className="pl-4 pb-2 animate-fade-in">
                          <Link
                            to={item.href}
                            className="block py-2.5 text-sm font-semibold text-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Shop All {item.label}
                          </Link>
                          {item.subItems.map((sub) => (
                            <Link
                              key={sub.href}
                              to={sub.href}
                              className="block py-2.5 text-sm text-muted-foreground"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className={`block py-3.5 text-sm font-bold uppercase tracking-wider border-b border-border ${item.accent ? "text-accent" : ""}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-6 pt-4 mt-2 border-t border-border">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); user ? setProfileOpen(true) : setAuthOpen(true); }}
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <User className="w-5 h-5" />
                  <span>{user ? "My Profile" : "Account"}</span>
                </button>
                <button className="flex items-center gap-2 text-sm font-medium">
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </button>
              </div>
            </div>
          </nav>
        )}
      </header>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      {user && <ProfileDrawer open={profileOpen} onOpenChange={setProfileOpen} />}
      <FavoritesDrawer open={favoritesOpen} onOpenChange={setFavoritesOpen} />
    </>
  );
};

export default Header;
