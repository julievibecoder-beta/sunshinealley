export function PageHero({
  title,
  subtitle,
  image,
  height = "h-[44vh] min-h-[280px]",
}: {
  title: string;
  subtitle?: string;
  image: string;
  height?: string;
}) {
  return (
    <section className={`relative ${height} w-full overflow-hidden`}>
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)" }} />
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="font-display text-4xl font-semibold md:text-5xl text-balance">{title}</h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-base text-white/85 md:text-lg">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
