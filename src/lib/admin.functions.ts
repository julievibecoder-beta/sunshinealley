import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ username: z.string(), password: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPass = process.env.ADMIN_PASSWORD;
    if (!expectedUser || !expectedPass) {
      throw new Error("Admin credentials not configured");
    }
    if (data.username.trim() !== expectedUser || data.password !== expectedPass) {
      return { ok: false as const };
    }
    const { getAdminSession } = await import("./admin-session.server");
    const session = await getAdminSession();
    await session.update({ username: data.username.trim() });
    return { ok: true as const };
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
