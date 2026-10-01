import express from "express";
import cors from "cors";

import datasetRoutes from "./routes/dataset.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BusinessLens API is running",
  });
});
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BusinessLens API is running, api/health"
  });
});

app.use("/api/datasets", datasetRoutes);
app.use("/api/analytics", analyticsRoutes);

export default app;