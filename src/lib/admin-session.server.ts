import { useSession } from "@tanstack/react-start/server";

export type AdminSessionData = { username?: string };

export function getAdminSessionConfig() {
  const password = process.env.ADMIN_SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET is not configured (need 32+ chars)");
  }
  return {
    password,
    name: "kc_admin_session",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

export async function getAdminSession() {
  return useSession<AdminSessionData>(getAdminSessionConfig());
}

export async function requireAdmin(): Promise<string> {
  const session = await getAdminSession();
  const username = session.data.username;
  if (!username) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return username;
}
