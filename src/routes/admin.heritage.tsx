import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  useSiteContent,
  saveSiteContent,
  resetSiteContent,
  type SiteContent,
  type HeritagePage,
} from "@/lib/site-content";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { SeoSection } from "@/components/admin/SeoSection";
import {
  PageHeader,
  Section,
  Field,
  Grid2,
  TextInput,
  TextArea,
  CardRow,
} from "@/components/admin/EditorUI";


export const Route = createFileRoute("/admin/heritage")({ component: AdminHeritage });

function AdminHeritage() {
  const live = useSiteContent();
  const [draft, setDraft] = useState<SiteContent>(live);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setDraft(live);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const p = draft.heritagePage;
  const setP = (patch: Partial<HeritagePage>) =>
    setDraft((d) => ({ ...d, heritagePage: { ...d.heritagePage, ...patch } }));

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        title="Heritage page"
        subtitle="Edit the heritage story, timeline, spotlights and GI tags."
        saved={saved}
        onSave={() => {
          saveSiteContent(draft);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }}
        onReset={() => {
          if (confirm("Reset ALL site content to defaults?")) {
            resetSiteContent();
            setDraft({ ...draft });
          }
        }}
      />

      <SeoSection value={p.seo} onChange={(seo) => setP({ seo })} />



      <Section title="Hero">
        <Field label="Hero image">
          <ImageUpload
            value={p.hero.image ? [p.hero.image] : []}
            onChange={(v) => setP({ hero: { ...p.hero, image: v[0] ?? "" } })}
          />
        </Field>
        <Field label="Title">
          <TextInput value={p.hero.title} onChange={(v) => setP({ hero: { ...p.hero, title: v } })} />
        </Field>
        <Field label="Subtitle">
          <TextArea value={p.hero.subtitle} onChange={(v) => setP({ hero: { ...p.hero, subtitle: v } })} />
        </Field>
      </Section>

      <Section
        title="Timeline"
        action={
          <button
            onClick={() =>
              setP({
                timeline: [
                  ...p.timeline,
                  { id: `h${Date.now()}`, era: "Year", title: "New milestone", text: "Description" },
                ],
              })
            }
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" /> Add entry
          </button>
        }
      >
        <Field label="Section title">
          <TextInput value={p.timelineSection.title} onChange={(v) => setP({ timelineSection: { title: v } })} />
        </Field>
        <div className="space-y-3">
          {p.timeline.map((t) => (
            <CardRow key={t.id} onRemove={() => setP({ timeline: p.timeline.filter((x) => x.id !== t.id) })}>
              <Grid2>
                <Field label="Era / Year">
                  <TextInput
                    value={t.era}
                    onChange={(v) => setP({ timeline: p.timeline.map((x) => (x.id === t.id ? { ...x, era: v } : x)) })}
                  />
                </Field>
                <Field label="Title">
                  <TextInput
                    value={t.title}
                    onChange={(v) => setP({ timeline: p.timeline.map((x) => (x.id === t.id ? { ...x, title: v } : x)) })}
                  />
                </Field>
              </Grid2>
              <Field label="Text">
                <TextArea
                  value={t.text}
                  onChange={(v) => setP({ timeline: p.timeline.map((x) => (x.id === t.id ? { ...x, text: v } : x)) })}
                />
              </Field>
            </CardRow>
          ))}
        </div>
      </Section>

      <Section
        title="Craft spotlights"
        action={
          <button
            onClick={() =>
              setP({
                spotlights: [
                  ...p.spotlights,
                  { id: `s${Date.now()}`, title: "New craft", text: "Short description" },
                ],
              })
            }
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" /> Add spotlight
          </button>
        }
      >
        <Grid2>
          <Field label="Section title">
            <TextInput
              value={p.spotlightSection.title}
              onChange={(v) => setP({ spotlightSection: { ...p.spotlightSection, title: v } })}
            />
          </Field>
          <Field label="Section subtitle">
            <TextInput
              value={p.spotlightSection.subtitle}
              onChange={(v) => setP({ spotlightSection: { ...p.spotlightSection, subtitle: v } })}
            />
          </Field>
        </Grid2>
        <div className="space-y-3">
          {p.spotlights.map((s) => (
            <CardRow key={s.id} onRemove={() => setP({ spotlights: p.spotlights.filter((x) => x.id !== s.id) })}>
              <Field label="Title">
                <TextInput
                  value={s.title}
                  onChange={(v) =>
                    setP({ spotlights: p.spotlights.map((x) => (x.id === s.id ? { ...x, title: v } : x)) })
                  }
                />
              </Field>
              <Field label="Text">
                <TextArea
                  value={s.text}
                  onChange={(v) =>
                    setP({ spotlights: p.spotlights.map((x) => (x.id === s.id ? { ...x, text: v } : x)) })
                  }
                />
              </Field>
            </CardRow>
          ))}
        </div>
      </Section>

      <Section title="GI protection section">
        <Grid2>
          <Field label="Eyebrow">
            <TextInput value={p.gi.eyebrow} onChange={(v) => setP({ gi: { ...p.gi, eyebrow: v } })} />
          </Field>
          <Field label="Title">
            <TextInput value={p.gi.title} onChange={(v) => setP({ gi: { ...p.gi, title: v } })} />
          </Field>
        </Grid2>
        <Field label="Body">
          <TextArea value={p.gi.body} onChange={(v) => setP({ gi: { ...p.gi, body: v } })} />
        </Field>
        <Field label="Tags (comma-separated)">
          <TextInput
            value={p.gi.tags.join(", ")}
            onChange={(v) =>
              setP({ gi: { ...p.gi, tags: v.split(",").map((s) => s.trim()).filter(Boolean) } })
            }
          />
        </Field>
      </Section>

      <Section title="Pull quote">
        <Field label="Quote">
          <TextArea value={p.quote} onChange={(v) => setP({ quote: v })} />
        </Field>
      </Section>
    </div>
  );
}
