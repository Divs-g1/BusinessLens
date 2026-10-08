
import { createRoot, } from "react-dom/client";
import { AuthProvider, } from "./context/AuthContext";
import { ThemeProvider, } from "./store/ThemeContext";

import "./index.css";
import App from "./App";

createRoot(
  document.getElementById("root")
).render(
  <AuthProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </AuthProvider>
);