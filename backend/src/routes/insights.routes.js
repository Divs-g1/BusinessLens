import express from "express";

import {
  getInsights,
} from "../controllers/insights.controller.js";

const router = express.Router();

router.get(
  "/:datasetId",
  getInsights
);

export default router;