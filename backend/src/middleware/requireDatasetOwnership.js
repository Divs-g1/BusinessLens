
import pool from "../config/db.js";

export const requireDatasetOwnership = async (
  req,
  res,
  next
) => {
  try {
    const datasetId = Number(req.params.datasetId ?? req.params.id);
    const userId = req.user?.id;

    if (
      !Number.isInteger(datasetId) ||
      datasetId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid dataset ID.",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const [datasets] = await pool.execute(
      `SELECT id
       FROM datasets
       WHERE id = ? AND user_id = ?
       LIMIT 1`,
      [datasetId, userId]
    );

    if (datasets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Dataset not found.",
      });
    }

    next();
  } catch (error) {
    console.error(
      "Dataset ownership verification failed:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to verify dataset access.",
    });
  }
};
