import express from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireDatasetOwnership } from "../middleware/requireDatasetOwnership.js";

import {
  uploadDataset,
  getDatasets,
  getProfile,
  getDataset,
  getRows,
} from "../controllers/dataset.controller.js";

const router = express.Router();
router.use(requireAuth);

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post(
  "/upload",
  requireAuth,
  upload.single("file"),
  uploadDataset
);

router.get(
  "/",
  requireAuth,
  getDatasets
);

router.get(
  "/:id/profile",
  requireAuth,
  getProfile
);

router.get(
  "/:id",
  requireAuth,
  getDataset
);

router.get(
  "/:id/rows",
  requireAuth,
  getRows
);



export default router;