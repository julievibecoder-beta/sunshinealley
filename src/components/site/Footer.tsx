import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { ChinarLeaf } from "./ChinarLeaf";
import { ADDRESS, EMAIL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="mt-20 border-t bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <ChinarLeaf className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-semibold">Kashmir Crafts</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Authentic handicrafts from the Valley — woven, carved and painted by master artisans of Kashmir.
          </p>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              { to: "/shop", label: "Shop" },
              { to: "/craftsmen", label: "Craftsmen" },
              { to: "/heritage", label: "Heritage" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-foreground/80 hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-foreground/80">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 text-primary" />
              <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 text-primary" />
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
              <span>{ADDRESS}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold">Follow Us</h4>
          <div className="mt-3 flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Mon–Sat · 10am–7pm IST</p>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-muted-foreground md:px-6">
          © {new Date().getFullYear()} Kashmir Crafts. Handmade with love in Srinagar.
        </div>
      </div>
    </footer>
  );
}
