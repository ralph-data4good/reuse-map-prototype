import { getCategoryColor } from "@/lib/reuse-categories";
import { cn } from "@/lib/utils";

// Colored pill badge for a Reuse Framework Category. Color comes from taxonomy.
export function CategoryBadge({
  category,
  className,
}: {
  category?: string | null;
  className?: string;
}) {
  if (!category) return null;
  const color = getCategoryColor(category);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white",
        className
      )}
      style={{ backgroundColor: color }}
    >
      {category}
    </span>
  );
}
