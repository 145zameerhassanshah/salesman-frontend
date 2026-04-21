"use client";

import { useState, useLayoutEffect } from "react";
import Sidebar from "@/app/components/dashboard/Sidebar";
import Topbar from "../components/dashboard/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setExpanded(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const SIDEBAR_W = 224;

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          html { touch-action: manipulation; }
        }
      `}</style>

      <div style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundColor: "#f9fafb",
      }}>

        {/* SIDEBAR */}
        <aside style={{
          position: "fixed",
          top: 0, left: 0, bottom: 0,
          zIndex: 50,
          width: `${SIDEBAR_W}px`,
          transform: isMobile && !expanded ? "translateX(-100%)" : "translateX(0)",
          transition: "transform 300ms ease-in-out",
        }}>
          <Sidebar expanded={expanded} setExpanded={setExpanded} />
        </aside>

        {/* MOBILE OVERLAY */}
        {isMobile && expanded && (
          <div
            onClick={() => setExpanded(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 40,
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          />
        )}

        {/* MAIN — ✅ desktop pe hamesha 224px margin, mobile pe 0 */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
          marginLeft: isMobile ? 0 : `${SIDEBAR_W}px`,
        }}>

          {/* TOPBAR */}
          <header style={{
            position: "sticky",
            top: 0, zIndex: 40,
            flexShrink: 0,
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}>
            <Topbar expanded={expanded} setExpanded={setExpanded} />
          </header>

          {/* PAGE CONTENT */}
          <main style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "1rem",
          }}>
            {children}
          </main>

        </div>
      </div>
    </>
  );
}