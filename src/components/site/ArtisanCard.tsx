import type { Craftsman } from "@/data/craftsmen";

export function ArtisanCard({ artisan, onRead }: { artisan: Craftsman; onRead?: () => void }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-card shadow-soft">
      <div className="aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={artisan.image}
          alt={artisan.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span
          className="inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{ background: "var(--primary-light)", color: "var(--primary-dark)" }}
        >
          {artisan.specialty}
        </span>
        <h3 className="font-display text-xl font-semibold">{artisan.name}</h3>
        <p className="text-sm text-muted-foreground">
          {artisan.location} · <span className="text-gold" style={{ color: "var(--gold)" }}>{artisan.years}</span>
        </p>
        <p className="text-sm leading-relaxed text-foreground/80">{artisan.bioShort}</p>
        {onRead && (
          <button
            onClick={onRead}
            className="mt-2 self-start text-sm font-medium text-primary hover:text-primary-dark"
          >
            Read full story →
          </button>
        )}
      </div>
    </article>
  );
}
