import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Pencil, X, Check } from "lucide-react";
import {
  useCategories,
  saveCategories,
  saveCategoriesWithCascade,
  type CategoryDef,
} from "@/lib/store";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

interface SubItem {
  /** Original name when the editor opened. Empty for newly added subs. */
  original: string;
  /** Current (possibly edited) name. */
  name: string;
}

interface DraftState {
  id: string;
  /** Original category name when editor opened. Empty for new categories. */
  originalName: string;
  name: string;
  subs: SubItem[];
}

function AdminCategories() {
  const categories = useCategories();
  const [editing, setEditing] = useState<DraftState | null>(null);

  const startNew = () =>
    setEditing({ id: "", originalName: "", name: "", subs: [] });

  const startEdit = (c: CategoryDef) =>
    setEditing({
      id: c.id,
      originalName: c.name,
      name: c.name,
      subs: c.subcategories.map((s) => ({ original: s, name: s })),
    });

  const remove = (id: string) => {
    if (
      !confirm(
        "Delete this category? Products in it will keep the category name as plain text.",
      )
    )
      return;
    saveCategories(categories.filter((c) => c.id !== id));
  };

  const submit = (draft: DraftState) => {
    const name = draft.name.trim();
    if (!name) return alert("Category name is required.");
    if (
      categories.some(
        (c) => c.name.toLowerCase() === name.toLowerCase() && c.id !== draft.id,
      )
    ) {
      return alert("A category with that name already exists.");
    }

    // Clean & dedupe subs (case-insensitive on current name).
    const seen = new Set<string>();
    const cleanedSubs: SubItem[] = [];
    for (const s of draft.subs) {
      const n = s.name.trim();
      if (!n) continue;
      const k = n.toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k);
      cleanedSubs.push({ original: s.original, name: n });
    }

    const cleaned: CategoryDef = {
      id: draft.id || `c-${Date.now()}`,
      name,
      subcategories: cleanedSubs.map((s) => s.name),
    };

    // Build cascade rename maps.
    const categoryRenames: Record<string, string> = {};
    if (draft.originalName && draft.originalName !== name) {
      categoryRenames[draft.originalName] = name;
    }
    const subRenameMap: Record<string, string> = {};
    for (const s of cleanedSubs) {
      if (s.original && s.original !== s.name) {
        subRenameMap[s.original] = s.name;
      }
    }
    const subRenames: Record<string, Record<string, string>> = {};
    if (Object.keys(subRenameMap).length > 0) {
      // Cascade is keyed by the NEW category name (post-rename).
      subRenames[name] = subRenameMap;
    }

    const next = draft.id
      ? categories.map((c) => (c.id === draft.id ? cleaned : c))
      : [...categories, cleaned];

    saveCategoriesWithCascade(next, categoryRenames, subRenames);
    setEditing(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            {categories.length} categories — renaming a category or
            subcategory automatically updates linked products.
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
              <div className="mt-3 max-h-40 overflow-y-auto pr-1">
                <div className="flex flex-wrap gap-1.5">
                  {c.subcategories.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
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
  draft: DraftState;
  onChange: (d: DraftState) => void;
  onCancel: () => void;
  onSubmit: (d: DraftState) => void;
}) {
  const [newSub, setNewSub] = useState("");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");




  const addSub = () => {
    const v = newSub.trim();
    if (!v) return;
    if (
      draft.subs.some((s) => s.name.toLowerCase() === v.toLowerCase())
    ) {
      setNewSub("");
      return;
    }
    onChange({
      ...draft,
      subs: [...draft.subs, { original: "", name: v }],
    });
    setNewSub("");
  };

  const removeSub = (idx: number) => {
    onChange({ ...draft, subs: draft.subs.filter((_, i) => i !== idx) });
    if (editIdx === idx) setEditIdx(null);
  };

  const startSubEdit = (idx: number) => {
    setEditIdx(idx);
    setEditValue(draft.subs[idx].name);
  };

  const commitSubEdit = () => {
    if (editIdx === null) return;
    const v = editValue.trim();
    if (!v) {
      setEditIdx(null);
      return;
    }
    if (
      draft.subs.some(
        (s, i) => i !== editIdx && s.name.toLowerCase() === v.toLowerCase(),
      )
    ) {
      alert("Another subcategory already has that name.");
      return;
    }
    const subs = draft.subs.map((s, i) =>
      i === editIdx ? { ...s, name: v } : s,
    );
    onChange({ ...draft, subs });
    setEditIdx(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/60 p-4"
      onClick={onCancel}
    >
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
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full p-2 hover:bg-muted"
          >
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
          {draft.originalName && draft.name.trim() !== draft.originalName && (
            <span className="mt-1 block text-xs text-muted-foreground">
              Products linked to “{draft.originalName}” will be re-linked to “
              {draft.name.trim()}”.
            </span>
          )}
        </label>

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium">
              Subcategories ({draft.subs.length})
            </span>
            <span className="text-xs text-muted-foreground">
              Click the pencil to rename
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto rounded-md border bg-card p-2">
            {draft.subs.length === 0 ? (
              <p className="px-1 py-2 text-xs text-muted-foreground">
                No subcategories yet.
              </p>
            ) : (
              <ul className="divide-y">
                {draft.subs.map((s, idx) => {
                  const isEditing = editIdx === idx;
                  const renamed = s.original && s.original !== s.name;
                  return (
                    <li
                      key={`${s.original}|${idx}`}
                      className="flex items-center gap-2 px-1 py-1.5"
                    >
                      {isEditing ? (
                        <>
                          <input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                commitSubEdit();
                              } else if (e.key === "Escape") {
                                e.preventDefault();
                                setEditIdx(null);
                              }
                            }}
                            className="flex-1 rounded border bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                          />
                          <button
                            type="button"
                            onClick={commitSubEdit}
                            className="rounded p-1 text-primary hover:bg-muted"
                            aria-label="Save"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditIdx(null)}
                            className="rounded p-1 hover:bg-muted"
                            aria-label="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 truncate text-sm">
                            {s.name}
                            {renamed && (
                              <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-900">
                                renamed from “{s.original}”
                              </span>
                            )}
                            {!s.original && (
                              <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-900">
                                new
                              </span>
                            )}
                          </span>
                          <button
                            type="button"
                            onClick={() => startSubEdit(idx)}
                            className="rounded p-1 hover:bg-muted hover:text-primary"
                            aria-label={`Rename ${s.name}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSub(idx)}
                            className="rounded p-1 hover:bg-muted hover:text-destructive"
                            aria-label={`Remove ${s.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
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
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
          >
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
