"use client";

import Image from "next/image";
import {
  LayoutGrid,
  ShoppingCart,
  Wallet,
  Shapes,
  Package,
  Users,
  ClipboardList,
  Box,
  FileText,
  Truck,
  
  Calculator,
} from "lucide-react";

import Link from "next/link";
import { useSelector } from "react-redux";
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
  const user = useSelector((state: any) => state.user.user);

  const { data: ordersList } = useOrders(user?.industry);
  const { data: quotationsList } = useQuotations(user?.industry);
  // ✅ DEBUG YAHAN LAGAO 👇
  console.log("USER:", user?.user_type);
  console.log("ORDERS DATA:", ordersList);
  console.log("QUOTATIONS DATA:", quotationsList);

  // ✅ ORDER COUNT
  let orderCount = 0;

  if (user?.user_type === "admin" || user?.user_type === "salesman") {
    orderCount =
      ordersList?.filter((o: any) => o.status === "unapproved").length || 0;
  }

  if (user?.user_type === "dispatcher" || user?.user_type === "manager") {
    orderCount =
      ordersList?.filter((o: any) => o.status === "approved").length || 0;
  }

  if (user?.user_type === "accountant") {
    orderCount =
      ordersList?.filter(
        (o: any) =>
          o.status === "dispatched" || o.status === "partial"
      ).length || 0;
  }

  // ✅ QUOTATION COUNT
  let quotationCount = 0;

  if (user?.user_type === "admin" || user?.user_type === "salesman") {
    quotationCount =
      quotationsList?.filter((q: any) => q.status === "pending").length || 0;
  }

  // ✅ MENUS

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
        { icon: Truck, label: "Production Manager", href: "/manager" },

    { icon: Calculator, label: "Accountant", href: "/accountant" },
    { icon: ClipboardList, label: "Reports", href: "/reports" },
  ];

  const salesmanMenu = [
    { icon: ShoppingCart, label: "Orders", href: "/orders" },
    { icon: ClipboardList, label: "Quotations", href: "/quotations" },
    { icon: Package, label: "My Dealers", href: "/dealers" },
  ];

  const staffMenu = [
        { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },

    { icon: ShoppingCart, label: "Orders", href: "/orders" }];

  const roleMenus: any = {
    admin: adminMenu,
    salesman: salesmanMenu,
    dispatcher: staffMenu,
    manager: staffMenu,       
    accountant: staffMenu,
  };

  const filteredMenu = roleMenus[user?.user_type] || [];

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

        {/* LOGO */}
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

                {/* ORDER BADGE */}
                {item.label === "Orders" && orderCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {orderCount}
                  </span>
                )}

                {/* QUOTATION BADGE */}
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
      </div>
    </div>
  );
}