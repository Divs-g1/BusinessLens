import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Lightbulb,
  MapPin,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

const insightIcons = {
  revenue_trend: TrendingUp,
  top_product: Package,
  top_category: BarChart3,
  top_region: MapPin,
  top_sales_channel: ShoppingBag,
  highest_product_margin: ArrowUpRight,
  data_quality: CheckCircle2,
};

const severityStyles = {
  positive: {
    icon: "text-emerald-400",
    background: "bg-emerald-400/10",
    border: "border-emerald-400/10",
  },

  neutral: {
    icon: "text-violet-400",
    background: "bg-violet-400/10",
    border: "border-violet-400/10",
  },

  warning: {
    icon: "text-amber-400",
    background: "bg-amber-400/10",
    border: "border-amber-400/10",
  },
};

const InsightsCard = ({ insights = [] }) => {
  const visibleInsights = insights.slice(0, 5);

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-400">
            AI-ready insights
          </p>

          <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">
            Business Insights
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Key findings from your business data
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-400">
          <Lightbulb className="h-5 w-5" />
        </div>
      </div>

      {/* Empty state */}
      {visibleInsights.length === 0 ? (
        <div className="mt-6 flex min-h-[260px] items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 text-center">
          <div>
            <Lightbulb className="mx-auto h-6 w-6 text-white/20" />

            <p className="mt-3 text-sm text-white/40">
              No business insights available.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {visibleInsights.map((insight, index) => {
            const Icon =
              insightIcons[insight.type] ||
              Lightbulb;

            const styles =
              severityStyles[insight.severity] ||
              severityStyles.neutral;

            return (
              <div
                key={`${insight.type}-${index}`}
                className={`rounded-xl border ${styles.border} bg-white/[0.02] p-3.5 transition-colors duration-200 hover:bg-white/[0.04]`}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles.background} ${styles.icon}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-medium text-white">
                        {insight.title}
                      </h3>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-white/40">
                      {insight.message}
                    </p>

                    {insight.value !== null &&
                      insight.value !== undefined && (
                        <p className="mt-2 text-xs font-medium text-white/60">
                          {typeof insight.value === "number"
                            ? insight.value.toLocaleString(
                                "en-IN"
                              )
                            : insight.value}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {insights.length > 5 && (
        <div className="mt-4 border-t border-white/[0.06] pt-3">
          <p className="text-xs text-white/30">
            Showing 5 of {insights.length} insights.
          </p>
        </div>
      )}
    </div>
  );
};

export default InsightsCard;