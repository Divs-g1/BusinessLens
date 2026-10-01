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
            path="/dashboard/datasets/:datasetId"
            element={<Dashboard />}
          />
        </Route>

        <Route
      path="/datasets/:datasetId/preview"
      element={<DatasetPreview />}
    />

    <Route
    path="/datasets/:datasetId/quality"
    element={<DataQuality />}
  />

        <Route
      path="/datasets"
      element={<Datasets />}
    />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;