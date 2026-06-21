import { Link } from "@tanstack/react-router";
import { Menu, X, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { ChinarLeaf } from "./ChinarLeaf";
import { getWhatsAppLink } from "@/lib/whatsapp";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/heritage", label: "Heritage" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-ivory/95 backdrop-blur transition-shadow ${
        scrolled ? "border-b shadow-soft" : ""
      }`}
      style={{ background: "color-mix(in oklab, var(--ivory) 92%, transparent)" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <ChinarLeaf className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-semibold tracking-tight">Kashmir Crafts</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-white md:flex"
            style={{ background: "var(--whatsapp)" }}
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted"
                activeProps={{ className: "text-primary bg-muted" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium text-white"
              style={{ background: "var(--whatsapp)" }}
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
