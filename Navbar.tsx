import React, { useState } from "react";
import {
  ListPlus,
  Globe,
  Lock,
  Edit3,
  Trash2,
  Check,
  X,
  CheckSquare,
  Share2,
  Sparkles,
} from "lucide-react";
import { TodoList } from "../types";

interface ListSidebarProps {
  lists: TodoList[];
  activeListId: string | null;
  onSelectList: (id: string) => void;
  onCreateList: (name: string) => void;
  onRenameList: (id: string, newName: string) => void;
  onDeleteList: (id: string) => void;
  onOpenShareModal: (list: TodoList) => void;
  onCloseMobileDrawer?: () => void;
}

export const ListSidebar: React.FC<ListSidebarProps> = ({
  lists,
  activeListId,
  onSelectList,
  onCreateList,
  onRenameList,
  onDeleteList,
  onOpenShareModal,
  onCloseMobileDrawer,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    onCreateList(newListName.trim());
    setNewListName("");
    setIsCreating(false);
  };

  const handleStartRename = (list: TodoList, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingListId(list.id);
    setEditingName(list.name);
  };

  const handleSaveRename = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (editingName.trim()) {
      onRenameList(id, editingName.trim());
    }
    setEditingListId(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-none">
              Todo Lists
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">{lists.length} lists total</p>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
          title="Create new Todo List"
        >
          <ListPlus className="w-4 h-4" />
          <span className="hidden sm:inline">New</span>
        </button>
      </div>

      {/* New List Inline Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900">
          <label className="block text-xs font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
            Create Todo List
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              autoFocus
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="e.g., Work Sprint Tasks"
              className="flex-1 text-xs px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
            <button
              type="submit"
              className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="p-1.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* List Items Navigation */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {lists.map((list) => {
          const isActive = list.id === activeListId;

          if (editingListId === list.id) {
            return (
              <form
                key={list.id}
                onSubmit={(e) => handleSaveRename(list.id, e)}
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-1"
              >
                <input
                  type="text"
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1 text-xs px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100"
                />
                <button type="submit" className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingListId(null)}
                  className="p-1 text-slate-400 hover:bg-slate-200 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            );
          }

          return (
            <div
              key={list.id}
              onClick={() => {
                onSelectList(list.id);
                if (onCloseMobileDrawer) onCloseMobileDrawer();
              }}
              className={`group flex items-center justify-between p-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-xs font-semibold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                {list.isPublic ? (
                  <Globe
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-indigo-200" : "text-emerald-500"
                    }`}
                    title="Publicly shared Todo List"
                  />
                ) : (
                  <Lock
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-indigo-200" : "text-slate-400"
                    }`}
                    title="Private Todo List"
                  />
                )}
                <span className="truncate">{list.name}</span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {list.itemCount !== undefined && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-indigo-700 text-indigo-100"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {list.itemCount}
                  </span>
                )}

                {/* List Action Buttons */}
                <div
                  className={`flex items-center gap-0.5 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  } transition-opacity`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenShareModal(list);
                    }}
                    className={`p-1 rounded-md transition-colors ${
                      isActive
                        ? "hover:bg-indigo-700 text-indigo-100"
                        : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                    }`}
                    title="Public Share Link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => handleStartRename(list, e)}
                    className={`p-1 rounded-md transition-colors ${
                      isActive
                        ? "hover:bg-indigo-700 text-indigo-100"
                        : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                    }`}
                    title="Rename Todo List"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {lists.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete "${list.name}"?`)) {
                          onDeleteList(list.id);
                        }
                      }}
                      className={`p-1 rounded-md transition-colors ${
                        isActive
                          ? "hover:bg-indigo-700 text-indigo-100"
                          : "hover:bg-red-100 dark:hover:bg-red-950/50 text-red-500"
                      }`}
                      title="Delete Todo List"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer Info */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Multi-device synced</span>
        </span>
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">• Live</span>
      </div>
    </div>
  );
};
