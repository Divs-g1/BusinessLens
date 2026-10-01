import {
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  Upload,
} from "lucide-react";

const formatDate = (date) => {
  if (!date) return "Recently";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const RecentActivity = ({ dataset }) => {
  if (!dataset) {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-400">
            Activity
          </p>

          <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">
            Recent Activity
          </h2>
        </div>

        <div className="mt-6 flex min-h-[160px] items-center justify-center text-sm text-white/40">
          No activity available.
        </div>
      </div>
    );
  }

  const activities = [
    {
      icon: Upload,
      title: "Dataset uploaded",
      description: dataset.original_filename,
      date: dataset.created_at,
    },
    {
      icon: FileSpreadsheet,
      title: "Dataset processed",
      description: `${dataset.row_count} rows · ${dataset.column_count} columns`,
      date: dataset.updated_at,
    },
    {
      icon: BarChart3,
      title: "Analytics generated",
      description: "Business analytics are available for this dataset.",
      date: dataset.updated_at,
    },
    {
      icon: CheckCircle2,
      title: "Dataset ready",
      description:
        dataset.status === "ready"
          ? "Dataset is ready for analysis."
          : `Current status: ${dataset.status}`,
      date: dataset.updated_at,
    },
  ];

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-400">
            Activity
          </p>

          <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Recent events for this dataset
          </p>
        </div>

        <div className="rounded-xl bg-white/[0.04] px-3 py-2">
          <span className="text-xs text-white/40">
            {dataset.name}
          </span>
        </div>
      </div>

      {/* Activity List */}
      <div className="mt-6">
        {activities.map((activity, index) => {
          const Icon = activity.icon;

          const isLast =
            index === activities.length - 1;

          return (
            <div
              key={`${activity.title}-${index}`}
              className="relative flex gap-4"
            >
              {/* Timeline */}
              <div className="relative flex flex-col items-center">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] text-violet-400">
                  <Icon className="h-4 w-4" />
                </div>

                {!isLast && (
                  <div className="mt-2 h-full min-h-8 w-px bg-white/[0.07]" />
                )}
              </div>

              {/* Content */}
              <div
                className={`min-w-0 flex-1 ${
                  isLast ? "pb-0" : "pb-6"
                }`}
              >
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <h3 className="text-sm font-medium text-white">
                    {activity.title}
                  </h3>

                  <span className="text-[11px] text-white/25">
                    {formatDate(activity.date)}
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-white/40">
                  {activity.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;