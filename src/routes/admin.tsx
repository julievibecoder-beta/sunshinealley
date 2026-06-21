import { createFileRoute, Outlet, Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, Package, Tags, FileSpreadsheet, LogOut, ExternalLink } from "lucide-react";
import { useAuth, logout } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Kashmir Crafts" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { ready, authed } = useAuth();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    if (!ready) return;
    if (!authed && !isLoginRoute) {
      router.navigate({ to: "/admin/login" });
    }
    if (authed && isLoginRoute) {
      router.navigate({ to: "/admin" });
    }
  }, [ready, authed, isLoginRoute, router]);

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (isLoginRoute || !authed) {
    return <Outlet />;
  }

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/products", label: "Products", icon: Package, exact: false },
    { to: "/admin/categories", label: "Categories", icon: Tags, exact: false },
    { to: "/admin/data", label: "Import / Export", icon: FileSpreadsheet, exact: false },
  ] as const;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
          <Link to="/admin" className="font-display text-lg font-semibold">
            Kashmir Crafts <span className="text-muted-foreground">/ Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" /> View site
            </Link>
            <button
              onClick={() => {
                logout();
                router.navigate({ to: "/admin/login" });
              }}
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-56 flex-none md:block">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    active ? "text-primary-foreground" : "hover:bg-muted"
                  }`}
                  style={active ? { background: "var(--primary)" } : undefined}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap gap-2 md:hidden">
            {navItems.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex-1 rounded-md border px-2 py-2 text-center text-xs font-medium ${
                    active ? "border-transparent text-primary-foreground" : ""
                  }`}
                  style={active ? { background: "var(--primary)" } : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
