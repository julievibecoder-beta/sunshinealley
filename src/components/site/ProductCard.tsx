import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { CategoryBadge } from "./CategoryBadge";
import { WhatsAppCTA } from "./WhatsAppButton";
import { formatPrice } from "@/lib/whatsapp";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-warm">
      <Link
        to="/shop/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/55">
            <span className="rounded-md bg-background/95 px-3 py-1 text-sm font-semibold tracking-wide text-foreground">
              Out of Stock
            </span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <CategoryBadge category={product.category} className="self-start" />
        <Link
          to="/shop/$slug"
          params={{ slug: product.slug }}
          className="font-display text-lg font-semibold leading-snug line-clamp-2 hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="line-clamp-1 text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="font-display text-base font-semibold text-primary-dark">
            {formatPrice(product.price)}
          </span>
          <WhatsAppCTA productName={product.name}>Enquire</WhatsAppCTA>
        </div>
      </div>
    </article>
  );
}
