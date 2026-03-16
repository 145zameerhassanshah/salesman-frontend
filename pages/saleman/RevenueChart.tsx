"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip
} from "recharts"

const data = [
  { month: "Jan", revenue: 20000 },
  { month: "Feb", revenue: 32000 },
  { month: "Mar", revenue: 45000 },
  { month: "Apr", revenue: 52000 },
  { month: "May", revenue: 61000 },
  { month: "Jun", revenue: 54000 },
  { month: "Jul", revenue: 58000 },
  { month: "Aug", revenue: 63000 },
  { month: "Sep", revenue: 70000 },
  { month: "Oct", revenue: 54000 },
  { month: "Nov", revenue: 60000 },
  { month: "Dec", revenue: 65000 },
];

export default function RevenueChart() {

  return (

    <div className="bg-gray-100 rounded-3xl p-6">

      <div className="flex justify-between items-center mb-6">

        <h3 className="text-gray-700 font-medium">
          Revenue Overview
        </h3>

        <button className="bg-black text-white text-sm px-3 py-1 rounded-lg">
          2026
        </button>

      </div>

      <div className="h-64">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={data}>

            <XAxis dataKey="month" stroke="#9CA3AF" />

            <Tooltip />

            <Bar
              dataKey="revenue"
              fill="#1E40AF"
              radius={[6, 6, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}