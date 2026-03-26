"use client";

import { useState } from "react";
import Sidebar from "@/app/components/dashboard/Sidebar";
import Topbar from "@/app/components/dashboard/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar expanded={expanded} setExpanded={setExpanded} />

      {/* Main Area */}
      <div
        className={`
        flex-1 flex flex-col transition-all duration-300
        ${expanded ? "ml-56" : "ml-16"}
      `}
      >

        {/* Topbar */}
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          <Topbar />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>

      </div>

    </div>
  );
}