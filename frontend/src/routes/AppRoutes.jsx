import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import AppLayout from "../layouts/AppLayout";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Datasets from "../pages/Datasets";
import DatasetPreview from "../pages/DatasetPreview";
import DataQuality from "../pages/DataQuality";
import BusinessAnomalies from "../pages/BusinessAnomalies";
import Login from "../pages/Login";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import NotFound from "../pages/NotFound";
import DataGuide from "../pages/DataGuide";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================== PUBLIC ==================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


      <Route path="*" element={<NotFound />} />

      <Route
      path="/data-guide"
      element={<DataGuide />}
    />

        {/* ==================== PROTECTED ==================== */}

        <Route element={<ProtectedRoute />}>
          
          <Route element={<AppLayout />}>

            <Route
              path="/datasets"
              element={<Datasets />}
            />

            <Route
              path="/dashboard/datasets/:datasetId"
              element={<Dashboard />}
            />

            <Route
              path="/datasets/:datasetId/preview"
              element={<DatasetPreview />}
            />

            <Route
              path="/datasets/:datasetId/quality"
              element={<DataQuality />}
            />

            <Route
              path="/dashboard/datasets/:datasetId/anomalies"
              element={<BusinessAnomalies />}
            />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;