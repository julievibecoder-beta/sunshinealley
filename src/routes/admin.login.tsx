import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";
import { login } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      router.navigate({ to: "/admin" });
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-warm"
      >
        <div className="flex items-center gap-2 text-primary">
          <Lock className="h-5 w-5" />
          <span className="text-xs font-medium uppercase tracking-widest">Admin Access</span>
        </div>
        <h1 className="mt-3 font-display text-2xl font-semibold">Sign in to manage</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Use the master admin credentials.
        </p>

        <label className="mt-6 block text-sm font-medium">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
          required
        />

        <label className="mt-4 block text-sm font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
          required
        />

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          className="mt-6 w-full rounded-md px-4 py-2.5 text-sm font-medium text-primary-foreground"
          style={{ background: "var(--primary)" }}
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
