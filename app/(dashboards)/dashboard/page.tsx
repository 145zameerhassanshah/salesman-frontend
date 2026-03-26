<<<<<<< HEAD
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import StatsCard from "@/app/components/dashboard/StatsCard";
import PendingApprovals from "@/app/components/dashboard/PendingApprovals";
import AuditLog from "@/app/components/dashboard/AuditLog";
=======
"use client"
import DashboardHeader from "@/pages/dashboard/DashboardHeader";
import StatsCard from "@/pages/dashboard/StatsCard";
import PendingApprovals from "@/pages/dashboard/PendingApprovals";
import AuditLog from "@/pages/dashboard/AuditLog";
>>>>>>> 4142b85e089f783fe9d90dd9197a5ba7c9f93909

import { ShoppingCart, Clock, FileWarning } from "lucide-react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function DashboardPage() {

  const router=useRouter()
  const user=useSelector((state:any)=>state?.user?.user);
  if(!user) return router.push("/");
  return (
    <div className="space-y-8">

      <DashboardHeader />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <StatsCard
          title="Total Orders"
          value={480}
          Icon={ShoppingCart}
        />

        <StatsCard
          title="Active Orders"
          value={320}
          Icon={Clock}
        />

        <StatsCard
          title="Pending Approvals"
          value={120}
          Icon={FileWarning}
        />

      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <PendingApprovals />

        <AuditLog />

      </div>

    </div>
  );
}