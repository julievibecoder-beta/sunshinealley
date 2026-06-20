import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { ArtisanCard } from "@/components/site/ArtisanCard";
import { PageHero } from "@/components/site/PageHero";
import { craftsmen, type Craftsman } from "@/data/craftsmen";

export const Route = createFileRoute("/craftsmen")({
  head: () => ({
    meta: [
      { title: "Our Craftsmen — Kashmir Crafts" },
      { name: "description", content: "Meet the master artisans of Kashmir whose hands shape every piece in our collection." },
      { property: "og:title", content: "Our Craftsmen — Kashmir Crafts" },
      { property: "og:description", content: "Meet the master artisans of Kashmir." },
      { property: "og:image", content: "https://picsum.photos/seed/craftsmen-hero/1600/700" },
    ],
  }),
  component: Craftsmen,
});

function Craftsmen() {
  const [open, setOpen] = useState<Craftsman | null>(null);

  return (
    <SiteShell>
      <PageHero
        title="The Hands Behind the Craft"
        subtitle="Every piece you see carries the life's work of a Kashmir master. Meet the artisans."
        image="https://picsum.photos/seed/craftsmen-hero/1600/700"
      />
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {craftsmen.map((a) => (
            <ArtisanCard key={a.id} artisan={a} onRead={() => setOpen(a)} />
          ))}
        </div>
      </section>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-card shadow-warm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-background/90 p-2 shadow-soft hover:bg-background"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <img src={open.image} alt={open.name} className="h-full w-full object-cover" />
              <div className="p-6 md:p-8">
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ background: "var(--primary-light)", color: "var(--primary-dark)" }}
                >
                  {open.specialty}
                </span>
                <h2 className="mt-3 font-display text-3xl font-semibold">{open.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {open.location} · <span style={{ color: "var(--gold)" }}>{open.years}</span>
                </p>
                <p className="mt-5 leading-relaxed text-foreground/85">{open.bioFull}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </SiteShell>
  );
}
