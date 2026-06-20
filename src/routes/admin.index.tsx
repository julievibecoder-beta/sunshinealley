import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Users, RotateCcw } from "lucide-react";
import { useProducts, useCraftsmen, resetStore } from "@/lib/store";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const products = useProducts();
  const craftsmen = useCraftsmen();
  const published = products.filter((p) => p.inStock).length;
  const featured = products.filter((p) => p.featured).length;

  const stats = [
    { label: "Total products", value: products.length },
    { label: "Published (in stock)", value: published },
    { label: "Featured", value: featured },
    { label: "Craftsmen", value: craftsmen.length },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your catalogue and artisan profiles.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          to="/admin/products"
          className="group flex items-start gap-4 rounded-xl border bg-card p-6 transition-colors hover:border-primary"
        >
          <div
            className="flex h-12 w-12 flex-none items-center justify-center rounded-full"
            style={{ background: "var(--primary-light)", color: "var(--primary-dark)" }}
          >
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold group-hover:text-primary">Products</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add, edit, or unpublish pieces in your shop.
            </p>
          </div>
        </Link>
        <Link
          to="/admin/craftsmen"
          className="group flex items-start gap-4 rounded-xl border bg-card p-6 transition-colors hover:border-primary"
        >
          <div
            className="flex h-12 w-12 flex-none items-center justify-center rounded-full"
            style={{ background: "var(--primary-light)", color: "var(--primary-dark)" }}
          >
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold group-hover:text-primary">Craftsmen</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage artisan biographies and photographs.
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-10 rounded-xl border bg-card p-5">
        <h3 className="font-display text-lg font-semibold">Reset to defaults</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Discards all admin changes and restores the seed catalogue.
        </p>
        <button
          onClick={() => {
            if (confirm("Reset all products and craftsmen to defaults? This cannot be undone.")) {
              resetStore();
            }
          }}
          className="mt-3 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:border-destructive hover:text-destructive"
        >
          <RotateCcw className="h-4 w-4" /> Reset data
        </button>
      </div>
    </div>
  );
}
