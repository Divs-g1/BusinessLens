import fs from "fs";
import path from "path";

import {
   parseDatasetFile,
  saveDataset,
  getDatasetProfile,
  getDatasetById,
  getDatasetRows,
} from "../services/dataset.service.js";

export const uploadDataset = async (req, res) => {
  console.log("1. Upload request received");

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No dataset file uploaded",
      });
    }

    console.log(
      "2. File received:",
      req.file.originalname
    );

    const filePath = req.file.path;

    const extension = path
      .extname(req.file.originalname)
      .toLowerCase();

    let fileType;

    if (extension === ".csv") {
      fileType = "csv";
    } else if (
      extension === ".xlsx" ||
      extension === ".xls"
    ) {
      fileType = "excel";
    } else {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.status(400).json({
        success: false,
        message:
          "Only CSV and Excel files are supported",
      });
    }

    const rows = await parseDatasetFile(
      filePath,
      fileType
    );

    console.log("3. File parsed");
    console.log("Rows:", rows.length);

    if (!rows.length) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.status(400).json({
        success: false,
        message: "The uploaded dataset is empty",
      });
    }

    const datasetName = path.basename(
      req.file.originalname,
      extension
    );

    const result = await saveDataset({
      userId: 1,
      datasetName,
      originalFilename: req.file.originalname,
      fileType,
      rows,
    });

    console.log(
      "4. Dataset saved:",
      result.datasetId
    );

    console.log(
      "5. Profile:",
      result.profile
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(201).json({
      success: true,
      message: "Dataset uploaded successfully",

      dataset: {
        id: result.datasetId,
        name: datasetName,
        originalFilename:
          req.file.originalname,
        fileType,
        rows: result.profile.rowCount,
        columns: result.profile.columnCount,
        status: "ready",
      },

      profile: result.profile,
    });
  } catch (error) {
    console.error(
      "Dataset upload error:",
      error
    );

    if (
      req.file?.path &&
      fs.existsSync(req.file.path)
    ) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to process dataset",
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const datasetId = Number(req.params.id);

    if (!Number.isInteger(datasetId) || datasetId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid dataset ID",
      });
    }

    const result = await getDatasetProfile(datasetId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Dataset not found",
      });
    }

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(
      "Get dataset profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get dataset profile",
      error: error.message,
    });
  }
};

export const getDataset = async (req, res) => {
  try {
    const datasetId = Number(req.params.id);

    if (!Number.isInteger(datasetId) || datasetId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid dataset ID",
      });
    }

    const dataset = await getDatasetById(datasetId);

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: "Dataset not found",
      });
    }

    return res.status(200).json({
      success: true,
      dataset,
    });
  } catch (error) {
    console.error(
      "Get dataset error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get dataset",
      error: error.message,
    });
  }
};

export const getRows = async (req, res) => {
  try {
    const datasetId = Number(req.params.id);

    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 50,
        1
      ),
      100
    );

    if (
      !Number.isInteger(datasetId) ||
      datasetId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid dataset ID",
      });
    }

    const dataset = await getDatasetById(datasetId);

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: "Dataset not found",
      });
    }

    const result = await getDatasetRows(
      datasetId,
      page,
      limit
    );

    return res.status(200).json({
      success: true,
      dataset: {
        id: dataset.id,
        name: dataset.name,
      },
      ...result,
    });
  } catch (error) {
    console.error(
      "Get dataset rows error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get dataset rows",
      error: error.message,
    });
  }
};