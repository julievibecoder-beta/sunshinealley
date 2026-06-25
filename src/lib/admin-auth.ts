import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminLogin, adminLogout, adminMe } from "./admin.functions";

const KEY = ["admin-me"] as const;

export function useAuth(): { ready: boolean; authed: boolean; username: string | null } {
  const { data, isFetched } = useQuery({
    queryKey: KEY,
    queryFn: () => adminMe(),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    retry: false,
  });
  return {
    ready: isFetched,
    authed: !!data?.username,
    username: data?.username ?? null,
  };
}

export function useLogin() {
  const qc = useQueryClient();
  return async (username: string, password: string) => {
    const res = await adminLogin({ data: { username, password } });
    if (res.ok) {
      await qc.invalidateQueries({ queryKey: KEY });
      return true;
    }
    return false;
  };
}

export function useLogout() {
  const qc = useQueryClient();
  return async () => {
    await adminLogout();
    await qc.invalidateQueries({ queryKey: KEY });
  };
}

// Back-compat sync exports (no longer used after refactor, kept to avoid import breaks).
export async function login(username: string, password: string): Promise<boolean> {
  const res = await adminLogin({ data: { username, password } });
  return res.ok;
}
export async function logout(): Promise<void> {
  await adminLogout();
}
