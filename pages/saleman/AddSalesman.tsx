"use client";

import { useState } from "react";

export default function AddSalesman() {
  const [active, setActive] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">Add New Salesman</h1>

        <div className="flex flex-wrap gap-3">
          <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
            Save Salesman
          </button>

          <button className="border px-4 py-2 rounded-lg hover:bg-gray-50">
            Save Draft
          </button>

          <button className="border border-red-400 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50">
            Cancel
          </button>
        </div>
      </div>

      <div className="space-y-6">

        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow p-4 md:p-6">
          <h2 className="text-lg font-medium mb-4">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <input
                type="text"
                placeholder="Admin"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Email Address</label>
              <input
                type="email"
                placeholder="contact@client.com"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring"
              />
            </div>

          </div>
        </div>

        {/* Login Credentials */}
        <div className="bg-white rounded-2xl shadow p-4 md:p-6">
          <h2 className="text-lg font-medium mb-4">Login Credentials</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="text-sm text-gray-500">Password</label>
              <input
                type="password"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Confirm Password</label>
              <input
                type="password"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring"
              />
            </div>

          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl shadow p-4 md:p-6">
          <h2 className="text-lg font-medium mb-4">Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

            <div>
              <label className="text-sm text-gray-500">Max Discount</label>
              <input
                type="number"
                placeholder="10%"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring"
              />
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
              <div>
                <p className="font-medium">Active Status</p>
                <p className="text-sm text-gray-500">
                  Enable or disable Salesman access immediately.
                </p>
              </div>

              {/* Toggle */}
              <button
                onClick={() => setActive(!active)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                  active ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    active ? "translate-x-6" : ""
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