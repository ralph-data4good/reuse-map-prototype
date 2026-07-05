import { getCategoryColor } from "@/lib/reuse-categories";
import { CategoryIcon } from "@/components/CategoryIcon";
import { cn } from "@/lib/utils";

// Colored pill badge for a Reuse Framework Category. Color comes from taxonomy.
export function CategoryBadge({
  category,
  className,
  showIcon = true,
}: {
  category?: string | null;
  className?: string;
  showIcon?: boolean;
}) {
  if (!category) return null;
  const color = getCategoryColor(category);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white",
        className
      )}
      style={{ backgroundColor: color }}
    >
      {showIcon && (
        <CategoryIcon category={category} className="h-3 w-3" color="#ffffff" />
      )}
      {category}
    </span>
  );
}
