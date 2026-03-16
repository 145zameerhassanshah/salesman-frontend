"use client";

import { Calendar } from "lucide-react";

export default function SalesmanHeader() {

  return (

    <div className="flex items-center justify-between mb-8">

      <div>

        <p className="text-sm text-gray-400">
          Salesmen ›
        </p>

        <h1 className="text-3xl font-bold text-gray-800">
          Jon Doe
        </h1>

      </div>

      <button className="bg-black text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm">

        <Calendar size={16} />
        12 Oct - 12 Nov

      </button>

    </div>

  );

}