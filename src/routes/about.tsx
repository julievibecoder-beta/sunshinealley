import { createFileRoute } from "@tanstack/react-router";
import { Shield, Users, Truck, Sparkles, Heart, Hand, Leaf } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Kashmir Crafts" },
      { name: "description", content: "Kashmir Crafts connects the world with authentic handicrafts of the Kashmir Valley — directly from master artisans." },
      { property: "og:title", content: "About Kashmir Crafts" },
      { property: "og:description", content: "Our story, our values, and the artisans who make it possible." },
    ],
  }),
  component: About,
});

const reasons = [
  { icon: Shield, title: "Authenticity guaranteed", text: "Every piece is verified — no machine copies, no imports." },
  { icon: Hand, title: "Directly from artisans", text: "We pay the makers fairly and credit them by name." },
  { icon: Sparkles, title: "Custom orders", text: "Bespoke sizes, patterns and colours — quoted on WhatsApp." },
  { icon: Truck, title: "Worldwide shipping", text: "Insured door-to-door delivery to over 40 countries." },
];

const values = [
  { icon: Leaf, title: "Preserve Tradition", text: "We commission techniques the world has nearly forgotten — Sozni, Kani, Khatamband." },
  { icon: Users, title: "Empower Artisans", text: "Long-term partnerships, transparent pricing, and royalties on signature designs." },
  { icon: Heart, title: "Honest Craft", text: "If a piece is partly machine-made, we say so. We never overstate origin or material." },
];

function About() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-primary">Our Story</span>
            <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">A shop with the Valley in its bones</h1>
            <p className="mt-5 leading-relaxed text-foreground/85">
              Kashmir Crafts was founded in 1998 with a single mission: to connect the world with the authentic handicrafts of the Kashmir Valley. What began as a small shop in Lal Chowk, Srinagar has grown into a trusted name for collectors, interior designers, and craft lovers across India and abroad.
            </p>
            <p className="mt-3 leading-relaxed text-foreground/85">
              We work with over forty artisan families across the Valley — many of whom have been part of our story for two decades. Every piece you buy here funds the next.
            </p>

            <div className="mt-8 flex items-center gap-4 rounded-xl border bg-card p-4 shadow-soft">
              <img
                src="https://picsum.photos/seed/owner-portrait/300/300"
                alt="Founder"
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <p className="font-display text-lg font-semibold">Imtiyaz Ahmad</p>
                <p className="text-sm text-muted-foreground">Founder · Kashmir Crafts</p>
              </div>
            </div>
          </div>
          <img
            src="https://picsum.photos/seed/kashmir-shop/800/900"
            alt="Our shop in Srinagar"
            className="aspect-[4/5] w-full rounded-2xl object-cover shadow-warm"
          />
        </div>
      </section>

      {/* Why us */}
      <section className="bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Why buy from us</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title} className="rounded-xl border bg-background p-6">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                  style={{ background: "var(--primary-light)", color: "var(--primary-dark)" }}
                >
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">Our values</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl p-8 text-center shadow-soft" style={{ background: "var(--primary-light)" }}>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "var(--primary)", color: "white" }}>
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">{v.text}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
