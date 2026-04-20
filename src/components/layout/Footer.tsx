import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-2">JOIN THE TROVE</h3>
            <p className="text-sm text-primary-foreground/70 mb-6">
              Be the first to know about new arrivals, sales & more.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-transparent border border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground"
              />
              <button type="submit" className="btn-accent">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">About</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Careers</Link></li>
              <li><Link to="/sustainability" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Sustainability</Link></li>
              <li><Link to="/press" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Press</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Help</h4>
            <ul className="space-y-2">
              <li><Link to="/support" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Customer Support</Link></li>
              <li><Link to="/delivery" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Delivery Info</Link></li>
              <li><Link to="/returns" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/size-guide" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors" aria-label="Youtube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/70">
            © 2025 Maggs Trove. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <img src="https://cdn-icons-png.flaticon.com/32/349/349221.png" alt="Visa" className="h-6 opacity-70" />
            <img src="https://cdn-icons-png.flaticon.com/32/349/349228.png" alt="Mastercard" className="h-6 opacity-70" />
            <img src="https://cdn-icons-png.flaticon.com/32/349/349230.png" alt="Amex" className="h-6 opacity-70" />
            <img src="https://cdn-icons-png.flaticon.com/32/6124/6124998.png" alt="PayPal" className="h-6 opacity-70" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
