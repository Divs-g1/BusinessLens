import {
  BarChart3,
  Database,
  FileText,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
const navigation = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Data",
    icon: Database,
  },
  {
    label: "Analytics",
    icon: BarChart3,
  },
  {
    label: "Insights",
    icon: Sparkles,
  },
  {
    label: "Reports",
    icon: FileText,
  },
];

const DashboardSidebar = () => {
  const { user } = useAuth();

  const displayName = user?.name || user?.email || "User";
  const initials = displayName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      className="
        fixed
        inset-y-0
        left-0
        z-40
        hidden
        w-[250px]
        border-r
        border-white/[0.07]
        bg-[#07070a]
        lg:block
      "
    >
      {/* Logo */}
      <div className="flex h-[72px] items-center border-b border-white/[0.06] px-6">
        <a
          href="/"
          className="flex items-center gap-3"
        >
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-gradient-to-br
              from-violet-500
              to-cyan-400
              text-xs
              font-black
            "
          >
            B
          </div>

          <span className="text-sm font-semibold">
            BusinessLens
          </span>
        </a>
      </div>

      {/* Navigation */}
      <div className="px-3 py-6">
        <p className="px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/20">
          Workspace
        </p>

        <nav className="mt-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                className={`
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-left
                  text-xs
                  transition
                  ${
                    item.active
                      ? "bg-white/[0.07] text-white"
                      : "text-white/40 hover:bg-white/[0.04] hover:text-white/75"
                  }
                `}
              >
                <Icon
                  size={16}
                  className={
                    item.active
                      ? "text-violet-300"
                      : "text-white/30 group-hover:text-white/60"
                  }
                />

                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="absolute inset-x-3 bottom-4">
        <button
          type="button"
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-2.5
            text-xs
            text-white/35
            transition
            hover:bg-white/[0.04]
            hover:text-white/70
          "
        >
          <Settings size={16} />
          Settings
        </button>

        <div className="mt-3 border-t border-white/[0.06] pt-3">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 text-[10px] font-bold text-black">
              {initials}
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-medium">
                {displayName}
              </p>

              <p className="truncate text-[9px] text-white/25">
                Business Owner
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;