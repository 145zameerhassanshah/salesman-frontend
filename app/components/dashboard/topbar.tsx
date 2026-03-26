"use client";

import { Search, Bell, Settings } from "lucide-react";

export default function Topbar() {
  return (
    <div className="w-full h-20 bg-gray-200/70 backdrop-blur-md flex items-center justify-between px-6">

      {/* Desktop Search */}
      <div className="hidden lg:flex items-center bg-white/60 rounded-2xl px-4 py-3 w-[320px]">
        <Search size={18} className="text-gray-500 mr-3" />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none w-full text-gray-600 placeholder-gray-400"
        />
      </div>

      {/* Mobile Search Icon */}
      <div className="lg:hidden bg-white/60 p-3 rounded-xl cursor-pointer">
        <Search size={20} />
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-3">

        {/* Notification */}
        <div className="relative bg-white/60 p-3 rounded-xl cursor-pointer">
          <Bell size={20} />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
            14
          </span>
        </div>

        {/* Settings */}
        <div className="bg-white/60 p-3 rounded-xl cursor-pointer">
          <Settings size={20} />
        </div>

      </div>
    </div>
  );
}