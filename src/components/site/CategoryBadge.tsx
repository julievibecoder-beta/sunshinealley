const palette = [
  "bg-amber-100 text-amber-900",
  "bg-rose-100 text-rose-900",
  "bg-teal-100 text-teal-900",
  "bg-purple-100 text-purple-900",
  "bg-sky-100 text-sky-900",
  "bg-emerald-100 text-emerald-900",
  "bg-orange-100 text-orange-900",
  "bg-indigo-100 text-indigo-900",
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function CategoryBadge({
  category,
  className = "",
}: {
  category: string;
  className?: string;
}) {
  const cls = palette[hash(category) % palette.length];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide ${cls} ${className}`}
    >
      {category}
    </span>
  );
}
