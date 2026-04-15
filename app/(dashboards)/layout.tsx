"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/dashboard/Sidebar";
import Topbar from "../components/dashboard/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(true);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) setExpanded(false);
    }
  }, []);

  return (
    <div className="flex min-h-screen font-sans">
      {/* Sidebar */}
      <Sidebar expanded={expanded} setExpanded={setExpanded} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300
          ${expanded ? "md:ml-56" : "md:ml-16"}
        `}
      >
        {/* Topbar */}
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          <Topbar expanded={expanded} setExpanded={setExpanded} />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}