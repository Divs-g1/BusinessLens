import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext(null);

const THEME_KEY = "businesslens-theme";

const themes = [
  {
    id: "light",
    name: "Light",
    description: "Clean and bright",
  },
  {
    id: "dark",
    name: "Dark",
    description: "Focused and immersive",
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Cool and calm",
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm and energetic",
  },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem(
      THEME_KEY,
      theme
    );
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
};