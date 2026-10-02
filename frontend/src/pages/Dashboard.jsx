import { useParams, useNavigate } from "react-router-dom";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import KPICard from "../components/dashboard/KPICard";
import RevenueChart from "../components/dashboard/RevenueChart";
import BusinessHealth from "../components/dashboard/BusinessHealth";
import PerformanceCard from "../components/dashboard/PerformanceCard";
import InsightsCard from "../components/dashboard/InsightsCard";
import RecentActivity from "../components/dashboard/RecentActivity";

import useDashboardAnalytics from "../hooks/useDashboardAnalytics";

import {
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

const Dashboard = () => {

  const { datasetId } = useParams();
  const navigate = useNavigate();

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
    businessAnomalies,
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
    <div className="min-h-[calc(100vh-72px)] bg-[#050507] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="animate-pulse space-y-6">

          {/* Header */}
          <div className="space-y-3">
            <div className="h-8 w-64 rounded-lg bg-white/10" />
            <div className="h-4 w-96 max-w-full rounded-lg bg-white/5" />
          </div>

          {/* KPI cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 rounded-2xl border border-white/10 bg-white/[0.03]"
              />
            ))}
          </div>

          {/* Chart */}
          <div className="h-[360px] rounded-2xl border border-white/10 bg-white/[0.03]" />

          {/* Bottom cards */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-72 rounded-2xl border border-white/10 bg-white/[0.03]" />
            <div className="h-72 rounded-2xl border border-white/10 bg-white/[0.03]" />
          </div>

        </div>

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
  // console.log("Dashboard dataset:", dataset);
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Dashboard Header */}
        <DashboardHeader dataset={dataset} />

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

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-amber-400/10 bg-amber-400/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">
  <div className="flex items-start gap-3">
    <div className="rounded-xl bg-amber-400/10 p-2.5">
      <AlertTriangle className="h-5 w-5 text-amber-400" />
    </div>

    <div>
      <h3 className="text-sm font-semibold text-white/80">
        Business Anomaly Analysis
      </h3>

      <p className="mt-1 text-xs text-white/35">
        Investigate unusual profitability patterns,
        loss-making orders, and affected business areas.
      </p>
    </div>
  </div>

  <button
    type="button"
    onClick={() =>
      navigate(
        `/dashboard/datasets/${dataset.id}/anomalies`
      )
    }
    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white/70 transition hover:border-white/[0.15] hover:bg-white/[0.07] hover:text-white"
  >
    View Anomalies
    <ArrowRight className="h-4 w-4" />
  </button>
</div>

        {/* Recent Activity */}
        <section className="mt-4">
        <RecentActivity dataset={dataset} />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;