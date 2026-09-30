import {
  Check,
  Palette,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useTheme,
} from "../../store/ThemeContext";

const ThemeSelector = () => {
  const {
    theme,
    setTheme,
    themes,
  } = useTheme();

  const [
    open,
    setOpen,
  ] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          border-[var(--border)]
          bg-[var(--surface)]
          px-3
          py-2
          text-sm
          font-medium
          backdrop-blur-xl
          transition
          hover:bg-[var(--surface-hover)]
        "
      >
        <Palette size={17} />

        <span className="hidden sm:block">
          Theme
        </span>
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            top-full
            z-50
            mt-2
            w-64
            rounded-2xl
            border
            border-[var(--border)]
            bg-[var(--surface-solid)]
            p-2
            shadow-[var(--shadow)]
            backdrop-blur-xl
          "
        >
          <div className="px-3 py-2">
            <p className="text-sm font-semibold">
              Appearance
            </p>

            <p className="mt-1 text-xs text-[var(--muted)]">
              Customize your workspace
            </p>
          </div>

          <div className="mt-1 space-y-1">
            {themes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTheme(item.id);
                  setOpen(false);
                }}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-xl
                  px-3
                  py-2.5
                  text-left
                  transition
                  hover:bg-[var(--primary-soft)]
                "
              >
                <div>
                  <p className="text-sm font-medium">
                    {item.name}
                  </p>

                  <p className="text-xs text-[var(--muted)]">
                    {item.description}
                  </p>
                </div>

                {theme === item.id && (
                  <Check
                    size={17}
                    className="text-[var(--primary)]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;