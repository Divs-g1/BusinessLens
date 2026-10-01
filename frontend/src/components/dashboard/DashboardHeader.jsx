const DashboardHeader = ({ dataset }) => {
  const rowCount = dataset?.rows ?? 0;

  const columnCount = Array.isArray(dataset?.columns)
    ? dataset.columns.length
    : dataset?.columnCount ?? 0;

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      {/* Left side */}
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-violet-400">
          Analytics Dashboard
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
          Business Overview
        </h1>

        <p className="mt-2 max-w-xl truncate text-sm text-white/35">
          {dataset?.originalFilename ||
            dataset?.name ||
            "Business dataset"}
        </p>
      </div>

      {/* Right side */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status */}
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
          ● Ready
        </span>

        {/* Rows */}
        <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-xs text-white/50">
          {rowCount} rows
        </span>

        {/* Columns */}
        <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-xs text-white/50">
          {columnCount} columns
        </span>
      </div>
    </div>
  );
};

export default DashboardHeader;