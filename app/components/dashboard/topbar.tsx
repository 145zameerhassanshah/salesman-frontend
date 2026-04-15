"use client";

import {
  Search,
  Bell,
  User,
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


export default function Topbar() {
  const user = useSelector((state: any) => state.user.user);
  const [openProfile, setOpenProfile] = useState(false);
  const dropdownRef = useRef<any>(null);
  const router = useRouter();
    const dispatch = useDispatch();

  /* ================= OUTSIDE CLICK CLOSE ================= */
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= LOGOUT ================= */
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

      {/* Mobile Search */}
      <div className="lg:hidden bg-white/60 p-3 rounded-xl cursor-pointer">
        <Search size={20} />
      </div>

      {/* RIGHT SIDE */}
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

        {/* PROFILE */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-3 bg-white/60 px-3 py-1 rounded-xl cursor-pointer hover:bg-white transition"
          >
            <img
              src={user?.profile_image || "/default-avatar.png"}
              className="w-9 h-9 rounded-lg object-cover"
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800">
                {user?.name}
              </p>
              <p className="text-xs text-gray-400 capitalize">
                {user?.user_type}
              </p>
            </div>
          </div>

          {/* DROPDOWN */}
          {openProfile && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">

              {/* HEADER */}
              <div className="bg-pink-600 p-4 text-white">
                <div className="flex items-center gap-3">
                  <img
                    src={user?.profile_image || "/default-avatar.png"}
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  <div>
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-xs opacity-80">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* MENU */}
              <div className="p-2 text-sm text-gray-700">

                {/* EDIT PROFILE */}
                <button
                  onClick={() => router.push("/profile")}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <Pencil size={16} />
                  Edit Profile
                </button>

                {/* CHANGE PASSWORD */}
                <button
                  onClick={() => router.push("/change-password")}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <KeyRound size={16} />
                  Change Password
                </button>

                {/* LOGOUT */}
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-red-100 text-red-500 rounded-lg transition"
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