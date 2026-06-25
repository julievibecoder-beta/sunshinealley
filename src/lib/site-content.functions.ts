import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { defaultSiteContent, mergeSiteContent, type SiteContent } from "./site-content-defaults";

export const getSiteContentFn = createServerFn({ method: "GET" }).handler(async (): Promise<SiteContent> => {
  const { getSql, ensureSchema, hasDatabaseUrl } = await import("./db.server");
  if (!hasDatabaseUrl()) return defaultSiteContent;
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<{ data: Partial<SiteContent> }[]>`SELECT data FROM site_content WHERE id = 'main' LIMIT 1`;
  if (!rows[0]) return defaultSiteContent;
  return mergeSiteContent(rows[0].data);
});

export const saveSiteContentFn = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ content: z.any() }).parse(d))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { getSql, ensureSchema } = await import("./db.server");
    await ensureSchema();
    const sql = getSql();
    const merged = mergeSiteContent(data.content as Partial<SiteContent>);
    await sql`INSERT INTO site_content (id, data, updated_at)
              VALUES ('main', ${sql.json(merged)}, now())
              ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`;
    return { ok: true };
  });

export const resetSiteContentFn = createServerFn({ method: "POST" }).handler(async () => {
  const { requireAdmin } = await import("./admin-session.server");
  await requireAdmin();
  const { getSql } = await import("./db.server");
  const sql = getSql();
  await sql`INSERT INTO site_content (id, data, updated_at)
            VALUES ('main', ${sql.json(defaultSiteContent)}, now())
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`;
  return { ok: true };
});
