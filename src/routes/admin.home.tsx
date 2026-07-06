import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, RotateCcw, Plus, Trash2, Shield, MessageCircle, Users, Leaf, Star } from "lucide-react";
import {
  useSiteContent,
  saveSiteContent,
  resetSiteContent,
  type SiteContent,
  type TrustItem,
  type Testimonial,
} from "@/lib/site-content";
import { ImageUpload } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/home")({
  component: AdminHomeContent,
});

const iconOptions: { value: TrustItem["icon"]; label: string; Icon: typeof Shield }[] = [
  { value: "shield", label: "Shield", Icon: Shield },
  { value: "message", label: "Message", Icon: MessageCircle },
  { value: "users", label: "Users", Icon: Users },
  { value: "leaf", label: "Leaf", Icon: Leaf },
  { value: "star", label: "Star", Icon: Star },
];

function AdminHomeContent() {
  const live = useSiteContent();
  const [draft, setDraft] = useState<SiteContent>(live);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(live);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const [saveError, setSaveError] = useState<string | null>(null);
  const save = async () => {
    setSaveError(null);
    try {
      await saveSiteContent(draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: unknown) {
      const err = e as { message?: string; status?: number; response?: { status?: number } };
      const status = err?.status ?? err?.response?.status;
      const msg = err?.message || String(e);
      const full = status ? `${status}: ${msg}` : msg;
      console.error("[admin.home] saveSiteContent failed:", e);
      setSaveError(
        status === 401
          ? "Not authorized — your admin session expired. Please log in again."
          : `Save failed — ${full}`,
      );
    }
  };

  const addTrust = () => {
    if (draft.trust.length >= 6) return;
    update("trust", [
      ...draft.trust,
      { id: `t${Date.now()}`, icon: "star", title: "New highlight", text: "Short description" },
    ]);
  };
  const removeTrust = (id: string) =>
    update("trust", draft.trust.filter((t) => t.id !== id));
  const patchTrust = (id: string, patch: Partial<TrustItem>) =>
    update("trust", draft.trust.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const addTestimonial = () =>
    update("testimonials", [
      ...draft.testimonials,
      {
        id: `v${Date.now()}`,
        name: "New customer",
        location: "City, Country",
        quote: "Share what they said…",
        rating: 5,
        image: "",
      },
    ]);
  const removeTestimonial = (id: string) =>
    update("testimonials", draft.testimonials.filter((t) => t.id !== id));
  const patchTestimonial = (id: string, patch: Partial<Testimonial>) =>
    update("testimonials", draft.testimonials.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Home page content</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit every section visible on the public homepage.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (confirm("Reset home content to defaults?")) {
                resetSiteContent();
                setDraft({ ...draft });
              }
            }}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:border-destructive hover:text-destructive"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button
            onClick={save}
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-primary-foreground"
            style={{ background: "var(--primary)" }}
          >
            <Save className="h-4 w-4" /> {saved ? "Saved!" : "Save changes"}
          </button>
        </div>
      </div>
      {saveError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {saveError}
        </div>
      )}


      {/* HERO */}
      <Section title="Hero">
        <Field label="Background image">
          <ImageUpload
            value={draft.hero.image ? [draft.hero.image] : []}
            onChange={(v) => update("hero", { ...draft.hero, image: v[0] ?? "" })}
          />
        </Field>
        <Grid2>
          <Field label="Eyebrow">
            <TextInput value={draft.hero.eyebrow} onChange={(v) => update("hero", { ...draft.hero, eyebrow: v })} />
          </Field>
          <div />
          <Field label="Title line 1">
            <TextInput value={draft.hero.titleLine1} onChange={(v) => update("hero", { ...draft.hero, titleLine1: v })} />
          </Field>
          <Field label="Title line 2">
            <TextInput value={draft.hero.titleLine2} onChange={(v) => update("hero", { ...draft.hero, titleLine2: v })} />
          </Field>
        </Grid2>
        <Field label="Subtitle">
          <TextArea value={draft.hero.subtitle} onChange={(v) => update("hero", { ...draft.hero, subtitle: v })} />
        </Field>
        <Grid2>
          <Field label="Primary button label">
            <TextInput
              value={draft.hero.primaryCtaLabel}
              onChange={(v) => update("hero", { ...draft.hero, primaryCtaLabel: v })}
            />
          </Field>
          <Field label="Secondary button label">
            <TextInput
              value={draft.hero.secondaryCtaLabel}
              onChange={(v) => update("hero", { ...draft.hero, secondaryCtaLabel: v })}
            />
          </Field>
        </Grid2>
      </Section>

      {/* CATEGORIES SECTION */}
      <Section title="Categories section">
        <Grid2>
          <Field label="Title">
            <TextInput
              value={draft.categoriesSection.title}
              onChange={(v) => update("categoriesSection", { ...draft.categoriesSection, title: v })}
            />
          </Field>
          <Field label="Subtitle">
            <TextInput
              value={draft.categoriesSection.subtitle}
              onChange={(v) => update("categoriesSection", { ...draft.categoriesSection, subtitle: v })}
            />
          </Field>
        </Grid2>
        <p className="text-xs text-muted-foreground">
          Tiles are generated from the Categories admin page.
        </p>
      </Section>

      {/* FEATURED */}
      <Section title="Featured pieces section">
        <Grid2>
          <Field label="Title">
            <TextInput
              value={draft.featuredSection.title}
              onChange={(v) => update("featuredSection", { ...draft.featuredSection, title: v })}
            />
          </Field>
          <Field label="Subtitle">
            <TextInput
              value={draft.featuredSection.subtitle}
              onChange={(v) => update("featuredSection", { ...draft.featuredSection, subtitle: v })}
            />
          </Field>
        </Grid2>
        <p className="text-xs text-muted-foreground">
          Items shown come from products marked as featured in the Products admin page.
        </p>
      </Section>

      {/* HERITAGE */}
      <Section title="Heritage section">
        <Grid2>
          <Field label="Eyebrow">
            <TextInput value={draft.heritage.eyebrow} onChange={(v) => update("heritage", { ...draft.heritage, eyebrow: v })} />
          </Field>
          <Field label="Title">
            <TextInput value={draft.heritage.title} onChange={(v) => update("heritage", { ...draft.heritage, title: v })} />
          </Field>
        </Grid2>
        <Field label="Paragraph 1">
          <TextArea value={draft.heritage.body1} onChange={(v) => update("heritage", { ...draft.heritage, body1: v })} />
        </Field>
        <Field label="Paragraph 2">
          <TextArea value={draft.heritage.body2} onChange={(v) => update("heritage", { ...draft.heritage, body2: v })} />
        </Field>
        <Field label="Link label">
          <TextInput value={draft.heritage.ctaLabel} onChange={(v) => update("heritage", { ...draft.heritage, ctaLabel: v })} />
        </Field>
        <Field label="Image">
          <ImageUpload
            value={draft.heritage.image ? [draft.heritage.image] : []}
            onChange={(v) => update("heritage", { ...draft.heritage, image: v[0] ?? "" })}
          />
        </Field>
      </Section>

      {/* TRUST BAR */}
      <Section
        title="Trust bar"
        action={
          <button
            onClick={addTrust}
            disabled={draft.trust.length >= 6}
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:border-primary hover:text-primary disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Add item
          </button>
        }
      >
        <div className="space-y-3">
          {draft.trust.map((item) => (
            <div key={item.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="grid flex-1 gap-3 sm:grid-cols-[120px_1fr_1fr]">
                  <label className="block">
                    <span className="text-xs text-muted-foreground">Icon</span>
                    <select
                      value={item.icon}
                      onChange={(e) => patchTrust(item.id, { icon: e.target.value as TrustItem["icon"] })}
                      className="mt-1 w-full rounded-md border bg-card px-2 py-1.5 text-sm"
                    >
                      {iconOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </label>
                  <Field label="Title" tight>
                    <TextInput value={item.title} onChange={(v) => patchTrust(item.id, { title: v })} />
                  </Field>
                  <Field label="Text" tight>
                    <TextInput value={item.text} onChange={(v) => patchTrust(item.id, { text: v })} />
                  </Field>
                </div>
                <button
                  onClick={() => removeTrust(item.id)}
                  className="mt-5 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section
        title="Customer testimonials"
        action={
          <button
            onClick={addTestimonial}
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" /> Add testimonial
          </button>
        }
      >
        <Grid2>
          <Field label="Section title">
            <TextInput
              value={draft.testimonialsSection.title}
              onChange={(v) => update("testimonialsSection", { ...draft.testimonialsSection, title: v })}
            />
          </Field>
          <Field label="Section subtitle">
            <TextInput
              value={draft.testimonialsSection.subtitle}
              onChange={(v) => update("testimonialsSection", { ...draft.testimonialsSection, subtitle: v })}
            />
          </Field>
        </Grid2>

        <div className="mt-2 space-y-4">
          {draft.testimonials.map((t) => (
            <div key={t.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Testimonial
                </span>
                <button
                  onClick={() => removeTestimonial(t.id)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <Grid2>
                <Field label="Name" tight>
                  <TextInput value={t.name} onChange={(v) => patchTestimonial(t.id, { name: v })} />
                </Field>
                <Field label="Location" tight>
                  <TextInput value={t.location} onChange={(v) => patchTestimonial(t.id, { location: v })} />
                </Field>
              </Grid2>
              <Field label="Quote" tight>
                <TextArea value={t.quote} onChange={(v) => patchTestimonial(t.id, { quote: v })} />
              </Field>
              <Grid2>
                <Field label="Rating (1-5)" tight>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={t.rating}
                    onChange={(e) => patchTestimonial(t.id, { rating: Math.max(1, Math.min(5, Number(e.target.value) || 5)) })}
                    className="w-full rounded-md border bg-card px-3 py-2 text-sm"
                  />
                </Field>
                <Field label="Photo" tight>
                  <ImageUpload
                    value={t.image ? [t.image] : []}
                    onChange={(v) => patchTestimonial(t.id, { image: v[0] ?? "" })}
                  />
                </Field>
              </Grid2>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-background p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        {action}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children, tight }: { label: string; children: React.ReactNode; tight?: boolean }) {
  return (
    <label className={`block ${tight ? "" : ""}`}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function TextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
    />
  );
}

function TextArea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="w-full rounded-md border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
    />
  );
}
