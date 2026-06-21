import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { Product, CategoryDef } from "@/data/products";
import { slugify } from "@/lib/store";

const CATEGORIES_SHEET = "Categories";
const PRODUCTS_SHEET = "Products";

interface CategoryRow {
  Category: string;
  Subcategories: string;
}

interface ProductRow {
  ID: string;
  Slug: string;
  Name: string;
  Category: string;
  Subcategory: string;
  Featured: string;
  "Price (INR)": number | string;
  Description: string;
  Dimensions: string;
  Material: string;
  Technique: string;
  "In Stock": string;
  Images: string;
}

function bool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  const s = String(v ?? "").trim().toLowerCase();
  return s === "true" || s === "yes" || s === "1" || s === "y";
}

export function exportToExcel(categories: CategoryDef[], products: Product[]) {
  const wb = XLSX.utils.book_new();

  const catRows: CategoryRow[] = categories.map((c) => ({
    Category: c.name,
    Subcategories: c.subcategories.join(", "),
  }));
  const wsCat = XLSX.utils.json_to_sheet(catRows, {
    header: ["Category", "Subcategories"],
  });
  wsCat["!cols"] = [{ wch: 22 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, wsCat, CATEGORIES_SHEET);

  const prodRows: ProductRow[] = products.map((p) => ({
    ID: p.id,
    Slug: p.slug,
    Name: p.name,
    Category: p.category,
    Subcategory: p.subcategory ?? "",
    Featured: p.featured ? "Yes" : "No",
    "Price (INR)": p.price ?? "",
    Description: p.description,
    Dimensions: p.dimensions,
    Material: p.material,
    Technique: p.technique,
    "In Stock": p.inStock ? "Yes" : "No",
    Images: p.images.join("\n"),
  }));
  const wsProd = XLSX.utils.json_to_sheet(prodRows, {
    header: [
      "ID",
      "Slug",
      "Name",
      "Category",
      "Subcategory",
      "Featured",
      "Price (INR)",
      "Description",
      "Dimensions",
      "Material",
      "Technique",
      "In Stock",
      "Images",
    ],
  });
  wsProd["!cols"] = [
    { wch: 6 }, { wch: 32 }, { wch: 36 }, { wch: 14 }, { wch: 18 }, { wch: 8 },
    { wch: 12 }, { wch: 50 }, { wch: 22 }, { wch: 26 }, { wch: 24 }, { wch: 8 }, { wch: 50 },
  ];
  XLSX.utils.book_append_sheet(wb, wsProd, PRODUCTS_SHEET);

  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([out], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const stamp = new Date().toISOString().slice(0, 10);
  saveAs(blob, `kashmir-crafts-catalogue-${stamp}.xlsx`);
}

export interface ImportResult {
  categories: CategoryDef[];
  products: Product[];
  warnings: string[];
}

export async function importFromExcel(file: File): Promise<ImportResult> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const warnings: string[] = [];

  const catSheet = wb.Sheets[CATEGORIES_SHEET];
  const prodSheet = wb.Sheets[PRODUCTS_SHEET];
  if (!catSheet) warnings.push(`Missing "${CATEGORIES_SHEET}" sheet`);
  if (!prodSheet) warnings.push(`Missing "${PRODUCTS_SHEET}" sheet`);

  const categories: CategoryDef[] = [];
  if (catSheet) {
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(catSheet, { defval: "" });
    rows.forEach((r, i) => {
      const name = String(r.Category ?? "").trim();
      if (!name) return;
      const subs = String(r.Subcategories ?? "")
        .split(/[,\n;|]/)
        .map((s) => s.trim())
        .filter(Boolean);
      categories.push({ id: `c${i + 1}-${Date.now()}`, name, subcategories: subs });
    });
  }

  const products: Product[] = [];
  if (prodSheet) {
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(prodSheet, { defval: "" });
    const usedSlugs = new Set<string>();
    rows.forEach((r, i) => {
      const name = String(r.Name ?? "").trim();
      if (!name) return;
      const id = String(r.ID ?? "").trim() || `${Date.now()}-${i}`;
      let slug = String(r.Slug ?? "").trim() || slugify(name);
      if (usedSlugs.has(slug)) slug = `${slug}-${i}`;
      usedSlugs.add(slug);
      const priceRaw = r["Price (INR)"];
      const price =
        priceRaw === "" || priceRaw == null ? undefined : Number(priceRaw);
      const images = String(r.Images ?? "")
        .split(/[\n;|]/)
        .map((s) => s.trim())
        .filter(Boolean);
      products.push({
        id,
        slug,
        name,
        category: String(r.Category ?? "").trim(),
        subcategory: String(r.Subcategory ?? "").trim() || undefined,
        featured: bool(r.Featured),
        price: Number.isFinite(price as number) ? (price as number) : undefined,
        description: String(r.Description ?? ""),
        dimensions: String(r.Dimensions ?? ""),
        material: String(r.Material ?? ""),
        technique: String(r.Technique ?? ""),
        images,
        inStock: bool(r["In Stock"]),
      });
    });
  }

  return { categories, products, warnings };
}
