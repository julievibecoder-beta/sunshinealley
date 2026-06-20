import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Phone } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { ProductCard } from "@/components/site/ProductCard";
import { CategoryBadge } from "@/components/site/CategoryBadge";
import { WhatsAppCTA } from "@/components/site/WhatsAppButton";
import { getProductBySlug, getRelatedProducts } from "@/data/products";
import { getCraftsmanById } from "@/data/craftsmen";
import { formatPrice, PHONE_TEL, PHONE_DISPLAY } from "@/lib/whatsapp";

export const Route = createFileRoute("/shop/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Kashmir Crafts` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — Kashmir Crafts` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.images[0] },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-primary hover:underline">
          ← Back to shop
        </Link>
      </div>
    </SiteShell>
  ),
  errorComponent: ({ reset }) => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Something went wrong</h1>
        <button onClick={reset} className="mt-4 text-primary hover:underline">Try again</button>
      </div>
    </SiteShell>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const artisan = getCraftsmanById(product.craftsmanId);
  const related = getRelatedProducts(product.slug, product.category);
  const [activeImg, setActiveImg] = useState(0);

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" search={{ category: product.category }} className="hover:text-primary">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* Images */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              <img
                src={product.images[activeImg]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
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
                    key={src}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square w-20 overflow-hidden rounded-md border-2 transition-colors ${
                      i === activeImg ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <CategoryBadge category={product.category} />
            <h1 className="mt-3 font-display text-3xl font-semibold md:text-4xl">{product.name}</h1>
            <p className="mt-3 font-display text-2xl font-semibold text-primary-dark" style={{ color: "var(--primary-dark)" }}>
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

            {artisan && (
              <Link
                to="/craftsmen"
                className="mt-5 flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:border-primary"
              >
                <img src={artisan.image} alt={artisan.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="text-xs text-muted-foreground">Crafted by</p>
                  <p className="text-sm font-semibold">{artisan.name}</p>
                  <p className="text-xs text-muted-foreground">{artisan.specialty}</p>
                </div>
              </Link>
            )}

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
