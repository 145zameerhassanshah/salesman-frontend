"use client";

import { Search, Filter, Plus, Eye, Pencil } from "lucide-react";

export default function PaymentsPage() {
  const data = Array(6).fill({
    invoice: "#INV-3387",
    name: "Jon Doe",
    total: 250,
    paid: 125,
    balance: 125,
    status: "Partial",
  });

  const statusStyle: any = {
    Paid: "bg-green-100 text-green-600",
    Partial: "bg-orange-100 text-orange-600",
    Unpaid: "bg-gray-200 text-gray-500",
  };

  return (
    <div className="p-3 md:p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">

        <h1 className="text-xl md:text-3xl font-semibold">Payments</h1>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-2 w-full md:w-auto">

          {/* SEARCH */}
          <div className="flex items-center bg-white/70 rounded-xl px-3 py-2 flex-1 md:w-64">
            <Search size={16} className="text-gray-500 mr-2" />
            <input
              placeholder="Search"
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          {/* FILTER */}
          <button className="bg-white/70 p-2 rounded-xl">
            <Filter size={18} />
          </button>

          {/* ADD */}
          <button className="bg-black text-white flex items-center gap-1 px-3 py-2 rounded-xl text-sm">
            <span className="hidden md:block">Add Payment</span>
            <Plus size={16} />
          </button>

        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white/70 backdrop-blur rounded-3xl p-3 md:p-5 overflow-hidden">

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm table-fixed">

            <thead className="text-gray-500 border-b">
              <tr>
                <th className="text-left py-3 w-[15%]">Invoice</th>
                <th className="text-left w-[20%]">Client</th>
                <th className="w-[10%]">Total</th>
                <th className="w-[15%]">Paid</th>
                <th className="w-[15%]">Balance</th>
                <th className="w-[10%]">Status</th>
                <th className="w-[15%] text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">

                  <td className="py-3">{item.invoice}</td>

                  <td className="flex items-center gap-2 py-3">
                    <img
                      src="/profile.png"
                      className="w-7 h-7 rounded-full"
                    />
                    {item.name}
                  </td>

                  <td>${item.total}</td>

                  <td className="text-green-600">
                    ${item.paid.toFixed(2)}
                  </td>

                  <td className="text-red-500">
                    ${item.balance.toFixed(2)}
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded-md ${statusStyle[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <div className="flex justify-center gap-2">
                      <button className="p-2 bg-gray-100 rounded-md">
                        <Eye size={14} />
                      </button>
                      <button className="p-2 bg-blue-100 text-blue-600 rounded-md">
                        <Pencil size={14} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden space-y-3">
          {data.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 shadow-sm">

              <div className="flex justify-between items-center">
                <p className="font-medium text-sm">{item.invoice}</p>
                <span className={`px-2 py-1 text-xs rounded ${statusStyle[item.status]}`}>
                  {item.status}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <img src="/profile.png" className="w-7 h-7 rounded-full" />
                <p className="text-sm">{item.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                <p>Total: ${item.total}</p>
                <p className="text-green-600">Paid: ${item.paid}</p>
                <p className="col-span-2 text-red-500">
                  Balance: ${item.balance}
                </p>
              </div>

              <div className="flex justify-center gap-3 mt-3">
                <button className="p-2 bg-gray-100 rounded">
                  <Eye size={14} />
                </button>
                <button className="p-2 bg-blue-100 text-blue-600 rounded">
                  <Pencil size={14} />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">

        {[
          { title: "Total Payments", value: 480 },
          { title: "Paid Payments", value: 360 },
          { title: "Partial Payments", value: 80 },
          { title: "Unpaid Payments", value: 40 },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white/70 backdrop-blur rounded-2xl p-4 text-center"
          >
            <p className="text-xs text-gray-500">{item.title}</p>
            <h2 className="text-xl md:text-2xl font-semibold">
              {item.value}
            </h2>
          </div>
        ))}

      </div>

    </div>
  );
}