import postgres from "postgres";
import { categoriesSeed, products as seedProducts } from "@/data/products";
import { defaultSiteContent } from "./site-content-defaults";

let sql: ReturnType<typeof postgres> | null = null;
let schemaReady: Promise<void> | null = null;

export function hasDatabaseUrl(): boolean {
  return !!process.env.DATABASE_URL;
}

export function getSql() {
  if (!sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not configured");
    // Parse manually to avoid postgres.js "Invalid URL string." on Workers
    // when the raw connection string contains reserved chars in the password.
    const parsed = parseConnectionString(url);
    sql = postgres({
      host: parsed.host,
      port: parsed.port,
      database: parsed.database,
      username: parsed.username,
      password: parsed.password,
      ssl: "require",
      max: 3,
      idle_timeout: 20,
      prepare: false,
    });
  }
  return sql;
}

function maybeDecode(v: string) {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

function parseConnectionString(raw: string) {
  const normalized = raw.trim();
  const schemeMatch = /^(postgres(?:ql)?):\/\//i.exec(normalized);
  if (!schemeMatch) {
    throw new Error("DATABASE_URL must start with postgres:// or postgresql://");
  }
  // Manual parse: `new URL()` rejects passwords containing raw reserved
  // characters such as $, # or ?, which Supabase passwords often include.
  const rest = normalized.slice(schemeMatch[0].length);
  const at = rest.lastIndexOf("@");
  if (at === -1) throw new Error("DATABASE_URL is missing credentials");
  const creds = rest.slice(0, at);
  let hostPart = rest.slice(at + 1);

  const colon = creds.indexOf(":");
  const username = maybeDecode(colon === -1 ? creds : creds.slice(0, colon));
  const password = colon === -1 ? "" : maybeDecode(creds.slice(colon + 1));

  // Drop any query string / fragment from the host+db portion.
  hostPart = hostPart.split(/[?#]/)[0] ?? hostPart;
  const slash = hostPart.indexOf("/");
  const hostAndPort = slash === -1 ? hostPart : hostPart.slice(0, slash);
  const database = slash === -1 ? "postgres" : maybeDecode(hostPart.slice(slash + 1)) || "postgres";
  const [host, portStr] = hostAndPort.split(":");

  if (!host) throw new Error("DATABASE_URL is missing a host");

  return {
    username,
    password,
    host,
    port: portStr ? Number(portStr) : 5432,
    database,
  };
}


export async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const s = getSql();
      await s.unsafe(`
        CREATE TABLE IF NOT EXISTS categories (
          id           text PRIMARY KEY,
          name         text NOT NULL,
          position     integer NOT NULL DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS subcategories (
          id           text PRIMARY KEY,
          category_id  text NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
          name         text NOT NULL,
          position     integer NOT NULL DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS products (
          id              text PRIMARY KEY,
          slug            text UNIQUE NOT NULL,
          name            text NOT NULL,
          category_id     text REFERENCES categories(id) ON DELETE SET NULL,
          subcategory_id  text REFERENCES subcategories(id) ON DELETE SET NULL,
          featured        boolean NOT NULL DEFAULT false,
          price           numeric(12,2),
          description     text NOT NULL DEFAULT '',
          dimensions      text NOT NULL DEFAULT '',
          material        text NOT NULL DEFAULT '',
          technique       text NOT NULL DEFAULT '',
          in_stock        boolean NOT NULL DEFAULT true,
          images          jsonb NOT NULL DEFAULT '[]'::jsonb,
          position        integer NOT NULL DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS site_content (
          id          text PRIMARY KEY,
          data        jsonb NOT NULL,
          updated_at  timestamptz NOT NULL DEFAULT now()
        );
      `);

      // Seed on first run if empty
      const [{ count: catCount }] =
        (await s`SELECT count(*)::int AS count FROM categories`) as unknown as [{ count: number }];
      if (catCount === 0) await seedCatalogue();

      const [{ count: scCount }] =
        (await s`SELECT count(*)::int AS count FROM site_content`) as unknown as [{ count: number }];
      if (scCount === 0) {
        await s`INSERT INTO site_content (id, data) VALUES ('main', ${s.json(defaultSiteContent)})`;
      }
    })().catch((e) => {
      schemaReady = null; // allow retry on next call
      throw e;
    });
  }
  return schemaReady;
}

async function seedCatalogue() {
  const s = getSql();
  await s.begin(async (tx) => {
    for (let i = 0; i < categoriesSeed.length; i++) {
      const c = categoriesSeed[i];
      await tx`INSERT INTO categories (id, name, position) VALUES (${c.id}, ${c.name}, ${i})`;
      for (let j = 0; j < c.subcategories.length; j++) {
        await tx`INSERT INTO subcategories (id, category_id, name, position)
                 VALUES (${`${c.id}-s${j}`}, ${c.id}, ${c.subcategories[j]}, ${j})`;
      }
    }
    // products
    for (let i = 0; i < seedProducts.length; i++) {
      const p = seedProducts[i];
      const cat = await tx`SELECT id FROM categories WHERE name = ${p.category} LIMIT 1`;
      const catId = cat[0]?.id ?? null;
      let subId: string | null = null;
      if (catId && p.subcategory) {
        const sub =
          await tx`SELECT id FROM subcategories WHERE category_id = ${catId} AND name = ${p.subcategory} LIMIT 1`;
        subId = sub[0]?.id ?? null;
      }
      await tx`INSERT INTO products (id, slug, name, category_id, subcategory_id, featured, price,
                description, dimensions, material, technique, in_stock, images, position)
               VALUES (${p.id}, ${p.slug}, ${p.name}, ${catId}, ${subId}, ${p.featured},
                       ${p.price ?? null}, ${p.description}, ${p.dimensions}, ${p.material},
                       ${p.technique}, ${p.inStock}, ${tx.json(p.images)}, ${i})`;
    }
  });
}
