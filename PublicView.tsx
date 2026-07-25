import React from "react";
import { X } from "lucide-react";

interface TagBadgeProps {
  tag: string;
  count?: number;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  size?: "sm" | "md";
}

const TAG_COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  urgent: { bg: "bg-red-500/10 dark:bg-red-500/20", text: "text-red-700 dark:text-red-300", border: "border-red-200 dark:border-red-800" },
  "high priority": { bg: "bg-orange-500/10 dark:bg-orange-500/20", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800" },
  "not important": { bg: "bg-slate-500/10 dark:bg-slate-500/20", text: "text-slate-700 dark:text-slate-300", border: "border-slate-200 dark:border-slate-700" },
  "low priority": { bg: "bg-blue-500/10 dark:bg-blue-500/20", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" },
  work: { bg: "bg-purple-500/10 dark:bg-purple-500/20", text: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800" },
  personal: { bg: "bg-emerald-500/10 dark:bg-emerald-500/20", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800" },
  "no tag": { bg: "bg-amber-500/10 dark:bg-amber-500/20", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800" },
};

export const TagBadge: React.FC<TagBadgeProps> = ({
  tag,
  count,
  selected = false,
  onClick,
  onRemove,
  size = "md",
}) => {
  const normalized = tag.toLowerCase().trim();
  const colorScheme = TAG_COLOR_MAP[normalized] || {
    bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200 dark:border-indigo-800",
  };

  const isClickable = Boolean(onClick);

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-150 border whitespace-nowrap ${
        colorScheme.bg
      } ${colorScheme.text} ${colorScheme.border} ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs sm:text-sm"
      } ${
        isClickable ? "cursor-pointer hover:opacity-80 active:scale-95" : ""
      } ${selected ? "ring-2 ring-indigo-500 ring-offset-1 font-semibold shadow-xs" : ""}`}
    >
      <span className="capitalize">#{tag}</span>
      {count !== undefined && (
        <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-black/5 dark:bg-white/10 text-[11px] font-bold">
          {count}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
          title="Remove tag"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
