"use client";

import AuthService from "@/app/components/services/authService";
import Image from "next/image";
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
  Box,
    FileText,      // ✅ for Quotations
  Truck,         // ✅ for Dispatcher
  Calculator 
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useOrders } from "@/hooks/useOrders";
import { useQuotations } from "@/hooks/useQuotations";

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
  const {data:ordersList}=useOrders(user?.industry);
  const {data:quotationsList}=useQuotations(user?.industry);

// ✅ ORDER COUNT BASED ON ROLE
let orderCount = 0;

if (user?.user_type === "admin" || user?.user_type === "salesman") {
  orderCount = ordersList?.filter((o: any) => o.status === "unapproved").length;
}

if (user?.user_type === "dispatcher") {
  orderCount = ordersList?.filter((o: any) => o.status === "approved").length;
}

if (user?.user_type === "accountant") {
  orderCount = ordersList?.filter(
    (o: any) => o.status === "dispatched" || o.status === "partial"
  ).length;
}

// ✅ QUOTATION COUNT
let quotationCount = 0;

if (user?.user_type === "admin" || user?.user_type === "salesman") {
  quotationCount = quotationsList?.filter(
    (q: any) => q.status === "pending"
  ).length;
}

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

  // ✅ ADMIN MENU
  const adminMenu = [
  { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },

  { icon: FileText, label: "Quotations", href: "/quotations" }, // ✅ changed
  { icon: ShoppingCart, label: "Orders", href: "/orders" },     // ✅ kept

  { icon: Wallet, label: "Payments", href: "/payments" },
  { icon: Shapes, label: "Categories", href: "/categories" },
  { icon: Box, label: "Products", href: "/products" },
  { icon: Package, label: "Dealers", href: "/dealers" },

  { icon: Users, label: "Salesman", href: "/saleman" },
  { icon: Truck, label: "Dispatcher", href: "/dispatcher" },     // ✅ NEW
  { icon: Calculator, label: "Accountant", href: "/accountant" }, // ✅ NEW

  { icon: ClipboardList, label: "Reports", href: "/reports" },
];

  // ✅ SALESMAN MENU
const salesmanMenu = [
    { icon: ShoppingCart, label: "Orders", href: "/orders" },
    { icon: ClipboardList, label: "Quotations", href: "/quotations" },
      { icon: Package, label: "My Dealers", href: "/dealers" },

  ];

  const staffMenu = [
    { icon: ShoppingCart, label: "Orders", href: "/orders" },
  ];

  // ✅ SYSTEM MENU
  const system = [
    // { icon: BarChart3, label: "Audit Trail", href: "/audit-trail" },
    { icon: LogOut, label: "Logout", action: logout },
  ];

  // ✅ ROLE BASED MENU
  const roleMenus: any = {
    admin: adminMenu,
    salesman: salesmanMenu,
    dispatcher:staffMenu,
    accountant:staffMenu,
  };

  const filteredMenu = roleMenus[user?.user_type] || [];

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
    z-50
    overflow-y-auto
  `}
>
      <div className="flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center justify-between w-full px-3 mb-4">

  <div
    className={`
      flex items-center justify-center overflow-hidden transition-all duration-300
      ${expanded ? "w-12 h-12" : "w-10 h-10"}
    `}
  >
    <Image
      src="/images/logo.webp"
      alt="logo"
      width={48}
      height={48}
      className="object-contain"
    />
  </div>

          {/* <ChevronRight
            size={18}
            className={`cursor-pointer transition ${
              expanded ? "rotate-180" : ""
            }`}
            onClick={() => setExpanded(!expanded)}
          /> */}
        </div>

        {/* MENU */}
        {filteredMenu.map((item: any, i: number) => {
          const Icon = item.icon;

          return (
            <Link
              key={i}
              href={item.href}
              className="group relative flex items-center gap-3 p-2 rounded-lg hover:bg-gray-300 w-full"
            >
              <div className="relative">
  <Icon size={18} />

  {/* ORDER NOTIFICATION */}
  {item.label === "Orders" && orderCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
      {orderCount}
    </span>
  )}

  {/* QUOTATION NOTIFICATION */}
  {item.label === "Quotations" && quotationCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
      {quotationCount}
    </span>
  )}
</div>

              {expanded && <span className="text-sm">{item.label}</span>}

              {!expanded && (
                <span className="absolute left-12 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}

        {/* SYSTEM MENU */}
        {filteredSystem.map((item: any, i: number) => {
          const Icon = item.icon;

          if (item.action) {
            return (
              <button
                key={i}
                onClick={item.action}
                className="group relative flex items-center gap-3 p-2 rounded-lg hover:bg-gray-300 w-full text-left"
              >
                <Icon size={18} />

                {expanded && <span className="text-sm">{item.label}</span>}

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
              href={item.href}
              className="group relative flex items-center gap-3 p-2 rounded-lg hover:bg-gray-300 w-full"
            >
              <Icon size={18} />

              {expanded && <span className="text-sm">{item.label}</span>}

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
        <img src="/profile.png" className="w-8 h-8 rounded-full" />

        {expanded && (
          <span className="text-sm">
            {user?.user_type}
          </span>
        )}
      </div>
    </div>
  );
}
