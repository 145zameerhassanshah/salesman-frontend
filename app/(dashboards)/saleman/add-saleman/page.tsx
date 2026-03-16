"use client";

import { useState } from "react";
import { User, KeyRound, Settings } from "lucide-react";

export default function AddSalesman() {
  const [active, setActive] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen p-4">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6 justify-between ">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Add New Salesman
        </h1>

        <div className="flex flex-wrap gap-3 ">
          <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg">
            Save Salesman
          </button>

          <button className="flex items-center gap-2 border px-4 py-2 rounded-lg bg-white">
            Save Draft
          </button>

          <button className="flex items-center gap-2 border px-4 py-2 rounded-lg bg-white">
            Cancel
          </button>
        </div>
      </div>

      <div className="space-y-6">

        {/* Personal Information */}
        <div className=" bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-5">
            <User size={18} />
            <h2 className="font-medium">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <input
                type="text"
                placeholder="Admin"
                className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Email Address</label>
              <input
                type="email"
                placeholder="contact@client.com"
                className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Login Credentials */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-5">
            <KeyRound size={18} />
            <h2 className="font-medium">Login Credentials</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Password</label>
              <input
                type="password"
                className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Confirm Password</label>
              <input
                type="password"
                className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Settings size={18} />
            <h2 className="font-medium">Settings</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Max Discount */}
            <div>
              <label className="text-sm text-gray-500">Max Discount</label>
              <input
                type="text"
                placeholder="10%"
                className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 outline-none"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl">
              <div>
                <p className="font-medium">Active Status</p>
                <p className="text-sm text-gray-500">
                  Enable or disable Salesman access immediately.
                </p>
              </div>

              <button
                onClick={() => setActive(!active)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                  active ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${
                    active ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}