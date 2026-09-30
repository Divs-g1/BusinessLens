import express from "express";
import multer from "multer";

import {
  uploadDataset,
  getProfile,
  getDataset,
  getRows,
} from "../controllers/dataset.controller.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post(
  "/upload",
  upload.single("file"),
  uploadDataset
);

router.get(
  "/:id/profile",
  getProfile
);

router.get(
  "/:id",
  getDataset
);

router.get(
  "/:id/rows",
  getRows
);

export default router;