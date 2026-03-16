import DashboardHeader from "@/pages/dashboard/DashboardHeader";
import StatsCard from "@/pages/dashboard/StatsCard";
import PendingApprovals from "@/pages/dashboard/PendingApprovals";
import AuditLog from "@/pages/dashboard/AuditLog";

import { ShoppingCart, Clock, FileWarning } from "lucide-react";

export default function DashboardPage() {

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