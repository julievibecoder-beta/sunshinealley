import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  useSiteContent,
  saveSiteContent,
  resetSiteContent,
  type SiteContent,
  type AboutPage,
  type AboutCard,
  type AboutIcon,
} from "@/lib/site-content";
import { aboutIconOptions } from "@/lib/about-icons";
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


export const Route = createFileRoute("/admin/about")({ component: AdminAbout });

function AdminAbout() {
  const live = useSiteContent();
  const [draft, setDraft] = useState<SiteContent>(live);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setDraft(live);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const p = draft.aboutPage;
  const setP = (patch: Partial<AboutPage>) =>
    setDraft((d) => ({ ...d, aboutPage: { ...d.aboutPage, ...patch } }));

  const patchList = (key: "reasons" | "values", id: string, patch: Partial<AboutCard>) =>
    setP({ [key]: p[key].map((x) => (x.id === id ? { ...x, ...patch } : x)) } as Partial<AboutPage>);

  const renderList = (key: "reasons" | "values") =>
    p[key].map((it) => (
      <CardRow key={it.id} onRemove={() => setP({ [key]: p[key].filter((x) => x.id !== it.id) } as Partial<AboutPage>)}>
        <Grid2>
          <Field label="Icon">
            <select
              value={it.icon}
              onChange={(e) => patchList(key, it.id, { icon: e.target.value as AboutIcon })}
              className="w-full rounded-md border bg-card px-2 py-2 text-sm"
            >
              {aboutIconOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Title">
            <TextInput value={it.title} onChange={(v) => patchList(key, it.id, { title: v })} />
          </Field>
        </Grid2>
        <Field label="Text">
          <TextArea value={it.text} onChange={(v) => patchList(key, it.id, { text: v })} />
        </Field>
      </CardRow>
    ));

  const addCard = (key: "reasons" | "values") =>
    setP({
      [key]: [
        ...p[key],
        { id: `${key}${Date.now()}`, icon: "sparkles", title: "New item", text: "Description" },
      ],
    } as Partial<AboutPage>);

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        title="About page"
        subtitle="Edit the story, side image, founder card, reasons and values."
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

      <Section title="Story">

        <Grid2>
          <Field label="Eyebrow">
            <TextInput value={p.story.eyebrow} onChange={(v) => setP({ story: { ...p.story, eyebrow: v } })} />
          </Field>
          <Field label="Title">
            <TextInput value={p.story.title} onChange={(v) => setP({ story: { ...p.story, title: v } })} />
          </Field>
        </Grid2>
        <Field label="Paragraph 1">
          <TextArea value={p.story.body1} onChange={(v) => setP({ story: { ...p.story, body1: v } })} />
        </Field>
        <Field label="Paragraph 2">
          <TextArea value={p.story.body2} onChange={(v) => setP({ story: { ...p.story, body2: v } })} />
        </Field>
        <Field label="Side image (right of story)">
          <ImageUpload
            value={p.story.sideImage ? [p.story.sideImage] : []}
            onChange={(v) => setP({ story: { ...p.story, sideImage: v[0] ?? "" } })}
          />
        </Field>
        <Grid2>
          <Field label="Founder name">
            <TextInput value={p.story.founderName} onChange={(v) => setP({ story: { ...p.story, founderName: v } })} />
          </Field>
          <Field label="Founder title">
            <TextInput value={p.story.founderTitle} onChange={(v) => setP({ story: { ...p.story, founderTitle: v } })} />
          </Field>
        </Grid2>
        <Field label="Founder photo">
          <ImageUpload
            value={p.story.founderImage ? [p.story.founderImage] : []}
            onChange={(v) => setP({ story: { ...p.story, founderImage: v[0] ?? "" } })}
          />
        </Field>
      </Section>

      <Section
        title="Why buy from us"
        action={
          <button
            onClick={() => addCard("reasons")}
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" /> Add reason
          </button>
        }
      >
        <Field label="Section title">
          <TextInput
            value={p.reasonsSection.title}
            onChange={(v) => setP({ reasonsSection: { title: v } })}
          />
        </Field>
        <div className="space-y-3">{renderList("reasons")}</div>
      </Section>

      <Section
        title="Our values"
        action={
          <button
            onClick={() => addCard("values")}
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" /> Add value
          </button>
        }
      >
        <Field label="Section title">
          <TextInput
            value={p.valuesSection.title}
            onChange={(v) => setP({ valuesSection: { title: v } })}
          />
        </Field>
        <div className="space-y-3">{renderList("values")}</div>
      </Section>
    </div>
  );
}
