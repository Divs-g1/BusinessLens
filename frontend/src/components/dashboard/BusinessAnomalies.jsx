import {
  AlertTriangle,
  ArrowDownRight,
  CircleAlert,
  Package,
  MapPin,
  ShoppingBag,
  TrendingDown,
} from "lucide-react";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const severityStyles = {
  high: {
    badge:
      "border-red-400/20 bg-red-400/10 text-red-400",
    icon: "text-red-400",
  },
  medium: {
    badge:
      "border-amber-400/20 bg-amber-400/10 text-amber-400",
    icon: "text-amber-400",
  },
  low: {
    badge:
      "border-blue-400/20 bg-blue-400/10 text-blue-400",
    icon: "text-blue-400",
  },
};

const BreakdownList = ({
  title,
  icon: Icon,
  items,
  labelKey,
}) => {
  if (!items?.length) {
    return null;
  }

  const maxLoss = Math.max(
    ...items.map((item) => item.totalLoss || 0)
  );

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-white/40" />

        <h3 className="text-sm font-semibold text-white/80">
          {title}
        </h3>
      </div>

      <div className="mt-5 space-y-4">
        {items.map((item) => {
          const value = item.totalLoss || 0;

          const percentage =
            maxLoss > 0
              ? (value / maxLoss) * 100
              : 0;

          return (
            <div key={item[labelKey]}>
              <div className="flex items-center justify-between gap-4">
                <span className="truncate text-sm text-white/60">
                  {item[labelKey]}
                </span>

                <span className="shrink-0 text-sm font-medium text-red-400">
                  {formatCurrency(value)}
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-red-400/70 transition-all"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>

              <p className="mt-1 text-[11px] text-white/25">
                {item.lossOrders} loss-making{" "}
                {item.lossOrders === 1
                  ? "order"
                  : "orders"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BusinessAnomalies = ({
  anomalies,
}) => {
  const summary =
    anomalies?.summary || {};

  const anomalyList =
    anomalies?.anomalies || [];

  const lossMakingOrders =
    anomalies?.lossMakingOrders || [];

  const breakdowns =
    anomalies?.breakdowns || {};

  const totalLoss =
    summary.totalLoss || 0;

  const hasAnomalies =
    summary.totalAnomalies > 0;

  if (!anomalies) {
    return null;
  }

  return (
    <section className="mt-8 space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />

            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-amber-400">
              Business Anomalies
            </p>
          </div>

          <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white">
            Unusual business patterns
          </h2>

          <p className="mt-1 text-sm text-white/35">
            Potential revenue and profitability issues
            detected in your dataset.
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
            hasAnomalies
              ? "border-red-400/20 bg-red-400/10 text-red-400"
              : "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />

          {hasAnomalies
            ? `${summary.totalAnomalies} anomalies detected`
            : "No anomalies detected"}
        </div>
      </div>

      {/* No anomalies */}
      {!hasAnomalies ? (
        <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-emerald-400/10 p-3">
              <TrendingDown className="h-5 w-5 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white/80">
                No profitability anomalies found
              </h3>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-white/35">
                The dataset contains the required revenue
                and cost fields, and no orders with negative
                profit were detected.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-red-400/10 bg-red-400/[0.03] p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/35">
                  Total Loss
                </p>

                <TrendingDown className="h-4 w-4 text-red-400" />
              </div>

              <p className="mt-3 text-2xl font-semibold tracking-tight text-red-400">
                {formatCurrency(totalLoss)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/35">
                  Loss-making Orders
                </p>

                <CircleAlert className="h-4 w-4 text-amber-400" />
              </div>

              <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
                {summary.lossMakingOrders || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/35">
                  Negative Margins
                </p>

                <ArrowDownRight className="h-4 w-4 text-red-400" />
              </div>

              <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
                {summary.negativeMargin || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/35">
                  Affected Rows
                </p>

                <AlertTriangle className="h-4 w-4 text-amber-400" />
              </div>

              <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
                {lossMakingOrders.length}
              </p>

              <p className="mt-1 text-[11px] text-white/25">
                out of {summary.totalRows || 0} rows
              </p>
            </div>
          </div>

          {/* Anomaly alerts */}
          <div className="space-y-3">
            {anomalyList.map((anomaly) => {
              const styles =
                severityStyles[
                  anomaly.severity
                ] || severityStyles.medium;

              return (
                <div
                  key={anomaly.type}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-0.5 rounded-xl bg-white/[0.04] p-2.5 ${styles.icon}`}
                    >
                      <AlertTriangle className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-white/80">
                          {anomaly.title}
                        </h3>

                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${styles.badge}`}
                        >
                          {anomaly.severity}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-white/35">
                        {anomaly.description}
                      </p>

                      {anomaly.totalLoss !==
                        undefined && (
                        <p className="mt-2 text-xs text-red-400/80">
                          Total impact:{" "}
                          {formatCurrency(
                            anomaly.totalLoss
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Breakdowns */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <BreakdownList
              title="Loss by Product"
              icon={Package}
              items={breakdowns.products}
              labelKey="product"
            />

            <BreakdownList
              title="Loss by Region"
              icon={MapPin}
              items={breakdowns.regions}
              labelKey="region"
            />

            <BreakdownList
              title="Loss by Channel"
              icon={ShoppingBag}
              items={breakdowns.channels}
              labelKey="channel"
            />
          </div>

          {/* Loss-making orders */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <div className="border-b border-white/[0.06] px-5 py-4">
              <h3 className="text-sm font-semibold text-white/80">
                Loss-making orders
              </h3>

              <p className="mt-1 text-xs text-white/30">
                Orders where cost exceeded revenue.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-white/25">
                    <th className="px-5 py-3 font-medium">
                      Row
                    </th>
                    <th className="px-5 py-3 font-medium">
                      Product
                    </th>
                    <th className="px-5 py-3 font-medium">
                      Region
                    </th>
                    <th className="px-5 py-3 font-medium">
                      Channel
                    </th>
                    <th className="px-5 py-3 text-right font-medium">
                      Revenue
                    </th>
                    <th className="px-5 py-3 text-right font-medium">
                      Cost
                    </th>
                    <th className="px-5 py-3 text-right font-medium">
                      Loss
                    </th>
                    <th className="px-5 py-3 text-right font-medium">
                      Margin
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {lossMakingOrders.map(
                    (order) => (
                      <tr
                        key={order.rowId}
                        className="border-b border-white/[0.04] last:border-0"
                      >
                        <td className="px-5 py-3 text-sm text-white/40">
                          #{order.rowIndex}
                        </td>

                        <td className="px-5 py-3 text-sm font-medium text-white/70">
                          {order.product}
                        </td>

                        <td className="px-5 py-3 text-sm text-white/45">
                          {order.region}
                        </td>

                        <td className="px-5 py-3 text-sm text-white/45">
                          {order.channel}
                        </td>

                        <td className="px-5 py-3 text-right text-sm text-white/50">
                          {formatCurrency(
                            order.revenue
                          )}
                        </td>

                        <td className="px-5 py-3 text-right text-sm text-white/50">
                          {formatCurrency(
                            order.cost
                          )}
                        </td>

                        <td className="px-5 py-3 text-right text-sm font-medium text-red-400">
                          {formatCurrency(
                            order.loss
                          )}
                        </td>

                        <td className="px-5 py-3 text-right text-sm font-medium text-red-400">
                          {order.margin.toFixed(
                            1
                          )}
                          %
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default BusinessAnomalies;