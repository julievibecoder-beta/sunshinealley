import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Tags, FileSpreadsheet, RotateCcw, Home } from "lucide-react";
import { useProducts, useCategories, resetStore } from "@/lib/store";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const products = useProducts();
  const categories = useCategories();
  const published = products.filter((p) => p.inStock).length;
  const featured = products.filter((p) => p.featured).length;
  const subCount = categories.reduce((n, c) => n + c.subcategories.length, 0);

  const stats = [
    { label: "Total products", value: products.length },
    { label: "Published (in stock)", value: published },
    { label: "Featured", value: featured },
    { label: "Categories / Sub", value: `${categories.length} / ${subCount}` },
  ];

  const tiles = [
    { to: "/admin/home", icon: Home, title: "Home content", desc: "Edit hero, sections, testimonials." },
    { to: "/admin/products", icon: Package, title: "Products", desc: "Add, edit, or unpublish pieces." },
    { to: "/admin/categories", icon: Tags, title: "Categories", desc: "Manage categories & subcategories." },
    { to: "/admin/data", icon: FileSpreadsheet, title: "Import / Export", desc: "Move catalogue via Excel." },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your catalogue.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {tiles.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="group flex items-start gap-4 rounded-xl border bg-card p-6 transition-colors hover:border-primary"
          >
            <div
              className="flex h-12 w-12 flex-none items-center justify-center rounded-full"
              style={{ background: "var(--primary-light)", color: "var(--primary-dark)" }}
            >
              <t.icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold group-hover:text-primary">{t.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl border bg-card p-5">
        <h3 className="font-display text-lg font-semibold">Reset to defaults</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Discards all admin changes and restores the seed catalogue.
        </p>
        <button
          onClick={() => {
            if (confirm("Reset all data to defaults? This cannot be undone.")) {
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
