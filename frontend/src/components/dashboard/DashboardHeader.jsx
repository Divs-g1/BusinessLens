import {
  CalendarDays,
  ChevronDown,
} from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-violet-400">
          Overview
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
          Good morning, Alex
        </h1>

        <p className="mt-2 text-sm text-white/35">
          Here's how your business is performing.
        </p>
      </div>

      <button
        type="button"
        className="
          flex
          w-fit
          items-center
          gap-3
          rounded-xl
          border
          border-white/[0.08]
          bg-white/[0.025]
          px-3.5
          py-2.5
          text-xs
          text-white/55
        "
      >
        <CalendarDays
          size={14}
          className="text-white/30"
        />

        Last 30 days

        <ChevronDown
          size={13}
          className="text-white/25"
        />
      </button>
    </div>
  );
};

export default DashboardHeader;