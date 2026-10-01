import { useEffect, useState, } from "react";
import { getDataset } from "../api/dataset.api";

import {
  getOverview,
  getRevenueByMonth,
  getRevenueByProduct,
  getRevenueByCategory,
  getRevenueByRegion,
  getQuantityByProduct,
  getQuantityByCategory,
  getRevenueByChannel,
  getProductPerformance,
  getDataQuality,
  getBusinessInsights,
} from "../api/analytics.api";

const useDashboardAnalytics = (
  datasetId
) => {
    
  const [data, setData] = useState({
    dataset: null,
    overview: null,
    revenueByMonth: [],
    revenueByProduct: [],
    revenueByCategory: [],
    revenueByRegion: [],
    quantityByProduct: [],
    quantityByCategory: [],
    revenueByChannel: [],
    productPerformance: [],
    dataQuality: null,
    insights: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!datasetId) {
      return;
    }

    const loadAnalytics =
      async () => {
        try {
          setLoading(true);
          setError(null);

          const [
            datasetResponse,
            overviewResponse,
            monthResponse,
            productResponse,
            categoryResponse,
            regionResponse,
            quantityProductResponse,
            quantityCategoryResponse,
            channelResponse,
            performanceResponse,
            qualityResponse,
            insightsResponse,
          ] = await Promise.all([
             getDataset(datasetId),
            getOverview(datasetId),
            getRevenueByMonth(datasetId),
            getRevenueByProduct(datasetId),
            getRevenueByCategory(datasetId),
            getRevenueByRegion(datasetId),
            getQuantityByProduct(datasetId),
            getQuantityByCategory(datasetId),
            getRevenueByChannel(datasetId),
            getProductPerformance(datasetId),
            getDataQuality(datasetId),
            getBusinessInsights(datasetId),
          ]);

          console.log("API RESPONSES:", {
                overviewResponse,
                monthResponse,
                productResponse,
                categoryResponse,
                regionResponse,
                quantityProductResponse,
                quantityCategoryResponse,
                channelResponse,
                performanceResponse,
                qualityResponse,
                insightsResponse,
                });

         setData({
            dataset: datasetResponse.dataset,
            overview: overviewResponse.overview,
            revenueByMonth: monthResponse.data,
            revenueByProduct: productResponse.data,
            revenueByCategory: categoryResponse.data,
            revenueByRegion: regionResponse.data,
            quantityByProduct: quantityProductResponse.data,
            quantityByCategory: quantityCategoryResponse.data,
            revenueByChannel: channelResponse.data,
            productPerformance: performanceResponse.data,
            dataQuality: qualityResponse.quality,
            insights: insightsResponse.insights,
            });
        } catch (err) {
          console.error(
            "Dashboard analytics error:",
            err
          );

          setError(
            "Failed to load dashboard analytics."
          );
        } finally {
          setLoading(false);
        }
      };

    loadAnalytics();
  }, [datasetId]);

  return {
    ...data,
    loading,
    error,
  };
};

export default useDashboardAnalytics;