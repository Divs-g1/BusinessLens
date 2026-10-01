import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const formatMonth = (value) => {
  if (!value) return "";

  const [year, month] = value.split("-");

  const date = new Date(
    Number(year),
    Number(month) - 1
  );

  return date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
};

const RevenueChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    month: formatMonth(item.month),
    revenue: Number(item.revenue || 0),
  }));

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-400">
            Revenue
          </p>

          <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">
            Revenue Overview
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Monthly revenue performance
          </p>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <span className="h-2 w-2 rounded-full bg-violet-400" />

          <span className="text-xs text-white/40">
            Revenue
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 h-[280px] w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-white/40">
            No revenue data available.
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "rgba(255,255,255,0.35)",
                  fontSize: 11,
                }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "rgba(255,255,255,0.35)",
                  fontSize: 11,
                }}
                tickFormatter={(value) => {
                  if (value >= 100000) {
                    return `₹${(value / 100000).toFixed(1)}L`;
                  }

                  if (value >= 1000) {
                    return `₹${(value / 1000).toFixed(0)}K`;
                  }

                  return `₹${value}`;
                }}
                width={55}
              />

              <Tooltip
                cursor={{
                  stroke: "rgba(255,255,255,0.12)",
                }}
                contentStyle={{
                  background: "#111114",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.35)",
                }}
                labelStyle={{
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "4px",
                }}
                itemStyle={{
                  color: "#ffffff",
                }}
                formatter={(value) => [
                  formatCurrency(value),
                  "Revenue",
                ]}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#8b5cf6",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;