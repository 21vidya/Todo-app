import React, { useState } from "react";
import {
  Check,
  Trash2,
  Edit2,
  Calendar,
  Bell,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Plus,
  Tag as TagIcon,
  X,
  Clock,
} from "lucide-react";
import { TodoItem } from "../types";
import { TagBadge } from "./TagBadge";

interface TodoItemRowProps {
  item: TodoItem;
  index: number;
  totalItems: number;
  onToggleComplete: (item: TodoItem) => void;
  onUpdateItem: (item: TodoItem, updates: Partial<TodoItem>) => void;
  onDeleteItem: (itemId: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isReadOnly?: boolean;
}

const COMMON_TAGS = ["urgent", "high priority", "low priority", "not important", "work", "personal"];

export const TodoItemRow: React.FC<TodoItemRowProps> = ({
  item,
  index,
  totalItems,
  onToggleComplete,
  onUpdateItem,
  onDeleteItem,
  onMoveUp,
  onMoveDown,
  isReadOnly = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editDesc, setEditDesc] = useState(item.description || "");
  const [editTags, setEditTags] = useState<string[]>(item.tags || []);
  const [newTagInput, setNewTagInput] = useState("");
  const [editDueDate, setEditDueDate] = useState(item.dueDate || "");
  const [editReminderEmail, setEditReminderEmail] = useState(item.reminderEmail || "");
  const [showReminderPicker, setShowReminderPicker] = useState(false);

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onUpdateItem(item, {
      title: editTitle.trim(),
      description: editDesc.trim() || undefined,
      tags: editTags,
      dueDate: editDueDate || undefined,
      reminderEmail: editReminderEmail.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleAddTag = (tagToAdd: string) => {
    const clean = tagToAdd.trim().toLowerCase();
    if (clean && !editTags.includes(clean)) {
      setEditTags([...editTags, clean]);
    }
    setNewTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((t) => t !== tagToRemove));
  };

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 border rounded-2xl p-4 transition-all duration-150 mb-2.5 ${
        item.completed
          ? "border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 opacity-80"
          : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs"
      }`}
    >
      {!isEditing ? (
        <div className="flex items-start gap-3">
          {/* Reorder Buttons / Grip handle */}
          {!isReadOnly && (
            <div className="flex flex-col items-center justify-center shrink-0 pt-0.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
              <button
                type="button"
                onClick={onMoveUp}
                disabled={index === 0}
                className="p-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"
                title="Move item up"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <GripVertical className="w-4 h-4 cursor-grab text-slate-300 dark:text-slate-600" />
              <button
                type="button"
                onClick={onMoveDown}
                disabled={index === totalItems - 1}
                className="p-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"
                title="Move item down"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Completion Checkbox */}
          <button
            type="button"
            onClick={() => !isReadOnly && onToggleComplete(item)}
            disabled={isReadOnly}
            className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
              item.completed
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "border-slate-300 dark:border-slate-700 hover:border-indigo-500"
            } ${isReadOnly ? "cursor-default" : "cursor-pointer"}`}
          >
            {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Item Text & Meta Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-snug break-words ${
                  item.completed ? "line-through text-slate-400 dark:text-slate-500" : ""
                }`}
              >
                {item.title}
              </h3>

              {/* Action Buttons (Edit & Delete) */}
              {!isReadOnly && (
                <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => {
                      setEditTitle(item.title);
                      setEditDesc(item.description || "");
                      setEditTags(item.tags || []);
                      setEditDueDate(item.dueDate || "");
                      setEditReminderEmail(item.reminderEmail || "");
                      setIsEditing(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors cursor-pointer"
                    title="Rename / Edit Todo Item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Todo Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  item.completed
                    ? "text-slate-400 dark:text-slate-600"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {item.description}
              </p>
            )}

            {/* Tags Display & Reminders Metadata Row */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              {item.tags && item.tags.length > 0 ? (
                item.tags.map((t) => <TagBadge key={t} tag={t} size="sm" />)
              ) : (
                <span className="text-[11px] text-slate-400 dark:text-slate-600 italic">No tag assigned</span>
              )}

              {/* Due Date & Reminder Badges */}
              {item.dueDate && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Due: {item.dueDate}</span>
                </span>
              )}

              {item.reminderEmail && (
                <span className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-md">
                  <Bell className="w-3 h-3 text-amber-500" />
                  <span>Reminder: {item.reminderEmail}</span>
                  {item.reminderSent && <span className="font-semibold text-[10px] bg-amber-200 dark:bg-amber-800 px-1 rounded">(Sent)</span>}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Inline Edit Mode */
        <div className="space-y-3 p-1">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-xs font-bold uppercase text-slate-500">Editing Todo Item</span>
            <button
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-sm px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Todo Item title"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={2}
              className="w-full text-xs px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Additional details..."
            />
          </div>

          {/* Tags Editor */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>Tags</span>
              <span className="text-[11px] text-slate-400">Click preset or type tag</span>
            </label>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {editTags.map((tag) => (
                <TagBadge key={tag} tag={tag} size="sm" onRemove={() => handleRemoveTag(tag)} />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(newTagInput);
                    }
                  }}
                  placeholder="Type tag (e.g. urgent, work)..."
                  className="w-full text-xs px-3 py-1.5 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAddTag(newTagInput)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-200"
              >
                Add Tag
              </button>
            </div>

            {/* Common Tag Presets */}
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="text-[11px] text-slate-400 self-center mr-1">Presets:</span>
              {COMMON_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date & Reminder Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-indigo-500" />
                <span>Due Date</span>
              </label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Bell className="w-3 h-3 text-amber-500" />
                <span>Email Reminder</span>
              </label>
              <input
                type="email"
                value={editReminderEmail}
                onChange={(e) => setEditReminderEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full text-xs px-2.5 py-1.5 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
