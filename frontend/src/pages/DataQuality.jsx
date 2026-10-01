import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Database,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { getDataset } from "../api/dataset.api";
import { getDataQuality } from "../api/analytics.api";

const DataQuality = () => {
  const { datasetId } = useParams();
  const navigate = useNavigate();

  const [dataset, setDataset] = useState(null);
  const [quality, setQuality] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * -----------------------------------------
   * LOAD DATA
   * -----------------------------------------
   */

  useEffect(() => {
    const loadDataQuality = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [
          datasetResponse,
          qualityResponse,
        ] = await Promise.all([
          getDataset(datasetId),
          getDataQuality(datasetId),
        ]);

        if (!datasetResponse?.success) {
          throw new Error(
            datasetResponse?.message ||
              "Failed to load dataset."
          );
        }

        if (!qualityResponse?.success) {
          throw new Error(
            qualityResponse?.message ||
              "Failed to load data quality."
          );
        }

        setDataset(
          datasetResponse.dataset
        );

        setQuality(
          qualityResponse.quality
        );
      } catch (loadError) {
        console.error(
          "Data quality error:",
          loadError
        );

        setError(
          loadError?.response?.data?.message ||
            loadError?.message ||
            "Failed to load data quality."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (datasetId) {
      loadDataQuality();
    }
  }, [datasetId]);

  /*
   * -----------------------------------------
   * COMPLETENESS
   * -----------------------------------------
   */

  const completeness = useMemo(() => {
    if (!quality) {
      return 0;
    }

    const totalCells =
      Number(quality.rowCount || 0) *
      Number(quality.columnCount || 0);

    const missingValues = Number(
      quality.missingValues || 0
    );

    if (totalCells === 0) {
      return 0;
    }

    return Math.max(
      0,
      Math.min(
        100,
        ((totalCells - missingValues) /
          totalCells) *
          100
      )
    );
  }, [quality]);

  /*
   * -----------------------------------------
   * SEMANTIC ROLES
   * -----------------------------------------
   */

  const semanticRoles = [
    {
      key: "identifier",
      label: "Identifier",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "product",
      label: "Product",
    },
    {
      key: "category",
      label: "Category",
    },
    {
      key: "quantity",
      label: "Quantity",
    },
    {
      key: "revenue",
      label: "Revenue",
    },
    {
      key: "cost",
      label: "Cost",
    },
    {
      key: "region",
      label: "Region",
    },
    {
      key: "sales_channel",
      label: "Sales Channel",
    },
  ];

  /*
   * -----------------------------------------
   * LOADING STATE
   * -----------------------------------------
   */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080808] text-white">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-5">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-7 w-7 animate-spin text-violet-400" />

            <p className="text-sm text-white/40">
              Analyzing data quality...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * -----------------------------------------
   * ERROR STATE
   * -----------------------------------------
   */

  if (error) {
    return (
      <div className="min-h-screen bg-[#080808] text-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <button
            type="button"
            onClick={() =>
              navigate("/datasets")
            }
            className="flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Data Center
          </button>

          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="max-w-md rounded-2xl border border-red-400/10 bg-red-400/[0.04] p-8 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-red-400" />

              <h2 className="mt-4 text-lg font-semibold">
                Unable to load data quality
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/40">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const duplicateCount = Number(
    quality?.duplicateRows ?? 0
  );

  /*
   * -----------------------------------------
   * MAIN UI
   * -----------------------------------------
   */

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">

        {/* HEADER */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              navigate("/datasets")
            }
            className="mb-6 flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Data Center
          </button>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-violet-400" />

                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-violet-400">
                  Data Quality
                </p>
              </div>

              <h1 className="mt-2 truncate text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                Data Quality Overview
              </h1>

              <p className="mt-2 truncate text-sm text-white/35">
                {dataset?.originalFilename ||
                  dataset?.name ||
                  "Business dataset"}
              </p>
            </div>

            <div
              className={`flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                quality?.analyticsReady
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                  : "border-amber-400/20 bg-amber-400/10 text-amber-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  quality?.analyticsReady
                    ? "bg-emerald-400"
                    : "bg-amber-400"
                }`}
              />

              {quality?.analyticsReady
                ? "Analytics Ready"
                : "Needs Attention"}
            </div>
          </div>
        </div>

        {/* KPI CARDS */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {/* ROWS */}

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-white/40">
                Total Rows
              </p>

              <Database className="h-4 w-4 text-white/25" />
            </div>

            <p className="mt-4 text-2xl font-semibold tracking-tight">
              {quality?.rowCount ?? 0}
            </p>

            <p className="mt-1 text-[11px] text-white/25">
              Records analyzed
            </p>
          </div>

          {/* COLUMNS */}

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-white/40">
                Total Columns
              </p>

              <Database className="h-4 w-4 text-white/25" />
            </div>

            <p className="mt-4 text-2xl font-semibold tracking-tight">
              {quality?.columnCount ?? 0}
            </p>

            <p className="mt-1 text-[11px] text-white/25">
              Fields detected
            </p>
          </div>

          {/* MISSING */}

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-white/40">
                Missing Values
              </p>

              {Number(
                quality?.missingValues || 0
              ) === 0 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400/70" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-400/70" />
              )}
            </div>

            <p className="mt-4 text-2xl font-semibold tracking-tight">
              {quality?.missingValues ?? 0}
            </p>

            <p className="mt-1 text-[11px] text-white/25">
              Missing cells detected
            </p>
          </div>

          {/* DUPLICATES */}

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-white/40">
                Duplicate Rows
              </p>

              {duplicateCount === 0 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400/70" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-400/70" />
              )}
            </div>

            <p className="mt-4 text-2xl font-semibold tracking-tight">
              {duplicateCount}
            </p>

            <p className="mt-1 text-[11px] text-white/25">
              Duplicate records detected
            </p>
          </div>
        </div>

        {/* ANALYTICS READINESS */}

        <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div className="flex gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  quality?.analyticsReady
                    ? "bg-emerald-400/10"
                    : "bg-amber-400/10"
                }`}
              >
                {quality?.analyticsReady ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                )}
              </div>

              <div>
                <h2 className="text-sm font-semibold">
                  Analytics Readiness
                </h2>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-white/35">
                  {quality?.analyticsReady
                    ? "This dataset contains the core business fields required by the current BusinessLens analytics engine."
                    : "This dataset needs attention before all core analytics can be generated."}
                </p>
              </div>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                quality?.analyticsReady
                  ? "bg-emerald-400/10 text-emerald-400"
                  : "bg-amber-400/10 text-amber-400"
              }`}
            >
              {quality?.analyticsReady
                ? "Ready"
                : "Needs Attention"}
            </span>
          </div>

          {!quality?.analyticsReady &&
            quality?.readinessIssues?.length >
              0 && (
              <div className="mt-5 space-y-2 border-t border-white/[0.06] pt-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
                  Issues Detected
                </p>

                {quality.readinessIssues.map(
                  (issue, index) => (
                    <div
                      key={`${issue}-${index}`}
                      className="flex items-start gap-2 text-xs text-amber-300/70"
                    >
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />

                      <span>
                        {issue}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
        </div>

        {/* COMPLETENESS + MISSING */}

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">

          {/* COMPLETENESS */}

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
            <div>
              <h2 className="text-sm font-semibold">
                Data Completeness
              </h2>

              <p className="mt-1 text-xs text-white/30">
                Percentage of cells containing usable values.
              </p>
            </div>

            <div className="mt-7">
              <div className="flex items-end justify-between">
                <p className="text-4xl font-semibold tracking-[-0.04em]">
                  {completeness.toFixed(1)}

                  <span className="ml-1 text-xl text-white/30">
                    %
                  </span>
                </p>

                <p className="text-xs text-white/30">
                  {quality?.missingValues ?? 0}{" "}
                  missing
                </p>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                  style={{
                    width: `${completeness}%`,
                  }}
                />
              </div>

              <div className="mt-3 flex justify-between text-[10px] text-white/20">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* MISSING DATA */}

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
            <h2 className="text-sm font-semibold">
              Missing Data
            </h2>

            <p className="mt-1 text-xs text-white/30">
              Columns containing missing values.
            </p>

            <div className="mt-5">
              {quality?.missingColumns?.length >
              0 ? (
                <div className="space-y-2">
                  {quality.missingColumns.map(
                    (column) => (
                      <div
                        key={column.column}
                        className="flex items-center justify-between rounded-xl border border-amber-400/10 bg-amber-400/[0.04] px-3 py-3"
                      >
                        <span className="truncate text-xs text-white/60">
                          {column.column}
                        </span>

                        <span className="ml-4 shrink-0 text-xs font-semibold text-amber-400">
                          {column.missingValues}
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] px-4 py-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />

                  <div>
                    <p className="text-xs font-semibold text-emerald-400">
                      No missing columns
                    </p>

                    <p className="mt-0.5 text-[11px] text-white/30">
                      All detected columns are complete.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DUPLICATE SUMMARY */}

        <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                duplicateCount === 0
                  ? "bg-emerald-400/10"
                  : "bg-amber-400/10"
              }`}
            >
              {duplicateCount === 0 ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-400" />
              )}
            </div>

            <div>
              <h2 className="text-sm font-semibold">
                Duplicate Detection
              </h2>

              <p className="mt-1 text-xs leading-5 text-white/30">
                {duplicateCount === 0
                  ? "No duplicate dataset rows were detected."
                  : `${duplicateCount} duplicate dataset rows were detected and may require review.`}
              </p>
            </div>
          </div>
        </div>

        {/* SEMANTIC STRUCTURE */}

        <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold">
              Semantic Data Structure
            </h2>

            <p className="mt-1 text-xs text-white/30">
              BusinessLens identified the following
              business roles in your dataset.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {semanticRoles.map(
              (role) => {
                const count =
                  Number(
                    quality?.semanticRoles?.[
                      role.key
                    ] || 0
                  );

                const detected =
                  count > 0;

                return (
                  <div
                    key={role.key}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                      detected
                        ? "border-white/[0.07] bg-white/[0.02]"
                        : "border-white/[0.05] bg-white/[0.01]"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {detected ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400/70" />
                      ) : (
                        <XCircle className="h-4 w-4 shrink-0 text-white/20" />
                      )}

                      <span
                        className={`truncate text-xs ${
                          detected
                            ? "text-white/60"
                            : "text-white/25"
                        }`}
                      >
                        {role.label}
                      </span>
                    </div>

                    <span
                      className={`ml-3 text-xs font-semibold ${
                        detected
                          ? "text-violet-400"
                          : "text-white/20"
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* COLUMN QUALITY */}

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
          <div className="border-b border-white/[0.07] px-5 py-5 sm:px-6">
            <h2 className="text-sm font-semibold">
              Column Quality
            </h2>

            <p className="mt-1 text-xs text-white/30">
              Detailed quality information for every
              detected column.
            </p>
          </div>

          {quality?.columns?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">
                      Column
                    </th>

                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">
                      Type
                    </th>

                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">
                      Semantic Role
                    </th>

                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">
                      Missing
                    </th>

                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">
                      Unique
                    </th>

                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {quality.columns.map(
                    (column) => {
                      const hasMissing =
                        Number(
                          column.missingCount
                        ) > 0;

                      return (
                        <tr
                          key={column.name}
                          className="border-b border-white/[0.05] last:border-0 transition hover:bg-white/[0.02]"
                        >
                          <td className="px-5 py-4 text-xs font-medium text-white/70">
                            {column.name}
                          </td>

                          <td className="px-5 py-4 text-xs capitalize text-white/40">
                            {column.dataType}
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-full border border-violet-400/10 bg-violet-400/[0.06] px-2.5 py-1 text-[10px] font-medium text-violet-300/70">
                              {column.semanticRole}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-xs">
                            <span
                              className={
                                hasMissing
                                  ? "text-amber-400"
                                  : "text-emerald-400"
                              }
                            >
                              {column.missingCount}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-xs text-white/40">
                            {column.uniqueCount}
                          </td>

                          <td className="px-5 py-4">
                            {hasMissing ? (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-amber-400">
                                <AlertCircle className="h-3.5 w-3.5" />
                                Review
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Clean
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Database className="mx-auto h-6 w-6 text-white/20" />

              <p className="mt-3 text-xs text-white/30">
                No column quality information available.
              </p>
            </div>
          )}
        </div>

        {/* ACTIONS */}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/datasets/${datasetId}/preview`
              )
            }
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 text-xs font-semibold text-white/60 transition hover:bg-white/[0.07] hover:text-white"
          >
            <Database className="h-4 w-4" />
            View Dataset
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/dashboard/datasets/${datasetId}`
              )
            }
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 text-xs font-semibold text-white transition hover:bg-violet-400"
          >
            Continue to Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataQuality;