import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Download,
  Filter,
  MapPin,
  Package,
  Search,
  ShoppingBag,
  TrendingDown,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getBusinessAnomalies,
} from "../api/analytics.api";


const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
};


const formatPercent = (value) => {
  return `${Number(value || 0).toFixed(1)}%`;
};


const getSeverityClass = (severity) => {
  if (severity === "high") {
    return "border-red-400/20 bg-red-400/10 text-red-400";
  }

  if (severity === "medium") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-400";
  }

  return "border-blue-400/20 bg-blue-400/10 text-blue-400";
};


const BreakdownCard = ({
  title,
  description,
  icon: Icon,
  items,
  labelKey,
}) => {
  const maxLoss = Math.max(
    ...(items || []).map(
      (item) => Number(item.totalLoss) || 0
    ),
    1
  );

  const totalLoss = (items || []).reduce(
    (sum, item) =>
      sum + (Number(item.totalLoss) || 0),
    0
  );

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d12] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.18)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.04] p-2">
              <Icon className="h-4 w-4 text-white/55" />
            </div>

            <h3 className="text-sm font-semibold text-white/90">
              {title}
            </h3>
          </div>

          <p className="mt-2 text-xs leading-5 text-white/30">
            {description}
          </p>
        </div>

        <span className="text-xs font-medium text-red-400">
          {formatCurrency(totalLoss)}
        </span>
      </div>

      <div className="mt-6 space-y-5">
        {(items || []).map((item) => {
          const loss =
            Number(item.totalLoss) || 0;

          const percentage =
            (loss / maxLoss) * 100;

          const share =
            totalLoss > 0
              ? (loss / totalLoss) * 100
              : 0;

          return (
            <div key={item[labelKey]}>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white/70">
                    {item[labelKey]}
                  </p>

                  <p className="mt-0.5 text-[11px] text-white/25">
                    {item.lossOrders}{" "}
                    {item.lossOrders === 1
                      ? "affected order"
                      : "affected orders"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-red-400">
                    {formatCurrency(loss)}
                  </p>

                  <p className="text-[10px] text-white/25">
                    {formatPercent(share)} of loss
                  </p>
                </div>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                <div
                  className="h-full rounded-full bg-red-400/70 transition-all"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const KpiCard = ({
  label,
  value,
  description,
  icon: Icon,
  danger = false,
}) => {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        danger
          ? "border-red-400/10 bg-red-400/[0.035]"
          : "border-white/[0.07] bg-[#0d0d12]"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-white/35">
          {label}
        </p>

        <div
          className={`rounded-lg p-2 ${
            danger
              ? "bg-red-400/10 text-red-400"
              : "bg-white/[0.04] text-white/40"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <p
        className={`mt-4 text-2xl font-semibold tracking-tight ${
          danger
            ? "text-red-400"
            : "text-white"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-[11px] text-white/25">
        {description}
      </p>
    </div>
  );
};


const BusinessAnomalies = () => {
  const navigate = useNavigate();

  const { datasetId } = useParams();

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [productFilter, setProductFilter] =
    useState("all");

  const [regionFilter, setRegionFilter] =
    useState("all");

  const [channelFilter, setChannelFilter] =
    useState("all");

  const [sortBy, setSortBy] =
    useState("loss");

  const [sortDirection, setSortDirection] =
    useState("desc");

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [showFilters, setShowFilters] =
    useState(false);


  useEffect(() => {
    const loadAnomalies = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getBusinessAnomalies(
            datasetId
          );

        setData(response);
      } catch (err) {
        console.error(
          "Failed to load anomaly analysis:",
          err
        );

        setError(
          "Unable to load anomaly analysis."
        );
      } finally {
        setLoading(false);
      }
    };

    if (datasetId) {
      loadAnomalies();
    }
  }, [datasetId]);


  const summary = data?.summary || {};
  const anomalies = data?.anomalies || [];
 const statisticalAnomalies = data?.statisticalAnomalies || [];

 const statisticalRowMap = useMemo(() => {
    const map = {};

    statisticalAnomalies.forEach(
      (anomaly) => {
        anomaly.outliers?.forEach(
          (outlier) => {
            if (!map[outlier.rowId]) {
              map[outlier.rowId] = {
                rowId: outlier.rowId,
                rowIndex: outlier.rowIndex,
                fields: [],
              };
            }

            map[outlier.rowId].fields.push({
              field: anomaly.field,
              direction: outlier.direction,
              value: outlier.value,
              deviation: outlier.deviation,
            });
          }
        );
      }
    );

    return Object.values(map).sort(
      (a, b) =>
        b.fields.length -
        a.fields.length
    );
  }, [statisticalAnomalies]);

const multiMetricOutliers =
  statisticalRowMap.filter(
    (row) => row.fields.length >= 2
  );



  const orders =
    data?.lossMakingOrders || [];

  const breakdowns =
    data?.breakdowns || {};

  const totalRows =
    Number(summary.totalRows) || 0;

  const totalLoss =
    Number(summary.totalLoss) || 0;

  const affectedOrders = Number(summary.lossMakingOrders) || 0;
  
  const statisticalOutlierRows =
  Number(
    summary.statisticalOutlierRows
  ) || 0;

const statisticalAnomalyCount =
  Number(
    summary.statisticalAnomalies
  ) || 0;

  const lossRate =
    totalRows > 0
      ? (affectedOrders / totalRows) *
        100
      : 0;


  const averageLoss =
    affectedOrders > 0
      ? totalLoss / affectedOrders
      : 0;


  const worstOrder =
    orders.length > 0
      ? orders.reduce(
          (worst, current) =>
            Number(current.loss) >
            Number(worst.loss)
              ? current
              : worst
        )
      : null;


  const averageNegativeMargin =
    orders.length > 0
      ? orders.reduce(
          (sum, order) =>
            sum +
            Number(order.margin || 0),
          0
        ) / orders.length
      : 0;


  const uniqueProducts =
    useMemo(() => {
      return [
        ...new Set(
          orders.map(
            (order) =>
              order.product
          )
        ),
      ].filter(Boolean);
    }, [orders]);


  const uniqueRegions =
    useMemo(() => {
      return [
        ...new Set(
          orders.map(
            (order) =>
              order.region
          )
        ),
      ].filter(Boolean);
    }, [orders]);


  const uniqueChannels =
    useMemo(() => {
      return [
        ...new Set(
          orders.map(
            (order) =>
              order.channel
          )
        ),
      ].filter(Boolean);
    }, [orders]);


  const filteredOrders =
    useMemo(() => {
      let result = [...orders];

      if (search.trim()) {
        const query =
          search
            .trim()
            .toLowerCase();

        result = result.filter(
          (order) =>
            String(
              order.rowIndex
            )
              .toLowerCase()
              .includes(query) ||
            String(
              order.product
            )
              .toLowerCase()
              .includes(query) ||
            String(
              order.region
            )
              .toLowerCase()
              .includes(query) ||
            String(
              order.channel
            )
              .toLowerCase()
              .includes(query)
        );
      }

      if (
        productFilter !== "all"
      ) {
        result =
          result.filter(
            (order) =>
              order.product ===
              productFilter
          );
      }

      if (
        regionFilter !== "all"
      ) {
        result =
          result.filter(
            (order) =>
              order.region ===
              regionFilter
          );
      }

      if (
        channelFilter !== "all"
      ) {
        result =
          result.filter(
            (order) =>
              order.channel ===
              channelFilter
          );
      }

      result.sort((a, b) => {
        const first =
          Number(
            a[sortBy]
          ) || 0;

        const second =
          Number(
            b[sortBy]
          ) || 0;

        return sortDirection ===
          "desc"
          ? second - first
          : first - second;
      });

      return result;
    }, [
      orders,
      search,
      productFilter,
      regionFilter,
      channelFilter,
      sortBy,
      sortDirection,
    ]);


  const changeSort = (field) => {
    if (sortBy === field) {
      setSortDirection(
        (current) =>
          current === "desc"
            ? "asc"
            : "desc"
      );

      return;
    }

    setSortBy(field);
    setSortDirection("desc");
  };


  const clearFilters = () => {
    setSearch("");
    setProductFilter("all");
    setRegionFilter("all");
    setChannelFilter("all");
  };


  const exportCsv = () => {
    if (!filteredOrders.length) {
      return;
    }

    const headers = [
      "Row",
      "Product",
      "Region",
      "Channel",
      "Revenue",
      "Cost",
      "Profit",
      "Loss",
      "Margin",
    ];

    const rows =
      filteredOrders.map(
        (order) => [
          order.rowIndex,
          order.product,
          order.region,
          order.channel,
          order.revenue,
          order.cost,
          order.profit,
          order.loss,
          order.margin,
        ]
      );

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(
              value ?? ""
            ).replace(
              /"/g,
              '""'
            )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob =
      new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `businesslens-anomalies-${datasetId}.csv`;

    link.click();

    URL.revokeObjectURL(url);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070a] p-6 text-white lg:p-8">
        <div className="mx-auto max-w-[1600px] animate-pulse space-y-6">
          <div className="h-4 w-32 rounded bg-white/[0.06]" />

          <div className="h-10 w-80 rounded bg-white/[0.06]" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div
                key={index}
                className="h-32 rounded-2xl bg-white/[0.04]"
              />
            ))}
          </div>

          <div className="h-80 rounded-2xl bg-white/[0.04]" />
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen bg-[#07070a] p-6 text-white lg:p-8">
        <div className="mx-auto max-w-[1600px]">
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          <div className="rounded-2xl border border-red-400/15 bg-red-400/[0.04] p-6 text-red-400">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const hasBusinessAnomalies = Number(summary.totalAnomalies) > 0;

const hasStatisticalAnomalies =
  statisticalAnomalies.length > 0;

const hasAnyAnomalies =
  hasBusinessAnomalies ||
  hasStatisticalAnomalies;

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-7 lg:px-10 lg:py-9">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header className="border-b border-white/[0.06] pb-7">
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-white/35 transition hover:text-white/75"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg border border-amber-400/20 bg-amber-400/10 p-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400">
                  Business Intelligence
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Anomaly Intelligence
              </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
                    Investigate unusual business patterns,
                    identify financial risk, detect statistical
                    outliers, and trace affected records back
                    to their business dimensions.
                    </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[11px] text-white/45">
                  Dataset:{" "}
                  <span className="text-white/70">
                    {data?.datasetName}
                  </span>
                </span>

                <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[11px] text-emerald-400">
                  Detection ready
                </span>
              </div>
            </div>

            <div
              className={`w-fit rounded-xl border px-4 py-3 ${
                hasAnyAnomalies
                  ? "border-red-400/20 bg-red-400/[0.06]"
                  : "border-emerald-400/20 bg-emerald-400/[0.06]"
              }`}
            >
              <p className="text-[10px] uppercase tracking-wider text-white/30">
                Detection Status
              </p>

              <p
                className={`mt-1 text-sm font-semibold ${
                  hasAnyAnomalies
                    ? "text-red-400"
                    : "text-emerald-400"
                }`}
              >
                {hasAnyAnomalies
                ? `${Number(summary.totalAnomalies) + statisticalAnomalyCount} anomaly types detected`
                : "No anomalies detected"}
              </p>
            </div>
          </div>
        </header>


        {/* ================================================= */}
        {/* NO ANOMALIES */}
        {/* ================================================= */}

        {!hasAnyAnomalies ? (
          <div className="mt-8 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.035] p-8">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-emerald-400/10 p-3">
             <ArrowUpDown className="h-5 w-5 text-emerald-400" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-white/90">
                  No profitability anomalies found
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
                  Revenue and cost fields were
                  successfully detected and analyzed.
                  No orders with negative profit were
                  found in this dataset.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ================================================= */}
            {/* EXECUTIVE SUMMARY */}
            {/* ================================================= */}

            <section className="mt-7">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/30">
                  Executive Risk Summary
                </p>

                <p className="mt-1 text-sm text-white/25">
                  High-level financial impact of
                  detected anomalies.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <KpiCard
                  label="Total Financial Loss"
                  value={formatCurrency(
                    totalLoss
                  )}
                  description="Combined loss from affected orders"
                  icon={TrendingDown}
                  danger
                />

                <KpiCard
                  label="Loss Rate"
                  value={formatPercent(
                    lossRate
                  )}
                  description={`${affectedOrders} of ${totalRows} rows affected`}
                  icon={CircleAlert}
                  danger
                />

                <KpiCard
                  label="Affected Orders"
                  value={affectedOrders}
                  description="Orders with negative profit"
                  icon={AlertTriangle}
                />

                <KpiCard
                  label="Average Loss"
                  value={formatCurrency(
                    averageLoss
                  )}
                  description="Average loss per affected order"
                  icon={ArrowDown}
                  danger
                />

                <KpiCard
                  label="Worst Single Loss"
                  value={
                    worstOrder
                      ? formatCurrency(
                          worstOrder.loss
                        )
                      : "₹0"
                  }
                  description={
                    worstOrder
                      ? `${worstOrder.product} · Row #${worstOrder.rowIndex}`
                      : "No affected order"
                  }
                  icon={TrendingDown}
                  danger
                />
              </div>
            </section>


            {/* ================================================= */}
            {/* ANOMALY TYPES */}
            {/* ================================================= */}

            <section className="mt-8">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/30">
                    Detection Results
                  </p>

                  <p className="mt-1 text-sm text-white/25">
                    Patterns identified by the anomaly
                    engine.
                  </p>
                </div>

                <span className="text-xs text-white/25">
                  {summary.totalAnomalies} detected
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {anomalies.map(
                  (anomaly) => (
                    <div
                      key={anomaly.type}
                      className="rounded-2xl border border-white/[0.07] bg-[#0d0d12] p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded-xl border border-red-400/10 bg-red-400/[0.07] p-3">
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <h3 className="text-sm font-semibold text-white/90">
                              {anomaly.title}
                            </h3>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getSeverityClass(
                                anomaly.severity
                              )}`}
                            >
                              {anomaly.severity}
                            </span>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-white/35">
                            {anomaly.description}
                          </p>

                          <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                              <p className="text-[10px] uppercase tracking-wider text-white/25">
                                Affected
                              </p>

                              <p className="mt-1 text-lg font-semibold text-white">
                                {anomaly.count}
                              </p>
                            </div>

                            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                              <p className="text-[10px] uppercase tracking-wider text-white/25">
                                Financial Impact
                              </p>

                        <p className="mt-1 text-lg font-semibold text-red-400">
                        {formatCurrency(
                            anomaly.totalLoss ??
                            (anomaly.type === "negative_profit_margin"
                                ? totalLoss
                                : 0)
                        )}
                        </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* ================================================= */}
{/* STATISTICAL OUTLIER ANALYSIS */}
{/* ================================================= */}

    <section className="mt-8">
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/30">
            Statistical Analysis
        </p>

        <h2 className="mt-1 text-lg font-semibold text-white/90">
            Statistical Outliers
        </h2>

        <p className="mt-1 max-w-2xl text-sm text-white/30">
            Values that fall outside the normal distribution
            of the dataset using the Interquartile Range
            method.
        </p>
        </div>

        <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-violet-400/15 bg-violet-400/[0.06] px-3 py-1.5 text-[11px] text-violet-300">
            {statisticalAnomalyCount} detected
        </span>

        <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[11px] text-white/40">
            {statisticalOutlierRows} unique rows
        </span>
        </div>
    </div>

    {statisticalAnomalies.length === 0 ? (
        <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-6">
        <div className="flex items-start gap-3">
            <div className="rounded-lg bg-emerald-400/10 p-2">
            <CircleAlert className="h-4 w-4 text-emerald-400" />
            </div>

            <div>
            <h3 className="text-sm font-semibold text-white/80">
                No statistical outliers detected
            </h3>

            <p className="mt-1 text-xs leading-5 text-white/30">
                The tested numerical fields remain within
                their calculated IQR boundaries.
            </p>
            </div>
        </div>
        </div>
    ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {statisticalAnomalies.map(
            (anomaly) => {
            const stats =
                anomaly.statistics;

            const isPositive =
                anomaly.highCount >
                anomaly.lowCount;

            return (
                <div
                key={anomaly.type}
                className="rounded-2xl border border-white/[0.07] bg-[#0d0d12] p-5"
                >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-violet-400/10 bg-violet-400/[0.07] p-3">
                        <TrendingDown
                        className={`h-5 w-5 ${
                            isPositive
                            ? "text-violet-400"
                            : "text-blue-400"
                        }`}
                        />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white/85">
                        {anomaly.title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-white/30">
                        {anomaly.description}
                        </p>
                    </div>
                    </div>

                    <span className="shrink-0 rounded-full border border-violet-400/15 bg-violet-400/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase text-violet-300">
                    {anomaly.count}{" "}
                    {anomaly.count === 1
                        ? "outlier"
                        : "outliers"}
                    </span>
                </div>

                {/* High / Low */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/25">
                        Unusually High
                    </p>

                    <p className="mt-1 text-lg font-semibold text-white/80">
                        {anomaly.highCount}
                    </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/25">
                        Unusually Low
                    </p>

                    <p className="mt-1 text-lg font-semibold text-white/80">
                        {anomaly.lowCount}
                    </p>
                    </div>
                </div>

                {/* Statistical values */}
                {stats && (
                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/[0.06] pt-4 sm:grid-cols-3">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/25">
                        Median
                        </p>

                        <p className="mt-1 text-xs font-medium text-white/60">
                        {stats.median}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/25">
                        Q1
                        </p>

                        <p className="mt-1 text-xs font-medium text-white/60">
                        {stats.q1}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/25">
                        Q3
                        </p>

                        <p className="mt-1 text-xs font-medium text-white/60">
                        {stats.q3}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/25">
                        IQR
                        </p>

                        <p className="mt-1 text-xs font-medium text-white/60">
                        {stats.iqr}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/25">
                        Lower Fence
                        </p>

                        <p className="mt-1 text-xs font-medium text-white/60">
                        {stats.lowerFence}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/25">
                        Upper Fence
                        </p>

                        <p className="mt-1 text-xs font-medium text-white/60">
                        {stats.upperFence}
                        </p>
                    </div>
                    </div>
                )}

                {/* Outlier rows */}
                <div className="mt-5 border-t border-white/[0.06] pt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/25">
                    Affected Rows
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                    {anomaly.outliers.map(
                        (outlier) => (
                        <span
                            key={`${anomaly.type}-${outlier.rowId}`}
                            className={`rounded-lg border px-2.5 py-1.5 text-[11px] ${
                            outlier.direction ===
                            "high"
                                ? "border-red-400/15 bg-red-400/[0.05] text-red-400"
                                : "border-blue-400/15 bg-blue-400/[0.05] text-blue-400"
                            }`}
                        >
                            Row #
                            {outlier.rowIndex}
                            {" · "}
                            {outlier.direction ===
                            "high"
                            ? "High"
                            : "Low"}
                        </span>
                        )
                    )}
                    </div>
                </div>
                </div>
            );
            }
        )}
        </div>
    )}
    </section>

{multiMetricOutliers.length > 0 && (
  <section className="mt-6">
    <div className="rounded-2xl border border-orange-400/10 bg-orange-400/[0.025] p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-orange-400/10 p-2">
          <AlertTriangle className="h-4 w-4 text-orange-400" />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white/90">
            Multi-metric Outliers
          </h2>

          <p className="mt-1 text-xs leading-5 text-white/30">
            These rows are statistically unusual across
            multiple numerical fields and may deserve
            deeper investigation.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {multiMetricOutliers.map(
          (row) => (
            <div
              key={row.rowId}
              className="rounded-xl border border-white/[0.06] bg-black/20 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white/75">
                  Row #{row.rowIndex}
                </span>

                <span className="rounded-full bg-orange-400/10 px-2 py-1 text-[10px] font-semibold text-orange-400">
                  {row.fields.length} metrics
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {row.fields.map(
                  (field) => (
                    <div
                      key={`${row.rowId}-${field.field}`}
                      className="flex items-center justify-between rounded-lg bg-white/[0.025] px-3 py-2"
                    >
                      <span className="text-xs text-white/45">
                        {field.field}
                      </span>

                      <div className="text-right">
                        <span
                          className={`text-xs font-medium ${
                            field.direction ===
                            "high"
                              ? "text-red-400"
                              : "text-blue-400"
                          }`}
                        >
                          {field.direction ===
                          "high"
                            ? "High"
                            : "Low"}
                        </span>

                        <p className="text-[10px] text-white/25">
                          {field.value}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  </section>
)}


            {/* ================================================= */}
            {/* RISK CONCENTRATION */}
            {/* ================================================= */}

            <section className="mt-8">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/30">
                  Risk Concentration
                </p>

                <p className="mt-1 text-sm text-white/25">
                  Where the detected financial loss is
                  concentrated.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <BreakdownCard
                  title="Product Risk"
                  description="Products contributing to detected losses."
                  icon={Package}
                  items={breakdowns.products}
                  labelKey="product"
                />

                <BreakdownCard
                  title="Regional Risk"
                  description="Geographic concentration of losses."
                  icon={MapPin}
                  items={breakdowns.regions}
                  labelKey="region"
                />

                <BreakdownCard
                  title="Channel Risk"
                  description="Sales channels contributing to losses."
                  icon={ShoppingBag}
                  items={breakdowns.channels}
                  labelKey="channel"
                />
              </div>
            </section>


            {/* ================================================= */}
            {/* RISK INTERPRETATION */}
            {/* ================================================= */}

            <section className="mt-8">
              <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.025] p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-amber-400/10 p-2">
                    <CircleAlert className="h-4 w-4 text-amber-400" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-white/90">
                      Risk Interpretation
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-white/30">
                      These observations are derived
                      directly from the detected
                      loss-making orders. They indicate
                      where further business investigation
                      may be useful.
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                      <div className="rounded-xl border border-white/[0.05] bg-black/20 p-4">
                        <p className="text-[10px] uppercase tracking-wider text-white/25">
                          Largest Product Impact
                        </p>

                        <p className="mt-2 text-sm font-semibold text-white/75">
                          {breakdowns.products?.[0]
                            ?.product ||
                            "—"}
                        </p>

                        <p className="mt-1 text-xs text-red-400">
                          {formatCurrency(
                            breakdowns
                              .products?.[0]
                              ?.totalLoss ||
                              0
                          )}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/[0.05] bg-black/20 p-4">
                        <p className="text-[10px] uppercase tracking-wider text-white/25">
                          Largest Regional Impact
                        </p>

                        <p className="mt-2 text-sm font-semibold text-white/75">
                          {breakdowns.regions?.[0]
                            ?.region ||
                            "—"}
                        </p>

                        <p className="mt-1 text-xs text-red-400">
                          {formatCurrency(
                            breakdowns
                              .regions?.[0]
                              ?.totalLoss ||
                              0
                          )}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/[0.05] bg-black/20 p-4">
                        <p className="text-[10px] uppercase tracking-wider text-white/25">
                          Largest Channel Impact
                        </p>

                        <p className="mt-2 text-sm font-semibold text-white/75">
                          {breakdowns.channels?.[0]
                            ?.channel ||
                            "—"}
                        </p>

                        <p className="mt-1 text-xs text-red-400">
                          {formatCurrency(
                            breakdowns
                              .channels?.[0]
                              ?.totalLoss ||
                              0
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-white/[0.05] bg-black/20 p-4">
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-white/25">
                            Average Negative Margin
                          </p>

                          <p className="mt-1 text-sm font-semibold text-red-400">
                            {formatPercent(
                              averageNegativeMargin
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-white/25">
                            Worst Order
                          </p>

                          <p className="mt-1 text-sm font-semibold text-white/75">
                            {worstOrder
                              ? `${worstOrder.product} · ${formatCurrency(
                                  worstOrder.loss
                                )}`
                              : "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-white/25">
                            Loss Concentration
                          </p>

                          <p className="mt-1 text-sm font-semibold text-white/75">
                            {breakdowns.products
                              ?.length ||
                              0}{" "}
                            products ·{" "}
                            {breakdowns.regions
                              ?.length ||
                              0}{" "}
                            regions ·{" "}
                            {breakdowns.channels
                              ?.length ||
                              0}{" "}
                            channels
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>


            {/* ================================================= */}
            {/* INVESTIGATION */}
            {/* ================================================= */}

            <section className="mt-8">
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/30">
                    Investigation
                  </p>

                  <p className="mt-1 text-sm text-white/25">
                    Search, filter, sort and inspect
                    individual affected orders.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={exportCsv}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-2.5 text-xs font-semibold text-white/65 transition hover:bg-white/[0.07] hover:text-white"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </div>


              {/* Search + filter controls */}
              <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d12] p-4">
                <div className="flex flex-col gap-3 lg:flex-row">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                    <input
                      type="text"
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target.value
                        )
                      }
                      placeholder="Search product, region, channel or row..."
                      className="h-10 w-full rounded-xl border border-white/[0.07] bg-black/20 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/[0.14]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowFilters(
                        (current) =>
                          !current
                      )
                    }
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs font-semibold text-white/55 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <Filter className="h-4 w-4" />
                    Filters

                    {(productFilter !==
                      "all" ||
                      regionFilter !==
                        "all" ||
                      channelFilter !==
                        "all") && (
                      <span className="rounded-full bg-red-400 px-1.5 py-0.5 text-[9px] font-bold text-black">
                        Active
                      </span>
                    )}
                  </button>
                </div>


                {showFilters && (
                  <div className="mt-4 grid grid-cols-1 gap-3 border-t border-white/[0.06] pt-4 md:grid-cols-3">
                    <select
                      value={
                        productFilter
                      }
                      onChange={(event) =>
                        setProductFilter(
                          event.target.value
                        )
                      }
                      className="h-10 rounded-xl border border-white/[0.07] bg-[#111116] px-3 text-xs text-white/60 outline-none"
                    >
                      <option value="all">
                        All products
                      </option>

                      {uniqueProducts.map(
                        (product) => (
                          <option
                            key={product}
                            value={product}
                          >
                            {product}
                          </option>
                        )
                      )}
                    </select>

                    <select
                      value={
                        regionFilter
                      }
                      onChange={(event) =>
                        setRegionFilter(
                          event.target.value
                        )
                      }
                      className="h-10 rounded-xl border border-white/[0.07] bg-[#111116] px-3 text-xs text-white/60 outline-none"
                    >
                      <option value="all">
                        All regions
                      </option>

                      {uniqueRegions.map(
                        (region) => (
                          <option
                            key={region}
                            value={region}
                          >
                            {region}
                          </option>
                        )
                      )}
                    </select>

                    <select
                      value={
                        channelFilter
                      }
                      onChange={(event) =>
                        setChannelFilter(
                          event.target.value
                        )
                      }
                      className="h-10 rounded-xl border border-white/[0.07] bg-[#111116] px-3 text-xs text-white/60 outline-none"
                    >
                      <option value="all">
                        All channels
                      </option>

                      {uniqueChannels.map(
                        (channel) => (
                          <option
                            key={channel}
                            value={channel}
                          >
                            {channel}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}


                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                  <p className="text-xs text-white/30">
                    Showing{" "}
                    <span className="text-white/65">
                      {filteredOrders.length}
                    </span>{" "}
                    of{" "}
                    <span className="text-white/65">
                      {orders.length}
                    </span>{" "}
                    affected orders
                  </p>

                  {(search ||
                    productFilter !==
                      "all" ||
                    regionFilter !==
                      "all" ||
                    channelFilter !==
                      "all") && (
                    <button
                      type="button"
                      onClick={
                        clearFilters
                      }
                      className="inline-flex items-center gap-1.5 text-xs text-white/35 transition hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                      Clear filters
                    </button>
                  )}
                </div>
              </div>


              {/* Orders table */}
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d12]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-white/[0.06] bg-white/[0.015] text-left">
                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-white/25">
                          Row
                        </th>

                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-white/25">
                          Product
                        </th>

                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-white/25">
                          Region
                        </th>

                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-white/25">
                          Channel
                        </th>

                        <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-white/25">
                          Revenue
                        </th>

                        <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-white/25">
                          Cost
                        </th>

                        <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-white/25">
                          Loss
                        </th>

                        <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-white/25">
                          Margin
                        </th>

                        <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-white/25">
                          Details
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredOrders.map(
                        (order) => {
                          const isSelected =
                            selectedOrder?.rowId ===
                            order.rowId;

                          return (
                            <tr
                              key={
                                order.rowId
                              }
                              className={`border-b border-white/[0.04] transition last:border-0 ${
                                isSelected
                                  ? "bg-red-400/[0.035]"
                                  : "hover:bg-white/[0.02]"
                              }`}
                            >
                              <td className="px-5 py-4">
                                <span className="text-sm font-medium text-white/50">
                                  #
                                  {
                                    order.rowIndex
                                  }
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <span className="text-sm font-medium text-white/80">
                                  {
                                    order.product
                                  }
                                </span>
                              </td>

                              <td className="px-5 py-4 text-sm text-white/45">
                                {
                                  order.region
                                }
                              </td>

                              <td className="px-5 py-4 text-sm text-white/45">
                                {
                                  order.channel
                                }
                              </td>

                              <td className="px-5 py-4 text-right text-sm text-white/50">
                                {formatCurrency(
                                  order.revenue
                                )}
                              </td>

                              <td className="px-5 py-4 text-right text-sm text-white/50">
                                {formatCurrency(
                                  order.cost
                                )}
                              </td>

                              <td className="px-5 py-4 text-right">
                                <span className="text-sm font-semibold text-red-400">
                                  {formatCurrency(
                                    order.loss
                                  )}
                                </span>
                              </td>

                              <td className="px-5 py-4 text-right">
                                <span className="rounded-full bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400">
                                  {formatPercent(
                                    order.margin
                                  )}
                                </span>
                              </td>

                              <td className="px-5 py-4 text-right">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedOrder(
                                      isSelected
                                        ? null
                                        : order
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-[11px] font-medium text-white/45 transition hover:bg-white/[0.06] hover:text-white"
                                >
                                  {isSelected ? (
                                    <>
                                      Hide
                                      <ChevronUp className="h-3.5 w-3.5" />
                                    </>
                                  ) : (
                                    <>
                                      Inspect
                                      <ChevronDown className="h-3.5 w-3.5" />
                                    </>
                                  )}
                                </button>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>


                {!filteredOrders.length && (
                  <div className="p-10 text-center">
                    <Search className="mx-auto h-5 w-5 text-white/20" />

                    <p className="mt-3 text-sm text-white/45">
                      No affected orders match
                      your filters.
                    </p>

                    <button
                      type="button"
                      onClick={
                        clearFilters
                      }
                      className="mt-3 text-xs text-white/35 underline underline-offset-4 hover:text-white"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>


              {/* Selected order detail */}
              {selectedOrder && (
                <div className="mt-4 rounded-2xl border border-red-400/10 bg-red-400/[0.025] p-5">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-400">
                        Order Investigation
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-white/90">
                        Row #
                        {
                          selectedOrder.rowIndex
                        }{" "}
                        ·{" "}
                        {
                          selectedOrder.product
                        }
                      </h3>

                      <p className="mt-1 text-xs text-white/30">
                        {
                          selectedOrder.region
                        }{" "}
                        ·{" "}
                        {
                          selectedOrder.channel
                        }
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedOrder(
                          null
                        )
                      }
                      className="self-start rounded-lg p-2 text-white/30 transition hover:bg-white/[0.05] hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                      <p className="text-[10px] uppercase tracking-wider text-white/25">
                        Revenue
                      </p>

                      <p className="mt-2 text-base font-semibold text-white/80">
                        {formatCurrency(
                          selectedOrder.revenue
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
                      <p className="text-[10px] uppercase tracking-wider text-white/25">
                        Cost
                      </p>

                      <p className="mt-2 text-base font-semibold text-white/80">
                        {formatCurrency(
                          selectedOrder.cost
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border border-red-400/10 bg-red-400/[0.04] p-4">
                      <p className="text-[10px] uppercase tracking-wider text-white/25">
                        Profit / Loss
                      </p>

                      <p className="mt-2 text-base font-semibold text-red-400">
                        {formatCurrency(
                          selectedOrder.profit
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border border-red-400/10 bg-red-400/[0.04] p-4">
                      <p className="text-[10px] uppercase tracking-wider text-white/25">
                        Margin
                      </p>

                      <p className="mt-2 text-base font-semibold text-red-400">
                        {formatPercent(
                          selectedOrder.margin
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/30">
                        Revenue
                      </span>

                      <span className="text-white/50">
                        {formatCurrency(
                          selectedOrder.revenue
                        )}
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.05]">
                      <div
                        className="h-full rounded-full bg-emerald-400/60"
                        style={{
                          width: "100%",
                        }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-white/30">
                        Cost
                      </span>

                      <span className="text-red-400">
                        {formatCurrency(
                          selectedOrder.cost
                        )}
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.05]">
                      <div
                        className="h-full rounded-full bg-red-400/70"
                        style={{
                          width: `${Math.min(
                            (selectedOrder.cost /
                              selectedOrder.revenue) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-amber-400/10 bg-amber-400/[0.025] p-4">
                    <div className="flex items-start gap-3">
                      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />

                      <div>
                        <p className="text-xs font-semibold text-white/70">
                          Why this order was
                          flagged
                        </p>

                        <p className="mt-1 text-xs leading-5 text-white/35">
                          The recorded cost exceeds
                          the recorded revenue by{" "}
                          <span className="font-medium text-red-400">
                            {formatCurrency(
                              selectedOrder.loss
                            )}
                          </span>
                          , producing a negative
                          profit margin of{" "}
                          <span className="font-medium text-red-400">
                            {formatPercent(
                              selectedOrder.margin
                            )}
                          </span>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>


            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <div className="mt-8 border-t border-white/[0.06] pt-5">
              <div className="flex flex-col gap-2 text-[11px] text-white/20 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  BusinessLens anomaly engine
                </span>

                <span>
                  Analysis based on{" "}
                  {totalRows} dataset rows
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BusinessAnomalies;