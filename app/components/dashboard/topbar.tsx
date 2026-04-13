"use client";

import { Search, Bell, Menu } from "lucide-react";
import { useSelector } from "react-redux";

interface TopbarProps {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
}

export default function Topbar({ expanded, setExpanded }: TopbarProps) {
  const user = useSelector((state: any) => state.user.user);

  return (
    <div className="w-full h-20 bg-gray-200/70 backdrop-blur-md flex items-center justify-between px-6 font-sans">

      {/* Mobile Hamburger */}
      <div className="lg:hidden flex items-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 bg-white/60 rounded-xl mr-3"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Desktop Search */}
      <div className="hidden lg:flex items-center bg-white/60 rounded-2xl px-4 py-3 w-[320px]">
        <Search size={18} className="text-gray-500 mr-3" />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none w-full text-gray-600 placeholder-gray-400"
        />
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-3">
        {/* Mobile Search */}
        <div className="lg:hidden bg-white/60 p-3 rounded-xl cursor-pointer">
          <Search size={20} />
        </div>

        {/* Notification */}
        {/* <div className="relative bg-white/60 p-3 rounded-xl cursor-pointer">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
            14
          </span>
        </div> */}

        {/* User Profile */}
        <div className="flex items-center gap-3 bg-white/60 px-3 py-1 rounded-xl cursor-pointer">
          <img
            src={user?.profile_image}
            className="w-9 h-9 rounded-lg object-cover"
            alt="profile"
          />
          <div className="hidden md:block">
            <p className="text-sm text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.user_type}</p>
          </div>
        </div>
      </div>
    </div>
  );
}