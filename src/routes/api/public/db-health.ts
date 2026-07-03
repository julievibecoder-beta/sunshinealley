import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/db-health")({
  server: {
    handlers: {
      GET: async () => {
        const started = Date.now();
        try {
          const { hasDatabaseUrl, getSql, ensureSchema } = await import(
            "@/lib/db.server"
          );

          if (!hasDatabaseUrl()) {
            return Response.json(
              {
                ok: false,
                status: "no_database_url",
                message:
                  "DATABASE_URL is not configured. App is running on read-only seed data.",
                database: { connected: false },
                schema: { ready: false },
              },
              { status: 503 },
            );
          }

          // Bootstrap schema + seed if this is the first call after deploy.
          const schemaStarted = Date.now();
          await ensureSchema();
          const schemaMs = Date.now() - schemaStarted;

          const sql = getSql();

          const pingStarted = Date.now();
          const ping = (await sql`SELECT
            current_database() AS db,
            current_user       AS usr,
            version()          AS version,
            now()              AS now`) as unknown as Array<{
            db: string;
            usr: string;
            version: string;
            now: string;
          }>;
          const pingMs = Date.now() - pingStarted;

          const expectedTables = [
            "categories",
            "subcategories",
            "products",
            "site_content",
          ] as const;

          const tableRows = (await sql`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_name = ANY(${sql.array(expectedTables as unknown as string[])})
          `) as unknown as Array<{ table_name: string }>;

          const presentTables = new Set(tableRows.map((r) => r.table_name));
          const missingTables = expectedTables.filter(
            (t) => !presentTables.has(t),
          );

          // Row counts per table (only for tables that exist).
          const counts: Record<string, number> = {};
          for (const t of expectedTables) {
            if (!presentTables.has(t)) continue;
            const rows = (await sql.unsafe(
              `SELECT count(*)::int AS count FROM public.${t}`,
            )) as unknown as Array<{ count: number }>;
            counts[t] = rows[0]?.count ?? 0;
          }

          const seeded =
            (counts.categories ?? 0) > 0 &&
            (counts.products ?? 0) > 0 &&
            (counts.site_content ?? 0) > 0;

          const ok = missingTables.length === 0;

          return Response.json(
            {
              ok,
              status: ok
                ? seeded
                  ? "ready"
                  : "schema_ready_not_seeded"
                : "schema_incomplete",
              database: {
                connected: true,
                name: ping[0]?.db,
                user: ping[0]?.usr,
                version: ping[0]?.version,
                serverTime: ping[0]?.now,
                pingMs,
              },
              schema: {
                ready: missingTables.length === 0,
                bootstrapMs: schemaMs,
                expectedTables,
                presentTables: Array.from(presentTables),
                missingTables,
              },
              seed: {
                applied: seeded,
                counts,
              },
              totalMs: Date.now() - started,
            },
            { status: ok ? 200 : 500 },
          );
        } catch (err) {
          const e = err as Error;
          return Response.json(
            {
              ok: false,
              status: "error",
              error: {
                name: e.name,
                message: e.message,
              },
              totalMs: Date.now() - started,
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
