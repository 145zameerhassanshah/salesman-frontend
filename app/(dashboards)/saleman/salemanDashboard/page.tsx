<<<<<<< HEAD
=======



>>>>>>> 4142b85e089f783fe9d90dd9197a5ba7c9f93909
import {
  DollarSign,
  TrendingUp,
  Target,
  Handshake
} from "lucide-react";
<<<<<<< HEAD
import PendingApprovals from "@/app/components/dashboard/PendingApprovals";
import SalesmanHeader from "@/app/components/saleman/SalesmanHeader";
import StatCard from "@/app/components/saleman/StatCard";
import Dispatched from "@/app/components/saleman/Dispatched";
=======
import PendingApprovals from "@/pages/dashboard/PendingApprovals";
import StatCard from "@/pages/saleman/StatCard";
>>>>>>> 4142b85e089f783fe9d90dd9197a5ba7c9f93909

export default function SalesmanPage() {

  return (

    <div className="p-6 space-y-6">

      <SalesmanHeader />

      {/* Stats */}

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <StatCard
          title="Total Revenue"
          value={425000}
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

      </div> */}

<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

        <PendingApprovals />
        <Dispatched />
      {/* <RevenueChart /> */}

    </div>
    </div>

  );

}
