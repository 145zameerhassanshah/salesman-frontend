import SalesmanHeader from "@/components/dashboard/SalesmanHeader";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";

import {
  DollarSign,
  TrendingUp,
  Target,
  Handshake
} from "lucide-react";

export default function SalesmanPage() {

  return (

    <div className="p-6 space-y-6">

      <SalesmanHeader />

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <StatCard
          title="Total Revenue"
          value="$425,000.00"
          icon={<DollarSign size={16} />}
        />

        <StatCard
          title="Conversion Rate"
          value="18.5%"
          icon={<TrendingUp size={16} />}
        />

        <StatCard
          title="Quota Progress"
          value="96%"
          icon={<Target size={16} />}
        />

        <StatCard
          title="Deals Closed"
          value="18"
          icon={<Handshake size={16} />}
        />

      </div>

      {/* Chart */}

      <RevenueChart />

    </div>

  );

}