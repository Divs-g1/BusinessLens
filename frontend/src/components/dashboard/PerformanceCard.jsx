import {
  ArrowDownRight,
  ArrowUpRight,
  Package,
} from "lucide-react";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const PerformanceCard = ({ data = [] }) => {
  const sortedProducts = [...data]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">
      {/* Header */}
      <div className="flex items-start justify-between p-5 sm:p-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-400">
            Products
          </p>

          <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">
            Product Performance
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Revenue and profitability by product
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-400">
          <Package className="h-5 w-5" />
        </div>
      </div>

      {/* Empty state */}
      {sortedProducts.length === 0 ? (
        <div className="px-5 pb-6">
          <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm text-white/40">
            No product performance data available.
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="border-y border-white/[0.06] bg-white/[0.015]">
                <th className="px-5 py-3 text-left text-xs font-medium text-white/35">
                  Product
                </th>

                <th className="px-5 py-3 text-right text-xs font-medium text-white/35">
                  Revenue
                </th>

                <th className="px-5 py-3 text-right text-xs font-medium text-white/35">
                  Profit
                </th>

                <th className="px-5 py-3 text-right text-xs font-medium text-white/35">
                  Quantity
                </th>

                <th className="px-5 py-3 text-right text-xs font-medium text-white/35">
                  Margin
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedProducts.map((product) => {
                const margin = Number(
                  product.profitMargin || 0
                );

                const isPositive = margin >= 0;

                return (
                  <tr
                    key={product.product}
                    className="border-b border-white/[0.05] last:border-b-0 transition-colors hover:bg-white/[0.025]"
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-xs font-semibold text-white/60">
                          {product.product
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">
                            {product.product}
                          </p>

                          <p className="mt-0.5 text-xs text-white/30">
                            Avg. {formatCurrency(
                              product.averageRevenuePerUnit
                            )} / unit
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Revenue */}
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-medium text-white">
                        {formatCurrency(product.revenue)}
                      </span>
                    </td>

                    {/* Profit */}
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-medium text-emerald-400">
                        {formatCurrency(product.profit)}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm text-white/60">
                        {Number(
                          product.quantity || 0
                        ).toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* Margin */}
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {isPositive ? (
                          <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
                        )}

                        <span
                          className={`text-sm font-medium ${
                            isPositive
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {margin.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      {data.length > 5 && (
        <div className="border-t border-white/[0.06] px-5 py-3 sm:px-6">
          <p className="text-xs text-white/30">
            Showing top 5 of {data.length} products by revenue.
          </p>
        </div>
      )}
    </div>
  );
};

export default PerformanceCard;