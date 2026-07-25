import React from "react";
import { CheckCircle2, Clock, ListTodo, Tag as TagIcon, FilterX } from "lucide-react";
import { ListStats } from "../types";
import { TagBadge } from "./TagBadge";

interface TodoStatsCardProps {
  stats: ListStats;
  selectedTagFilter: string | null;
  onSelectTagFilter: (tag: string | null) => void;
  listName: string;
}

export const TodoStatsCard: React.FC<TodoStatsCardProps> = ({
  stats,
  selectedTagFilter,
  onSelectTagFilter,
  listName,
}) => {
  const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const tagEntries = Object.entries(stats.tagCounts);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-all mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>List Statistics</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
              {listName}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Overview of items, status completion rate, and tag breakdown
          </p>
        </div>

        {/* Selected Filter Notice */}
        {selectedTagFilter && (
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-xl text-xs text-indigo-700 dark:text-indigo-300">
            <span>Filter active: <strong className="capitalize">#{selectedTagFilter}</strong></span>
            <button
              onClick={() => onSelectTagFilter(null)}
              className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-lg text-indigo-600 dark:text-indigo-400 font-semibold inline-flex items-center gap-1"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Clear Filter</span>
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar & Numeric Counters */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</div>
            <div className="text-xs text-slate-500 font-medium">Total Items</div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</div>
            <div className="text-xs text-slate-500 font-medium">Completed</div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</div>
            <div className="text-xs text-slate-500 font-medium">Pending</div>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5 font-medium">
          <span>Completion Rate</span>
          <span>{percentage}% Done</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Tag Counts & Tag Filter Chips */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
          <span className="flex items-center gap-1.5">
            <TagIcon className="w-3.5 h-3.5 text-indigo-500" />
            <span>Filter Items by Tag ({tagEntries.length + (stats.noTagCount > 0 ? 1 : 0)})</span>
          </span>
          {selectedTagFilter && (
            <button
              onClick={() => onSelectTagFilter(null)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Show All ({stats.total})
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {/* All Filter Button */}
          <button
            onClick={() => onSelectTagFilter(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              selectedTagFilter === null
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs"
                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
            }`}
          >
            All Items ({stats.total})
          </button>

          {/* Tag Chips with item counts e.g. urgent (2), not important (1), low priority (5) */}
          {tagEntries.map(([tag, count]) => (
            <TagBadge
              key={tag}
              tag={tag}
              count={count}
              selected={selectedTagFilter === tag}
              onClick={() => onSelectTagFilter(selectedTagFilter === tag ? null : tag)}
            />
          ))}

          {/* No Tag Chip e.g. no tag (5) */}
          {stats.noTagCount > 0 && (
            <TagBadge
              tag="no tag"
              count={stats.noTagCount}
              selected={selectedTagFilter === "no tag"}
              onClick={() => onSelectTagFilter(selectedTagFilter === "no tag" ? null : "no tag")}
            />
          )}
        </div>
      </div>
    </div>
  );
};
