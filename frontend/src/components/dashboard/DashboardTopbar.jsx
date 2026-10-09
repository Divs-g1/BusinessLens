import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  LogOut,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const DashboardTopbar = () => {
  const { user, logout } = useAuth();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  
    const displayName = user?.name || user?.email || "User";
    const initials = displayName
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

        const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setShowProfileMenu(false);

    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };
 
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

{/* user and logout button */}
<div className="relative ml-2">
  <button
    type="button"
    onClick={() =>
      setShowProfileMenu((current) => !current)
    }
    aria-expanded={showProfileMenu}
    aria-label="Open profile menu"
    className="
      flex items-center gap-2 rounded-lg px-2 py-1.5
      transition hover:bg-white/[0.05]
    "
  >
    <div
      className="
        flex h-8 w-8 items-center justify-center
        rounded-full bg-gradient-to-br from-violet-400
        to-cyan-400 text-[10px] font-bold text-black
      "
    >
      {initials}
    </div>

    <span className="hidden text-xs text-white/60 md:block">
      {displayName}
    </span>

    <ChevronDown
      size={13}
      className={`hidden text-white/25 transition-transform md:block ${
        showProfileMenu ? "rotate-180" : ""
      }`}
    />
  </button>

  {showProfileMenu && (
    <>
      <button
        type="button"
        aria-label="Close profile menu"
        onClick={() => setShowProfileMenu(false)}
        className="fixed inset-0 z-40 cursor-default"
      />

      <div
        className="
          absolute right-0 top-full z-50 mt-3 w-64
          overflow-hidden rounded-2xl border border-white/10
          bg-[#101014] p-2 shadow-2xl shadow-black/40
        "
      >
        <div className="border-b border-white/[0.07] px-3 py-3">
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10 shrink-0 items-center
                justify-center rounded-full
                bg-gradient-to-br from-violet-400 to-cyan-400
                text-xs font-bold text-black
              "
            >
              {initials}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {displayName}
              </p>

              <p className="truncate text-xs text-white/40">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowProfileMenu(false)}
          className="
            mt-2 flex w-full items-center gap-3
            rounded-xl px-3 py-2.5 text-left
            text-sm text-white/65 transition
            hover:bg-white/[0.06] hover:text-white
          "
        >
          <UserRound size={16} />
          Account
        </button>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="
            flex w-full items-center gap-3 rounded-xl
            px-3 py-2.5 text-left text-sm
            text-red-400 transition hover:bg-red-400/10
            disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          <LogOut size={16} />
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </>
  )}
</div>  

      </div>
    </header>
  );
};

export default DashboardTopbar;