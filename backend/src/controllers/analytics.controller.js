import {
getOverviewAnalytics,
  getRevenueByMonth,
  getRevenueByProduct,
  getRevenueByCategory,
  getRevenueByRegion,
  getQuantityByProduct,
  getQuantityByCategory,
  getRevenueBySalesChannel,
  getProductPerformance,
  getDataQuality
} from "../services/analytics.service.js";

export const getOverview = async (
  req,
  res
) => {
  try {
    const datasetId = Number(
      req.params.datasetId
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

    const analytics =
      await getOverviewAnalytics(
        datasetId
      );

    return res.status(200).json({
      success: true,
      datasetId,
      overview: analytics,
    });
  } catch (error) {
    console.error(
      "Get overview analytics error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to calculate overview analytics",
      error: error.message,
    });
  }
};


export const getRevenueMonthAnalytics = async (
  req,
  res
) => {
  try {
    const datasetId = Number(
      req.params.datasetId
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

    const data = await getRevenueByMonth(
      datasetId
    );

    return res.status(200).json({
      success: true,
      datasetId,
      data,
    });
  } catch (error) {
    console.error(
      "Revenue by month error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to calculate monthly revenue",
      error: error.message,
    });
  }
};


export const getRevenueProductAnalytics = async (req, res) => {
    try {
      const datasetId = Number(
        req.params.datasetId
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

      const data =
        await getRevenueByProduct(datasetId);

      return res.status(200).json({
        success: true,
        datasetId,
        data,
      });
    } catch (error) {
      console.error(
        "Revenue by product error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to calculate product revenue",
        error: error.message,
      });
    }
  };


export const getRevenueCategoryAnalytics = async (req, res) => {
    try {
      const datasetId = Number(
        req.params.datasetId
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

      const data =
        await getRevenueByCategory(datasetId);

      return res.status(200).json({
        success: true,
        datasetId,
        data,
      });
    } catch (error) {
      console.error(
        "Revenue by category error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to calculate category revenue",
        error: error.message,
      });
    }
  };


export const getRevenueRegionAnalytics = async (req, res) => {
    try {
      const datasetId = Number(
        req.params.datasetId
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

      const data =
        await getRevenueByRegion(datasetId);

      return res.status(200).json({
        success: true,
        datasetId,
        data,
      });
    } catch (error) {
      console.error(
        "Revenue by region error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to calculate regional revenue",
        error: error.message,
      });
    }
  };


export const getQuantityProductAnalytics = async (req, res) => {
    try {
      const { datasetId } = req.params;

      const data =
        await getQuantityByProduct(
          datasetId
        );

      res.status(200).json({
        success: true,
        datasetId: Number(datasetId),
        data,
      });
    } catch (error) {
      console.error(
        "Quantity by product error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to calculate quantity by product",
      });
    }
  };

export const getQuantityCategoryAnalytics = async (req, res) => {
    try {
      const { datasetId } = req.params;

      const data =
        await getQuantityByCategory(
          datasetId
        );

      res.status(200).json({
        success: true,
        datasetId: Number(datasetId),
        data,
      });
    } catch (error) {
      console.error(
        "Quantity by category error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to calculate quantity by category",
      });
    }
  };


export const getSalesChannelAnalytics = async (req, res) => {
    try {
      const { datasetId } = req.params;

      const data =
        await getRevenueBySalesChannel(
          datasetId
        );

      res.status(200).json({
        success: true,
        datasetId: Number(datasetId),
        data,
      });
    } catch (error) {
      console.error(
        "Sales channel analytics error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to calculate sales channel analytics",
      });
    }
  };


export const getProductPerformanceAnalytics = async (req, res) => {
    try {
      const { datasetId } = req.params;

      const data =
        await getProductPerformance(
          datasetId
        );

      res.status(200).json({
        success: true,
        datasetId: Number(datasetId),
        data,
      });
    } catch (error) {
      console.error(
        "Product performance error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to calculate product performance",
      });
    }
  };


export const getDataQualityAnalytics = async (req, res) => {
    try {
      const { datasetId } = req.params;

      const quality =
        await getDataQuality(
          datasetId
        );

      res.status(200).json({
        success: true,
        datasetId: Number(datasetId),
        quality,
      });
    } catch (error) {
      console.error(
        "Data quality error:",
        error
      );

      if (
        error.message ===
        "Dataset not found"
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Dataset not found",
        });
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to calculate data quality",
      });
    }
  };