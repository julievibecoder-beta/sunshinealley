import { Save, RotateCcw } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  onSave,
  onReset,
  saved,
}: {
  title: string;
  subtitle: string;
  onSave: () => void;
  onReset: () => void;
  saved: boolean;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-display text-3xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:border-destructive hover:text-destructive"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
        <button
          onClick={onSave}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-primary-foreground"
          style={{ background: "var(--primary)" }}
        >
          <Save className="h-4 w-4" /> {saved ? "Saved!" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

export function Section({
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

export function Field({ label, children }: { label: string; children: React.ReactNode; tight?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function TextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
    />
  );
}

export function TextArea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full rounded-md border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
    />
  );
}

export function CardRow({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">{children}</div>
        <button
          onClick={onRemove}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
          aria-label="Remove"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
