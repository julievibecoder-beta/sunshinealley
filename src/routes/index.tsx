import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, MessageCircle, Users, Leaf, Star, ArrowRight, Quote } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { ProductCard } from "@/components/site/ProductCard";
import { useProducts, useCategories } from "@/lib/store";
import { slugify } from "@/lib/store";
import { useSiteContent } from "@/lib/site-content";
import type { TrustItem } from "@/lib/site-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kashmir Crafts — Handcrafted in the Valley of Kashmir" },
      { name: "description", content: "Authentic Kashmiri handicrafts — carpets, Pashmina, paper maché and walnut wood — direct from master artisans of the Valley." },
      { property: "og:title", content: "Kashmir Crafts — Handcrafted in the Valley of Kashmir" },
      { property: "og:description", content: "Browse a curated collection of carpets, shawls, and paper maché crafted by Kashmir's master artisans." },
      { property: "og:image", content: "https://picsum.photos/seed/kashmir1/1600/900" },
    ],
  }),
  component: Home,
});

const trustIconMap: Record<TrustItem["icon"], typeof Shield> = {
  shield: Shield,
  message: MessageCircle,
  users: Users,
  leaf: Leaf,
  star: Star,
};

function Home() {
  const products = useProducts();
  const categories = useCategories();
  const content = useSiteContent();
  const featured = products.filter((p) => p.featured).slice(0, 8);

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[520px] w-full overflow-hidden">
        {content.hero.image && (
          <img
            src={content.hero.image}
            alt="Kashmir Valley landscape"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)" }} />
        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-4 text-center text-white">
          <span className="text-xs uppercase tracking-[0.3em] text-white/85">{content.hero.eyebrow}</span>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight md:text-5xl lg:text-6xl text-balance">
            {content.hero.titleLine1}
            <br />
            {content.hero.titleLine2}
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/85 md:text-lg">{content.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-warm hover:bg-primary-dark"
              style={{ background: "var(--primary)" }}
            >
              {content.hero.primaryCtaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-md border border-white/80 px-6 py-3 text-sm font-medium text-white backdrop-blur hover:bg-white hover:text-foreground"
            >
              {content.hero.secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">{content.categoriesSection.title}</h2>
          <p className="mt-2 text-muted-foreground">{content.categoriesSection.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to="/shop"
              search={{ category: cat.name }}
              className="group relative block aspect-[4/3] overflow-hidden rounded-2xl shadow-soft"
            >
              <img
                src={`https://picsum.photos/seed/kashmir-${slugify(cat.name)}/900/700`}
                alt={cat.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div
                className="absolute inset-0 transition-opacity group-hover:bg-black/35"
                style={{ background: "rgba(0,0,0,0.5)" }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="font-display text-3xl font-semibold md:text-4xl">{cat.name}</span>
                {cat.subcategories.length > 0 && (
                  <span className="mt-2 max-w-md text-center text-xs text-white/80">
                    {cat.subcategories.slice(0, 4).join(" · ")}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">{content.featuredSection.title}</h2>
            <p className="mt-2 text-muted-foreground">{content.featuredSection.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark"
            >
              View entire collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Heritage snippet */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div className="order-1 md:order-1">
            <span className="text-xs uppercase tracking-[0.25em] text-primary">{content.heritage.eyebrow}</span>
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">{content.heritage.title}</h2>
            <p className="mt-4 leading-relaxed text-foreground/85">{content.heritage.body1}</p>
            <p className="mt-3 leading-relaxed text-foreground/85">{content.heritage.body2}</p>
            <Link
              to="/heritage"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark"
            >
              {content.heritage.ctaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="order-0 md:order-2">
            {content.heritage.image && (
              <img
                src={content.heritage.image}
                alt="Kashmir heritage craft"
                loading="lazy"
                className="aspect-[4/3] w-full rounded-2xl object-cover shadow-warm"
              />
            )}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y bg-card">
        <div
          className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 md:px-6"
          style={{ gridTemplateColumns: `repeat(${Math.min(content.trust.length || 1, 3)}, minmax(0, 1fr))` }}
        >
          {content.trust.map((item) => {
            const Icon = trustIconMap[item.icon] ?? Shield;
            return (
              <div key={item.id} className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 flex-none items-center justify-center rounded-full"
                  style={{ background: "var(--primary-light)", color: "var(--primary-dark)" }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Customer Testimonials */}
      {content.testimonials.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">{content.testimonialsSection.title}</h2>
            <p className="mt-2 text-muted-foreground">{content.testimonialsSection.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {content.testimonials.map((t) => (
              <figure
                key={t.id}
                className="relative flex h-full flex-col rounded-2xl border bg-card p-6 shadow-soft"
              >
                <Quote className="absolute right-5 top-5 h-6 w-6 text-primary/20" />
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4"
                      fill={i < t.rating ? "currentColor" : "none"}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/85">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t pt-4">
                  {t.image ? (
                    <img
                      src={t.image}
                      alt={t.name}
                      loading="lazy"
                      className="h-10 w-10 flex-none rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-sm font-semibold"
                      style={{ background: "var(--primary-light)", color: "var(--primary-dark)" }}
                    >
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </SiteShell>
  );
}
