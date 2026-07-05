import { getCategoryChipColors } from "@/lib/reuse-categories";
import { CategoryIcon } from "@/components/CategoryIcon";
import { cn } from "@/lib/utils";

export function CategoryBadge({
  category,
  className,
  showIcon = true,
  showLabel = true,
  compact = false,
}: {
  category?: string | null;
  className?: string;
  showIcon?: boolean;
  showLabel?: boolean;
  compact?: boolean;
}) {
  if (!category) return null;
  const chip = getCategoryChipColors(category);

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-full font-semibold",
        compact
          ? "px-2 py-0.5 text-[10px] leading-tight"
          : "px-2.5 py-0.5 text-xs",
        className
      )}
      style={{
        backgroundColor: chip.backgroundColor,
        color: chip.color,
      }}
    >
      {showIcon && (
        <CategoryIcon
          category={category}
          className={compact ? "h-2.5 w-2.5 shrink-0" : "h-3 w-3 shrink-0"}
          color={chip.iconColor}
        />
      )}
      {showLabel && (
        <span className="truncate">{category}</span>
      )}
    </span>
  );
}
