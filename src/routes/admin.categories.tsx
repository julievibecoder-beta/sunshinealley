import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { useCategories, saveCategories, type CategoryDef } from "@/lib/store";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const categories = useCategories();
  const [editing, setEditing] = useState<CategoryDef | null>(null);

  const startNew = () =>
    setEditing({ id: "", name: "", subcategories: [] });
  const startEdit = (c: CategoryDef) => setEditing({ ...c, subcategories: [...c.subcategories] });

  const remove = (id: string) => {
    if (!confirm("Delete this category? Products in it will keep the name as plain text.")) return;
    saveCategories(categories.filter((c) => c.id !== id));
  };

  const submit = (draft: CategoryDef) => {
    const name = draft.name.trim();
    if (!name) return alert("Category name is required.");
    if (
      categories.some(
        (c) => c.name.toLowerCase() === name.toLowerCase() && c.id !== draft.id,
      )
    ) {
      return alert("A category with that name already exists.");
    }
    const cleaned = {
      ...draft,
      name,
      subcategories: draft.subcategories.map((s) => s.trim()).filter(Boolean),
    };
    if (draft.id) {
      saveCategories(categories.map((c) => (c.id === draft.id ? cleaned : c)));
    } else {
      cleaned.id = `c-${Date.now()}`;
      saveCategories([...categories, cleaned]);
    }
    setEditing(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            {categories.length} categories
          </p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-primary-foreground"
          style={{ background: "var(--primary)" }}
        >
          <Plus className="h-4 w-4" /> New category
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {categories.map((c) => (
          <div key={c.id} className="rounded-xl border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-semibold">{c.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {c.subcategories.length} subcategories
                </p>
              </div>
              <div className="flex gap-2">
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
            {c.subcategories.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.subcategories.map((s) => (
                  <span key={s} className="rounded-full bg-muted px-2.5 py-0.5 text-xs">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
            No categories yet.
          </p>
        )}
      </div>

      {editing && (
        <CategoryEditor
          draft={editing}
          onChange={setEditing}
          onCancel={() => setEditing(null)}
          onSubmit={submit}
        />
      )}
    </div>
  );
}

function CategoryEditor({
  draft,
  onChange,
  onCancel,
  onSubmit,
}: {
  draft: CategoryDef;
  onChange: (d: CategoryDef) => void;
  onCancel: () => void;
  onSubmit: (d: CategoryDef) => void;
}) {
  const [newSub, setNewSub] = useState("");

  const addSub = () => {
    const v = newSub.trim();
    if (!v) return;
    if (draft.subcategories.some((s) => s.toLowerCase() === v.toLowerCase())) {
      setNewSub("");
      return;
    }
    onChange({ ...draft, subcategories: [...draft.subcategories, v] });
    setNewSub("");
  };

  const removeSub = (s: string) => {
    onChange({ ...draft, subcategories: draft.subcategories.filter((x) => x !== s) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/60 p-4" onClick={onCancel}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(draft);
        }}
        className="my-8 w-full max-w-lg rounded-2xl bg-background p-6 shadow-warm md:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">
            {draft.id ? "Edit category" : "New category"}
          </h2>
          <button type="button" onClick={onCancel} className="rounded-full p-2 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <label className="mt-6 block text-sm">
          <span className="mb-1 block font-medium">Name</span>
          <input
            required
            value={draft.name}
            onChange={(e) => onChange({ ...draft, name: e.target.value })}
            className="w-full rounded-md border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <div className="mt-4">
          <span className="mb-1 block text-sm font-medium">Subcategories</span>
          <div className="flex flex-wrap gap-1.5">
            {draft.subcategories.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs"
              >
                {s}
                <button type="button" onClick={() => removeSub(s)} aria-label={`Remove ${s}`}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {draft.subcategories.length === 0 && (
              <span className="text-xs text-muted-foreground">No subcategories yet.</span>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={newSub}
              onChange={(e) => setNewSub(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSub();
                }
              }}
              placeholder="Add subcategory…"
              className="flex-1 rounded-md border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="button"
              onClick={addSub}
              className="rounded-md border px-3 py-2 text-sm hover:border-primary hover:text-primary"
            >
              Add
            </button>
          </div>
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
            {draft.id ? "Save changes" : "Create category"}
          </button>
        </div>
      </form>
    </div>
  );
}
