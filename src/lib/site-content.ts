import { useEffect, useState } from "react";

const KEY = "kc_site_content_v1";
const EVENT = "kc-store-change";
const isClient = typeof window !== "undefined";

export type TrustItem = { id: string; icon: "shield" | "message" | "users" | "leaf" | "star"; title: string; text: string };
export type Testimonial = { id: string; name: string; location: string; quote: string; rating: number; image: string };

export type TimelineItem = { id: string; era: string; title: string; text: string };
export type SpotlightItem = { id: string; title: string; text: string };

export type AboutIcon = "shield" | "users" | "truck" | "sparkles" | "heart" | "hand" | "leaf";
export type AboutCard = { id: string; icon: AboutIcon; title: string; text: string };

export type SeoMeta = { title: string; description: string; ogImage: string };


export type HeritagePage = {
  seo: SeoMeta;
  hero: { title: string; subtitle: string; image: string };
  timelineSection: { title: string };
  timeline: TimelineItem[];
  spotlightSection: { title: string; subtitle: string };
  spotlights: SpotlightItem[];
  gi: { eyebrow: string; title: string; body: string; tags: string[] };
  quote: string;
};


export type AboutPage = {
  seo: SeoMeta;
  story: {
    eyebrow: string;
    title: string;
    body1: string;
    body2: string;
    sideImage: string;
    founderName: string;
    founderTitle: string;
    founderImage: string;
  };
  reasonsSection: { title: string };
  reasons: AboutCard[];
  valuesSection: { title: string };
  values: AboutCard[];
};

export type ContactPage = {
  seo: SeoMeta;
  header: { title: string; subtitle: string };

  details: {
    sectionTitle: string;
    phoneLabel: string;
    phoneDisplay: string;
    whatsappLabel: string;
    whatsappLink: string;
    emailLabel: string;
    email: string;
    addressLabel: string;
    address: string;
    hoursLabel: string;
    hours: string;
    whatsappCtaLabel: string;
  };
  form: { sectionTitle: string; submitLabel: string; successTitle: string; successText: string; subjects: string[] };
  mapEmbedUrl: string;
  footerCta: { title: string; text: string; buttonLabel: string };
};

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
  heritagePage: HeritagePage;
  aboutPage: AboutPage;
  contactPage: ContactPage;
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
  heritagePage: {
    hero: {
      title: "500 Years of Living Craft",
      subtitle: "A story that began in the courts of the Sultans and continues in workshops across the Valley.",
      image: "https://picsum.photos/seed/kashmirheritage/1600/700",
    },
    timelineSection: { title: "A Timeline of Mastery" },
    timeline: [
      { id: "h1", era: "1400s", title: "Mughal Influence Begins", text: "Sultan Zain-ul-Abidin brought Persian weavers to Kashmir, igniting the carpet and shawl tradition." },
      { id: "h2", era: "1600s", title: "The Pashmina Era", text: "Mughal Emperor Akbar made Kashmiri Pashmina the fabric of royalty. Shawls became diplomatic gifts to European courts." },
      { id: "h3", era: "1700s", title: "Global Trade Routes", text: "Kashmir shawls reached France and Britain via the Silk Road. The Paisley pattern gets its name from Scottish weavers imitating Kashmiri designs." },
      { id: "h4", era: "1800s", title: "Paper Maché Flourishes", text: "Persian-origin paper maché art finds its highest expression in Kashmiri artisans' hands, decorating boxes, vases, and ceilings." },
      { id: "h5", era: "Today", title: "A Living Legacy", text: "Despite industrialization, thousands of Kashmir families keep these crafts alive through handmade techniques unchanged for centuries." },
    ],
    spotlightSection: { title: "Craft Spotlight", subtitle: "Six techniques that define Kashmiri handicraft." },
    spotlights: [
      { id: "s1", title: "Pashmina Shawls", text: "The fiber comes from Changthangi goats at 4,500m altitude. One shawl uses 3 goats' annual fiber yield." },
      { id: "s2", title: "Knotted Carpets", text: "Hand-knotted on vertical looms; a 4×6 ft carpet can have 1.2 million individual knots." },
      { id: "s3", title: "Paper Maché", text: "Crafted from waste paper pulp, sun-dried, then painted with 20+ layers of lacquer." },
      { id: "s4", title: "Sozni Embroidery", text: "Single-needle work on Pashmina so delicate it's called 'needle painting'." },
      { id: "s5", title: "Walnut Wood Carving", text: "Only Himalayan walnut is used; the wood must dry for 10 years before carving." },
      { id: "s6", title: "Kani Weaving", text: "Each colour change uses a new spool (kani); complex patterns use 300+ spools simultaneously." },
    ],
    gi: {
      eyebrow: "Geographical Indication",
      title: "Crafts with GI Protection",
      body: "Kashmiri Pashmina, Kani Shawl, Sozni Embroidery, and Khatamband joinery are all GI-tagged by the Government of India — a legal recognition that these crafts can only be authentic when made in Kashmir, by Kashmiris, using traditional methods.",
      tags: ["Pashmina", "Kani Shawl", "Sozni Embroidery", "Khatamband"],
    },
    quote: "A Kashmiri carpet is not made — it is grown, thread by thread, year by year, in the hands of a family.",
  },
  aboutPage: {
    story: {
      eyebrow: "Our Story",
      title: "A shop with the Valley in its bones",
      body1:
        "Kashmir Crafts was founded in 1998 with a single mission: to connect the world with the authentic handicrafts of the Kashmir Valley. What began as a small shop in Lal Chowk, Srinagar has grown into a trusted name for collectors, interior designers, and craft lovers across India and abroad.",
      body2:
        "We work with over forty artisan families across the Valley — many of whom have been part of our story for two decades. Every piece you buy here funds the next.",
      sideImage: "https://picsum.photos/seed/kashmir-shop/800/900",
      founderName: "Imtiyaz Ahmad",
      founderTitle: "Founder · Kashmir Crafts",
      founderImage: "https://picsum.photos/seed/owner-portrait/300/300",
    },
    reasonsSection: { title: "Why buy from us" },
    reasons: [
      { id: "r1", icon: "shield", title: "Authenticity guaranteed", text: "Every piece is verified — no machine copies, no imports." },
      { id: "r2", icon: "hand", title: "Directly from artisans", text: "We pay the makers fairly and credit them by name." },
      { id: "r3", icon: "sparkles", title: "Custom orders", text: "Bespoke sizes, patterns and colours — quoted on WhatsApp." },
      { id: "r4", icon: "truck", title: "Worldwide shipping", text: "Insured door-to-door delivery to over 40 countries." },
    ],
    valuesSection: { title: "Our values" },
    values: [
      { id: "vv1", icon: "leaf", title: "Preserve Tradition", text: "We commission techniques the world has nearly forgotten — Sozni, Kani, Khatamband." },
      { id: "vv2", icon: "users", title: "Empower Artisans", text: "Long-term partnerships, transparent pricing, and royalties on signature designs." },
      { id: "vv3", icon: "heart", title: "Honest Craft", text: "If a piece is partly machine-made, we say so. We never overstate origin or material." },
    ],
  },
  contactPage: {
    header: { title: "Get in Touch", subtitle: "We'd love to hear from you. Most customers reach us on WhatsApp." },
    details: {
      sectionTitle: "Reach us directly",
      phoneLabel: "Phone",
      phoneDisplay: "+91 99999 99999",
      whatsappLabel: "WhatsApp",
      whatsappLink: "Chat with us on WhatsApp",
      emailLabel: "Email",
      email: "hello@kashmircrafts.example",
      addressLabel: "Address",
      address: "Lal Chowk, Srinagar, Kashmir 190001, India",
      hoursLabel: "Shop Hours",
      hours: "Mon–Sat · 10am–7pm IST",
      whatsappCtaLabel: "Chat with us on WhatsApp",
    },
    form: {
      sectionTitle: "Send us a message",
      submitLabel: "Send Message",
      successTitle: "Thank you!",
      successText: "We'll get back to you within 24 hours.",
      subjects: ["General Enquiry", "Product Enquiry", "Custom Order", "Wholesale"],
    },
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=74.79%2C34.07%2C74.83%2C34.10&layer=mapnik&marker=34.0837%2C74.7973",
    footerCta: {
      title: "Prefer WhatsApp?",
      text: "Most customers reach us this way — and we usually reply within minutes.",
      buttonLabel: "Chat on WhatsApp",
    },
  },
};

function read(): SiteContent {
  if (!isClient) return defaultSiteContent;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SiteContent>;
      // Deep-merge top-level keys so newly added sections fall back to defaults.
      return {
        ...defaultSiteContent,
        ...parsed,
        heritagePage: { ...defaultSiteContent.heritagePage, ...(parsed.heritagePage ?? {}) },
        aboutPage: {
          ...defaultSiteContent.aboutPage,
          ...(parsed.aboutPage ?? {}),
          story: { ...defaultSiteContent.aboutPage.story, ...((parsed.aboutPage ?? {}).story ?? {}) },
        },
        contactPage: {
          ...defaultSiteContent.contactPage,
          ...(parsed.contactPage ?? {}),
          header: { ...defaultSiteContent.contactPage.header, ...((parsed.contactPage ?? {}).header ?? {}) },
          details: { ...defaultSiteContent.contactPage.details, ...((parsed.contactPage ?? {}).details ?? {}) },
          form: { ...defaultSiteContent.contactPage.form, ...((parsed.contactPage ?? {}).form ?? {}) },
          footerCta: { ...defaultSiteContent.contactPage.footerCta, ...((parsed.contactPage ?? {}).footerCta ?? {}) },
        },
      } as SiteContent;
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
