import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  ArrowRight,
  Database,
  Rows3,
  Columns3,
  RefreshCcw,
  BarChart3,
  Clock3,
} from "lucide-react";

import {
  getDatasets,
  uploadDataset,
} from "../api/dataset.api";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const Datasets = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [datasets, setDatasets] = useState([]);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [uploadedDataset, setUploadedDataset] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isUploading, setIsUploading] =
    useState(false);

  const [isDragging, setIsDragging] =
    useState(false);

  const [uploadStage, setUploadStage] =
    useState("");

  const [progress, setProgress] =
    useState(0);

  const [error, setError] =
    useState("");

  const [showUpload, setShowUpload] =
    useState(false);

  /*
   * Fetch datasets
   */
  const loadDatasets = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response =
        await getDatasets();

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to load datasets."
        );
      }

      setDatasets(
        response.datasets || []
      );
    } catch (loadError) {
      console.error(
        "Dataset loading error:",
        loadError
      );

      setError(
        loadError?.response?.data?.message ||
          loadError?.message ||
          "Unable to load datasets."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * Load datasets when page opens
   */
  useEffect(() => {
    loadDatasets();
  }, []);

  /*
   * Validate file
   */
  const validateFile = (file) => {
    if (!file) {
      return "Please select a file.";
    }

    const allowedExtensions = [
      ".csv",
      ".xls",
      ".xlsx",
    ];

    const fileName =
      file.name.toLowerCase();

    const isValidExtension =
      allowedExtensions.some(
        (extension) =>
          fileName.endsWith(
            extension
          )
      );

    if (!isValidExtension) {
      return "Only CSV, XLS, and XLSX files are supported.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10 MB.";
    }

    return "";
  };

  /*
   * Select file
   */
  const handleFileSelect = (file) => {
    setError("");
    setUploadedDataset(null);

    const validationError =
      validateFile(file);

    if (validationError) {
      setSelectedFile(null);
      setError(validationError);
      return;
    }

    setSelectedFile(file);
  };

  /*
   * File picker
   */
  const handleInputChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (file) {
      handleFileSelect(file);
    }

    event.target.value = "";
  };

  /*
   * Drag events
   */
  const handleDragOver = (
    event
  ) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (
    event
  ) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (
    event
  ) => {
    event.preventDefault();
    setIsDragging(false);

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      handleFileSelect(file);
    }
  };

  /*
   * Upload dataset
   */
  const handleUpload = async () => {
    if (
      !selectedFile ||
      isUploading
    ) {
      return;
    }

    setError("");
    setIsUploading(true);
    setProgress(10);
    setUploadStage(
      "Validating your file..."
    );

    try {
      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            400
          )
      );

      setProgress(30);
      setUploadStage(
        "Uploading dataset..."
      );

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            400
          )
      );

      setProgress(55);
      setUploadStage(
        "Processing your data..."
      );

      const response =
        await uploadDataset(
          selectedFile
        );

      setProgress(80);
      setUploadStage(
        "Preparing analytics..."
      );

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            500
          )
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Dataset upload failed."
        );
      }

      setProgress(100);
      setUploadStage(
        "Dataset ready"
      );

      setUploadedDataset(
        response.dataset
      );

      /*
       * Refresh dataset list
       */
      await loadDatasets();

      /*
       * Close upload section
       */
      setTimeout(() => {
        setShowUpload(false);
        setSelectedFile(null);
        setUploadedDataset(null);
        setProgress(0);
        setUploadStage("");
      }, 700);
    } catch (uploadError) {
      console.error(
        "Dataset upload error:",
        uploadError
      );

      setError(
        uploadError?.response?.data?.message ||
          uploadError?.message ||
          "Something went wrong while uploading the dataset."
      );

      setProgress(0);
      setUploadStage("");
    } finally {
      setIsUploading(false);
    }
  };

  /*
   * Reset upload
   */
  const handleReset = () => {
    setSelectedFile(null);
    setUploadedDataset(null);
    setError("");
    setProgress(0);
    setUploadStage("");
  };

  /*
   * Analyze dataset
   */
  const handleAnalyze = (
    datasetId
  ) => {
    if (!datasetId) {
      return;
    }

    navigate(
      `/dashboard/datasets/${datasetId}`
    );
  };

  /*
   * File icon
   */
  const getFileIcon = (
    fileName
  ) => {
    if (
      fileName
        ?.toLowerCase()
        .endsWith(".csv")
    ) {
      return FileText;
    }

    return FileSpreadsheet;
  };

  /*
   * Format date
   */
  const formatDate = (
    date
  ) => {
    if (!date) {
      return "Recently";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#050507] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

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
          className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60">
              <Database
                size={13}
                className="text-cyan-400"
              />

              BusinessLens Data Center
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your Datasets
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45 sm:text-base">
              Manage your business datasets and
              analyze them with BusinessLens.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowUpload(true);
              setError("");
            }}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-black transition hover:bg-white/90"
          >
            <UploadCloud size={17} />

            Upload Dataset
          </button>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="mb-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.08] p-4"
            >
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0 text-red-400"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-red-300">
                  Something went wrong
                </p>

                <p className="mt-1 text-xs leading-5 text-red-300/70">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setError("")
                }
                className="text-red-300/60 transition hover:text-red-300"
              >
                <X size={17} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload panel */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="mb-8 overflow-hidden"
            >
              <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">

                {/* Upload header */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">
                      Upload a new dataset
                    </h2>

                    <p className="mt-1 text-xs text-white/35">
                      CSV, XLS and XLSX files up to 10 MB.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleReset();
                      setShowUpload(false);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-white/35 transition hover:bg-white/10 hover:text-white"
                  >
                    <X size={17} />
                  </button>
                </div>

                {/* Drop zone */}
                <div
                  onDragOver={
                    handleDragOver
                  }
                  onDragLeave={
                    handleDragLeave
                  }
                  onDrop={
                    handleDrop
                  }
                  className={`
                    rounded-2xl border border-dashed
                    p-8 text-center transition-all
                    ${
                      isDragging
                        ? "border-cyan-400/60 bg-cyan-400/[0.06]"
                        : "border-white/10 bg-black/20"
                    }
                  `}
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10">
                    <UploadCloud
                      size={30}
                      className="text-cyan-400"
                    />
                  </div>

                  <h3 className="mt-5 text-base font-bold">
                    {isDragging
                      ? "Drop your dataset here"
                      : "Upload your business data"}
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-white/35">
                    Drag and drop your file here or
                    choose one from your computer.
                  </p>

                  <button
                    type="button"
                    disabled={
                      isUploading
                    }
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-black transition hover:bg-white/90 disabled:opacity-50"
                  >
                    <FileSpreadsheet
                      size={15}
                    />

                    Choose File
                  </button>

                  <input
                    ref={
                      fileInputRef
                    }
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    onChange={
                      handleInputChange
                    }
                    className="hidden"
                  />
                </div>

                {/* Selected file */}
                <AnimatePresence>
                  {selectedFile &&
                    !isUploading && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                            {(() => {
                              const Icon =
                                getFileIcon(
                                  selectedFile.name
                                );

                              return (
                                <Icon
                                  size={20}
                                />
                              );
                            })()}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                              {
                                selectedFile.name
                              }
                            </p>

                            <p className="mt-1 text-xs text-white/35">
                              {(
                                selectedFile.size /
                                1024 /
                                1024
                              ).toFixed(
                                2
                              )}{" "}
                              MB
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedFile(
                                null
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/35 hover:bg-white/10 hover:text-white"
                          >
                            <X
                              size={
                                16
                              }
                            />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={
                            handleUpload
                          }
                          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 text-sm font-bold text-black transition hover:bg-cyan-300"
                        >
                          <UploadCloud
                            size={
                              17
                            }
                          />

                          Upload Dataset
                        </button>
                      </motion.div>
                    )}
                </AnimatePresence>

                {/* Upload progress */}
                <AnimatePresence>
                  {isUploading && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5"
                    >
                      <div className="flex items-center gap-3">
                        <LoaderCircle
                          size={22}
                          className="animate-spin text-cyan-400"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold">
                            {
                              uploadStage
                            }
                          </p>

                          <p className="mt-1 truncate text-xs text-white/35">
                            {
                              selectedFile?.name
                            }
                          </p>
                        </div>

                        <span className="text-sm font-bold text-cyan-400">
                          {progress}%
                        </span>
                      </div>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          animate={{
                            width: `${progress}%`,
                          }}
                          className="h-full rounded-full bg-cyan-400"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dataset list */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">
                Your Datasets
              </h2>

              <p className="mt-1 text-xs text-white/35">
                {datasets.length}{" "}
                dataset
                {datasets.length === 1
                  ? ""
                  : "s"} available
              </p>
            </div>

            <button
              type="button"
              onClick={
                loadDatasets
              }
              disabled={isLoading}
              className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs text-white/50 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
            >
              <RefreshCcw
                size={13}
                className={
                  isLoading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid gap-4">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                  >
                    <div className="h-5 w-64 rounded bg-white/10" />

                    <div className="mt-3 h-3 w-40 rounded bg-white/5" />

                    <div className="mt-6 h-10 w-full rounded bg-white/5" />
                  </div>
                )
              )}
            </div>
          )}

          {/* Empty state */}
          {!isLoading &&
            datasets.length === 0 && (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10">
                  <Database
                    size={28}
                    className="text-cyan-400"
                  />
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  No datasets yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
                  Upload your first business dataset
                  to start generating analytics and
                  insights.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setShowUpload(
                      true
                    )
                  }
                  className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-black"
                >
                  <UploadCloud
                    size={15}
                  />

                  Upload Dataset
                </button>
              </div>
            )}

          {/* Dataset cards */}
          {!isLoading &&
            datasets.length > 0 && (
              <div className="grid gap-4">
                {datasets.map(
                  (dataset, index) => {
                    const FileIcon =
                      getFileIcon(
                        dataset.originalFilename
                      );

                    return (
                      <motion.div
                        key={
                          dataset.id
                        }
                        initial={{
                          opacity: 0,
                          y: 12,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay:
                            index *
                            0.05,
                        }}
                        className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/20 hover:bg-white/[0.04]"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                          {/* Dataset info */}
                          <div className="flex min-w-0 flex-1 items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                              <FileIcon
                                size={
                                  21
                                }
                              />
                            </div>

                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-bold text-white/90">
                                {
                                  dataset.name
                                }
                              </h3>

                              <p className="mt-1 truncate text-xs text-white/35">
                                {
                                  dataset.originalFilename
                                }
                              </p>

                              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-white/35">
                                <span className="flex items-center gap-1.5">
                                  <Rows3
                                    size={
                                      12
                                    }
                                  />

                                  {
                                    dataset.rows
                                  }{" "}
                                  rows
                                </span>

                                <span className="text-white/15">
                                  •
                                </span>

                                <span className="flex items-center gap-1.5">
                                  <Columns3
                                    size={
                                      12
                                    }
                                  />

                                  {
                                    dataset.columns
                                  }{" "}
                                  columns
                                </span>

                                <span className="text-white/15">
                                  •
                                </span>

                                <span className="flex items-center gap-1.5">
                                  <Clock3
                                    size={
                                      12
                                    }
                                  />

                                  {
                                    formatDate(
                                      dataset.createdAt
                                    )
                                  }
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Status + action */}
                          <div className="flex items-center justify-between gap-3 lg:justify-end">
                            <span
                              className={`
                                rounded-full border px-3 py-1.5 text-[11px] font-semibold
                                ${
                                  dataset.status ===
                                  "ready"
                                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                                    : dataset.status ===
                                      "processing"
                                    ? "border-amber-400/20 bg-amber-400/10 text-amber-400"
                                    : "border-red-400/20 bg-red-400/10 text-red-400"
                                }
                              `}
                            >
                              ●{" "}
                              {dataset.status
                                ?.charAt(
                                  0
                                )
                                .toUpperCase() +
                                dataset.status?.slice(
                                  1
                                )}
                            </span>

                            <button
                              type="button"
                              disabled={
                                dataset.status !==
                                "ready"
                              }
                              onClick={() =>
                                handleAnalyze(
                                  dataset.id
                                )
                              }
                              className="flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <BarChart3
                                size={
                                  15
                                }
                              />

                              Analyze

                              <ArrowRight
                                size={
                                  14
                                }
                              />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Datasets;