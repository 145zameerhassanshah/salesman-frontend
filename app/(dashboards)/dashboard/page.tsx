"use client";

import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import StatsCard from "@/app/components/dashboard/StatsCard";

import { ShoppingCart, Clock, FileWarning } from "lucide-react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { order } from "@/app/components/services/orderService";

export default function DashboardPage() {
  const router = useRouter();
  const user = useSelector((state: any) => state?.user?.user);

  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    pendingOrders: 0,
  });

  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);

  // fetch stats
  useEffect(() => {
    if (!user) return;

    const id = user?.businessId || user?.industry;

    const fetchStats = async () => {
      try {
        const res = await order.getDashboardStats(id);
        if (res) setStats(res);
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
    <div className="space-y-8">
      <DashboardHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <StatsCard
          title="Total Orders"
          value={loading ? "..." : stats.totalOrders}
          Icon={ShoppingCart}
        />

        <StatsCard
          title="Active Orders"
          value={loading ? "..." : stats.activeOrders}
          Icon={Clock}
        />

        <StatsCard
          title="Pending Approvals"
          value={loading ? "..." : stats.pendingOrders}
          Icon={FileWarning}
        />

      </div>
    </div>
  );
}