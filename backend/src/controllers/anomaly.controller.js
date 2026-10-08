import { getBusinessAnomalies, } from "../services/anomaly.service.js";


export const getBusinessAnomaliesAnalytics = async (req, res) => {
    try {
      const { datasetId } = req.params;
      const result =  await getBusinessAnomalies(datasetId);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error(
        "Business anomaly detection error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to detect business anomalies.",
      });
    }
  };