import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { ProductCard } from "@/components/site/ProductCard";
import { CategoryBadge } from "@/components/site/CategoryBadge";
import { WhatsAppCTA } from "@/components/site/WhatsAppButton";
import { useProducts } from "@/lib/store";
import { formatPrice, PHONE_TEL, PHONE_DISPLAY } from "@/lib/whatsapp";

export const Route = createFileRoute("/shop/$slug")({
  head: () => ({
    meta: [
      { title: "Product — Sunshine Alley" },
      { name: "description", content: "Handcrafted Kashmiri piece — details, materials, and artisan story." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const products = useProducts();
  const [activeImg, setActiveImg] = useState(0);

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="font-display text-3xl">Product not found</h1>
          <Link to="/shop" className="mt-4 inline-block text-primary hover:underline">
            ← Back to shop
          </Link>
        </div>
      </SiteShell>
    );
  }

  const related = products
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, 4);
  const safeIdx = Math.min(activeImg, Math.max(0, product.images.length - 1));

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <nav className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" search={{ category: product.category }} className="hover:text-primary">
            {product.category}
          </Link>
          {product.subcategory && (
            <>
              <span className="mx-2">/</span>
              <Link
                to="/shop"
                search={{ category: product.category, subcategory: product.subcategory }}
                className="hover:text-primary"
              >
                {product.subcategory}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              {product.images[safeIdx] && (
                <img
                  src={product.images[safeIdx]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              )}
              {product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImg((safeIdx - 1 + product.images.length) % product.images.length)}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-soft hover:bg-background"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImg((safeIdx + 1) % product.images.length)}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-soft hover:bg-background"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {product.images.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${i === safeIdx ? "w-5 bg-background" : "w-1.5 bg-background/60"}`}
                      />
                    ))}
                  </div>
                </>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/55">
                  <span className="rounded-md bg-background/95 px-4 py-2 text-sm font-semibold">Out of Stock</span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 flex gap-3">
                {product.images.map((src: string, i: number) => (
                  <button
                    key={src + i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square w-20 overflow-hidden rounded-md border-2 transition-colors ${
                      i === safeIdx ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              <CategoryBadge category={product.category} />
              {product.subcategory && <CategoryBadge category={product.subcategory} />}
            </div>
            <h1 className="mt-3 font-display text-3xl font-semibold md:text-4xl">{product.name}</h1>
            <p className="mt-3 font-display text-2xl font-semibold" style={{ color: "var(--primary-dark)" }}>
              {formatPrice(product.price)}
            </p>
            <hr className="my-6" />
            <p className="leading-relaxed text-foreground/85">{product.description}</p>

            <dl className="mt-6 grid grid-cols-1 gap-3 rounded-xl bg-card p-5 text-sm shadow-soft sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Dimensions</dt>
                <dd className="font-medium">{product.dimensions}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Material</dt>
                <dd className="font-medium">{product.material}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Technique</dt>
                <dd className="font-medium">{product.technique}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Craft Region</dt>
                <dd className="font-medium">Kashmir, India</dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <WhatsAppCTA productName={product.name} size="lg" className="w-full sm:w-auto">
                Enquire on WhatsApp
              </WhatsAppCTA>
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border-2 px-6 py-3.5 text-sm font-medium hover:border-primary hover:text-primary sm:w-auto"
              >
                <Phone className="h-4 w-4" /> Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-semibold md:text-3xl">You may also like</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteShell>
  );
}
