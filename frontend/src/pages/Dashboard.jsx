import DashboardHeader from "../components/dashboard/DashboardHeader";
import KPICard from "../components/dashboard/KPICard";
import RevenueChart from "../components/dashboard/RevenueChart";
import BusinessHealth from "../components/dashboard/BusinessHealth";
import PerformanceCard from "../components/dashboard/PerformanceCard";
import InsightsCard from "../components/dashboard/InsightsCard";
import RecentActivity from "../components/dashboard/RecentActivity";

const Dashboard = () => {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Dashboard Header */}
        <DashboardHeader />

        {/* KPI Cards */}
        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KPICard
            title="Revenue"
            value="₹24.8L"
            change="+18.4%"
            description="vs last month"
            trend="up"
          />

          <KPICard
            title="Orders"
            value="12,482"
            change="+12.1%"
            description="vs last month"
            trend="up"
          />

          <KPICard
            title="Customers"
            value="4,293"
            change="+8.7%"
            description="vs last month"
            trend="up"
          />

          <KPICard
            title="Profit"
            value="₹6.2L"
            change="+21.3%"
            description="vs last month"
            trend="up"
          />
        </section>

        {/* Revenue + Business Health */}
        <section className="mt-4 grid gap-4 xl:grid-cols-[1.7fr_0.8fr]">
          <RevenueChart />
          <BusinessHealth />
        </section>

        {/* Performance + Insights */}
        <section className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <PerformanceCard />
          <InsightsCard />
        </section>

        {/* Recent Activity */}
        <section className="mt-4">
          <RecentActivity />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;