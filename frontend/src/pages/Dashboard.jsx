import DashboardHeader from "../components/dashboard/DashboardHeader";
import KPICard from "../components/dashboard/KPICard";
import RevenueChart from "../components/dashboard/RevenueChart";
import BusinessHealth from "../components/dashboard/BusinessHealth";
import PerformanceCard from "../components/dashboard/PerformanceCard";
import InsightsCard from "../components/dashboard/InsightsCard";
import RecentActivity from "../components/dashboard/RecentActivity";

import useDashboardAnalytics from "../hooks/useDashboardAnalytics";

const Dashboard = () => {
  const datasetId = 2;

  const {
    dataset,
    overview,
    revenueByMonth,
    revenueByProduct,
    revenueByCategory,
    revenueByRegion,
    quantityByProduct,
    quantityByCategory,
    revenueByChannel,
    productPerformance,
    dataQuality,
    insights,
    loading,
    error,
  } = useDashboardAnalytics(datasetId);

  const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const currentMonthRevenue =
  revenueByMonth[revenueByMonth.length - 1]?.revenue || 0;

const previousMonthRevenue =
  revenueByMonth[revenueByMonth.length - 2]?.revenue || 0;

const revenueChange =
  previousMonthRevenue > 0
    ? (
        ((currentMonthRevenue - previousMonthRevenue) /
          previousMonthRevenue) *
        100
      ).toFixed(1)
    : 0;

const revenueTrend =
  Number(revenueChange) >= 0 ? "up" : "down";

  console.log("Dashboard Analytics:", {
    overview,
    revenueByMonth,
    revenueByProduct,
    revenueByCategory,
    revenueByRegion,
    quantityByProduct,
    quantityByCategory,
    revenueByChannel,
    productPerformance,
    dataQuality,
    insights,
  });

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#050507]">
        <div className="text-sm text-white/50">
          Loading analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#050507]">
        <div className="text-sm text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Dashboard Header */}
        <DashboardHeader />

        {/* KPI Cards */}
        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KPICard
        title="Revenue"
        value={formatCurrency(overview?.totalRevenue)}
        change={`${revenueChange > 0 ? "+" : ""}${revenueChange}%`}
        description="vs previous month"
        trend={revenueTrend}
      />

      <KPICard
        title="Orders"
        value={overview?.totalOrders?.toLocaleString("en-IN") || "0"}
        change=""
        description="Total orders"
        trend="up"
      />

      <KPICard
        title="Average Order Value"
        value={formatCurrency(overview?.averageOrderValue)}
        change=""
        description="Average revenue per order"
        trend="up"
      />

      <KPICard
        title="Profit"
        value={formatCurrency(overview?.totalProfit)}
        change={`${overview?.profitMargin || 0}%`}
        description="Profit margin"
        trend="up"
      />
      </section>

        {/* Revenue + Business Health */}
        <section className="mt-4 grid gap-4 xl:grid-cols-[1.7fr_0.8fr]">
          <RevenueChart data={revenueByMonth} />
          <BusinessHealth overview={overview} dataQuality={dataQuality} />
        </section>

        {/* Performance + Insights */}
        <section className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <PerformanceCard data={productPerformance} />
        <InsightsCard insights={insights} />
        </section>

        {/* Recent Activity */}
        <section className="mt-4">
        <RecentActivity dataset={dataset} />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;