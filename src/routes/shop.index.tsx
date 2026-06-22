import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { z } from "zod";
import { SiteShell } from "@/components/site/SiteShell";
import { ProductCard } from "@/components/site/ProductCard";
import { useProducts, useCategories } from "@/lib/store";

const searchSchema = z.object({
  category: z.string().optional(),
  subcategory: z.string().optional(),
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

function Shop() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const products = useProducts();
  const categories = useCategories();
  const [query, setQuery] = useState("");

  const filter = search.category ?? "All";
  const sub = search.subcategory;

  const setFilter = (cat: string | undefined) => {
    navigate({ search: cat ? { category: cat } : {} });
  };
  const setSub = (s: string | undefined) => {
    navigate({ search: { category: filter === "All" ? undefined : filter, subcategory: s } });
  };

  const activeCat = categories.find((c) => c.name === filter);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filter !== "All" && p.category !== filter) return false;
      if (sub && p.subcategory !== sub) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [filter, sub, query, products]);

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
              <FilterPill active={filter === "All"} onClick={() => setFilter(undefined)}>All</FilterPill>
              {categories.map((c) => (
                <FilterPill
                  key={c.id}
                  active={filter === c.name}
                  onClick={() => setFilter(c.name)}
                >
                  {c.name}
                </FilterPill>
              ))}
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
          {activeCat && activeCat.subcategories.length > 0 && (
            <div className="mx-auto mt-3 flex max-w-7xl flex-wrap gap-2">
              <SubPill active={!sub} onClick={() => setSub(undefined)}>All {activeCat.name}</SubPill>
              {activeCat.subcategories.map((s) => (
                <SubPill key={s} active={sub === s} onClick={() => setSub(s)}>{s}</SubPill>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No pieces match your search.{" "}
            <button onClick={() => { setFilter(undefined); setQuery(""); }} className="text-primary underline">
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

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-transparent text-primary-foreground"
          : "bg-card text-foreground hover:border-primary hover:text-primary"
      }`}
      style={active ? { background: "var(--primary)" } : undefined}
    >
      {children}
    </button>
  );
}

function SubPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active ? "border-primary text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
