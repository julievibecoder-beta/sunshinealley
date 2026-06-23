import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/PageHero";
import { useSiteContent } from "@/lib/site-content";

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

function Heritage() {
  const p = useSiteContent().heritagePage;

  return (
    <SiteShell>
      <PageHero
        title={p.hero.title}
        subtitle={p.hero.subtitle}
        image={p.hero.image}
        height="h-[60vh] min-h-[360px]"
      />

      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
        <h2 className="text-center font-display text-3xl font-semibold md:text-4xl">{p.timelineSection.title}</h2>
        <div className="relative mt-12">
          <div className="absolute left-4 top-0 h-full w-px md:left-1/2" style={{ background: "var(--border)" }} />
          <ol className="space-y-12">
            {p.timeline.map((t, i) => {
              const right = i % 2 === 1;
              return (
                <li key={t.id} className="relative md:grid md:grid-cols-2 md:gap-10">
                  <span
                    className="absolute left-4 top-2 -translate-x-1/2 rounded-full md:left-1/2"
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

      <section className="bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">{p.spotlightSection.title}</h2>
            <p className="mt-2 text-muted-foreground">{p.spotlightSection.subtitle}</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {p.spotlights.map((s) => (
              <div key={s.id} className="rounded-xl border bg-background p-6 shadow-soft">
                <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-foreground/85">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20 text-center">
        <span className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--gold)" }}>{p.gi.eyebrow}</span>
        <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">{p.gi.title}</h2>
        <p className="mt-4 leading-relaxed text-foreground/85">{p.gi.body}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {p.gi.tags.map((tag) => (
            <span key={tag} className="rounded-full border px-4 py-1.5 text-sm font-medium" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>
              {tag}
            </span>
          ))}
        </div>
      </section>

      {p.quote ? (
        <section className="px-4 pb-24 md:px-6">
          <blockquote
            className="mx-auto max-w-4xl rounded-3xl px-8 py-14 text-center"
            style={{ background: "var(--primary-light)" }}
          >
            <p className="font-display text-2xl italic leading-relaxed md:text-3xl">"{p.quote}"</p>
          </blockquote>
        </section>
      ) : null}
    </SiteShell>
  );
}
