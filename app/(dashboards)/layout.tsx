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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setExpanded(false);
      else setExpanded(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile zoom fix */}
      <style>{`
        @media (max-width: 767px) {
          html { touch-action: manipulation; }
        }
      `}</style>

      <div className="flex h-screen w-screen overflow-hidden font-sans bg-gray-50">

        {/* Mobile Overlay */}
        {isMobile && expanded && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setExpanded(false)}
          />
        )}

        {/* SIDEBAR — always fixed */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50
            transition-all duration-300 ease-in-out
            ${expanded ? "w-56" : "w-16"}
            ${isMobile && !expanded ? "-translate-x-full" : "translate-x-0"}
          `}
        >
          <Sidebar expanded={expanded} setExpanded={setExpanded} />
        </aside>

        {/* MAIN CONTENT */}
        <div
          className={`
            flex flex-col flex-1 min-w-0
            transition-all duration-300 ease-in-out
            ${!isMobile ? (expanded ? "ml-56" : "ml-16") : "ml-0"}
          `}
        >
          {/* TOPBAR */}
          <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
            <Topbar expanded={expanded} setExpanded={setExpanded} />
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>

      </div>
    </>
  );
}