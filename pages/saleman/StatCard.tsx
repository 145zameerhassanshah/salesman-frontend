"use client";

import { ReactNode } from "react";

interface Props {
  title: string;
  value: string;
  icon: ReactNode;
}

export default function StatCard({ title, value, icon }: Props) {

  return (

    <div
      className="
      bg-gray-100
      rounded-3xl
      px-6 py-5
      flex flex-col
      justify-center
      gap-3
      transition-all
      duration-200
      hover:shadow-md
      "
    >

      {/* Title Row */}

      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">

        <div className="text-gray-400">
          {icon}
        </div>

        <span>{title}</span>

      </div>

      {/* Value */}

      <p className="text-3xl md:text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight">
        {value}
      </p>

    </div>

  );

}