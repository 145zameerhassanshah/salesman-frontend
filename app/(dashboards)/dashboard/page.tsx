"use client";

import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import StatsCard from "@/app/components/dashboard/StatsCard";

import {
  ShoppingCart,
  Clock,
  FileWarning,
  FileText,
  Users,
  Plus,
} from "lucide-react";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { dashboard } from "@/app/components/services/dashboardService";

export default function DashboardPage() {
  const router = useRouter();
  const user = useSelector((state: any) => state?.user?.user);

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    approvedOrders: 0,
    dispatchedOrders: 0,
    totalQuotations: 0,
    totalDealers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);

  useEffect(() => {
  if (!user?.industry) return; 

const id = user?.industry; 
    const fetchStats = async () => {
      try {
        const res = await dashboard.getStats(id);

          if (res?.stats) {
          setStats(res.stats);
        }

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-4 md:space-y-6">

      <div className="flex items-start justify-between gap-3">
        <DashboardHeader />
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            onClick={() => router.push("/orders/add")}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-black px-3 py-2 text-xs font-medium text-white"
          >
            <Plus size={14} /> Create new order
          </button>
          <button
            onClick={() => router.push("/quotations/add")}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700"
          >
            <FileText size={14} /> Create quotation
          </button>
        </div>
      </div>

<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">

  {/* ✅ TOTAL ORDERS */}
  <StatsCard
    title="Total Orders"
    value={loading ? "..." : stats.totalOrders || 0}
    Icon={ShoppingCart}
  />

  <StatsCard
    title="Active Orders"
    value={loading ? "..." : (stats.approvedOrders || 0) + (stats.dispatchedOrders || 0)}
    Icon={Clock}
  />

  {/* ✅ PENDING → ONLY ADMIN + SALESMAN */}
  {(user?.user_type === "admin" || user?.user_type === "super_admin" || user?.user_type === "salesman") && (
  <StatsCard
      title="Pending"
      value={stats.pendingOrders || 0}
      Icon={FileWarning}
    />
  )}

  {/* ✅ APPROVED */}
  <StatsCard
    title="Approved"
    value={stats.approvedOrders || 0}
    Icon={Clock}
  />

  {(user?.user_type === "admin" || user?.user_type === "super_admin") && (
    <StatsCard
      title="Unapproved"
      value={stats.pendingOrders || 0}
      Icon={FileWarning}
    />
  )}

  {/* ✅ DISPATCHED → ONLY DISPATCHER / ACCOUNTANT */}
  {(user?.user_type === "dispatcher" || user?.user_type === "manager" || user?.user_type === "accountant") && (
    <StatsCard
      title="Dispatched"
      value={stats.dispatchedOrders || 0}
      Icon={ShoppingCart}
    />
  )}

</div>
    </div>
  );
}
