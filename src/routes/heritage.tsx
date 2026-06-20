import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/heritage")({
  head: () => ({
    meta: [
      { title: "Heritage — 500 Years of Kashmiri Craft" },
      { name: "description", content: "From Mughal-era Pashmina to paper maché, explore 500 years of Kashmiri craft heritage and the techniques still alive today." },
      { property: "og:title", content: "500 Years of Kashmiri Craft Heritage" },
      { property: "og:description", content: "From Mughal-era Pashmina to paper maché — the living history of Kashmir's crafts." },
      { property: "og:image", content: "https://picsum.photos/seed/kashmirheritage/1600/700" },
    ],
  }),
  component: Heritage,
});

const timeline = [
  { era: "1400s", title: "Mughal Influence Begins", text: "Sultan Zain-ul-Abidin brought Persian weavers to Kashmir, igniting the carpet and shawl tradition." },
  { era: "1600s", title: "The Pashmina Era", text: "Mughal Emperor Akbar made Kashmiri Pashmina the fabric of royalty. Shawls became diplomatic gifts to European courts." },
  { era: "1700s", title: "Global Trade Routes", text: "Kashmir shawls reached France and Britain via the Silk Road. The Paisley pattern gets its name from Scottish weavers imitating Kashmiri designs." },
  { era: "1800s", title: "Paper Maché Flourishes", text: "Persian-origin paper maché art finds its highest expression in Kashmiri artisans' hands, decorating boxes, vases, and ceilings." },
  { era: "Today", title: "A Living Legacy", text: "Despite industrialization, thousands of Kashmir families keep these crafts alive through handmade techniques unchanged for centuries." },
];

const spotlights = [
  { title: "Pashmina Shawls", text: "The fiber comes from Changthangi goats at 4,500m altitude. One shawl uses 3 goats' annual fiber yield." },
  { title: "Knotted Carpets", text: "Hand-knotted on vertical looms; a 4×6 ft carpet can have 1.2 million individual knots." },
  { title: "Paper Maché", text: "Crafted from waste paper pulp, sun-dried, then painted with 20+ layers of lacquer." },
  { title: "Sozni Embroidery", text: "Single-needle work on Pashmina so delicate it's called 'needle painting'." },
  { title: "Walnut Wood Carving", text: "Only Himalayan walnut is used; the wood must dry for 10 years before carving." },
  { title: "Kani Weaving", text: "Each colour change uses a new spool (kani); complex patterns use 300+ spools simultaneously." },
];

function Heritage() {
  return (
    <SiteShell>
      <PageHero
        title="500 Years of Living Craft"
        subtitle="A story that began in the courts of the Sultans and continues in workshops across the Valley."
        image="https://picsum.photos/seed/kashmirheritage/1600/700"
        height="h-[60vh] min-h-[360px]"
      />

      {/* Timeline */}
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
        <h2 className="text-center font-display text-3xl font-semibold md:text-4xl">A Timeline of Mastery</h2>
        <div className="relative mt-12">
          <div
            className="absolute left-4 top-0 h-full w-px md:left-1/2"
            style={{ background: "var(--border)" }}
          />
          <ol className="space-y-12">
            {timeline.map((t, i) => {
              const right = i % 2 === 1;
              return (
                <li key={t.era} className="relative md:grid md:grid-cols-2 md:gap-10">
                  <span
                    className="absolute left-4 top-2 -translate-x-1/2 rounded-full bg-primary md:left-1/2"
                    style={{ width: 14, height: 14, background: "var(--primary)" }}
                  />
                  <div className={`pl-12 md:pl-0 ${right ? "md:col-start-2" : "md:text-right md:pr-10"}`}>
                    <p className="font-display text-2xl font-semibold" style={{ color: "var(--primary)" }}>{t.era}</p>
                    <h3 className="mt-1 font-display text-xl font-semibold">{t.title}</h3>
                    <p className="mt-2 leading-relaxed text-foreground/85">{t.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Spotlights */}
      <section className="bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Craft Spotlight</h2>
            <p className="mt-2 text-muted-foreground">Six techniques that define Kashmiri handicraft.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {spotlights.map((s) => (
              <div key={s.title} className="rounded-xl border bg-background p-6 shadow-soft">
                <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-foreground/85">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GI tags */}
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20 text-center">
        <span className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--gold)" }}>Geographical Indication</span>
        <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">Crafts with GI Protection</h2>
        <p className="mt-4 leading-relaxed text-foreground/85">
          Kashmiri Pashmina, Kani Shawl, Sozni Embroidery, and Khatamband joinery are all GI-tagged by the Government of India — a legal recognition that these crafts can only be authentic when made in Kashmir, by Kashmiris, using traditional methods.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {["Pashmina", "Kani Shawl", "Sozni Embroidery", "Khatamband"].map((tag) => (
            <span key={tag} className="rounded-full border px-4 py-1.5 text-sm font-medium" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="px-4 pb-24 md:px-6">
        <blockquote
          className="mx-auto max-w-4xl rounded-3xl px-8 py-14 text-center"
          style={{ background: "var(--primary-light)" }}
        >
          <p className="font-display text-2xl italic leading-relaxed md:text-3xl">
            "A Kashmiri carpet is not made — it is grown, thread by thread, year by year, in the hands of a family."
          </p>
        </blockquote>
      </section>
    </SiteShell>
  );
}
