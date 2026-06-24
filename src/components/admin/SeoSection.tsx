import type { SeoMeta } from "@/lib/site-content";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Section, Field, TextInput, TextArea } from "@/components/admin/EditorUI";

export function SeoSection({
  value,
  onChange,
}: {
  value: SeoMeta;
  onChange: (next: SeoMeta) => void;
}) {
  return (
    <Section title="SEO & social sharing">
      <p className="-mt-2 text-xs text-muted-foreground">
        Controls the browser tab title, search-result snippet, and the preview image used when this page is shared
        on social media or messaging apps.
      </p>
      <Field label="Page title (≤ 60 characters recommended)">
        <TextInput value={value.title} onChange={(v) => onChange({ ...value, title: v })} />
      </Field>
      <Field label="Meta description (≤ 160 characters recommended)">
        <TextArea value={value.description} onChange={(v) => onChange({ ...value, description: v })} rows={3} />
      </Field>
      <Field label="Open Graph image (1200×630 recommended)">
        <ImageUpload
          value={value.ogImage ? [value.ogImage] : []}
          onChange={(v) => onChange({ ...value, ogImage: v[0] ?? "" })}
        />
      </Field>
    </Section>
  );
}
