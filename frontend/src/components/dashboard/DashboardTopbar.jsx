import {
  Bell,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";

const DashboardTopbar = () => {
  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-[72px]
        items-center
        justify-between
        border-b
        border-white/[0.06]
        bg-[#050507]/80
        px-4
        backdrop-blur-xl
        sm:px-6
        lg:px-8
      "
    >
      {/* Mobile menu */}
      <button
        type="button"
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-lg
          border
          border-white/10
          bg-white/[0.03]
          text-white/50
          lg:hidden
        "
      >
        <Menu size={17} />
      </button>

      {/* Project selector */}
      <button
        type="button"
        className="
          hidden
          items-center
          gap-2
          rounded-lg
          border
          border-white/[0.08]
          bg-white/[0.025]
          px-3
          py-2
          text-xs
          text-white/60
          sm:flex
        "
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400" />

        Sales Analytics

        <ChevronDown
          size={13}
          className="text-white/25"
        />
      </button>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="
            hidden
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            text-white/35
            transition
            hover:bg-white/[0.05]
            hover:text-white
            sm:flex
          "
        >
          <Search size={16} />
        </button>

        <button
          type="button"
          className="
            relative
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            text-white/35
            transition
            hover:bg-white/[0.05]
            hover:text-white
          "
        >
          <Bell size={16} />

          <span
            className="
              absolute
              right-2
              top-2
              h-1.5
              w-1.5
              rounded-full
              bg-violet-400
            "
          />
        </button>

        <div className="ml-2 h-6 w-px bg-white/[0.07]" />

        <button
          type="button"
          className="
            flex
            items-center
            gap-2
            rounded-lg
            px-2
            py-1.5
          "
        >
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-gradient-to-br
              from-violet-400
              to-cyan-400
              text-[10px]
              font-bold
              text-black
            "
          >
            AG
          </div>

          <span className="hidden text-xs text-white/60 md:block">
            Alex
          </span>

          <ChevronDown
            size={13}
            className="hidden text-white/25 md:block"
          />
        </button>
      </div>
    </header>
  );
};

export default DashboardTopbar;