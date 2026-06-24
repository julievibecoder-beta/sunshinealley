import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { loadSiteContent, useSiteContent } from "@/lib/site-content";
import { aboutIconMap } from "@/lib/about-icons";

export const Route = createFileRoute("/about")({
  head: () => {
    const s = loadSiteContent().aboutPage.seo;
    return {
      meta: [
        { title: s.title },
        { name: "description", content: s.description },
        { property: "og:title", content: s.title },
        { property: "og:description", content: s.description },
        ...(s.ogImage ? [{ property: "og:image" as const, content: s.ogImage }] : []),
      ],
    };
  },
  component: About,
});


function About() {
  const p = useSiteContent().aboutPage;
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-primary">{p.story.eyebrow}</span>
            <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{p.story.title}</h1>
            <p className="mt-5 leading-relaxed text-foreground/85">{p.story.body1}</p>
            {p.story.body2 ? <p className="mt-3 leading-relaxed text-foreground/85">{p.story.body2}</p> : null}

            {(p.story.founderName || p.story.founderImage) && (
              <div className="mt-8 flex items-center gap-4 rounded-xl border bg-card p-4 shadow-soft">
                {p.story.founderImage ? (
                  <img
                    src={p.story.founderImage}
                    alt={p.story.founderName || "Founder"}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : null}
                <div>
                  <p className="font-display text-lg font-semibold">{p.story.founderName}</p>
                  <p className="text-sm text-muted-foreground">{p.story.founderTitle}</p>
                </div>
              </div>
            )}
          </div>
          {p.story.sideImage ? (
            <img
              src={p.story.sideImage}
              alt={p.story.title}
              className="aspect-[4/5] w-full rounded-2xl object-cover shadow-warm"
            />
          ) : null}
        </div>
      </section>

      <section className="bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">{p.reasonsSection.title}</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {p.reasons.map((r) => {
              const Icon = aboutIconMap[r.icon];
              return (
                <div key={r.id} className="rounded-xl border bg-background p-6">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ background: "var(--primary-light)", color: "var(--primary-dark)" }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">{r.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">{p.valuesSection.title}</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {p.values.map((v) => {
            const Icon = aboutIconMap[v.icon];
            return (
              <div key={v.id} className="rounded-2xl p-8 text-center shadow-soft" style={{ background: "var(--primary-light)" }}>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "var(--primary)", color: "white" }}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/80">{v.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </SiteShell>
  );
}
