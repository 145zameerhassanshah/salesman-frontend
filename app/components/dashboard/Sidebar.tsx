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
  LogOut,
  Box,
  FileText,
  Truck,
  Calculator,
  X,
} from "lucide-react";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useOrders } from "@/hooks/useOrders";
import { useQuotations } from "@/hooks/useQuotations";
import { useEffect } from "react";

export default function Sidebar({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.user.user);
  const { data: ordersList } = useOrders(user?.industry);
  const { data: quotationsList } = useQuotations(user?.industry);

  let orderCount = 0;

  if (user?.user_type === "admin" || user?.user_type === "salesman") {
    orderCount =
      ordersList?.filter((o: any) => o.status === "unapproved").length || 0;
  }

  if (user?.user_type === "dispatcher") {
    orderCount =
      ordersList?.filter((o: any) => o.status === "approved").length || 0;
  }

  if (user?.user_type === "accountant") {
    orderCount =
      ordersList?.filter(
        (o: any) => o.status === "dispatched" || o.status === "partial"
      ).length || 0;
  }

  let quotationCount = 0;

  if (user?.user_type === "admin" || user?.user_type === "salesman") {
    quotationCount =
      quotationsList?.filter((q: any) => q.status === "pending").length || 0;
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

  const adminMenu = [ 
    { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
    { icon: FileText, label: "Quotations", href: "/quotations" },
    { icon: ShoppingCart, label: "Orders", href: "/orders" },
    { icon: Wallet, label: "Payments", href: "/payments" },
    { icon: Shapes, label: "Categories", href: "/categories" },
    { icon: Box, label: "Products", href: "/products" },
    { icon: Package, label: "Dealers", href: "/dealers" },
    { icon: Users, label: "Salesman", href: "/saleman" },
    { icon: Truck, label: "Dispatcher", href: "/dispatcher" },
    { icon: Calculator, label: "Accountant", href: "/accountant" },
    { icon: ClipboardList, label: "Reports", href: "/reports" },
  ];

  const salesmanMenu = [
    { icon: ShoppingCart, label: "Orders", href: "/orders" },
    { icon: ClipboardList, label: "Quotations", href: "/quotations" },
    { icon: Package, label: "My Dealers", href: "/dealers" },
  ];

  const staffMenu = [{ icon: ShoppingCart, label: "Orders", href: "/orders" }];

  const system = [{ icon: LogOut, label: "Logout", action: logout }];

  const roleMenus: any = {
    admin: adminMenu,
    salesman: salesmanMenu,
    dispatcher: staffMenu,
    accountant: staffMenu,
  };

  const filteredMenu = roleMenus[user?.user_type] || [];

  const filteredSystem =
    user?.user_type === "salesman"
      ? system.filter((item) => item.label === "Logout")
      : system;

  // ✅ Mobile route change → close
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setExpanded(false);
    }
  }, [pathname, setExpanded]);

  // ✅ FIX: Desktop pe auto expand
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setExpanded(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setExpanded]);

  const sidebarDesktopWidth = expanded ? "md:w-56" : "md:w-16";

  return (
    <>
      {expanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setExpanded(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-black text-white z-50 overflow-y-auto md:overflow-hidden transition-all duration-300
        w-64
        ${expanded ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${sidebarDesktopWidth}
        font-sans`}
      >
        <div className="flex flex-col h-full">

          {/* Logo */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="w-12 h-12 flex items-center justify-center">
              <Image src="/images/logo.webp" alt="logo" width={48} height={48} />
            </div>

            <button
              onClick={() => setExpanded(false)}
              className="md:hidden p-2"
            >
              <X size={20} />
            </button>
          </div>

          {/* MENU */}
          <div className="flex-1 px-2 py-3 space-y-1">
            {filteredMenu.map((item: any, i: number) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={i}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 768) setExpanded(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl ${
                    isActive ? "bg-white text-black" : "hover:bg-white/10"
                  }`}
                >
                  <div className="relative">
                    <Icon size={18} />

                    {/*  ORDER NOTIFICATION */}
                    {item.label === "Orders" && orderCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                        {orderCount}
                      </span>
                    )}

                    {/*  QUOTATION NOTIFICATION */}
                    {item.label === "Quotations" && quotationCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                        {quotationCount}
                      </span>
                    )}
                  </div>

                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* SYSTEM */}
          <div className="px-2 py-3 border-t border-white/10">
            {filteredSystem.map((item: any, i: number) => {
              const Icon = item.icon;

              return (
                <button
                  key={i}
                  onClick={item.action}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl w-full hover:bg-red-500/20"
                >
                  <Icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}