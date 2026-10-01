import {
  Activity,
  CheckCircle2,
  Database,
  TrendingUp,
} from "lucide-react";

const BusinessHealth = ({
  overview,
  dataQuality,
}) => {
  const profitMargin = Number(
    overview?.profitMargin || 0
  );

  const totalProfit = Number(
    overview?.totalProfit || 0
  );

  const totalRevenue = Number(
    overview?.totalRevenue || 0
  );

  const totalCost = Number(
    overview?.totalCost || 0
  );

  const missingValues = Number(
    dataQuality?.missingValues || 0
  );

  const analyticsReady =
    dataQuality?.analyticsReady ?? false;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getHealthStatus = () => {
    if (!analyticsReady) {
      return {
        label: "Needs attention",
        description:
          "Some data quality issues may affect analytics.",
      };
    }

    if (profitMargin >= 30) {
      return {
        label: "Healthy",
        description:
          "The dataset shows a positive profitability profile.",
      };
    }

    if (profitMargin >= 15) {
      return {
        label: "Stable",
        description:
          "Profitability is positive but should be monitored.",
      };
    }

    return {
      label: "Monitor",
      description:
        "Profit margin is relatively low for this dataset.",
    };
  };

  const health = getHealthStatus();

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-400">
            Health
          </p>

          <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">
            Business Health
          </h2>
        </div>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            analyticsReady
              ? "bg-emerald-400/10 text-emerald-400"
              : "bg-amber-400/10 text-amber-400"
          }`}
        >
          {analyticsReady ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <Activity className="h-5 w-5" />
          )}
        </div>
      </div>

      {/* Status */}
      <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-center gap-3">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              analyticsReady
                ? "bg-emerald-400"
                : "bg-amber-400"
            }`}
          />

          <div>
            <p className="text-sm font-medium text-white">
              {health.label}
            </p>

            <p className="mt-0.5 text-xs text-white/40">
              {health.description}
            </p>
          </div>
        </div>
      </div>

      {/* Profit Margin */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/50">
            Profit Margin
          </span>

          <span className="text-sm font-semibold text-white">
            {profitMargin.toFixed(2)}%
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-violet-500 transition-all duration-700"
            style={{
              width: `${Math.min(
                Math.max(profitMargin, 0),
                100
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />

            <span className="text-xs text-white/40">
              Profit
            </span>
          </div>

          <p className="mt-2 text-sm font-semibold text-white">
            {formatCurrency(totalProfit)}
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-violet-400" />

            <span className="text-xs text-white/40">
              Data Quality
            </span>
          </div>

          <p className="mt-2 text-sm font-semibold text-white">
            {missingValues === 0
              ? "Excellent"
              : `${missingValues} missing`}
          </p>
        </div>
      </div>

      {/* Revenue / Cost */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/40">
            Revenue
          </span>

          <span className="font-medium text-white">
            {formatCurrency(totalRevenue)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-white/40">
            Cost
          </span>

          <span className="font-medium text-white">
            {formatCurrency(totalCost)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BusinessHealth;