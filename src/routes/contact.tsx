import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { WhatsAppCTA } from "@/components/site/WhatsAppButton";
import { ADDRESS, EMAIL, PHONE_DISPLAY, PHONE_TEL, getWhatsAppLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Kashmir Crafts" },
      { name: "description", content: "Get in touch with Kashmir Crafts. WhatsApp, phone, email, or visit our shop in Lal Chowk, Srinagar." },
      { property: "og:title", content: "Contact Kashmir Crafts" },
      { property: "og:description", content: "Reach us on WhatsApp, phone or email — or visit us in Srinagar." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Enquiry",
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
          <h1 className="font-display text-4xl font-semibold md:text-5xl">Get in Touch</h1>
          <p className="mt-3 text-muted-foreground">
            We'd love to hear from you. Most customers reach us on WhatsApp.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* Details */}
          <div className="rounded-2xl border bg-card p-8 shadow-soft">
            <h2 className="font-display text-2xl font-semibold">Reach us directly</h2>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <a href={`tel:${PHONE_TEL}`} className="font-medium hover:text-primary">{PHONE_DISPLAY}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 h-5 w-5" style={{ color: "var(--whatsapp)" }} />
                <div>
                  <p className="text-muted-foreground">WhatsApp</p>
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary">
                    Chat with us on WhatsApp
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <a href={`mailto:${EMAIL}`} className="font-medium hover:text-primary">{EMAIL}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium">{ADDRESS}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-muted-foreground">Shop Hours</p>
                  <p className="font-medium">Mon–Sat · 10am–7pm IST</p>
                </div>
              </li>
            </ul>
            <div className="mt-8">
              <WhatsAppCTA size="lg" className="w-full">Chat with us on WhatsApp</WhatsAppCTA>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border bg-card p-8 shadow-soft">
            <h2 className="font-display text-2xl font-semibold">Send us a message</h2>
            {submitted ? (
              <div className="mt-8 rounded-xl border p-6 text-center" style={{ background: "var(--primary-light)" }}>
                <p className="font-display text-xl font-semibold">Thank you!</p>
                <p className="mt-2 text-sm text-foreground/80">We'll get back to you within 24 hours.</p>
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
                    <option>General Enquiry</option>
                    <option>Product Enquiry</option>
                    <option>Custom Order</option>
                    <option>Wholesale</option>
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
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="mt-14 overflow-hidden rounded-2xl border shadow-soft">
          <iframe
            title="Kashmir Crafts location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=74.79%2C34.07%2C74.83%2C34.10&layer=mapnik&marker=34.0837%2C74.7973"
            className="h-[360px] w-full"
            loading="lazy"
          />
        </div>

        {/* WhatsApp footer CTA */}
        <div className="mt-14 rounded-2xl px-8 py-12 text-center" style={{ background: "var(--primary-light)" }}>
          <p className="font-display text-2xl font-semibold">Prefer WhatsApp?</p>
          <p className="mt-2 text-foreground/80">Most customers reach us this way — and we usually reply within minutes.</p>
          <div className="mt-6">
            <WhatsAppCTA size="lg">Chat on WhatsApp</WhatsAppCTA>
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
