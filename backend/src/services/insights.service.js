import {
  getOverviewAnalytics,
  getRevenueByMonth,
  getRevenueByProduct,
  getRevenueByCategory,
  getRevenueByRegion,
  getRevenueBySalesChannel,
  getProductPerformance,
  getDataQuality
} from "./analytics.service.js";


const buildRevenueTrendInsight = (
  monthlyRevenue
) => {
  if (monthlyRevenue.length < 2) {
    return null;
  }

  const previous =
    monthlyRevenue[
      monthlyRevenue.length - 2
    ];

  const current =
    monthlyRevenue[
      monthlyRevenue.length - 1
    ];

  if (previous.revenue === 0) {
    return null;
  }

  const change =
    ((current.revenue - previous.revenue) /
      previous.revenue) *
    100;

  const roundedChange =
    Number(change.toFixed(2));

  if (change > 0) {
    return {
      type: "revenue_trend",
      severity: "positive",
      title: "Revenue Increased",
      message: `Revenue increased by ${roundedChange}% compared with the previous month.`,
      value: roundedChange,
      metadata: {
        previousMonth: previous.month,
        currentMonth: current.month,
      },
    };
  }

  if (change < 0) {
    return {
      type: "revenue_trend",
      severity: "warning",
      title: "Revenue Decreased",
      message: `Revenue decreased by ${Math.abs(roundedChange)}% compared with the previous month.`,
      value: roundedChange,
      metadata: {
        previousMonth: previous.month,
        currentMonth: current.month,
      },
    };
  }

  return {
    type: "revenue_trend",
    severity: "neutral",
    title: "Revenue Stable",
    message:
      "Revenue remained unchanged compared with the previous month.",
    value: 0,
    metadata: {
      previousMonth: previous.month,
      currentMonth: current.month,
    },
  };
};

const buildTopProductInsight = (
  products
) => {
  if (!products.length) {
    return null;
  }

  const topProduct = products[0];

  return {
    type: "top_product",
    severity: "positive",
    title: "Top Revenue Product",
    message: `${topProduct.product} generated the highest revenue.`,
    value: topProduct.revenue,
    metadata: {
      product: topProduct.product,
    },
  };
};


const buildTopCategoryInsight = (
  categories
) => {
  if (!categories.length) {
    return null;
  }

  const topCategory = categories[0];

  return {
    type: "top_category",
    severity: "positive",
    title: "Top Revenue Category",
    message: `${topCategory.category} generated the highest revenue.`,
    value: topCategory.revenue,
    metadata: {
      category: topCategory.category,
    },
  };
};


const buildTopRegionInsight = (
  regions
) => {
  if (!regions.length) {
    return null;
  }

  const topRegion = regions[0];

  return {
    type: "top_region",
    severity: "positive",
    title: "Top Revenue Region",
    message: `${topRegion.region} generated the highest revenue.`,
    value: topRegion.revenue,
    metadata: {
      region: topRegion.region,
    },
  };
};


const buildSalesChannelInsight = (
  channels
) => {
  if (!channels.length) {
    return null;
  }

  const topChannel = channels[0];

  return {
    type: "top_sales_channel",
    severity: "positive",
    title: "Leading Sales Channel",
    message: `${topChannel.channel} generated the highest revenue.`,
    value: topChannel.revenue,
    metadata: {
      channel: topChannel.channel,
    },
  };
};


const buildProductMarginInsight = (
  products
) => {
  const productsWithMargin =
    products.filter(
      (product) =>
        product.profitMargin !== null
    );

  if (!productsWithMargin.length) {
    return null;
  }

  const highestMarginProduct =
    [...productsWithMargin].sort(
      (a, b) =>
        b.profitMargin -
        a.profitMargin
    )[0];

  return {
    type: "highest_product_margin",
    severity: "positive",
    title: "Highest Product Margin",
    message: `${highestMarginProduct.product} has the highest profit margin.`,
    value:
      highestMarginProduct.profitMargin,
    metadata: {
      product:
        highestMarginProduct.product,
    },
  };
};


const buildDataQualityInsight = (
  quality
) => {
  if (
    quality.missingValues === 0 &&
    quality.analyticsReady
  ) {
    return {
      type: "data_quality",
      severity: "positive",
      title: "Data Quality",
      message:
        "The dataset contains no missing values and is ready for analytics.",
      value: 0,
      metadata: {
        missingValues: 0,
        analyticsReady: true,
      },
    };
  }

  if (quality.missingValues > 0) {
    return {
      type: "data_quality",
      severity: "warning",
      title: "Missing Data Detected",
      message: `${quality.missingValues} missing values were detected in the dataset.`,
      value: quality.missingValues,
      metadata: {
        missingValues:
          quality.missingValues,
        analyticsReady:
          quality.analyticsReady,
      },
    };
  }

  return null;
};

export const getBusinessInsights = async (datasetId) => {
    const [
      overview,
      monthlyRevenue,
      productRevenue,
      categoryRevenue,
      regionRevenue,
      salesChannels,
      productPerformance,
      quality
    ] = await Promise.all([
      getOverviewAnalytics(datasetId),
      getRevenueByMonth(datasetId),
      getRevenueByProduct(datasetId),
      getRevenueByCategory(datasetId),
      getRevenueByRegion(datasetId),
      getRevenueBySalesChannel(datasetId),
      getProductPerformance(datasetId),
      getDataQuality(datasetId),
    ]);

    const insights = [];

    const revenueTrend =
      buildRevenueTrendInsight(
        monthlyRevenue
      );

    if (revenueTrend) {
      insights.push(revenueTrend);
    }

    const topProduct =
      buildTopProductInsight(
        productRevenue
      );

    if (topProduct) {
      insights.push(topProduct);
    }

    const topCategory =
      buildTopCategoryInsight(
        categoryRevenue
      );

    if (topCategory) {
      insights.push(topCategory);
    }

    const topRegion =
      buildTopRegionInsight(
        regionRevenue
      );

    if (topRegion) {
      insights.push(topRegion);
    }

    const topChannel =
      buildSalesChannelInsight(
        salesChannels
      );

    if (topChannel) {
      insights.push(topChannel);
    }

    const marginInsight =
      buildProductMarginInsight(
        productPerformance
      );

    if (marginInsight) {
      insights.push(marginInsight);
    }

    const dataQualityInsight =
  buildDataQualityInsight(quality);

    if (dataQualityInsight) {
    insights.push(dataQualityInsight);
    }

    return {
      datasetId: Number(datasetId),

      summary: {
        totalInsights:
          insights.length,

        totalRevenue:
          overview.totalRevenue,

        totalProfit:
          overview.totalProfit,

        profitMargin:
          overview.profitMargin,
      },

      insights,
    };
  };


