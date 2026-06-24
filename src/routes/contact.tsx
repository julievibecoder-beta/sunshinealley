import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { WhatsAppCTA } from "@/components/site/WhatsAppButton";
import { PHONE_TEL, getWhatsAppLink } from "@/lib/whatsapp";
import { loadSiteContent, useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/contact")({
  head: () => {
    const s = loadSiteContent().contactPage.seo;
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
  component: Contact,
});


function Contact() {
  const p = useSiteContent().contactPage;
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: p.form.subjects[0] ?? "General Enquiry",
    message: "",
  });

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="text-center">
          <h1 className="font-display text-4xl font-semibold md:text-5xl">{p.header.title}</h1>
          <p className="mt-3 text-muted-foreground">{p.header.subtitle}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-8 shadow-soft">
            <h2 className="font-display text-2xl font-semibold">{p.details.sectionTitle}</h2>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-muted-foreground">{p.details.phoneLabel}</p>
                  <a href={`tel:${PHONE_TEL}`} className="font-medium hover:text-primary">{p.details.phoneDisplay}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 h-5 w-5" style={{ color: "var(--whatsapp)" }} />
                <div>
                  <p className="text-muted-foreground">{p.details.whatsappLabel}</p>
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary">
                    {p.details.whatsappLink}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-muted-foreground">{p.details.emailLabel}</p>
                  <a href={`mailto:${p.details.email}`} className="font-medium hover:text-primary">{p.details.email}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-muted-foreground">{p.details.addressLabel}</p>
                  <p className="font-medium">{p.details.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-muted-foreground">{p.details.hoursLabel}</p>
                  <p className="font-medium">{p.details.hours}</p>
                </div>
              </li>
            </ul>
            <div className="mt-8">
              <WhatsAppCTA size="lg" className="w-full">{p.details.whatsappCtaLabel}</WhatsAppCTA>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-8 shadow-soft">
            <h2 className="font-display text-2xl font-semibold">{p.form.sectionTitle}</h2>
            {submitted ? (
              <div className="mt-8 rounded-xl border p-6 text-center" style={{ background: "var(--primary-light)" }}>
                <p className="font-display text-xl font-semibold">{p.form.successTitle}</p>
                <p className="mt-2 text-sm text-foreground/80">{p.form.successText}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <Field label="Full Name" required>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="form-input"
                  />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Email" required>
                    <input
                      required type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="form-input"
                    />
                  </Field>
                  <Field label="Phone (optional)">
                    <input
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className="form-input"
                    />
                  </Field>
                </div>
                <Field label="Subject">
                  <select
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    className="form-input"
                  >
                    {p.form.subjects.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Message" required>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className="form-input resize-y"
                  />
                </Field>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
                  style={{ background: "var(--primary)" }}
                >
                  {p.form.submitLabel}
                </button>
              </form>
            )}
          </div>
        </div>

        {p.mapEmbedUrl ? (
          <div className="mt-14 overflow-hidden rounded-2xl border shadow-soft">
            <iframe
              title="Map"
              src={p.mapEmbedUrl}
              className="h-[360px] w-full"
              loading="lazy"
            />
          </div>
        ) : null}

        <div className="mt-14 rounded-2xl px-8 py-12 text-center" style={{ background: "var(--primary-light)" }}>
          <p className="font-display text-2xl font-semibold">{p.footerCta.title}</p>
          <p className="mt-2 text-foreground/80">{p.footerCta.text}</p>
          <div className="mt-6">
            <WhatsAppCTA size="lg">{p.footerCta.buttonLabel}</WhatsAppCTA>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      {children}
    </label>
  );
}
