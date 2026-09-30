import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import AppLayout from "../layouts/AppLayout";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Application */}
        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;