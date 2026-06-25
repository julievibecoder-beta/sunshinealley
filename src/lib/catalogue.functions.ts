import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type CategoryDef = { id: string; name: string; subcategories: string[] };
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  featured: boolean;
  price?: number;
  description: string;
  dimensions: string;
  material: string;
  technique: string;
  images: string[];
  inStock: boolean;
};

export const getCatalogue = createServerFn({ method: "GET" }).handler(async () => {
  const { getSql, ensureSchema, hasDatabaseUrl } = await import("./db.server");
  if (!hasDatabaseUrl()) {
    const { categoriesSeed, products } = await import("@/data/products");
    return { categories: categoriesSeed as CategoryDef[], products: products as Product[] };
  }
  await ensureSchema();
  const sql = getSql();
  const cats = await sql<
    { id: string; name: string; position: number }[]
  >`SELECT id, name, position FROM categories ORDER BY position, name`;
  const subs = await sql<
    { id: string; category_id: string; name: string; position: number }[]
  >`SELECT id, category_id, name, position FROM subcategories ORDER BY position, name`;
  const prods = await sql<
    {
      id: string;
      slug: string;
      name: string;
      category_id: string | null;
      subcategory_id: string | null;
      featured: boolean;
      price: string | null;
      description: string;
      dimensions: string;
      material: string;
      technique: string;
      in_stock: boolean;
      images: string[];
      position: number;
    }[]
  >`SELECT id, slug, name, category_id, subcategory_id, featured, price, description,
          dimensions, material, technique, in_stock, images, position
     FROM products ORDER BY position, name`;

  const categories: CategoryDef[] = cats.map((c) => ({
    id: c.id,
    name: c.name,
    subcategories: subs.filter((s) => s.category_id === c.id).map((s) => s.name),
  }));

  const catNameById = new Map(cats.map((c) => [c.id, c.name]));
  const subNameById = new Map(subs.map((s) => [s.id, s.name]));

  const products: Product[] = prods.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category_id ? catNameById.get(p.category_id) ?? "" : "",
    subcategory: p.subcategory_id ? subNameById.get(p.subcategory_id) : undefined,
    featured: p.featured,
    price: p.price == null ? undefined : Number(p.price),
    description: p.description,
    dimensions: p.dimensions,
    material: p.material,
    technique: p.technique,
    images: Array.isArray(p.images) ? p.images : [],
    inStock: p.in_stock,
  }));

  return { categories, products };
});

const CategoriesInput = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    subcategories: z.array(z.string()),
  }),
);

export const saveCategoriesFn = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ items: CategoriesInput }).parse(d))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { getSql, ensureSchema } = await import("./db.server");
    await ensureSchema();
    const sql = getSql();

    await sql.begin(async (tx) => {
      // Upsert categories, in given order. Categories not in list are deleted (cascade subs).
      const incomingIds = data.items.map((c) => c.id);
      if (incomingIds.length === 0) {
        await tx`DELETE FROM categories`;
      } else {
        await tx`DELETE FROM categories WHERE id <> ALL(${incomingIds})`;
      }
      for (let i = 0; i < data.items.length; i++) {
        const c = data.items[i];
        await tx`INSERT INTO categories (id, name, position)
                 VALUES (${c.id}, ${c.name}, ${i})
                 ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, position = EXCLUDED.position`;

        // Snapshot existing subs for cascade-rename of products by name.
        const existing = await tx<{ id: string; name: string }[]>`
          SELECT id, name FROM subcategories WHERE category_id = ${c.id}`;
        const wantedNames = c.subcategories;

        // Match existing subs to wanted names by name preservation; otherwise create/rename in slot.
        const usedExisting = new Set<string>();
        const targets: { id: string; name: string; position: number }[] = [];
        for (let j = 0; j < wantedNames.length; j++) {
          const name = wantedNames[j];
          const matched = existing.find((e) => !usedExisting.has(e.id) && e.name === name);
          if (matched) {
            usedExisting.add(matched.id);
            targets.push({ id: matched.id, name, position: j });
          }
        }
        // Fill leftover wanted slots
        for (let j = 0; j < wantedNames.length; j++) {
          const name = wantedNames[j];
          if (targets.find((t) => t.position === j)) continue;
          const freeExisting = existing.find((e) => !usedExisting.has(e.id));
          if (freeExisting) {
            usedExisting.add(freeExisting.id);
            targets.push({ id: freeExisting.id, name, position: j });
          } else {
            targets.push({ id: `${c.id}-s-${Date.now()}-${j}`, name, position: j });
          }
        }
        // Delete subs not used
        const keepIds = targets.map((t) => t.id);
        if (keepIds.length === 0) {
          await tx`DELETE FROM subcategories WHERE category_id = ${c.id}`;
        } else {
          await tx`DELETE FROM subcategories WHERE category_id = ${c.id} AND id <> ALL(${keepIds})`;
        }
        for (const t of targets) {
          await tx`INSERT INTO subcategories (id, category_id, name, position)
                   VALUES (${t.id}, ${c.id}, ${t.name}, ${t.position})
                   ON CONFLICT (id) DO UPDATE
                     SET name = EXCLUDED.name, position = EXCLUDED.position`;
        }
      }
    });

    return { ok: true };
  });

const ProductsInput = z.array(
  z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    category: z.string(),
    subcategory: z.string().optional(),
    featured: z.boolean(),
    price: z.number().optional(),
    description: z.string(),
    dimensions: z.string(),
    material: z.string(),
    technique: z.string(),
    images: z.array(z.string()),
    inStock: z.boolean(),
  }),
);

export const saveProductsFn = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ items: ProductsInput }).parse(d))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { getSql, ensureSchema } = await import("./db.server");
    await ensureSchema();
    const sql = getSql();

    const cats = await sql<{ id: string; name: string }[]>`SELECT id, name FROM categories`;
    const subs = await sql<
      { id: string; category_id: string; name: string }[]
    >`SELECT id, category_id, name FROM subcategories`;
    const catByName = new Map(cats.map((c) => [c.name, c.id]));
    const subByPair = new Map(subs.map((s) => [`${s.category_id}::${s.name}`, s.id]));

    await sql.begin(async (tx) => {
      const incomingIds = data.items.map((p) => p.id);
      if (incomingIds.length === 0) {
        await tx`DELETE FROM products`;
      } else {
        await tx`DELETE FROM products WHERE id <> ALL(${incomingIds})`;
      }
      for (let i = 0; i < data.items.length; i++) {
        const p = data.items[i];
        const catId = catByName.get(p.category) ?? null;
        const subId =
          catId && p.subcategory ? subByPair.get(`${catId}::${p.subcategory}`) ?? null : null;
        await tx`INSERT INTO products (id, slug, name, category_id, subcategory_id, featured, price,
                  description, dimensions, material, technique, in_stock, images, position)
                 VALUES (${p.id}, ${p.slug}, ${p.name}, ${catId}, ${subId}, ${p.featured},
                         ${p.price ?? null}, ${p.description}, ${p.dimensions}, ${p.material},
                         ${p.technique}, ${p.inStock}, ${tx.json(p.images)}, ${i})
                 ON CONFLICT (id) DO UPDATE SET
                   slug = EXCLUDED.slug,
                   name = EXCLUDED.name,
                   category_id = EXCLUDED.category_id,
                   subcategory_id = EXCLUDED.subcategory_id,
                   featured = EXCLUDED.featured,
                   price = EXCLUDED.price,
                   description = EXCLUDED.description,
                   dimensions = EXCLUDED.dimensions,
                   material = EXCLUDED.material,
                   technique = EXCLUDED.technique,
                   in_stock = EXCLUDED.in_stock,
                   images = EXCLUDED.images,
                   position = EXCLUDED.position`;
      }
    });

    return { ok: true };
  });

export const resetCatalogueFn = createServerFn({ method: "POST" }).handler(async () => {
  const { requireAdmin } = await import("./admin-session.server");
  await requireAdmin();
  const { getSql } = await import("./db.server");
  const sql = getSql();
  await sql`DELETE FROM products`;
  await sql`DELETE FROM subcategories`;
  await sql`DELETE FROM categories`;
  // Force re-seed next call
  const { ensureSchema } = await import("./db.server");
  // schemaReady is module-scoped; ensure tables exist (they do) and seed by clearing site_content not needed.
  await ensureSchema();
  return { ok: true };
});
