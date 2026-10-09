import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";

import {
  getOverview,
  getRevenueMonthAnalytics,
  getRevenueProductAnalytics,
  getRevenueCategoryAnalytics,
  getRevenueRegionAnalytics,
  getQuantityProductAnalytics,
  getQuantityCategoryAnalytics,
  getSalesChannelAnalytics,
  getProductPerformanceAnalytics,
  getDataQualityAnalytics,
} from "../controllers/analytics.controller.js";

import {getBusinessAnomaliesAnalytics,} from "../controllers/anomaly.controller.js";
import { requireDatasetOwnership } from "../middleware/requireDatasetOwnership.js";

const router = express.Router();
router.use(requireAuth);
router.param("datasetId", requireDatasetOwnership);

router.get(
  "/:datasetId/overview",
  getOverview
);

router.get(
  "/:datasetId/revenue-by-month",
  getRevenueMonthAnalytics
);

router.get(
  "/:datasetId/revenue-by-product",
  getRevenueProductAnalytics
);

router.get(
  "/:datasetId/revenue-by-category",
  getRevenueCategoryAnalytics
);

router.get(
  "/:datasetId/revenue-by-region",
  getRevenueRegionAnalytics
);

router.get(
  "/:datasetId/quantity-by-product",
  getQuantityProductAnalytics
);

router.get(
  "/:datasetId/quantity-by-category",
  getQuantityCategoryAnalytics
);

router.get(
  "/:datasetId/revenue-by-channel",
  getSalesChannelAnalytics
);

router.get(
  "/:datasetId/product-performance",
  getProductPerformanceAnalytics
);

router.get(
  "/:datasetId/data-quality",
  getDataQualityAnalytics
);

router.get(
  "/:datasetId/business-anomalies",
  getBusinessAnomaliesAnalytics
);

export default router;