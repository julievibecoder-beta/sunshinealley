import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ username: z.string(), password: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const isDev = process.env.NODE_ENV !== "production";
    try {
      const expectedUser = process.env.ADMIN_USERNAME;
      const expectedPass = process.env.ADMIN_PASSWORD;
      const sessionSecret = process.env.ADMIN_SESSION_SECRET;

      if (!expectedUser || !expectedPass) {
        const msg = "ADMIN_USERNAME / ADMIN_PASSWORD env vars are not set on the server.";
        console.error("[adminLogin]", msg);
        return { ok: false as const, code: "config_missing", message: isDev ? msg : "Server not configured." };
      }
      if (!sessionSecret || sessionSecret.length < 32) {
        const msg = "ADMIN_SESSION_SECRET is missing or shorter than 32 characters.";
        console.error("[adminLogin]", msg);
        return { ok: false as const, code: "session_secret_missing", message: isDev ? msg : "Server not configured." };
      }
      if (data.username.trim() !== expectedUser || data.password !== expectedPass) {
        console.warn("[adminLogin] bad credentials for username:", data.username);
        return { ok: false as const, code: "bad_credentials", message: "Invalid username or password." };
      }

      const { getAdminSession } = await import("./admin-session.server");
      const session = await getAdminSession();
      await session.update({ username: data.username.trim() });
      return { ok: true as const };
    } catch (err) {
      const e = err as Error;
      console.error("[adminLogin] unexpected error:", e?.stack || e);
      return {
        ok: false as const,
        code: "server_error",
        message: isDev ? `${e?.name ?? "Error"}: ${e?.message ?? String(e)}` : "Sign-in failed. Please try again.",
      };
    }
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { getAdminSession } = await import("./admin-session.server");
  const session = await getAdminSession();
  await session.clear();
  return { ok: true };
});

export const adminMe = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminSession } = await import("./admin-session.server");
  const session = await getAdminSession();
  return { username: session.data.username ?? null };
});
