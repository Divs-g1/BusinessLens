import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import datasetRoutes from "./routes/dataset.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import insightsRoutes from "./routes/insights.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(cookieParser());

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

app.use( "/api/auth", authRoutes);
app.use("/api/datasets", datasetRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use( "/api/insights", insightsRoutes );

export default app;