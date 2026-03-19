
<<<<<<< HEAD
import PendingApprovals from "@/pages/dashboard/PendingApprovals";
import StatsCard from "@/pages/dashboard/StatsCard";
import Dispatched from "@/pages/saleman/Dispatched";
import SalesmanHeader from "@/pages/saleman/SalesmanHeader";
import { ShoppingCart, Clock,} from "lucide-react";
=======
>>>>>>> 7dd8ed18ba5e5b8fbbf00bcf7eccb1a5a960bfe3

import {
  DollarSign,
  TrendingUp,
  Target,
  Handshake
} from "lucide-react";
import PendingApprovals from "@/pages/dashboard/PendingApprovals";
import SalesmanHeader from "@/pages/saleman/SalesmanHeader";
import StatCard from "@/pages/saleman/StatCard";
import Dispatched from "@/pages/saleman/Dispatched";

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

<<<<<<< HEAD
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    
            <StatsCard
              title="Total Revenue"
              value={425000}
              Icon={DollarSign}
            />
    
            <StatsCard
              title="Conversion Rate"
              value={18.5}
              Icon={TrendingUp}
            />
    
            <StatsCard
              title="Quota Progress"
              value={96}
              Icon={Target}
            />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 mt-6 gap-6">
            
                    <PendingApprovals />
                    <Dispatched />
    
          </div>

=======
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

        <PendingApprovals />
        <Dispatched />
      {/* <RevenueChart /> */}
>>>>>>> 7dd8ed18ba5e5b8fbbf00bcf7eccb1a5a960bfe3

    </div>
    </div>

  );

}