import { useEffect, useState } from "react";

const KEY = "kc_site_content_v1";
const EVENT = "kc-store-change";
const isClient = typeof window !== "undefined";

export type TrustItem = { id: string; icon: "shield" | "message" | "users" | "leaf" | "star"; title: string; text: string };
export type Testimonial = { id: string; name: string; location: string; quote: string; rating: number; image: string };

export type SiteContent = {
  hero: {
    image: string;
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
  categoriesSection: { title: string; subtitle: string };
  featuredSection: { title: string; subtitle: string };
  heritage: { eyebrow: string; title: string; body1: string; body2: string; ctaLabel: string; image: string };
  trust: TrustItem[];
  testimonialsSection: { title: string; subtitle: string };
  testimonials: Testimonial[];
};

export const defaultSiteContent: SiteContent = {
  hero: {
    image: "https://picsum.photos/seed/kashmir1/1600/900",
    eyebrow: "Handcrafted in the Valley of Kashmir",
    titleLine1: "Woven in Kashmir,",
    titleLine2: "Cherished Worldwide",
    subtitle:
      "Authentic Kashmiri handicrafts — carpets, shawls, paper maché, and more — crafted by generations of master artisans.",
    primaryCtaLabel: "Explore the Shop",
    secondaryCtaLabel: "Our Story",
  },
  categoriesSection: {
    title: "Shop by Category",
    subtitle: "Explore Kashmir's living craft traditions.",
  },
  featuredSection: {
    title: "Featured Pieces",
    subtitle: "Each item tells a story of Kashmir's living craft tradition.",
  },
  heritage: {
    eyebrow: "Heritage",
    title: "500 Years of Living Craft",
    body1:
      "Kashmir's handicraft tradition was kindled in the 1400s when Sultan Zain-ul-Abidin invited Persian masters to the Valley. Under the Mughals, Pashmina shawls became diplomatic gifts to European courts, and the paisley motif — born here — would later travel along the Silk Road into legend.",
    body2:
      "From hand-knotted silk carpets to lacquered paper maché and walnut wood lattices, every piece is the latest chapter in a five-century story still being written by hand.",
    ctaLabel: "Explore the full history",
    image: "https://picsum.photos/seed/kashmirhistory/800/600",
  },
  trust: [
    { id: "t1", icon: "shield", title: "100% Authentic", text: "Directly sourced from Kashmir's master craftsmen" },
    { id: "t2", icon: "message", title: "WhatsApp Enquiries", text: "Get pricing and availability instantly" },
    { id: "t3", icon: "users", title: "Made to Order", text: "Custom sizes and designs available" },
  ],
  testimonialsSection: {
    title: "Customer Testimonials",
    subtitle: "Hear from collectors who brought a piece of Kashmir home.",
  },
  testimonials: [
    {
      id: "v1",
      name: "Aarav Mehta",
      location: "Mumbai, India",
      quote:
        "The Pashmina shawl is breathtakingly soft and the craftsmanship is unlike anything I've owned. Shipping was quick and the team answered every question on WhatsApp.",
      rating: 5,
      image: "https://picsum.photos/seed/testimonial-aarav/200/200",
    },
    {
      id: "v2",
      name: "Sophia Laurent",
      location: "Paris, France",
      quote:
        "My silk carpet is a work of art — the detail in the knotting is incredible. It feels like owning a piece of living history.",
      rating: 5,
      image: "https://picsum.photos/seed/testimonial-sophia/200/200",
    },
    {
      id: "v3",
      name: "Rahul Verma",
      location: "Bengaluru, India",
      quote:
        "Custom paper maché box arrived perfectly packed. The colors and gold work are even richer in person. Highly recommended.",
      rating: 5,
      image: "https://picsum.photos/seed/testimonial-rahul/200/200",
    },
  ],
};

function read(): SiteContent {
  if (!isClient) return defaultSiteContent;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SiteContent>;
      return { ...defaultSiteContent, ...parsed } as SiteContent;
    }
  } catch {
    /* ignore */
  }
  return defaultSiteContent;
}

export function loadSiteContent(): SiteContent {
  return read();
}

export function saveSiteContent(c: SiteContent) {
  if (!isClient) return;
  localStorage.setItem(KEY, JSON.stringify(c));
  window.dispatchEvent(new Event(EVENT));
}

export function resetSiteContent() {
  if (!isClient) return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function useSiteContent(): SiteContent {
  const [v, setV] = useState<SiteContent>(read);
  useEffect(() => {
    setV(read());
    const on = () => setV(read());
    window.addEventListener(EVENT, on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return v;
}
