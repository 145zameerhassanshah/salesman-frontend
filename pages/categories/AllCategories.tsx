"use client";

import { Search, Filter, Plus, Pencil, Eye, MoreVertical } from "lucide-react";

export default function AllCategories() {

  const data = [
    { name: "Heaters", products: 6, status: "Active", date: "24/2/2026" },
    { name: "Heaters", products: 6, status: "Active", date: "24/2/2026" },
    { name: "Heaters", products: 6, status: "Inactive", date: "24/2/2026" },
    { name: "Heaters", products: 6, status: "Approved", date: "24/2/2026" },
  ];

  const statusColor = (status: string) => {
    if (status === "Active") return "bg-green-100 text-green-600";
    if (status === "Inactive") return "bg-gray-200 text-gray-500";
    return "bg-teal-100 text-teal-600";
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        <h1 className="text-3xl md:text-4xl font-semibold">
          Categories
        </h1>

        <div className="flex items-center gap-2 flex-wrap">

          {/* Search */}
          <div className="flex items-center bg-white/60 rounded-xl px-3 py-2">

            <Search size={16} className="text-gray-500 mr-2"/>

            <input
              placeholder="Search"
              className="bg-transparent outline-none text-sm w-32 md:w-48"
            />

          </div>

          {/* Filter */}
          <button className="bg-white/60 p-2 rounded-xl">
            <Filter size={18}/>
          </button>

          {/* Add Category */}
          <button className="bg-black text-white flex items-center gap-2 px-3 py-2 rounded-xl text-sm">

            Add Category
            <Plus size={16}/>

          </button>

        </div>

      </div>

      {/* Table Card */}
      <div className="bg-white/60 backdrop-blur rounded-3xl p-4 md:p-6">

        <div className="overflow-x-auto">

          <table className="w-full text-xs md:text-sm">

            {/* Head */}
            <thead className="text-gray-500 border-b">

              <tr>

                <th className="text-left py-3">
                  Category Name
                </th>

                <th className="text-left">
                  No. of Products
                </th>

                <th className="text-left">
                  Status
                </th>

                <th className="text-left">
                  Date
                </th>

                <th className="text-left">
                  Action
                </th>

              </tr>

            </thead>

            {/* Body */}
            <tbody>

              {data.map((item, i) => (

                <tr key={i} className="border-b last:border-none">

                  {/* Name */}
                  <td className="py-4 flex items-center gap-3">

                    <img
                      src="/product.png"
                      className="w-8 h-8 rounded-lg"
                    />

                    {item.name}

                  </td>

                  {/* Products */}
                  <td>{item.products}</td>

                  {/* Status */}
                  <td>

                    <span className={`px-2 py-1 rounded-md text-xs ${statusColor(item.status)}`}>
                      {item.status}
                    </span>

                  </td>

                  {/* Date */}
                  <td>{item.date}</td>

                  {/* Action */}
                  <td>

                    <div className="flex gap-2">

                      <button className="bg-gray-100 p-2 rounded-lg">
                        <Pencil size={14}/>
                      </button>

                      <button className="bg-gray-100 p-2 rounded-lg">
                        <Eye size={14}/>
                      </button>

                      <button className="bg-gray-100 p-2 rounded-lg">
                        <MoreVertical size={14}/>
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-xs md:text-sm gap-3">

          <p className="text-gray-500">
            Total Categories: 4
          </p>

          <div className="flex items-center gap-2">

            <button className="px-2 py-1 border rounded">
              1
            </button>

            <button className="px-2 py-1">
              2
            </button>

            <button className="px-2 py-1">
              3
            </button>

            <span>...</span>

            <button className="px-2 py-1">
              7
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}