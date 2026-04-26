"use client";

import { Check, X } from "lucide-react";

export default function CategoryHeader() {
  return (
    <div className="flex items-center justify-between gap-2">

      <div className="min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">Categories</p>
        <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">Heaters</h1>
      </div>

      <div className="flex gap-2 flex-shrink-0">

        <button className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition whitespace-nowrap hidden sm:block">
          Save Draft
        </button>

        <button className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-200 rounded-xl text-red-500 hover:bg-red-50 transition whitespace-nowrap">
          <X size={13} />
          <span className="hidden sm:inline">Cancel</span>
        </button>

        <button className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition whitespace-nowrap">
          <Check size={13} />
          <span className="hidden sm:inline">Save Category</span>
          <span className="sm:hidden">Save</span>
        </button>

      </div>

    </div>
  );
}