"use client";

import {
  Search,
  Menu,
  LogOut,
  KeyRound,
  Pencil
} from "lucide-react";
import AuthService from "@/app/components/services/authService";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearUser } from "@/store/userSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function Topbar({ expanded, setExpanded }: any) {
  const user = useSelector((state: any) => state.user.user);
  const [openProfile, setOpenProfile] = useState(false);
  const dropdownRef = useRef<any>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    try {
      const signOut = await AuthService.logoutUser();

      if (signOut?.success === false) {
        toast.error(signOut?.message);
        return;
      }

      toast.success(signOut?.message || "Logout successful");

      dispatch(clearUser());
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full h-16 md:h-20 bg-gray-200/70 backdrop-blur-md flex items-center justify-between px-3 md:px-6">

      {/* ✅ HAMBURGER */}
      <div className="flex items-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 bg-white/60 rounded-xl mr-2 md:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center bg-white/60 rounded-2xl px-4 py-2 w-[260px]">
          <Search size={16} className="text-gray-500 mr-2" />
          <input
            placeholder="Search"
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* PROFILE */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-2 bg-white/60 px-2 py-1 rounded-xl cursor-pointer"
          >
            <img
              src={user?.profile_image || "/default-avatar.png"}
              className="w-8 h-8 rounded-lg object-cover"
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">
                {user?.user_type}
              </p>
            </div>
          </div>

          {/* DROPDOWN */}
          {openProfile && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl z-50">

              <div className="p-2 text-sm">

                <button
                  onClick={() => router.push("/profile")}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-lg"
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>

                <button
                  onClick={() => router.push("/change-password")}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-lg"
                >
                  <KeyRound size={16} />
                  Change Password
                </button>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-100 text-red-500 rounded-lg"
                >
                  <LogOut size={16} />
                  Logout
                </button>

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}