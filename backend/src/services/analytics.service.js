import pool from "../config/db.js";

import { detectSemanticColumns,} from "./semanticProfiler.service.js";

import {
  buildSemanticMapping,
  getSemanticValue,
} from "./semanticMapping.service.js";

const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};

const round = (value, decimals = 2) => {
  return Number(value.toFixed(decimals));
};

const getDatasetSemanticMapping = async (
  datasetId
) => {
  const [columns] = await pool.execute(
    `
    SELECT
      column_name,
      data_type
    FROM dataset_columns
    WHERE dataset_id = ?
    ORDER BY column_index ASC
    `,
    [datasetId]
  );

  const semanticColumns =
    detectSemanticColumns(
      columns.map((column) => ({
        columnName: column.column_name,
        dataType: column.data_type,
      }))
    );

  return buildSemanticMapping(
    semanticColumns
  );
};

const getDatasetRows = async (datasetId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      row_data
    FROM dataset_rows
    WHERE dataset_id = ?
    ORDER BY row_index ASC
    `,
    [datasetId]
  );

  return rows;
};

const parseRowData = (rowData) => {
  return typeof rowData === "string"
    ? JSON.parse(rowData)
    : rowData;
};

/*
|--------------------------------------------------------------------------
| Overview Analytics
|--------------------------------------------------------------------------
*/

export const getOverviewAnalytics = async (
  datasetId
) => {
  const rows = await getDatasetRows(
    datasetId
  );

  const mapping =
    await getDatasetSemanticMapping(
      datasetId
    );

  const hasRevenue =
    Boolean(mapping.revenue);

  const hasCost =
    Boolean(mapping.cost);

  let totalRevenue = 0;
  let totalCost = 0;

  const totalOrders = rows.length;

  for (const row of rows) {
    const data = parseRowData(
      row.row_data
    );

    if (hasRevenue) {
      totalRevenue += toNumber(
        getSemanticValue(
          data,
          mapping,
          "revenue"
        )
      );
    }

    if (hasCost) {
      totalCost += toNumber(
        getSemanticValue(
          data,
          mapping,
          "cost"
        )
      );
    }
  }

  const totalProfit =
    hasRevenue && hasCost
      ? totalRevenue - totalCost
      : null;

  const averageOrderValue =
    hasRevenue && totalOrders > 0
      ? totalRevenue / totalOrders
      : null;

  const profitMargin =
    hasRevenue &&
    hasCost &&
    totalRevenue > 0
      ? (totalProfit / totalRevenue) * 100
      : null;

  return {
    totalRevenue: hasRevenue
      ? round(totalRevenue)
      : null,

    totalCost: hasCost
      ? round(totalCost)
      : null,

    totalProfit:
      totalProfit !== null
        ? round(totalProfit)
        : null,

    totalOrders,

    averageOrderValue:
      averageOrderValue !== null
        ? round(averageOrderValue)
        : null,

    profitMargin:
      profitMargin !== null
        ? round(profitMargin)
        : null,

    availableMetrics: {
      revenue: hasRevenue,
      cost: hasCost,
      profit:
        hasRevenue && hasCost,
      orders: true,
      averageOrderValue:
        hasRevenue,
      profitMargin:
        hasRevenue && hasCost,
    },
  };
};

/*
|--------------------------------------------------------------------------
| Revenue By Month
|--------------------------------------------------------------------------
*/

export const getRevenueByMonth = async (
  datasetId
) => {
  const rows = await getDatasetRows(
    datasetId
  );

  const mapping =
    await getDatasetSemanticMapping(
      datasetId
    );

  if (
    !mapping.date ||
    !mapping.revenue
  ) {
    return [];
  }

  const monthlyRevenue = {};

  for (const row of rows) {
    const data = parseRowData(
      row.row_data
    );

    const date = getSemanticValue(
      data,
      mapping,
      "date"
    );

    const revenue = toNumber(
      getSemanticValue(
        data,
        mapping,
        "revenue"
      )
    );

    if (!date) {
      continue;
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      continue;
    }

    const month = parsedDate
      .toISOString()
      .slice(0, 7);

    if (!monthlyRevenue[month]) {
      monthlyRevenue[month] = 0;
    }

    monthlyRevenue[month] += revenue;
  }

  return Object.entries(
    monthlyRevenue
  )
    .sort(
      ([monthA], [monthB]) =>
        monthA.localeCompare(monthB)
    )
    .map(
      ([month, revenue]) => ({
        month,
        revenue: round(revenue),
      })
    );
};

/*
|--------------------------------------------------------------------------
| Revenue By Product
|--------------------------------------------------------------------------
*/

export const getRevenueByProduct = async (
  datasetId
) => {
  const rows = await getDatasetRows(
    datasetId
  );

  const mapping =
    await getDatasetSemanticMapping(
      datasetId
    );

  if (
    !mapping.product ||
    !mapping.revenue
  ) {
    return [];
  }

  const productRevenue = {};

  for (const row of rows) {
    const data = parseRowData(
      row.row_data
    );

    const product =
      getSemanticValue(
        data,
        mapping,
        "product"
      );

    const revenue = toNumber(
      getSemanticValue(
        data,
        mapping,
        "revenue"
      )
    );

    if (!product) {
      continue;
    }

    if (!productRevenue[product]) {
      productRevenue[product] = 0;
    }

    productRevenue[product] += revenue;
  }

  return Object.entries(
    productRevenue
  )
    .sort(
      ([, revenueA], [, revenueB]) =>
        revenueB - revenueA
    )
    .map(
      ([product, revenue]) => ({
        product,
        revenue: round(revenue),
      })
    );
};

/*
|--------------------------------------------------------------------------
| Revenue By Category
|--------------------------------------------------------------------------
*/

export const getRevenueByCategory = async (datasetId) => {
    const rows = await getDatasetRows(
      datasetId
    );

    const mapping =
      await getDatasetSemanticMapping(
        datasetId
      );

    if (
      !mapping.category ||
      !mapping.revenue
    ) {
      return [];
    }

    const categoryRevenue = {};

    for (const row of rows) {
      const data = parseRowData(
        row.row_data
      );

      const category =
        getSemanticValue(
          data,
          mapping,
          "category"
        );

      const revenue = toNumber(
        getSemanticValue(
          data,
          mapping,
          "revenue"
        )
      );

      if (!category) {
        continue;
      }

      if (!categoryRevenue[category]) {
        categoryRevenue[category] = 0;
      }

      categoryRevenue[category] += revenue;
    }

    return Object.entries(
      categoryRevenue
    )
      .sort(
        ([, revenueA], [, revenueB]) =>
          revenueB - revenueA
      )
      .map(
        ([category, revenue]) => ({
          category,
          revenue: round(revenue),
        })
      );
  };

/*
|--------------------------------------------------------------------------
| Revenue By Region
|--------------------------------------------------------------------------
*/

export const getRevenueByRegion = async (
  datasetId
) => {
  const rows = await getDatasetRows(
    datasetId
  );

  const mapping =
    await getDatasetSemanticMapping(
      datasetId
    );

  if (
    !mapping.region ||
    !mapping.revenue
  ) {
    return [];
  }

  const regionRevenue = {};

  for (const row of rows) {
    const data = parseRowData(
      row.row_data
    );

    const region =
      getSemanticValue(
        data,
        mapping,
        "region"
      );

    const revenue = toNumber(
      getSemanticValue(
        data,
        mapping,
        "revenue"
      )
    );

    if (!region) {
      continue;
    }

    if (!regionRevenue[region]) {
      regionRevenue[region] = 0;
    }

    regionRevenue[region] += revenue;
  }

  return Object.entries(
    regionRevenue
  )
    .sort(
      ([, revenueA], [, revenueB]) =>
        revenueB - revenueA
    )
    .map(
      ([region, revenue]) => ({
        region,
        revenue: round(revenue),
      })
    );
};

// ------------ Quantity ------------

export const getQuantityByProduct = async (
  datasetId
) => {
  const rows = await getDatasetRows(datasetId);

  const mapping =
    await getDatasetSemanticMapping(datasetId);

  if (
    !mapping.product ||
    !mapping.quantity
  ) {
    return [];
  }

  const productQuantity = {};

  for (const row of rows) {
    const data = parseRowData(row.row_data);

    const product = getSemanticValue(
      data,
      mapping,
      "product"
    );

    const quantity = toNumber(
      getSemanticValue(
        data,
        mapping,
        "quantity"
      )
    );

    if (!product) {
      continue;
    }

    if (!productQuantity[product]) {
      productQuantity[product] = 0;
    }

    productQuantity[product] += quantity;
  }

  return Object.entries(productQuantity)
    .sort(
      ([, quantityA], [, quantityB]) =>
        quantityB - quantityA
    )
    .map(([product, quantity]) => ({
      product,
      quantity: round(quantity),
    }));
};

export const getQuantityByCategory = async (datasetId) => {
    const rows =
      await getDatasetRows(datasetId);

    const mapping =
      await getDatasetSemanticMapping(
        datasetId
      );

    if (
      !mapping.category ||
      !mapping.quantity
    ) {
      return [];
    }

    const categoryQuantity = {};

    for (const row of rows) {
      const data =
        parseRowData(row.row_data);

      const category =
        getSemanticValue(
          data,
          mapping,
          "category"
        );

      const quantity = toNumber(
        getSemanticValue(
          data,
          mapping,
          "quantity"
        )
      );

      if (!category) {
        continue;
      }

      if (!categoryQuantity[category]) {
        categoryQuantity[category] = 0;
      }

      categoryQuantity[category] += quantity;
    }

    return Object.entries(
      categoryQuantity
    )
      .sort(
        ([, quantityA], [, quantityB]) =>
          quantityB - quantityA
      )
      .map(([category, quantity]) => ({
        category,
        quantity: round(quantity),
      }));
  };


export const getRevenueBySalesChannel = async (datasetId) => {
    const rows =
      await getDatasetRows(datasetId);

    const mapping =
      await getDatasetSemanticMapping(
        datasetId
      );

    if (
      !mapping.sales_channel ||
      !mapping.revenue
    ) {
      return [];
    }

    const channelRevenue = {};

    for (const row of rows) {
      const data =
        parseRowData(row.row_data);

      const channel =
        getSemanticValue(
          data,
          mapping,
          "sales_channel"
        );

      const revenue = toNumber(
        getSemanticValue(
          data,
          mapping,
          "revenue"
        )
      );

      if (!channel) {
        continue;
      }

      if (!channelRevenue[channel]) {
        channelRevenue[channel] = 0;
      }

      channelRevenue[channel] += revenue;
    }

    return Object.entries(channelRevenue)
      .sort(
        ([, revenueA], [, revenueB]) =>
          revenueB - revenueA
      )
      .map(([channel, revenue]) => ({
        channel,
        revenue: round(revenue),
      }));
  };


export const getProductPerformance = async (
  datasetId
) => {
  const rows = await getDatasetRows(datasetId);

  const mapping =
    await getDatasetSemanticMapping(
      datasetId
    );

  if (
    !mapping.product ||
    !mapping.revenue
  ) {
    return [];
  }

  const hasCost = Boolean(mapping.cost);
  const hasQuantity = Boolean(mapping.quantity);

  const productPerformance = {};

  for (const row of rows) {
    const data = parseRowData(row.row_data);

    const product = getSemanticValue(
      data,
      mapping,
      "product"
    );

    if (!product) {
      continue;
    }

    const revenue = toNumber(
      getSemanticValue(
        data,
        mapping,
        "revenue"
      )
    );

    const cost = hasCost
      ? toNumber(
          getSemanticValue(
            data,
            mapping,
            "cost"
          )
        )
      : 0;

    const quantity = hasQuantity
      ? toNumber(
          getSemanticValue(
            data,
            mapping,
            "quantity"
          )
        )
      : 0;

    if (!productPerformance[product]) {
      productPerformance[product] = {
        revenue: 0,
        cost: 0,
        quantity: 0,
      };
    }

    productPerformance[product].revenue +=
      revenue;

    productPerformance[product].cost +=
      cost;

    productPerformance[product].quantity +=
      quantity;
  }

  return Object.entries(productPerformance)
    .sort(
      ([, productA], [, productB]) =>
        productB.revenue - productA.revenue
    )
    .map(([product, metrics]) => {
      const profit =
        hasCost
          ? metrics.revenue - metrics.cost
          : null;

      const profitMargin =
        hasCost &&
        metrics.revenue > 0
          ? (profit / metrics.revenue) * 100
          : null;

      const averageRevenuePerUnit =
        hasQuantity &&
        metrics.quantity > 0
          ? metrics.revenue /
            metrics.quantity
          : null;

      return {
        product,

        revenue: round(
          metrics.revenue
        ),

        cost: hasCost
          ? round(metrics.cost)
          : null,

        profit:
          profit !== null
            ? round(profit)
            : null,

        quantity: hasQuantity
          ? round(metrics.quantity)
          : null,

        profitMargin:
          profitMargin !== null
            ? round(profitMargin)
            : null,

        averageRevenuePerUnit:
          averageRevenuePerUnit !== null
            ? round(
                averageRevenuePerUnit
              )
            : null,
      };
    });
};


export const getDataQuality = async (
  datasetId
) => {
  const [datasetRows] = await pool.execute(
    `
    SELECT
      row_count,
      column_count
    FROM datasets
    WHERE id = ?
    `,
    [datasetId]
  );

  if (datasetRows.length === 0) {
    throw new Error("Dataset not found");
  }

  const dataset = datasetRows[0];

  const [columns] = await pool.execute(
    `
    SELECT
      column_name,
      data_type,
      nullable,
      missing_count,
      unique_count
    FROM dataset_columns
    WHERE dataset_id = ?
    ORDER BY column_index ASC
    `,
    [datasetId]
  );

  /*
   * Reconstruct semantic roles from the
   * stored column metadata.
   */
  const semanticColumns =
    detectSemanticColumns(
      columns.map((column) => ({
        columnName: column.column_name,
        dataType: column.data_type,
      }))
    );

  const missingColumns = columns
    .filter(
      (column) =>
        Number(column.missing_count) > 0
    )
    .map((column) => ({
      column: column.column_name,
      missingValues:
        Number(column.missing_count),
    }));

  /*
   * Count how many columns belong to
   * each semantic role.
   */
  const semanticRoles = {};

  for (const column of semanticColumns) {
    if (column.role === "unknown") {
      continue;
    }

    if (!semanticRoles[column.role]) {
      semanticRoles[column.role] = 0;
    }

    semanticRoles[column.role] += 1;
  }

  /*
   * Determine whether the dataset contains
   * enough information for core analytics.
   *
   * Revenue is the primary requirement for
   * BusinessLens revenue analytics.
   */
  const mapping =
    buildSemanticMapping(
      semanticColumns
    );

  const hasRevenue =
    Boolean(mapping.revenue);

  const hasDate =
    Boolean(mapping.date);

  const hasProduct =
    Boolean(mapping.product);

  const readinessIssues = [];

  if (!hasRevenue) {
    readinessIssues.push(
      "Revenue column was not detected"
    );
  }

  if (!hasDate) {
    readinessIssues.push(
      "Date column was not detected"
    );
  }

  if (!hasProduct) {
    readinessIssues.push(
      "Product column was not detected"
    );
  }

  const analyticsReady =
    readinessIssues.length === 0;

  return {
    rowCount: Number(
      dataset.row_count
    ),

    columnCount: Number(
      dataset.column_count
    ),

    missingValues:
      missingColumns.reduce(
        (total, column) =>
          total + column.missingValues,
        0
      ),

    duplicateRows: null,

    missingColumns,

    semanticRoles,

    analyticsReady,

    readinessIssues,
  };
};