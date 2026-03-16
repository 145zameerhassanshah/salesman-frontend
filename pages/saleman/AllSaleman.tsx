"use client";
import Link from "next/link";
import { Search, Plus, SlidersHorizontal, Pencil, Eye, MoreVertical } from "lucide-react";

type Salesman = {
  name: string;
  phone: string;
  email: string;
  discount: string;
  status: "Pending" | "Approved" | "Blocked";
  date: string;
};

const salesmen: Salesman[] = [
  {
    name: "Jon Doe",
    phone: "+92 312 3456789",
    email: "example@gmail.com",
    discount: "15%",
    status: "Pending",
    date: "24/2/2026",
  },
  {
    name: "Jon Doe",
    phone: "+92 312 3456789",
    email: "example@gmail.com",
    discount: "15%",
    status: "Approved",
    date: "24/2/2026",
  },
  {
    name: "Jon Doe",
    phone: "+92 312 3456789",
    email: "example@gmail.com",
    discount: "15%",
    status: "Blocked",
    date: "24/2/2026",
  },
  {
    name: "Jon Doe",
    phone: "+92 312 3456789",
    email: "example@gmail.com",
    discount: "15%",
    status: "Approved",
    date: "24/2/2026",
  },
];

const statusStyle = {
  Pending: "bg-yellow-100 text-yellow-600",
  Approved: "bg-green-100 text-green-600",
  Blocked: "bg-red-100 text-red-600",
};

export default function AllSaleman() {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <h1 className="text-3xl font-semibold">Salesmen</h1>

        <div className="flex items-center gap-3 w-full md:w-auto">

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-3 py-2 bg-white border rounded-lg focus:outline-none"
            />
          </div>

          {/* Filter */}
          <button className="p-2 bg-white border rounded-lg">
            <SlidersHorizontal size={18} />
          </button>

          {/* Add Salesman */}
          <Link href="/saleman/add-saleman">
  <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg">
    Add Salesman
    <Plus size={16} />
  </button>
</Link>

        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">

        <table className="w-full min-w-[850px] text-sm">

          <thead className="text-gray-500 border-b">

            <tr className="text-left">
              <th className="py-3">Saleman Name</th>
              <th>Phone No.</th>
              <th>Email</th>
              <th>Max Disc. %</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-center">Action</th>
            </tr>

          </thead>

          <tbody>

            {salesmen.map((salesman, index) => (

              <tr key={index} className="border-b last:border-none">

                {/* Name */}
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://i.pravatar.cc/40"
                      className="w-8 h-8 rounded-full"
                    />
                    {salesman.name}
                  </div>
                </td>

                <td>{salesman.phone}</td>

                <td>{salesman.email}</td>

                <td>{salesman.discount}</td>

                <td>
                  <span
                    className={`px-3 py-1 text-xs rounded-md font-medium ${statusStyle[salesman.status]}`}
                  >
                    {salesman.status}
                  </span>
                </td>

                <td>{salesman.date}</td>

                {/* Actions */}
                <td>
                  <div className="flex justify-center gap-2">

                    <button className="p-2 bg-gray-100 rounded-md">
                      <Pencil size={16} />
                    </button>

                    <button className="p-2 bg-gray-100 rounded-md">
                      <Eye size={16} />
                    </button>

                    <button className="p-2 bg-gray-100 rounded-md">
                      <MoreVertical size={16} />
                    </button>

                  </div>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {/* Footer */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 text-sm text-gray-500">

          <p>Total Salesmen: 4</p>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded">&lt;</button>
            <button className="px-3 py-1 border rounded bg-gray-100">1</button>
            <button className="px-3 py-1 border rounded">&gt;</button>
          </div>

        </div>

      </div>
    </div>
  );
}