import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useCraftsmen, saveCraftsmen, type Craftsman } from "@/lib/store";

export const Route = createFileRoute("/admin/craftsmen")({
  component: AdminCraftsmen,
});

type Draft = Craftsman;

const emptyDraft = (): Draft => ({
  id: "",
  name: "",
  specialty: "",
  location: "",
  years: "",
  bioShort: "",
  bioFull: "",
  image: "",
});

function AdminCraftsmen() {
  const craftsmen = useCraftsmen();
  const [editing, setEditing] = useState<Draft | null>(null);

  const startNew = () => setEditing({ ...emptyDraft(), id: "" });
  const startEdit = (c: Craftsman) => setEditing({ ...c });

  const remove = (id: string) => {
    if (!confirm("Delete this craftsman?")) return;
    saveCraftsmen(craftsmen.filter((c) => c.id !== id));
  };

  const submit = (draft: Draft) => {
    if (!draft.name.trim()) return alert("Name is required.");
    const finalImage = draft.image.trim() || `https://picsum.photos/seed/${draft.name.replace(/\s+/g, "-")}/600/800`;
    if (draft.id) {
      saveCraftsmen(craftsmen.map((c) => (c.id === draft.id ? { ...draft, image: finalImage } : c)));
    } else {
      const id = Date.now().toString();
      saveCraftsmen([{ ...draft, id, image: finalImage }, ...craftsmen]);
    }
    setEditing(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Craftsmen</h1>
          <p className="text-sm text-muted-foreground">{craftsmen.length} artisans</p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-primary-foreground"
          style={{ background: "var(--primary)" }}
        >
          <Plus className="h-4 w-4" /> New craftsman
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {craftsmen.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-xl border bg-card">
            <img src={c.image} alt={c.name} className="aspect-[4/3] w-full object-cover" />
            <div className="p-4">
              <h3 className="font-display text-lg font-semibold">{c.name}</h3>
              <p className="text-xs text-muted-foreground">{c.specialty}</p>
              <p className="text-xs text-muted-foreground">{c.location} · {c.years}</p>
              <p className="mt-2 line-clamp-3 text-sm text-foreground/80">{c.bioShort}</p>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={() => startEdit(c)}
                  className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:border-primary hover:text-primary"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => remove(c.id)}
                  className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:border-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <CraftsmanEditor
          draft={editing}
          onChange={setEditing}
          onCancel={() => setEditing(null)}
          onSubmit={submit}
        />
      )}
    </div>
  );
}

function CraftsmanEditor({
  draft,
  onChange,
  onCancel,
  onSubmit,
}: {
  draft: Draft;
  onChange: (d: Draft) => void;
  onCancel: () => void;
  onSubmit: (d: Draft) => void;
}) {
  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => onChange({ ...draft, [key]: value });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/60 p-4" onClick={onCancel}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(draft);
        }}
        className="my-8 w-full max-w-2xl rounded-2xl bg-background p-6 shadow-warm md:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">
            {draft.id ? "Edit craftsman" : "New craftsman"}
          </h2>
          <button type="button" onClick={onCancel} className="rounded-full p-2 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <F label="Name" full>
            <input required value={draft.name} onChange={(e) => update("name", e.target.value)} className="i" />
          </F>
          <F label="Specialty">
            <input value={draft.specialty} onChange={(e) => update("specialty", e.target.value)} className="i" />
          </F>
          <F label="Location">
            <input value={draft.location} onChange={(e) => update("location", e.target.value)} className="i" />
          </F>
          <F label="Years of experience" full>
            <input value={draft.years} onChange={(e) => update("years", e.target.value)} placeholder="e.g. 30+ years" className="i" />
          </F>
          <F label="Image URL" full>
            <input value={draft.image} onChange={(e) => update("image", e.target.value)} placeholder="https://…" className="i" />
          </F>
          <F label="Short bio (card)" full>
            <textarea rows={2} value={draft.bioShort} onChange={(e) => update("bioShort", e.target.value)} className="i" />
          </F>
          <F label="Full bio (modal)" full>
            <textarea rows={5} value={draft.bioFull} onChange={(e) => update("bioFull", e.target.value)} className="i" />
          </F>
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-md border px-4 py-2 text-sm hover:bg-muted">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md px-4 py-2 text-sm font-medium text-primary-foreground"
            style={{ background: "var(--primary)" }}
          >
            {draft.id ? "Save changes" : "Create craftsman"}
          </button>
        </div>

        <style>{`
          .i {
            width: 100%;
            border: 1px solid var(--border);
            background: var(--card);
            border-radius: 0.5rem;
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            outline: none;
          }
          .i:focus { box-shadow: 0 0 0 2px color-mix(in oklab, var(--primary) 30%, transparent); }
        `}</style>
      </form>
    </div>
  );
}

function F({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block text-sm ${full ? "md:col-span-2" : ""}`}>
      <span className="mb-1 block font-medium">{label}</span>
      {children}
    </label>
  );
}
