import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  useSiteContent,
  saveSiteContent,
  resetSiteContent,
  type SiteContent,
  type ContactPage,
} from "@/lib/site-content";
import { SeoSection } from "@/components/admin/SeoSection";
import {
  PageHeader,
  Section,
  Field,
  Grid2,
  TextInput,
  TextArea,
} from "@/components/admin/EditorUI";


export const Route = createFileRoute("/admin/contact")({ component: AdminContact });

function AdminContact() {
  const router = useRouter();
  const live = useSiteContent();
  const [draft, setDraft] = useState<SiteContent>(live);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  useEffect(() => {
    setDraft(live);
  }, [live]);

  const p = draft.contactPage;
  const setP = (patch: Partial<ContactPage>) =>
    setDraft((d) => ({ ...d, contactPage: { ...d.contactPage, ...patch } }));

  const onSave = async () => {
    setSaveError(null);
    setSaving(true);
    try {
      await saveSiteContent(draft);
      await router.invalidate({ sync: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      const err = e as { message?: string; status?: number };
      setSaveError(
        err?.status === 401
          ? "Not authorized — please log in again."
          : `Save failed — ${err?.message ?? String(e)}`,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        title="Contact page"
        subtitle="Edit headings, contact details, form labels and map."
        saved={saved}
        saving={saving}
        onSave={onSave}
        onReset={() => {
          if (confirm("Reset ALL site content to defaults?")) {
            resetSiteContent();
          }
        }}
      />
      {saveError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {saveError}
        </div>
      )}

      <SeoSection value={p.seo} onChange={(seo) => setP({ seo })} />

      <Section title="Header">

        <Field label="Title">
          <TextInput value={p.header.title} onChange={(v) => setP({ header: { ...p.header, title: v } })} />
        </Field>
        <Field label="Subtitle">
          <TextArea value={p.header.subtitle} onChange={(v) => setP({ header: { ...p.header, subtitle: v } })} />
        </Field>
      </Section>

      <Section title="Contact details">
        <Field label="Section title">
          <TextInput
            value={p.details.sectionTitle}
            onChange={(v) => setP({ details: { ...p.details, sectionTitle: v } })}
          />
        </Field>
        <Grid2>
          <Field label="Phone label">
            <TextInput
              value={p.details.phoneLabel}
              onChange={(v) => setP({ details: { ...p.details, phoneLabel: v } })}
            />
          </Field>
          <Field label="Phone (display)">
            <TextInput
              value={p.details.phoneDisplay}
              onChange={(v) => setP({ details: { ...p.details, phoneDisplay: v } })}
            />
          </Field>
        </Grid2>
        <Grid2>
          <Field label="WhatsApp label">
            <TextInput
              value={p.details.whatsappLabel}
              onChange={(v) => setP({ details: { ...p.details, whatsappLabel: v } })}
            />
          </Field>
          <Field label="WhatsApp link text">
            <TextInput
              value={p.details.whatsappLink}
              onChange={(v) => setP({ details: { ...p.details, whatsappLink: v } })}
            />
          </Field>
        </Grid2>
        <Grid2>
          <Field label="Email label">
            <TextInput
              value={p.details.emailLabel}
              onChange={(v) => setP({ details: { ...p.details, emailLabel: v } })}
            />
          </Field>
          <Field label="Email address">
            <TextInput
              value={p.details.email}
              onChange={(v) => setP({ details: { ...p.details, email: v } })}
            />
          </Field>
        </Grid2>
        <Grid2>
          <Field label="Address label">
            <TextInput
              value={p.details.addressLabel}
              onChange={(v) => setP({ details: { ...p.details, addressLabel: v } })}
            />
          </Field>
          <Field label="Address">
            <TextInput
              value={p.details.address}
              onChange={(v) => setP({ details: { ...p.details, address: v } })}
            />
          </Field>
        </Grid2>
        <Grid2>
          <Field label="Hours label">
            <TextInput
              value={p.details.hoursLabel}
              onChange={(v) => setP({ details: { ...p.details, hoursLabel: v } })}
            />
          </Field>
          <Field label="Hours">
            <TextInput
              value={p.details.hours}
              onChange={(v) => setP({ details: { ...p.details, hours: v } })}
            />
          </Field>
        </Grid2>
        <Field label="WhatsApp button label">
          <TextInput
            value={p.details.whatsappCtaLabel}
            onChange={(v) => setP({ details: { ...p.details, whatsappCtaLabel: v } })}
          />
        </Field>
      </Section>

      <Section title="Contact form">
        <Grid2>
          <Field label="Section title">
            <TextInput
              value={p.form.sectionTitle}
              onChange={(v) => setP({ form: { ...p.form, sectionTitle: v } })}
            />
          </Field>
          <Field label="Submit button label">
            <TextInput
              value={p.form.submitLabel}
              onChange={(v) => setP({ form: { ...p.form, submitLabel: v } })}
            />
          </Field>
        </Grid2>
        <Grid2>
          <Field label="Success title">
            <TextInput
              value={p.form.successTitle}
              onChange={(v) => setP({ form: { ...p.form, successTitle: v } })}
            />
          </Field>
          <Field label="Success text">
            <TextInput
              value={p.form.successText}
              onChange={(v) => setP({ form: { ...p.form, successText: v } })}
            />
          </Field>
        </Grid2>
        <Field label="Subject options (one per line)">
          <TextArea
            value={p.form.subjects.join("\n")}
            onChange={(v) =>
              setP({ form: { ...p.form, subjects: v.split("\n").map((s) => s.trim()).filter(Boolean) } })
            }
            rows={4}
          />
        </Field>
      </Section>

      <Section title="Map">
        <Field label="Map embed URL (iframe src)">
          <TextArea value={p.mapEmbedUrl} onChange={(v) => setP({ mapEmbedUrl: v })} />
        </Field>
      </Section>

      <Section title="Footer CTA">
        <Grid2>
          <Field label="Title">
            <TextInput value={p.footerCta.title} onChange={(v) => setP({ footerCta: { ...p.footerCta, title: v } })} />
          </Field>
          <Field label="Button label">
            <TextInput
              value={p.footerCta.buttonLabel}
              onChange={(v) => setP({ footerCta: { ...p.footerCta, buttonLabel: v } })}
            />
          </Field>
        </Grid2>
        <Field label="Text">
          <TextArea value={p.footerCta.text} onChange={(v) => setP({ footerCta: { ...p.footerCta, text: v } })} />
        </Field>
      </Section>
    </div>
  );
}
