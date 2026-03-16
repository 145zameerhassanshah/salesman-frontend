"use client";

import { ReactNode } from "react";

interface Props {
  title: string;
  value: string;
  icon: ReactNode;
}

export default function StatCard({ title, value, icon }: Props) {

  return (

    <div className="bg-gray-100 rounded-2xl p-5 flex flex-col gap-2 shadow-sm">

      <div className="flex items-center gap-2 text-gray-500 text-sm">
        {icon}
        {title}
      </div>

      <p className="text-2xl font-semibold text-gray-800">
        {value}
      </p>

    </div>

  );

}