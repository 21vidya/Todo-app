import React, { useState } from "react";
import { Globe, Lock, Copy, Check, ExternalLink, X, ShieldAlert } from "lucide-react";
import { TodoList } from "../types";

interface ShareModalProps {
  list: TodoList;
  onClose: () => void;
  onTogglePublic: (listId: string, isPublic: boolean) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  list,
  onClose,
  onTogglePublic,
}) => {
  const [copied, setCopied] = useState(false);

  // Generate full shareable URL
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${origin}?shareToken=${list.shareToken}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Share Todo List
            </h3>
            <p className="text-xs text-slate-500">
              "{list.name}"
            </p>
          </div>
        </div>

        {/* Public vs Private Status Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-semibold text-sm">
              {list.isPublic ? (
                <>
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-700 dark:text-emerald-300">Publicly Shared</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700 dark:text-slate-300">Private (Only You)</span>
                </>
              )}
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => onTogglePublic(list.id, !list.isPublic)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                list.isPublic ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  list.isPublic ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            {list.isPublic
              ? "Anyone with the unique link below can view this Todo List and its completion stats."
              : "Only you can see this list. Enable public sharing to generate a view-only link for team members or friends."}
          </p>
        </div>

        {/* Shareable Link Input & Copy */}
        {list.isPublic && (
          <div className="space-y-3 mb-5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Unique Share Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 text-xs px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex justify-end">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Test public link in new tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Clear Badge Indicator Notice */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Shared lists display a prominent <strong>"Publicly Shared Todo List"</strong> badge header to ensure clear visibility of public status.
          </span>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
