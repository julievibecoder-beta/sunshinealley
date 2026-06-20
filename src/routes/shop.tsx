import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { z } from "zod";
import { SiteShell } from "@/components/site/SiteShell";
import { ProductCard } from "@/components/site/ProductCard";
import { products, categories, type Category } from "@/data/products";

const searchSchema = z.object({
  category: z.enum(["Accessories", "Carpets", "Boxes", "Wearables"]).optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop — Kashmir Crafts" },
      { name: "description", content: "Browse our collection of handcrafted Kashmiri carpets, Pashmina shawls, paper maché, and walnut wood pieces." },
      { property: "og:title", content: "Shop — Kashmir Crafts" },
      { property: "og:description", content: "Authentic Kashmiri handicrafts curated from master artisans of the Valley." },
    ],
  }),
  component: Shop,
});

type Filter = Category | "All";

function Shop() {
  const search = Route.useSearch();
  const initial: Filter = (search.category as Filter) ?? "All";
  const [filter, setFilter] = useState<Filter>(initial);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filter !== "All" && p.category !== filter) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [filter, query]);

  const filters: Filter[] = ["All", ...categories];

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 md:px-6 md:pt-16">
        <div className="text-center">
          <h1 className="font-display text-4xl font-semibold md:text-5xl">Our Collection</h1>
          <p className="mt-3 text-muted-foreground">
            Handcrafted pieces from the heart of Kashmir.
          </p>
        </div>

        <div className="sticky top-16 z-30 mt-10 -mx-4 border-y bg-background/90 px-4 py-4 backdrop-blur md:-mx-6 md:px-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => {
                const active = f === filter;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "border-transparent text-primary-foreground"
                        : "bg-card text-foreground hover:border-primary hover:text-primary"
                    }`}
                    style={active ? { background: "var(--primary)" } : undefined}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pieces..."
                className="w-full rounded-full border bg-card py-2 pl-9 pr-4 text-sm outline-none ring-primary/30 focus:ring-2"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No pieces match your search.{" "}
            <button onClick={() => { setFilter("All"); setQuery(""); }} className="text-primary underline">
              Clear filters
            </button>
          </div>
        )}

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Looking for something specific?{" "}
          <Link to="/contact" className="text-primary hover:underline">
            Get in touch
          </Link>{" "}
          — custom orders welcome.
        </p>
      </section>
    </SiteShell>
  );
}
