"use client";

import { Check, X } from "lucide-react";

export default function CategoryHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

      <div>
        <p className="text-sm text-gray-400">Categories </p>
        <h1 className="text-3xl font-semibold">Heaters</h1>
      </div>

      <div className="flex flex-wrap gap-2">

        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm">
          <Check size={16}/>
          Save Category
        </button>

        <button className="border px-4 py-2 rounded-lg text-sm">
          Save Draft
        </button>

        <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm text-red-500">
          <X size={16}/>
          Cancel
        </button>

      </div>

    </div>
  );
}