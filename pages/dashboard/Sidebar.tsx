"use client";

import AuthService from "@/app/components/services/authService";
import { clearUser } from "@/store/userSlice";
import {
  LayoutGrid,
  ShoppingCart,
  Wallet,
  Shapes,
  Package,
  Users,
  ClipboardList,
  BarChart3,
  LogOut,
  ChevronRight,
  Box
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function Sidebar({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
}) {

  const router = useRouter();
  const dispatch = useDispatch();
   const user = useSelector((state: any) => state.user.user);

  const logout = async () => {
    try {

      const signOut = await AuthService.logoutUser();

      if (signOut?.success === false) {
        toast.error(signOut?.message);
        return;
      }

      toast.success(signOut?.message || "Logout successful");

      dispatch(clearUser());

      router.push("/login");

    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const menu = [
    { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
    { icon: ShoppingCart, label: "Orders", href: "/orders" },
    { icon: Wallet, label: "Payments", href: "/payments" },
    { icon: Shapes, label: "Categories", href: "/categories" },
    { icon: Box, label: "Products", href: "/products" },
    { icon: Package, label: "Clients", href: "/clients" },
    { icon: Users, label: "Salesman", href: "/saleman" },
    { icon: ClipboardList, label: "Report", href: "/reports" }
  ];

  const system = [
    { icon: BarChart3, label: "Audit Trail", href: "/audit-trail" },
    { icon: LogOut, label: "Logout", action: logout }
  ];

  const filteredMenu =
  user?.user_type === "salesman" ? [] : menu;

const filteredSystem =
  user?.user_type === "salesman"
    ? system.filter((item) => item.label === "Logout")
    : system;

  return (
    <div
      className={`
        fixed top-0 left-0 h-screen
        ${expanded ? "w-56" : "w-16"}
        bg-black text-white
        transition-all duration-300
      `}
    >

      <div className="flex flex-col items-center">

        {/* Logo */}
        <div className="flex items-center justify-between w-full px-3 mb-3">

          <div className="bg-orange-500 w-10 h-10 rounded flex items-center justify-center text-white text-sm font-bold">
            IM
          </div>

          <ChevronRight
            size={18}
            className={`cursor-pointer transition ${expanded ? "rotate-180" : ""}`}
            onClick={() => setExpanded(!expanded)}
          />

        </div>
        {filteredMenu
        .map((item, i) => {
          const Icon = item.icon;

          return (
            <Link
              key={i}
              href={item.href}
              className="group relative flex items-center gap-3 p-2 rounded-lg hover:bg-gray-300 w-full"
            >

              <Icon size={18} />

              {expanded && (
                <span className="text-sm">{item.label}</span>
              )}

              {!expanded && (
                <span className="absolute left-12 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                  {item.label}
                </span>
              )}

            </Link>
          );
        })}

        {/* SYSTEM MENU */}

        {filteredSystem.map((item, i) => {

          const Icon = item.icon;

          if (item.action) {

            return (
              <button
                key={i}
                onClick={item.action}
                className="group relative flex items-center gap-3 p-2 rounded-lg hover:bg-gray-300 w-full text-left"
              >

                <Icon size={18} />

                {expanded && (
                  <span className="text-sm">{item.label}</span>
                )}

                {!expanded && (
                  <span className="absolute left-12 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                    {item.label}
                  </span>
                )}

              </button>
            );
          }

          return (
            <Link
              key={i}
              href={item.href!}
              className="group relative flex items-center gap-3 p-2 rounded-lg hover:bg-gray-300 w-full"
            >

              <Icon size={18} />

              {expanded && (
                <span className="text-sm">{item.label}</span>
              )}

              {!expanded && (
                <span className="absolute left-12 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                  {item.label}
                </span>
              )}

            </Link>
          );

        })}

      </div>

      {/* PROFILE */}

      <div className="absolute bottom-3 flex items-center gap-2 px-3">

        <img
          src="/profile.png"
          className="w-8 h-8 rounded-full"
        />

        {expanded && (
          <span className="text-sm">Admin</span>
        )}

      </div>

    </div>
  );
}