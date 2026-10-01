import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

const KPICard = ({
  title,
  value,
  change,
  description,
  trend = "up",
}) => {
  const isPositive = trend === "up";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]">
      {/* Subtle glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-violet-500/10 blur-3xl transition-all duration-300 group-hover:bg-violet-500/15" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white/50">
            {title}
          </p>

          {change && (
            <div
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                isPositive
                  ? "bg-emerald-400/10 text-emerald-400"
                  : "bg-red-400/10 text-red-400"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}

              <span>{change}</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mt-4">
          <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {value}
          </h3>
        </div>

        {/* Description */}
        <p className="mt-2 text-xs text-white/35">
          {description}
        </p>
      </div>
    </div>
  );
};

export default KPICard;