import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Download, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  useProducts,
  useCategories,
  saveProducts,
  saveCategories,
} from "@/lib/store";
import { exportToExcel, importFromExcel, type ImportResult } from "@/lib/excel";

export const Route = createFileRoute("/admin/data")({
  component: AdminData,
});

function AdminData() {
  const products = useProducts();
  const categories = useCategories();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setDone(null);
    try {
      const result = await importFromExcel(file);
      setPreview(result);
    } catch (err) {
      setError((err as Error).message || "Failed to read file.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const applyImport = (mode: "replace" | "merge") => {
    if (!preview) return;
    if (mode === "replace") {
      if (!confirm("Replace ALL categories and products with the imported data?")) return;
      if (preview.categories.length) saveCategories(preview.categories);
      if (preview.products.length) saveProducts(preview.products);
    } else {
      const catByName = new Map(categories.map((c) => [c.name.toLowerCase(), c]));
      const mergedCats = [...categories];
      preview.categories.forEach((nc) => {
        const ex = catByName.get(nc.name.toLowerCase());
        if (ex) {
          const subs = new Set([...ex.subcategories, ...nc.subcategories]);
          const idx = mergedCats.findIndex((c) => c.id === ex.id);
          mergedCats[idx] = { ...ex, subcategories: Array.from(subs) };
        } else {
          mergedCats.push(nc);
        }
      });
      saveCategories(mergedCats);

      const bySlug = new Map(products.map((p) => [p.slug, p]));
      const merged = [...products];
      preview.products.forEach((np) => {
        const ex = bySlug.get(np.slug);
        if (ex) {
          const idx = merged.findIndex((p) => p.id === ex.id);
          merged[idx] = { ...np, id: ex.id };
        } else {
          merged.unshift(np);
        }
      });
      saveProducts(merged);
    }
    setDone(`Imported ${preview.categories.length} categories and ${preview.products.length} products.`);
    setPreview(null);
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Import / Export</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Move your full catalogue (categories, subcategories, products) via Excel.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: "var(--primary-light)", color: "var(--primary-dark)" }}
            >
              <Download className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-semibold">Export to Excel</h2>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Downloads an .xlsx file with two sheets — <strong>Categories</strong> and <strong>Products</strong> — reflecting your current catalogue.
          </p>
          <button
            onClick={() => exportToExcel(categories, products)}
            className="mt-4 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-primary-foreground"
            style={{ background: "var(--primary)" }}
          >
            <Download className="h-4 w-4" /> Download Excel
          </button>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: "var(--primary-light)", color: "var(--primary-dark)" }}
            >
              <Upload className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-semibold">Import from Excel</h2>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Upload an .xlsx with the same two sheets. You can preview before applying.
          </p>
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-4 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary"
          >
            <Upload className="h-4 w-4" /> Choose .xlsx file
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={onPickFile}
            className="hidden"
          />
        </div>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
          <span>{error}</span>
        </div>
      )}

      {done && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-green-300 bg-green-50 p-4 text-sm text-green-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" />
          <span>{done}</span>
        </div>
      )}

      {preview && (
        <div className="mt-6 rounded-xl border bg-card p-5">
          <h3 className="font-display text-lg font-semibold">Import preview</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Found <strong>{preview.categories.length}</strong> categories and{" "}
            <strong>{preview.products.length}</strong> products.
          </p>
          {preview.warnings.length > 0 && (
            <ul className="mt-3 list-disc pl-5 text-sm text-amber-700">
              {preview.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          )}

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-md border p-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Categories</p>
              <ul className="mt-2 max-h-48 overflow-y-auto text-sm">
                {preview.categories.map((c) => (
                  <li key={c.id}>
                    <span className="font-medium">{c.name}</span>{" "}
                    <span className="text-muted-foreground">
                      ({c.subcategories.join(", ") || "no subcategories"})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Products (first 10)</p>
              <ul className="mt-2 max-h-48 overflow-y-auto text-sm">
                {preview.products.slice(0, 10).map((p) => (
                  <li key={p.id}>
                    {p.name}{" "}
                    <span className="text-muted-foreground">
                      — {p.category}
                      {p.subcategory ? ` / ${p.subcategory}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => applyImport("merge")}
              className="rounded-md px-4 py-2 text-sm font-medium text-primary-foreground"
              style={{ background: "var(--primary)" }}
            >
              Merge into catalogue
            </button>
            <button
              onClick={() => applyImport("replace")}
              className="rounded-md border px-4 py-2 text-sm font-medium hover:border-destructive hover:text-destructive"
            >
              Replace all
            </button>
            <button
              onClick={() => setPreview(null)}
              className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-10 rounded-xl border bg-muted/30 p-5 text-sm">
        <h4 className="font-display text-base font-semibold">Excel format</h4>
        <p className="mt-2 text-muted-foreground">
          The workbook must contain two sheets:
        </p>
        <ul className="mt-2 list-disc pl-5 text-muted-foreground">
          <li>
            <strong>Categories</strong> — columns: <code>Category</code>, <code>Subcategories</code> (comma-separated).
          </li>
          <li>
            <strong>Products</strong> — columns: <code>ID</code>, <code>Slug</code>, <code>Name</code>, <code>Category</code>,{" "}
            <code>Subcategory</code>, <code>Featured</code> (Yes/No), <code>Price (INR)</code>, <code>Description</code>,{" "}
            <code>Dimensions</code>, <code>Material</code>, <code>Technique</code>, <code>In Stock</code> (Yes/No),{" "}
            <code>Images</code> (one URL per line).
          </li>
        </ul>
        <p className="mt-2 text-muted-foreground">
          Tip: export first to get a perfectly-formatted template you can edit.
        </p>
      </div>
    </div>
  );
}
