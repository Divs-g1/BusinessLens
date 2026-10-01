import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Database,
  Loader2,
  AlertCircle,
  Rows3,
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
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * -----------------------------------------
   * LOAD DATASET INFORMATION
   * -----------------------------------------
   */
  useEffect(() => {
    const loadDataset = async () => {
      try {
        const response = await getDataset(datasetId);

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Failed to load dataset."
          );
        }

        const datasetData = response.dataset;

        setDataset(datasetData);

        const datasetColumns = Array.isArray(
          datasetData?.columns
        )
          ? datasetData.columns
          : [];

        setColumns(datasetColumns);
      } catch (loadError) {
        console.error(
          "Load dataset error:",
          loadError
        );

        setError(
          loadError?.response?.data?.message ||
            loadError?.message ||
            "Failed to load dataset."
        );
      }
    };

    if (datasetId) {
      loadDataset();
    }
  }, [datasetId]);

  /*
   * -----------------------------------------
   * LOAD DATASET ROWS
   * -----------------------------------------
   */
  useEffect(() => {
    const loadRows = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getDatasetRows(
          datasetId,
          page,
          PAGE_SIZE
        );

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Failed to load dataset rows."
          );
        }

        /*
         * Backend may return rows in:
         *
         * response.rows
         * response.data
         */
        const apiRows =
          response.rows ||
          response.data ||
          [];

       const normalizedRows = apiRows.map((row) => {
  if (
    row?.data &&
    typeof row.data === "object"
  ) {
    return {
      id: row.id,
      rowIndex: row.rowIndex,
      ...row.data,
    };
  }

  return row;
});

        setRows(normalizedRows);

        /*
         * Get total row count from whichever
         * response format backend provides.
         */
        setTotalRows(
        response.pagination?.total ??
            dataset?.rows ??
            normalizedRows.length
        );
            } catch (loadError) {
        console.error(
          "Load dataset rows error:",
          loadError
        );

        setError(
          loadError?.response?.data?.message ||
            loadError?.message ||
            "Failed to load dataset rows."
        );

        setRows([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (datasetId) {
      loadRows();
    }
  }, [datasetId, page, dataset?.rows]);

  /*
   * -----------------------------------------
   * CALCULATE PAGINATION
   * -----------------------------------------
   */
  const totalPages = Math.max(
    1,
    Math.ceil(totalRows / PAGE_SIZE)
  );

  const startRow =
    totalRows === 0
      ? 0
      : (page - 1) * PAGE_SIZE + 1;

  const endRow = Math.min(
    page * PAGE_SIZE,
    totalRows
  );

  /*
   * -----------------------------------------
   * FORMAT COLUMN NAME
   * -----------------------------------------
   */
  const getColumnName = (column) => {
    if (typeof column === "string") {
      return column;
    }

    return (
      column?.name ||
      column?.column_name ||
      column?.columnName ||
      `Column ${column?.column_index ?? ""}`
    );
  };

  /*
   * -----------------------------------------
   * GET CELL VALUE
   * -----------------------------------------
   */
  const getCellValue = (
    row,
    column
  ) => {
    const columnName =
      getColumnName(column);

    let value = row?.[columnName];

    /*
     * Handle different column naming formats
     */
    if (
      value === undefined &&
      column?.column_name
    ) {
      value =
        row?.[column.column_name];
    }

    if (
      value === undefined &&
      column?.columnName
    ) {
      value =
        row?.[column.columnName];
    }

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    /*
     * Format objects/arrays safely
     */
    if (
      typeof value === "object"
    ) {
      try {
        return JSON.stringify(value);
      } catch {
        return "—";
      }
    }

    return String(value);
  };

  /*
   * -----------------------------------------
   * MEMOIZED COLUMNS
   * -----------------------------------------
   */
  const tableColumns = useMemo(() => {
    return columns.map((column) => ({
      original: column,
      name: getColumnName(column),
    }));
  }, [columns]);

  /*
   * -----------------------------------------
   * PAGE CHANGE
   * -----------------------------------------
   */
  const goToPreviousPage = () => {
    setPage((currentPage) =>
      Math.max(1, currentPage - 1)
    );
  };

  const goToNextPage = () => {
    setPage((currentPage) =>
      Math.min(
        totalPages,
        currentPage + 1
      )
    );
  };

  /*
   * -----------------------------------------
   * LOADING STATE
   * -----------------------------------------
   */
  if (
    isLoading &&
    rows.length === 0
  ) {
    return (
      <div className="min-h-screen bg-[#080808] text-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-7 w-7 animate-spin text-violet-400" />

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
   * -----------------------------------------
   * ERROR STATE
   * -----------------------------------------
   */
  if (
    error &&
    !dataset
  ) {
    return (
      <div className="min-h-screen bg-[#080808] text-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <button
            type="button"
            onClick={() =>
              navigate("/datasets")
            }
            className="mb-8 flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Data Center
          </button>

          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="max-w-md rounded-2xl border border-red-400/10 bg-red-400/[0.04] p-8 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-red-400" />

              <h2 className="mt-4 text-lg font-semibold">
                Unable to load dataset
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

  /*
   * -----------------------------------------
   * MAIN UI
   * -----------------------------------------
   */
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">

        {/* -------------------------------- */}
        {/* HEADER */}
        {/* -------------------------------- */}

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
                <Database className="h-4 w-4 text-violet-400" />

                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-violet-400">
                  Data Explorer
                </p>
              </div>

              <h1 className="mt-2 truncate text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                {dataset?.originalFilename ||
                  dataset?.name ||
                  "Dataset Preview"}
              </h1>

              <p className="mt-2 text-sm text-white/35">
                Preview and explore the uploaded dataset.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Ready
              </span>

              <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-xs text-white/50">
                {dataset?.rows ??
                  totalRows ??
                  0}{" "}
                rows
              </span>

              <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-xs text-white/50">
                {dataset?.columns?.length ??
                  dataset?.columnCount ??
                  columns.length}{" "}
                columns
              </span>
            </div>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* ERROR BANNER */}
        {/* -------------------------------- */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-400/10 bg-red-400/[0.04] px-4 py-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

            <p className="text-sm text-red-300/80">
              {error}
            </p>
          </div>
        )}

        {/* -------------------------------- */}
        {/* TABLE */}
        {/* -------------------------------- */}

        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">

          {/* Table header */}
          <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
            <div className="flex items-center gap-3">
              <Rows3 className="h-4 w-4 text-white/40" />

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Dataset Rows
                </h2>

                <p className="mt-0.5 text-xs text-white/30">
                  Showing {startRow}–{endRow} of{" "}
                  {totalRows} rows
                </p>
              </div>
            </div>

            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
            )}
          </div>

          {/* -------------------------------- */}
          {/* EMPTY STATE */}
          {/* -------------------------------- */}

          {!isLoading &&
            rows.length === 0 && (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                  <Database className="h-5 w-5 text-white/30" />
                </div>

                <h3 className="mt-4 text-sm font-semibold">
                  No rows found
                </h3>

                <p className="mt-2 max-w-sm text-xs leading-5 text-white/30">
                  This dataset does not contain any
                  rows that can be displayed.
                </p>
              </div>
            )}

          {/* -------------------------------- */}
          {/* DATA TABLE */}
          {/* -------------------------------- */}

          {rows.length > 0 &&
            tableColumns.length > 0 && (
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-max border-collapse text-left">

                  <thead>
                    <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                      <th className="sticky left-0 z-10 border-r border-white/[0.06] bg-[#0b0b0b] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">
                        #
                      </th>

                      {tableColumns.map(
                        (
                          column,
                          columnIndex
                        ) => (
                          <th
                            key={`${column.name}-${columnIndex}`}
                            className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35"
                          >
                            {column.name}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map(
                      (row, rowIndex) => (
                        <tr
                          key={
                            row?.id ??
                            `${page}-${rowIndex}`
                          }
                          className="border-b border-white/[0.05] transition hover:bg-white/[0.025]"
                        >
                          <td className="sticky left-0 z-10 border-r border-white/[0.06] bg-[#080808] px-4 py-3 text-xs font-medium text-white/25">
                            {(page - 1) *
                              PAGE_SIZE +
                              rowIndex +
                              1}
                          </td>

                          {tableColumns.map(
                            (
                              column,
                              columnIndex
                            ) => (
                              <td
                                key={`${column.name}-${columnIndex}`}
                                className="max-w-[280px] px-4 py-3 text-xs text-white/60"
                                title={getCellValue(
                                  row,
                                  column.original
                                )}
                              >
                                <div className="max-w-[280px] truncate">
                                  {getCellValue(
                                    row,
                                    column.original
                                  )}
                                </div>
                              </td>
                            )
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

          {/* -------------------------------- */}
          {/* PAGINATION */}
          {/* -------------------------------- */}

          {totalRows > 0 && (
            <div className="flex flex-col gap-4 border-t border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs text-white/30">
                Page {page} of{" "}
                {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={
                    goToPreviousPage
                  }
                  disabled={page === 1}
                  className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 text-xs font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={
                    goToNextPage
                  }
                  disabled={
                    page >= totalPages
                  }
                  className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 text-xs font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* -------------------------------- */}
        {/* DATASET INFO */}
        {/* -------------------------------- */}

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/25">
          <span>
            File type:{" "}
            <span className="text-white/45">
              {dataset?.fileType ||
                "—"}
            </span>
          </span>

          <span>
            Total rows:{" "}
            <span className="text-white/45">
              {dataset?.rows ??
                totalRows ??
                0}
            </span>
          </span>

          <span>
            Total columns:{" "}
            <span className="text-white/45">
              {dataset?.columns?.length ??
                dataset?.columnCount ??
                columns.length}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default DatasetPreview;