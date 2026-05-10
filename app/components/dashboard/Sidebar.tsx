// // "use client";

// // import Image from "next/image";
// // import {
// //   LayoutGrid,
// //   ShoppingCart,
// //   Wallet,
// //   Shapes,
// //   Package,
// //   Users,
// //   ClipboardList,
// //   Box,
// //   FileText,
// //   Truck,
// //   Calculator,
// // } from "lucide-react";

// // import Link from "next/link";
// // import { useSelector } from "react-redux";
// // import { useOrders } from "@/hooks/useOrders";
// // import { useQuotations } from "@/hooks/useQuotations";

// // export default function Sidebar({
// //   expanded,
// //   setExpanded,
// // }: {
// //   expanded: boolean;
// //   setExpanded: (v: boolean) => void;
// // }) {
// //   const user = useSelector((state: any) => state.user.user);

// //   const { data: ordersList } = useOrders(user?.industry);
// //   const { data: quotationsList } = useQuotations(user?.industry);

// //   let orderCount = 0;

// //   if (user?.user_type === "admin" || user?.user_type === "salesman") {
// //     orderCount =
// //       ordersList?.filter((o: any) => o.status === "unapproved").length || 0;
// //   }

// //   if (user?.user_type === "dispatcher" || user?.user_type === "manager") {
// //     orderCount =
// //       ordersList?.filter((o: any) => o.status === "approved").length || 0;
// //   }

// //   if (user?.user_type === "accountant") {
// //     orderCount =
// //       ordersList?.filter(
// //         (o: any) =>
// //           o.status === "dispatched" || o.status === "partial"
// //       ).length || 0;
// //   }

// //   let quotationCount = 0;

// //   if (user?.user_type === "admin" || user?.user_type === "salesman") {
// //     quotationCount =
// //       quotationsList?.filter((q: any) => q.status === "pending").length || 0;
// //   }

// //   const adminMenu = [
// //     { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
// //     { icon: FileText, label: "Quotations", href: "/quotations" },
// //     { icon: ShoppingCart, label: "Orders", href: "/orders" },
// //     { icon: Wallet, label: "Payments", href: "/payments" },
// //     { icon: Shapes, label: "Categories", href: "/categories" },
// //     { icon: Box, label: "Products", href: "/products" },
// //     { icon: Package, label: "Dealers", href: "/dealers" },
// //     { icon: Users, label: "Salesman", href: "/saleman" },
// //     { icon: Truck, label: "Dispatcher", href: "/dispatcher" },
// //     { icon: Truck, label: "Production Manager", href: "/manager" },
// //     { icon: Calculator, label: "Accountant", href: "/accountant" },
// //     { icon: ClipboardList, label: "Reports", href: "/reports" },
// //   ];

// //   const salesmanMenu = [
// //     { icon: ShoppingCart, label: "Orders", href: "/orders" },
// //     { icon: ClipboardList, label: "Quotations", href: "/quotations" },
// //     { icon: Package, label: "My Dealers", href: "/dealers" },
// //   ];

// //   const staffMenu = [
// //         { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },

// //     { icon: ShoppingCart, label: "Orders", href: "/orders" }];

// //   const roleMenus: any = {
// //     admin: adminMenu,
// //   };

// //   const filteredMenu = roleMenus[user?.user_type] || [];

// //   return (
// //     <>
// //       {/* SIDEBAR */}
// //       <div
// //         className={`
// //           fixed top-0 left-0 h-screen
// //           bg-black text-white
// //           z-50
// //           transition-transform duration-300
// //           overflow-y-auto overscroll-contain

// //           ${expanded ? "translate-x-0" : "-translate-x-full"}
// //           md:translate-x-0

// //           w-56
// //         `}
// //       >
// //         <div className="flex flex-col items-center">

// //           {/* LOGO */}
// //           <div className="flex items-center justify-between w-full px-3 mb-4 mt-2">
// //             <Image
// //               src="/images/logo.webp"
// //               alt="logo"
// //               width={40}
// //               height={40}
// //             />
// //           </div>

// //           {/* MENU */}
// //           {filteredMenu.map((item: any, i: number) => {
// //             const Icon = item.icon;

// //             return (
// //               <Link
// //                 key={i}
// //                 href={item.href}
// //                 onClick={() => setExpanded(false)} // ✅ mobile auto close
// //                 className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 w-full"
// //               >
// //                 <div className="relative">
// //                   <Icon size={18} />

// //                   {item.label === "Orders" && orderCount > 0 && (
// //                     <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] px-1.5 rounded-full">
// //                       {orderCount}
// //                     </span>
// //                   )}

// //                   {item.label === "Quotations" && quotationCount > 0 && (
// //                     <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] px-1.5 rounded-full">
// //                       {quotationCount}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <span className="text-sm">{item.label}</span>
// //               </Link>
// //             );
// //           })}
// //         </div>
// //       </div>

// //       {/* OVERLAY */}
// //       {expanded && (
// //         <div
// //           onClick={() => setExpanded(false)}
// //           className="fixed inset-0 bg-black/40 z-40 md:hidden"
// //         />
// //       )}
// //     </>
// //   );
// // }




// "use client";

// import Image from "next/image";
// import {
//   LayoutGrid,
//   ShoppingCart,
//   Wallet,
//   Shapes,
//   Package,
//   Users,
//   ClipboardList,
//   Box,
//   FileText,
//   Truck,
//   Calculator,
// } from "lucide-react";

// import Link from "next/link";
// import { useSelector } from "react-redux";
// import { useOrders } from "@/hooks/useOrders";
// import { useQuotations } from "@/hooks/useQuotations";

// export default function Sidebar({
//   expanded,
//   setExpanded,
// }: {
//   expanded: boolean;
//   setExpanded: (v: boolean) => void;
// }) {
//   const user = useSelector((state: any) => state.user.user);

//   const { data: ordersList } = useOrders(user?.industry);
//   const { data: quotationsList } = useQuotations(user?.industry);

//   const safeOrdersList = Array.isArray(ordersList)
//     ? ordersList
//     : Array.isArray((ordersList as any)?.orders)
//     ? (ordersList as any).orders
//     : [];

//   const safeQuotationsList = Array.isArray(quotationsList)
//     ? quotationsList
//     : Array.isArray((quotationsList as any)?.quotations)
//     ? (quotationsList as any).quotations
//     : [];

//   let orderCount = 0;

//   if (user?.user_type === "admin" || user?.user_type === "salesman") {
//     orderCount = safeOrdersList.filter(
//       (o: any) => o.status === "unapproved"
//     ).length;
//   }

//   if (user?.user_type === "dispatcher" || user?.user_type === "manager") {
//     orderCount = safeOrdersList.filter(
//       (o: any) => o.status === "approved"
//     ).length;
//   }

//   if (user?.user_type === "accountant") {
//     orderCount = safeOrdersList.filter(
//       (o: any) => o.status === "dispatched" || o.status === "partial"
//     ).length;
//   }

//   let quotationCount = 0;

//   if (user?.user_type === "admin" || user?.user_type === "salesman") {
//     quotationCount = safeQuotationsList.filter(
//       (q: any) => q.status === "pending"
//     ).length;
//   }

//   const adminMenu = [
//     { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
//     { icon: FileText, label: "Quotations", href: "/quotations" },
//     { icon: ShoppingCart, label: "Orders", href: "/orders" },
//     { icon: Wallet, label: "Payments", href: "/payments" },
//     { icon: Shapes, label: "Categories", href: "/categories" },
//     { icon: Box, label: "Products", href: "/products" },
//     { icon: Package, label: "Dealers", href: "/dealers" },
//     { icon: Users, label: "Salesman", href: "/saleman" },
//     { icon: Truck, label: "Dispatcher", href: "/dispatcher" },
//     { icon: Truck, label: "Production Manager", href: "/manager" },
//     { icon: Calculator, label: "Accountant", href: "/accountant" },
//     { icon: ClipboardList, label: "Reports", href: "/reports" },
//   ];

//   const salesmanMenu = [
//     { icon: ShoppingCart, label: "Orders", href: "/orders" },
//     { icon: ClipboardList, label: "Quotations", href: "/quotations" },
//     { icon: Package, label: "My Dealers", href: "/dealers" },
//   ];

//   const staffMenu = [
//     { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
//     { icon: ShoppingCart, label: "Orders", href: "/orders" },
//   ];

//   const roleMenus: any = {
//     admin: adminMenu,
//     salesman: salesmanMenu,
//     dispatcher: staffMenu,
//     manager: staffMenu,
//     accountant: staffMenu,
//   };

//   const filteredMenu = roleMenus[user?.user_type] || [];

//   return (
//     <>
//       {/* SIDEBAR */}
//       <div
//         className={`
//           fixed top-0 left-0 h-screen
//           bg-black text-white
//           z-50
//           transition-transform duration-300
//           overflow-y-auto overscroll-contain

//           ${expanded ? "translate-x-0" : "-translate-x-full"}
//           md:translate-x-0

//           w-56
//         `}
//       >
//         <div className="flex flex-col items-center">
//           {/* LOGO */}
//           <div className="flex items-center justify-between w-full px-3 mb-4 mt-2">
//             <Image
//               src="/images/logo.webp"
//               alt="logo"
//               width={40}
//               height={40}
//             />
//           </div>

//           {/* MENU */}
//           {filteredMenu.map((item: any, i: number) => {
//             const Icon = item.icon;

//             return (
//               <Link
//                 key={i}
//                 href={item.href}
//                 onClick={() => setExpanded(false)}
//                 className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 w-full"
//               >
//                 <div className="relative">
//                   <Icon size={18} />

//                   {item.label === "Orders" && orderCount > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] px-1.5 rounded-full">
//                       {orderCount}
//                     </span>
//                   )}

//                   {item.label === "Quotations" && quotationCount > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] px-1.5 rounded-full">
//                       {quotationCount}
//                     </span>
//                   )}
//                 </div>

//                 <span className="text-sm">{item.label}</span>
//               </Link>
//             );
//           })}
//         </div>
//       </div>

//       {/* OVERLAY */}
//       {expanded && (
//         <div
//           onClick={() => setExpanded(false)}
//           className="fixed inset-0 bg-black/40 z-40 md:hidden"
//         />
//       )}
//     </>
//   );
// }

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
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { useOrders } from "@/hooks/useOrders";
import { useQuotations } from "@/hooks/useQuotations";

export default function Sidebar({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const user = useSelector((state: any) => state.user.user);

  const { data: ordersList } = useOrders(user?.industry);
  const { data: quotationsList } = useQuotations(user?.industry);

  const safeOrdersList = Array.isArray(ordersList)
    ? ordersList
    : Array.isArray((ordersList as any)?.orders)
    ? (ordersList as any).orders
    : [];

  const safeQuotationsList = Array.isArray(quotationsList)
    ? quotationsList
    : Array.isArray((quotationsList as any)?.quotations)
    ? (quotationsList as any).quotations
    : [];

  let orderCount = 0;

  if (user?.user_type === "admin" || user?.user_type === "salesman") {
    orderCount = safeOrdersList.filter(
      (o: any) => o.status === "unapproved"
    ).length;
  }

  if (user?.user_type === "dispatcher" || user?.user_type === "manager") {
    orderCount = safeOrdersList.filter(
      (o: any) => o.status === "approved"
    ).length;
  }

  if (user?.user_type === "accountant") {
    orderCount = safeOrdersList.filter(
      (o: any) => o.status === "dispatched" || o.status === "partial"
    ).length;
  }

  let quotationCount = 0;

  if (user?.user_type === "admin" || user?.user_type === "salesman") {
    quotationCount = safeQuotationsList.filter(
      (q: any) => q.status === "pending"
    ).length;
  }

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
    { icon: ShoppingCart, label: "Orders", href: "/orders" },
  ];

  const roleMenus: any = {
    admin: adminMenu,
    salesman: salesmanMenu,
    dispatcher: staffMenu,
    manager: staffMenu,
    accountant: staffMenu,
  };

  const filteredMenu = roleMenus[user?.user_type] || [];

  return (
    <>
      {/* SIDEBAR */}
      <div
        className={`
          fixed top-0 left-0 h-screen
          z-50 w-60
          bg-gradient-to-b from-[#050505] via-[#0b0b0b] to-[#111111]
          text-white
          border-r border-white/10
          shadow-2xl shadow-black/40
          transition-transform duration-300 ease-in-out
          overflow-y-auto overscroll-contain
          scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent

          ${expanded ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex min-h-full flex-col">
          {/* LOGO */}
          <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
            <div className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-white/10">
              <Image
                src="/images/logo.webp"
                alt="logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-wide">
                Order Panel
              </h2>
              <p className="text-[11px] text-white/50 capitalize">
                {user?.user_type || "User"}
              </p>
            </div>
          </div>

          {/* MENU */}
          <nav className="flex flex-col gap-1 px-3 py-4">
            {filteredMenu.map((item: any, i: number) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={i}
                  href={item.href}
                  onClick={() => setExpanded(false)}
                  className={`
                    group relative flex items-center gap-3
                    rounded-xl px-3 py-2.5
                    text-sm font-medium
                    transition-all duration-200

                    ${
                      isActive
                        ? "bg-white text-black shadow-lg shadow-white/10"
                        : "text-white/75 hover:bg-white/10 hover:text-white hover:translate-x-1"
                    }
                  `}
                >
                  <span
                    className={`
                      flex h-9 w-9 items-center justify-center rounded-lg
                      transition-all duration-200

                      ${
                        isActive
                          ? "bg-black text-white"
                          : "bg-white/10 text-white/80 group-hover:bg-white/15 group-hover:text-white"
                      }
                    `}
                  >
                    <Icon size={18} />
                  </span>

                  <span className="flex-1 whitespace-nowrap">
                    {item.label}
                  </span>

                  {item.label === "Orders" && orderCount > 0 && (
                    <span
                      className={`
                        min-w-5 h-5 px-1.5
                        flex items-center justify-center
                        rounded-full text-[10px] font-bold
                        ${
                          isActive
                            ? "bg-red-500 text-white"
                            : "bg-red-500 text-white shadow-md shadow-red-500/30"
                        }
                      `}
                    >
                      {orderCount}
                    </span>
                  )}

                  {item.label === "Quotations" && quotationCount > 0 && (
                    <span
                      className={`
                        min-w-5 h-5 px-1.5
                        flex items-center justify-center
                        rounded-full text-[10px] font-bold
                        ${
                          isActive
                            ? "bg-red-500 text-white"
                            : "bg-red-500 text-white shadow-md shadow-red-500/30"
                        }
                      `}
                    >
                      {quotationCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* OVERLAY */}
      {expanded && (
        <div
          onClick={() => setExpanded(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        />
      )}
    </>
  );
}