import pool from "../config/db.js";

import { detectSemanticColumns, } from "./semanticProfiler.service.js";
import { buildSemanticMapping, } from "./semanticMapping.service.js";


const clampScore = (score) => {
  return Math.max(
    0,
    Math.min(100, Math.round(score))
  );
};

const getPriorityLevel = (score) => {
  if (score >= 80) {
    return "critical";
  }

  if (score >= 60) {
    return "high";
  }

  if (score >= 35) {
    return "medium";
  }

  return "low";
};

const calculateMedian = (values) => {
  if (!values.length) {
    return null;
  }

  const sorted = [...values].sort(
    (a, b) => a - b
  );

  const middle =
    Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (
      (sorted[middle - 1] +
        sorted[middle]) /
      2
    );
  }

  return sorted[middle];
};


const calculateQuartiles = (values) => {
  if (values.length < 4) {
    return null;
  }

  const sorted = [...values].sort(
    (a, b) => a - b
  );

  const middle =
    Math.floor(sorted.length / 2);

  const lowerHalf =
    sorted.slice(0, middle);

  const upperHalf =
    sorted.slice(
      sorted.length % 2 === 0
        ? middle
        : middle + 1
    );

  const q1 =
    calculateMedian(lowerHalf);

  const q3 =
    calculateMedian(upperHalf);

  if (
    q1 === null ||
    q3 === null
  ) {
    return null;
  }

  const iqr = q3 - q1;

  return {
    q1,
    q3,
    iqr,
    lowerFence:
      q1 - 1.5 * iqr,
    upperFence:
      q3 + 1.5 * iqr,
  };
};


const detectIqrOutliers = (
  observations,
  field
) => {
  if (observations.length < 8) {
    return {
      field,
      statistics: null,
      outliers: [],
    };
  }

  const values =
    observations
      .map(
        (item) => item.value
      )
      .filter(
        (value) =>
          Number.isFinite(value)
      );

  const quartiles =
    calculateQuartiles(values);

  if (!quartiles) {
    return {
      field,
      statistics: null,
      outliers: [],
    };
  }

  const outliers =
    observations
      .filter((item) => {
        return (
          item.value <
            quartiles.lowerFence ||
          item.value >
            quartiles.upperFence
        );
      })
      .map((item) => {
        const isHigh =
          item.value >
          quartiles.upperFence;

        return {
          rowId: item.rowId,
          rowIndex: item.rowIndex,
          value: item.value,
          direction: isHigh
            ? "high"
            : "low",
          deviation:
            isHigh
              ? item.value -
                quartiles.upperFence
              : quartiles.lowerFence -
                item.value,
        };
      });

  return {
    field,
    statistics: {
      count: values.length,
      q1: quartiles.q1,
      q3: quartiles.q3,
      iqr: quartiles.iqr,
      lowerFence:
        quartiles.lowerFence,
      upperFence:
        quartiles.upperFence,
      median:
        calculateMedian(values),
    },
    outliers,
  };
};

/*
 * -----------------------------------------
 * HELPERS
 * -----------------------------------------
 */

const toNumber = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(
    String(value)
      .replace(/,/g, "")
      .replace(/[₹$€£]/g, "")
      .trim()
  );

  return Number.isFinite(number)
    ? number
    : null;
};

const getRowValue = (
  row,
  columnName
) => {
  if (!columnName) {
    return null;
  }

  return row?.[columnName];
};

const calculateInvestigationPriority = ({
  financialImpact = 0,
  maxFinancialImpact = 0,
  margin = 0,
  anomalyCount = 0,
  statisticalSignals = 0,
}) => {
  const safeFinancialImpact =
    Number(financialImpact) || 0;

  const safeMaxFinancialImpact =
    Number(maxFinancialImpact) || 0;

  const safeMargin =
    Number(margin) || 0;

  const safeAnomalyCount =
    Number(anomalyCount) || 0;

  const safeStatisticalSignals =
    Number(statisticalSignals) || 0;

  /*
   * -----------------------------------------
   * FINANCIAL IMPACT
   * -----------------------------------------
   *
   * Compares this order's loss against the
   * largest loss-making order in the dataset.
   *
   * Maximum: 40 points
   */

  const financialScore =
    safeMaxFinancialImpact > 0
      ? Math.min(
          40,
          (safeFinancialImpact /
            safeMaxFinancialImpact) *
            40
        )
      : 0;

  /*
   * -----------------------------------------
   * MARGIN SEVERITY
   * -----------------------------------------
   *
   * More negative margins indicate greater
   * business impact.
   *
   * Maximum: 25 points
   */

  const marginScore =
    safeMargin < 0
      ? Math.min(
          25,
          Math.abs(safeMargin) / 2
        )
      : 0;

  /*
   * -----------------------------------------
   * ANOMALY SIGNALS
   * -----------------------------------------
   *
   * Multiple independent business signals
   * increase investigation priority.
   *
   * Maximum: 20 points
   */

  const signalScore =
    Math.min(
      20,
      safeAnomalyCount * 5
    );

  /*
   * -----------------------------------------
   * STATISTICAL SUPPORT
   * -----------------------------------------
   *
   * Statistical evidence provides additional
   * support for investigation.
   *
   * Maximum: 15 points
   */

  const statisticalScore =
    Math.min(
      15,
      safeStatisticalSignals * 5
    );

  const score = clampScore(
    financialScore +
      marginScore +
      signalScore +
      statisticalScore
  );

  return {
    score,
    level: getPriorityLevel(score),

    components: {
      financialImpact:
        clampScore(financialScore),

      marginSeverity:
        clampScore(marginScore),

      anomalySignals:
        clampScore(signalScore),

      statisticalSupport:
        clampScore(statisticalScore),
    },
  };
};

/*
 * -----------------------------------------
 * BUSINESS ANOMERY DETECTION
 * -----------------------------------------
 */

export const getBusinessAnomalies = async (
  datasetId
) => {
  /*
   * -----------------------------------------
   * GET DATASET
   * -----------------------------------------
   */

  const [datasetRows] = await pool.execute(
      `
        SELECT
          id,
          name,
          row_count,
          column_count
        FROM datasets
        WHERE id = ?
      `,
      [datasetId]
    );

  if (datasetRows.length === 0) {
    throw new Error(
      "Dataset not found"
    );
  }

  const dataset =
    datasetRows[0];

  /*
   * -----------------------------------------
   * GET COLUMN METADATA
   * -----------------------------------------
   */

  const [columns] = await pool.execute(
      `
        SELECT
          column_name,
          data_type,
          column_index
        FROM dataset_columns
        WHERE dataset_id = ?
        ORDER BY column_index ASC
      `,
      [datasetId]
    );

  if (columns.length === 0) {
    return {
      datasetId: Number(datasetId),
      datasetName: dataset.name,
      anomalies: [],
      summary: {
        totalAnomalies: 0,
        lossMakingOrders: 0,
        negativeProfit: 0,
        negativeMargin: 0,
      },
    };
  }

  /*
   * -----------------------------------------
   * DETECT SEMANTIC COLUMNS
   * -----------------------------------------
   */

  const semanticColumns = detectSemanticColumns(
      columns.map((column) => ({
        columnName:
          column.column_name,

        dataType:
          column.data_type,
      }))
    );

  /*
   * -----------------------------------------
   * BUILD BUSINESS MAPPING
   * -----------------------------------------
   */

  const mapping = buildSemanticMapping(
      semanticColumns
    );

  /*
   * -----------------------------------------
   * GET RAW DATASET ROWS
   * -----------------------------------------
   */

  const [rows] =
    await pool.execute(
      `
        SELECT
          id,
          row_index,
          row_data
        FROM dataset_rows
        WHERE dataset_id = ?
        ORDER BY row_index ASC
      `,
      [datasetId]
    );

  /*
   * -----------------------------------------
   * VALIDATE CORE METRICS
   * -----------------------------------------
   */

  const hasRevenue = Boolean(mapping.revenue);
  const hasCost = Boolean(mapping.cost);

  /*
   * We need both Revenue and Cost
   * to calculate profit anomalies.
   */

  if (
    !hasRevenue ||
    !hasCost
  ) {
    return {
      datasetId: Number(datasetId),

      datasetName:
        dataset.name,

      anomalies: [],

      summary: {
        totalAnomalies: 0,
        lossMakingOrders: 0,
        negativeProfit: 0,
        negativeMargin: 0,
      },

      readiness: {
        canDetectProfitAnomalies: false,

        missingFields: [
          ...(!hasRevenue
            ? ["revenue"]
            : []),

          ...(!hasCost
            ? ["cost"]
            : []),
        ],
      },
    };
  }

  /*
   * -----------------------------------------
   * PROCESS ROWS
   * -----------------------------------------
   */

const lossMakingOrders = [];

const productLossMap = {};
const regionLossMap = {};
const channelLossMap = {};

const statisticalObservations = {
  revenue: [],
  cost: [],
  quantity: [],
  margin: [],
};

  for (
    const row of rows
  ) {
    let rowData =
      row.row_data;

    /*
     * MySQL JSON may already be an object,
     * but handle string responses as well.
     */

    if (
      typeof rowData ===
      "string"
    ) {
      try {
        rowData =
          JSON.parse(rowData);
      } catch {
        continue;
      }
    }

    if (
      !rowData ||
      typeof rowData !==
        "object"
    ) {
      continue;
    }

    const revenue =
      toNumber(
        getRowValue(
          rowData,
          mapping.revenue
        )
      );

    const cost =
      toNumber(
        getRowValue(
          rowData,
          mapping.cost
        )
      );

      const quantity = mapping.quantity
    ? toNumber(
        getRowValue(
          rowData,
          mapping.quantity
        )
      )
    : null;

    if (
      revenue === null ||
      cost === null
    ) {
      continue;
    }


    const profit =
      revenue - cost;

    const margin =
      revenue !== 0
        ? (profit / revenue) *
          100
        : null;

statisticalObservations.revenue.push({
  rowId: row.id,
  rowIndex: row.row_index,
  value: revenue,
});


statisticalObservations.cost.push({
  rowId: row.id,
  rowIndex: row.row_index,
  value: cost,
});


if (quantity !== null) {
  statisticalObservations.quantity.push({
    rowId: row.id,
    rowIndex: row.row_index,
    value: quantity,
  });
}


if (margin !== null) {
  statisticalObservations.margin.push({
    rowId: row.id,
    rowIndex: row.row_index,
    value: margin,
  });
}

    /*
     * ---------------------------------------
     * LOSS-MAKING ORDER
     * ---------------------------------------
     */

    if (profit < 0) {
      const product =
        mapping.product
          ? getRowValue(
              rowData,
              mapping.product
            )
          : null;

      const region =
        mapping.region
          ? getRowValue(
              rowData,
              mapping.region
            )
          : null;

      const channel =
        mapping.sales_channel
          ? getRowValue(
              rowData,
              mapping.sales_channel
            )
          : null;

      const loss = Math.abs(profit);

      lossMakingOrders.push({
        rowId: row.id,

        rowIndex:
          row.row_index,

        product:
          product ?? "Unknown",

        region:
          region ?? "Unknown",

        channel:
          channel ?? "Unknown",

        revenue,
        cost,
        profit,
        loss,
        margin,
      });

      /*
       * -------------------------------------
       * PRODUCT LOSS AGGREGATION
       * -------------------------------------
       */

      if (product) {
        if (
          !productLossMap[
            product
          ]
        ) {
          productLossMap[
            product
          ] = {
            product,
            lossOrders: 0,
            totalLoss: 0,
          };
        }

        productLossMap[
          product
        ].lossOrders += 1;

        productLossMap[
          product
        ].totalLoss += loss;
      }

      /*
       * -------------------------------------
       * REGION LOSS AGGREGATION
       * -------------------------------------
       */

      if (region) {
        if (
          !regionLossMap[
            region
          ]
        ) {
          regionLossMap[
            region
          ] = {
            region,
            lossOrders: 0,
            totalLoss: 0,
          };
        }

        regionLossMap[
          region
        ].lossOrders += 1;

        regionLossMap[
          region
        ].totalLoss += loss;
      }

      /*
       * -------------------------------------
       * CHANNEL LOSS AGGREGATION
       * -------------------------------------
       */

      if (channel) {
        if (
          !channelLossMap[
            channel
          ]
        ) {
          channelLossMap[
            channel
          ] = {
            channel,
            lossOrders: 0,
            totalLoss: 0,
          };
        }

        channelLossMap[
          channel
        ].lossOrders += 1;

        channelLossMap[
          channel
        ].totalLoss += loss;
      }
    }
  }

  /*
 * -----------------------------------------
 * STATISTICAL ANOMALY DETECTION
 * -----------------------------------------
 */

const statisticalResults = {
  revenue: detectIqrOutliers(
    statisticalObservations.revenue,
    "revenue"
  ),

  cost: detectIqrOutliers(
    statisticalObservations.cost,
    "cost"
  ),

  quantity: detectIqrOutliers(
    statisticalObservations.quantity,
    "quantity"
  ),

  margin: detectIqrOutliers(
    statisticalObservations.margin,
    "margin"
  ),
};

const statisticalAnomalies = [];

const statisticalFields = [
  {
    key: "revenue",
    label: "Revenue",
  },
  {
    key: "cost",
    label: "Cost",
  },
  {
    key: "quantity",
    label: "Quantity",
  },
  {
    key: "margin",
    label: "Profit Margin",
  },
];


for (const field of statisticalFields) {
  const result =
    statisticalResults[field.key];

  if (
    !result ||
    !result.outliers ||
    result.outliers.length === 0
  ) {
    continue;
  }

  const highCount =
    result.outliers.filter(
      (item) =>
        item.direction === "high"
    ).length;

  const lowCount =
    result.outliers.filter(
      (item) =>
        item.direction === "low"
    ).length;

  statisticalAnomalies.push({
    type:
      `statistical_${field.key}_outlier`,

    field:
      field.key,

    title:
      `${field.label} outliers detected`,

    description:
      `${result.outliers.length} rows contain unusually high or low ${field.label.toLowerCase()} values based on the dataset's IQR distribution.`,

    count:
      result.outliers.length,

    highCount,

    lowCount,

    statistics:
      result.statistics,

    affectedRows:
      result.outliers.map(
        (item) =>
          item.rowId
      ),

    outliers:
      result.outliers,
  });
}

  /*
   * -----------------------------------------
   * SORT AGGREGATIONS
   * -----------------------------------------
   */

  const productLosses =
    Object.values(
      productLossMap
    ).sort(
      (a, b) =>
        b.totalLoss -
        a.totalLoss
    );

  const regionLosses =
    Object.values(
      regionLossMap
    ).sort(
      (a, b) =>
        b.totalLoss -
        a.totalLoss
    );

  const channelLosses =
    Object.values(
      channelLossMap
    ).sort(
      (a, b) =>
        b.totalLoss -
        a.totalLoss
    );

  /*
   * -----------------------------------------
   * TOTAL LOSS
   * -----------------------------------------
   */

  const totalLoss =
    lossMakingOrders.reduce(
      (total, order) =>
        total + order.loss,
      0
    );

    const maxFinancialImpact = lossMakingOrders.reduce(
    (max, order) =>
      Math.max(
        max,
        Number(order.loss) || 0
      ),
    0
  );

  /*
   * -----------------------------------------
   * NEGATIVE MARGIN
   * -----------------------------------------
   */

  const negativeMarginOrders =
    lossMakingOrders.filter(
      (order) =>
        order.margin !==
          null &&
        order.margin < 0
    );

    // * ------------------
    const prioritizedOrders = lossMakingOrders.map((order) => {
    const statisticalSignals =
      statisticalAnomalies.filter(
        (anomaly) =>
          anomaly.outliers?.some(
            (outlier) =>
              outlier.rowId ===
              order.rowId
          )
      ).length;

    const priority = calculateInvestigationPriority({
    financialImpact:
      order.loss,

    maxFinancialImpact,

    margin:
      order.margin,

    anomalyCount:
      1 +
      (
        order.margin !== null &&
        order.margin < 0
          ? 1
          : 0
      ),

    statisticalSignals,
  });

    return {
      ...order,

      priorityScore:
        priority.score,

      priorityLevel:
        priority.level,

      priorityBreakdown:
        priority.components,
    };
  });

  const prioritySummary = prioritizedOrders.reduce(
    (summary, order) => {
      summary[order.priorityLevel] =
        (summary[order.priorityLevel] || 0) + 1;

      return summary;
    },
    {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    }
  );

  /*
   * -----------------------------------------
   * ANOMALIES
   * -----------------------------------------
   */

  const anomalies = [];

  if (
    lossMakingOrders.length > 0
  ) {
    anomalies.push({
      type: "loss_making_orders",

      severity:
        lossMakingOrders.length /
          Number(
            dataset.row_count || 1
          ) >=
        0.25
          ? "high"
          : "medium",

      title:
        "Loss-making orders detected",

      description:
        `${lossMakingOrders.length} orders have costs higher than revenue.`,

      count:
        lossMakingOrders.length,

      totalLoss,

      affectedRows:
        lossMakingOrders.map(
          (order) =>
            order.rowId
        ),
    });
  }

  if (
    negativeMarginOrders.length >
    0
  ) {
    anomalies.push({
      type: "negative_profit_margin",

      severity: "high",

      title:
        "Negative profit margins detected",

      description:
        `${negativeMarginOrders.length} orders generated a negative profit margin.`,

      count:
        negativeMarginOrders.length,

      affectedRows:
        negativeMarginOrders.map(
          (order) =>
            order.rowId
        ),
    });
  }

  /*
   * -----------------------------------------
   * FINAL RESULT
   * -----------------------------------------
   */

  return {
    datasetId: Number(datasetId),
    datasetName:dataset.name,
    summary: {
    totalRows: Number(
      dataset.row_count
    ),

    totalAnomalies:anomalies.length,
    statisticalAnomalies: statisticalAnomalies.length,

  statisticalOutlierRows:
    [
      ...new Set(
        statisticalAnomalies.flatMap(
          (anomaly) =>
            anomaly.affectedRows
        )
      ),
    ].length,

  // lossMakingOrders: lossMakingOrders.length,
  lossMakingOrders: lossMakingOrders.length,
  negativeProfit:lossMakingOrders.length,
  negativeMargin: negativeMarginOrders.length,
  totalLoss,
},

    anomalies,
    statisticalAnomalies,
    lossMakingOrders:prioritizedOrders,
    prioritySummary,
    breakdowns: {
      products: productLosses,
      regions: regionLosses,
      channels: channelLosses,
    },

    readiness: {
      canDetectProfitAnomalies:
        true,

      detectedFields: {
        revenue:
          mapping.revenue,

        cost: mapping.cost,
        quantity: mapping.quantity || null,
        product:mapping.product || null,
        region: mapping.region || null,
        salesChannel:
          mapping.sales_channel ||
          null,
      },
    },
  };
};