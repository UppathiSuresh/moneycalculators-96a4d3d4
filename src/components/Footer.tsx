import { NavLink } from "@/components/NavLink";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/calculators", label: "Calculators" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <footer className="mt-16 border-t bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Financial Calculators</h3>
            <p className="text-sm text-muted-foreground">
              Professional tools to help you make informed financial decisions with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Disclaimer</h3>
            <p className="text-xs text-muted-foreground">
              These calculators are for informational purposes only. Results should not be considered as financial advice. 
              Please consult with a qualified financial advisor for personalized guidance.
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Easy-Money. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
