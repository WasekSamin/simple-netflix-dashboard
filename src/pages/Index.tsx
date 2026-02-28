import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentMoviesTable from "@/components/dashboard/RecentMoviesTable";
import UserGrowthChart from "@/components/dashboard/UserGrowthChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { Film, Users, CreditCard, Eye } from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back — here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Movies"
          value="847"
          change="↑ 12% from last month"
          changeType="positive"
          icon={Film}
        />
        <StatsCard
          title="Total Users"
          value="12,458"
          change="↑ 8.3% from last month"
          changeType="positive"
          icon={Users}
        />
        <StatsCard
          title="Active Subs"
          value="3,642"
          change="↑ 5.1% from last month"
          changeType="positive"
          icon={CreditCard}
        />
        <StatsCard
          title="Total Views"
          value="284K"
          change="↑ 22% from last month"
          changeType="positive"
          icon={Eye}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        <UserGrowthChart />
        <RevenueChart />
      </div>

      {/* Recent Movies */}
      <RecentMoviesTable />
    </DashboardLayout>
  );
};

export default Index;
