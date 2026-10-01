import {
  getBusinessInsights,
} from "../services/insights.service.js";

export const getInsights =
  async (req, res) => {
    try {
      const { datasetId } = req.params;

      const result =
        await getBusinessInsights(
          datasetId
        );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error(
        "Business insights error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to generate business insights",
      });
    }
  };