"use client";

import { Check, X, Eye, Plus, Search, SlidersHorizontal } from "lucide-react";

type Quotation = {
  id: string;
  client: string;
  salesman: string;
  total: string;
  discount: string;
  status: "Pending" | "Active" | "Rejected" | "Delivered" | "Cancelled";
  date: string;
};

const orders: Quotation[] = [
  {
    id: "#ORD-3387",
    client: "Jon Doe",
    salesman: "Admin",
    total: "$250,000.00",
    discount: "$500.00 (5%)",
    status: "Pending",
    date: "24/2/2026",
  },
  {
    id: "#INV-3387",
    client: "Jon Doe",
    salesman: "Admin",
    total: "$250,000.00",
    discount: "$500.00 (5%)",
    status: "Active",
    date: "24/2/2026",
  },
  {
    id: "#ORD-3387",
    client: "Jon Doe",
    salesman: "Admin",
    total: "$250,000.00",
    discount: "$500.00 (5%)",
    status: "Rejected",
    date: "24/2/2026",
  },
  {
    id: "#ORD-3387",
    client: "Jon Doe",
    salesman: "Admin",
    total: "$250,000.00",
    discount: "$500.00 (5%)",
    status: "Delivered",
    date: "24/2/2026",
  },
  {
    id: "#ORD-3387",
    client: "Jon Doe",
    salesman: "Admin",
    total: "$250,000.00",
    discount: "$500.00 (5%)",
    status: "Cancelled",
    date: "24/2/2026",
  },
];

const statusStyle = {
  Pending: "bg-yellow-100 text-yellow-600",
  Active: "bg-blue-100 text-blue-600",
  Rejected: "bg-red-100 text-red-600",
  Delivered: "bg-green-100 text-green-600",
  Cancelled: "bg-orange-100 text-orange-600",
};

export default function Quotationspage() {
  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-semibold">Quotations</h1>

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
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border focus:outline-none"
            />
          </div>

          {/* Filter */}
          <button className="p-2 bg-white border rounded-lg">
            <SlidersHorizontal size={18} />
          </button>

          {/* Add Order */}
          <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg">
            Add Quotation
            
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">

        <table className="w-full min-w-[900px] text-sm">

          <thead className="text-gray-500 border-b">
            <tr className="text-left">
              <th className="py-3">Invoice #</th>
              <th>Dealer</th>
              <th>Salesman</th>
              <th>Total</th>
              <th>Discount</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>

            {orders.map((order, i) => (
              <tr key={i} className="border-b last:border-none">

                <td className="py-4 font-medium">{order.id}</td>

                <td>
                  <div className="flex items-center gap-2">
                    <img
                      src="https://i.pravatar.cc/40"
                      className="w-8 h-8 rounded-full"
                    />
                    {order.client}
                  </div>
                </td>

                <td>
                  <div className="flex items-center gap-2">
                    <img
                      src="https://i.pravatar.cc/41"
                      className="w-8 h-8 rounded-full"
                    />
                    {order.salesman}
                  </div>
                </td>

                <td>{order.total}</td>

                <td>{order.discount}</td>

                <td>
                  <span
                    className={`px-3 py-1 text-xs rounded-md font-medium ${statusStyle[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td>{order.date}</td>

                <td>
                  <div className="flex justify-center gap-2">

                    <button className="p-2 bg-green-100 text-green-600 rounded-md">
                      <Check size={16} />
                    </button>

                    <button className="p-2 bg-red-100 text-red-600 rounded-md">
                      <X size={16} />
                    </button>

                    <button className="p-2 bg-gray-100 text-gray-600 rounded-md">
                      <Eye size={16} />
                    </button>

                  </div>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

        {/* Footer */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 text-sm text-gray-500">

          <p>Total Orders: 480</p>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded">1</button>
            <button className="px-3 py-1 border rounded bg-gray-100">2</button>
            <button className="px-3 py-1 border rounded">3</button>
            <span>...</span>
            <button className="px-3 py-1 border rounded">14</button>
            <button className="px-3 py-1 border rounded">15</button>
          </div>

        </div>

      </div>
    </div>
  );
}