import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Star, X } from "lucide-react";
import {
  useProducts,
  useCraftsmen,
  saveProducts,
  slugify,
  type Product,
  type Category,
} from "@/lib/store";
import { categories } from "@/data/products";
import { formatPrice } from "@/lib/whatsapp";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

type Draft = Omit<Product, "id" | "slug" | "images"> & { id?: string; slug?: string; imagesText: string };

const emptyDraft = (): Draft => ({
  name: "",
  category: "Carpets",
  featured: false,
  price: undefined,
  description: "",
  dimensions: "",
  material: "",
  technique: "",
  craftsmanId: "",
  imagesText: "",
  inStock: true,
});

function AdminProducts() {
  const products = useProducts();
  const craftsmen = useCraftsmen();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Draft | null>(null);

  const filtered = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()),
      ),
    [products, search],
  );

  const startNew = () => setEditing(emptyDraft());
  const startEdit = (p: Product) =>
    setEditing({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      featured: p.featured,
      price: p.price,
      description: p.description,
      dimensions: p.dimensions,
      material: p.material,
      technique: p.technique,
      craftsmanId: p.craftsmanId,
      imagesText: p.images.join("\n"),
      inStock: p.inStock,
    });

  const remove = (id: string) => {
    if (!confirm("Delete this product?")) return;
    saveProducts(products.filter((p) => p.id !== id));
  };

  const togglePublish = (p: Product) => {
    saveProducts(products.map((x) => (x.id === p.id ? { ...x, inStock: !x.inStock } : x)));
  };

  const submit = (draft: Draft) => {
    if (!draft.name.trim()) return alert("Name is required.");
    const images = draft.imagesText
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const finalImages = images.length > 0 ? images : [`https://picsum.photos/seed/${slugify(draft.name)}/800/800`];

    if (draft.id) {
      const next = products.map((p) =>
        p.id === draft.id
          ? {
              ...p,
              name: draft.name.trim(),
              category: draft.category,
              featured: draft.featured,
              price: draft.price,
              description: draft.description,
              dimensions: draft.dimensions,
              material: draft.material,
              technique: draft.technique,
              craftsmanId: draft.craftsmanId,
              inStock: draft.inStock,
              images: finalImages,
            }
          : p,
      );
      saveProducts(next);
    } else {
      const id = Date.now().toString();
      let slug = slugify(draft.name);
      const existing = new Set(products.map((p) => p.slug));
      if (existing.has(slug)) slug = `${slug}-${id.slice(-4)}`;
      const next: Product = {
        id,
        slug,
        name: draft.name.trim(),
        category: draft.category,
        featured: draft.featured,
        price: draft.price,
        description: draft.description,
        dimensions: draft.dimensions,
        material: draft.material,
        technique: draft.technique,
        craftsmanId: draft.craftsmanId,
        inStock: draft.inStock,
        images: finalImages,
      };
      saveProducts([next, ...products]);
    }
    setEditing(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} pieces in catalogue</p>
        </div>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-primary-foreground"
          style={{ background: "var(--primary)" }}
        >
          <Plus className="h-4 w-4" /> New product
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or category…"
        className="mt-4 w-full rounded-md border bg-card px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
      />

      <div className="mt-4 overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.images[0] && (
                      <img src={p.images[0]} alt="" className="h-10 w-10 rounded object-cover" />
                    )}
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.slug}</div>
                    </div>
                    {p.featured && (
                      <Star className="h-4 w-4" style={{ color: "var(--gold)" }} fill="currentColor" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => togglePublish(p)}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      p.inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.inStock ? "Published" : "Hidden"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => startEdit(p)}
                    className="mr-2 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:border-primary hover:text-primary"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:border-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  No products match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductEditor
          draft={editing}
          craftsmenOptions={craftsmen}
          onChange={setEditing}
          onCancel={() => setEditing(null)}
          onSubmit={submit}
        />
      )}
    </div>
  );
}

function ProductEditor({
  draft,
  craftsmenOptions,
  onChange,
  onCancel,
  onSubmit,
}: {
  draft: Draft;
  craftsmenOptions: { id: string; name: string }[];
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
            {draft.id ? "Edit product" : "New product"}
          </h2>
          <button type="button" onClick={onCancel} className="rounded-full p-2 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Name" full>
            <input
              required
              value={draft.name}
              onChange={(e) => update("name", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Category">
            <select
              value={draft.category}
              onChange={(e) => update("category", e.target.value as Category)}
              className="input"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Price (INR)">
            <input
              type="number"
              value={draft.price ?? ""}
              onChange={(e) => update("price", e.target.value ? Number(e.target.value) : undefined)}
              className="input"
            />
          </Field>
          <Field label="Dimensions">
            <input value={draft.dimensions} onChange={(e) => update("dimensions", e.target.value)} className="input" />
          </Field>
          <Field label="Material">
            <input value={draft.material} onChange={(e) => update("material", e.target.value)} className="input" />
          </Field>
          <Field label="Technique" full>
            <input value={draft.technique} onChange={(e) => update("technique", e.target.value)} className="input" />
          </Field>
          <Field label="Craftsman" full>
            <select
              value={draft.craftsmanId}
              onChange={(e) => update("craftsmanId", e.target.value)}
              className="input"
            >
              <option value="">— None —</option>
              {craftsmenOptions.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Description" full>
            <textarea
              rows={4}
              value={draft.description}
              onChange={(e) => update("description", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Image URLs (one per line)" full>
            <textarea
              rows={3}
              value={draft.imagesText}
              onChange={(e) => update("imagesText", e.target.value)}
              placeholder="https://…"
              className="input font-mono text-xs"
            />
          </Field>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.inStock}
              onChange={(e) => update("inStock", e.target.checked)}
            />
            Published (in stock)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(e) => update("featured", e.target.checked)}
            />
            Featured on home page
          </label>
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
            {draft.id ? "Save changes" : "Create product"}
          </button>
        </div>

        <style>{`
          .input {
            width: 100%;
            border: 1px solid var(--border);
            background: var(--card);
            border-radius: 0.5rem;
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            outline: none;
          }
          .input:focus { box-shadow: 0 0 0 2px color-mix(in oklab, var(--primary) 30%, transparent); }
        `}</style>
      </form>
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block text-sm ${full ? "md:col-span-2" : ""}`}>
      <span className="mb-1 block font-medium">{label}</span>
      {children}
    </label>
  );
}
