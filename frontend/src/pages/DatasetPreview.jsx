import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Database,
  LoaderCircle,
  AlertCircle,
  Rows3,
  Columns3,
} from "lucide-react";

import {
  getDataset,
  getDatasetRows,
} from "../api/dataset.api";

const PAGE_SIZE = 10;

const DatasetPreview = () => {
  const { datasetId } = useParams();
  const navigate = useNavigate();

  const [dataset, setDataset] = useState(null);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const totalPages =
    Math.ceil(totalRows / PAGE_SIZE) || 1;

  /*
   * Load dataset information
   */
  const loadDataset = async () => {
    try {
      const response =
        await getDataset(datasetId);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to load dataset."
        );
      }

      const datasetData =
        response.dataset;

      setDataset(datasetData);

      /*
       * Dataset columns are returned
       * as objects.
       */
      if (
        Array.isArray(
          datasetData?.columns
        )
      ) {
        setColumns(
          datasetData.columns
        );
      }
    } catch (loadError) {
      console.error(
        "Dataset loading error:",
        loadError
      );

      setError(
        loadError?.response?.data?.message ||
          loadError?.message ||
          "Unable to load dataset."
      );
    }
  };

  /*
   * Load dataset rows
   */
  const loadRows = async (
    currentPage
  ) => {
    try {
      setIsLoading(true);
      setError("");

      const response =
        await getDatasetRows(
          datasetId,
          currentPage,
          PAGE_SIZE
        );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to load dataset rows."
        );
      }

      setRows(
        response.rows || []
      );

      setTotalRows(
        response.totalRows ??
          response.total ??
          dataset?.rows ??
          0
      );
    } catch (loadError) {
      console.error(
        "Dataset rows error:",
        loadError
      );

      setError(
        loadError?.response?.data?.message ||
          loadError?.message ||
          "Unable to load dataset rows."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * Load dataset information
   */
  useEffect(() => {
    if (!datasetId) {
      return;
    }

    loadDataset();
  }, [datasetId]);

  /*
   * Load rows whenever page changes
   */
  useEffect(() => {
    if (!datasetId) {
      return;
    }

    loadRows(page);
  }, [datasetId, page]);

  /*
   * Previous page
   */
  const handlePrevious = () => {
    setPage((currentPage) =>
      Math.max(
        currentPage - 1,
        1
      )
    );
  };

  /*
   * Next page
   */
  const handleNext = () => {
    setPage((currentPage) =>
      Math.min(
        currentPage + 1,
        totalPages
      )
    );
  };

  /*
   * Loading state
   */
  if (
    isLoading &&
    !dataset &&
    rows.length === 0
  ) {
    return (
      <div className="min-h-screen bg-[#050507] px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <LoaderCircle
                size={30}
                className="animate-spin text-cyan-400"
              />

              <p className="text-sm text-white/40">
                Loading dataset...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Error state
   */
  if (error && !dataset) {
    return (
      <div className="min-h-screen bg-[#050507] px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="max-w-md rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-6 text-center">
              <AlertCircle
                size={30}
                className="mx-auto text-red-400"
              />

              <h2 className="mt-4 text-lg font-bold">
                Unable to load dataset
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/40">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/datasets")
                }
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-black"
              >
                <ArrowLeft size={15} />

                Back to Datasets
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-7"
        >
          <button
            type="button"
            onClick={() =>
              navigate("/datasets")
            }
            className="mb-5 flex items-center gap-2 text-xs text-white/40 transition hover:text-white"
          >
            <ArrowLeft size={14} />

            Back to Datasets
          </button>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60">
                <Database
                  size={13}
                  className="text-cyan-400"
                />

                Dataset Preview
              </div>

              <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
                {dataset?.name ||
                  dataset?.originalFilename ||
                  "Dataset"}
              </h1>

              <p className="mt-2 truncate text-sm text-white/35">
                {dataset?.originalFilename ||
                  "Uploaded dataset"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/50">
                <Rows3 size={13} />

                {dataset?.rows ?? 0} rows
              </span>

              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/50">
                <Columns3 size={13} />

                {columns.length ||
                  dataset?.columns?.length ||
                  0}{" "}
                columns
              </span>

              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                ●{" "}
                {dataset?.status
                  ? dataset.status
                      .charAt(0)
                      .toUpperCase() +
                    dataset.status.slice(
                      1
                    )
                  : "Ready"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-4">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-400"
            />

            <p className="text-xs leading-5 text-red-300/80">
              {error}
            </p>
          </div>
        )}

        {/* Table */}
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"
        >
          {/* Table header */}
          <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold">
                Data Preview
              </h2>

              <p className="mt-1 text-xs text-white/30">
                Showing up to {PAGE_SIZE} rows per page.
              </p>
            </div>

            <div className="text-xs text-white/35">
              {totalRows > 0
                ? `${Math.min(
                    (page - 1) *
                      PAGE_SIZE +
                      1,
                    totalRows
                  )}–${Math.min(
                    page *
                      PAGE_SIZE,
                    totalRows
                  )} of ${totalRows}`
                : "No rows"}
            </div>
          </div>

          {/* Table container */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <LoaderCircle
                  size={26}
                  className="animate-spin text-cyan-400"
                />
              </div>
            ) : rows.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                <Database
                  size={30}
                  className="text-white/20"
                />

                <p className="mt-4 text-sm font-semibold text-white/60">
                  No data available
                </p>

                <p className="mt-1 text-xs text-white/30">
                  This dataset does not contain any
                  previewable rows.
                </p>
              </div>
            ) : (
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="whitespace-nowrap px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                      #
                    </th>

                    {columns.map(
                      (column) => (
                        <th
                          key={
                            column.id ??
                            column.name
                          }
                          className="whitespace-nowrap px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-white/30"
                        >
                          {column.name}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {rows.map(
                    (
                      row,
                      rowIndex
                    ) => (
                      <tr
                        key={
                          row.id ??
                          rowIndex
                        }
                        className="border-b border-white/[0.06] transition hover:bg-white/[0.025]"
                      >
                        <td className="whitespace-nowrap px-5 py-4 text-xs text-white/25">
                          {(page -
                            1) *
                            PAGE_SIZE +
                            rowIndex +
                            1}
                        </td>

                        {columns.map(
                          (
                            column
                          ) => {
                            const value =
                              row[
                                column.name
                              ];

                            return (
                              <td
                                key={
                                  column.id ??
                                  column.name
                                }
                                className="max-w-[260px] whitespace-nowrap px-5 py-4 text-xs text-white/65"
                              >
                                {value ===
                                  null ||
                                value ===
                                  undefined ||
                                value ===
                                  ""
                                  ? (
                                    <span className="text-white/20">
                                      —
                                    </span>
                                  )
                                  : String(
                                      value
                                    )}
                              </td>
                            );
                          }
                        )}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!isLoading &&
            rows.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-white/30">
                  Page {page} of{" "}
                  {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={
                      handlePrevious
                    }
                    disabled={
                      page === 1
                    }
                    className="flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs text-white/50 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft
                      size={14}
                    />

                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleNext
                    }
                    disabled={
                      page >=
                      totalPages
                    }
                    className="flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs text-white/50 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Next

                    <ChevronRight
                      size={14}
                    />
                  </button>
                </div>
              </div>
            )}
        </motion.div>
      </div>
    </div>
  );
};

export default DatasetPreview;