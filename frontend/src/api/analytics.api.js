
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5009";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Overview Analytics
export const getOverview = async (datasetId) => {
  const response = await api.get(
    `/api/analytics/${datasetId}/overview`
  );

  return response.data;
};

// Revenue by Month
export const getRevenueByMonth = async (datasetId) => {
  const response = await api.get(
    `/api/analytics/${datasetId}/revenue-by-month`
  );

  return response.data;
};

// Revenue by Product
export const getRevenueByProduct = async (datasetId) => {
  const response = await api.get(
    `/api/analytics/${datasetId}/revenue-by-product`
  );

  return response.data;
};

// Revenue by Category
export const getRevenueByCategory = async (datasetId) => {
  const response = await api.get(
    `/api/analytics/${datasetId}/revenue-by-category`
  );

  return response.data;
};

// Revenue by Region
export const getRevenueByRegion = async (datasetId) => {
  const response = await api.get(
    `/api/analytics/${datasetId}/revenue-by-region`
  );

  return response.data;
};

// Quantity by Product
export const getQuantityByProduct = async (datasetId) => {
  const response = await api.get(
    `/api/analytics/${datasetId}/quantity-by-product`
  );

  return response.data;
};

// Quantity by Category
export const getQuantityByCategory = async (datasetId) => {
  const response = await api.get(
    `/api/analytics/${datasetId}/quantity-by-category`
  );

  return response.data;
};

// Revenue by Sales Channel
export const getRevenueByChannel = async (datasetId) => {
  const response = await api.get(
    `/api/analytics/${datasetId}/revenue-by-channel`
  );

  return response.data;
};

// Product Performance
export const getProductPerformance = async (datasetId) => {
  const response = await api.get(
    `/api/analytics/${datasetId}/product-performance`
  );

  return response.data;
};

// Data Quality
export const getDataQuality = async (datasetId) => {
  const response = await api.get(
    `/api/analytics/${datasetId}/data-quality`
  );

  return response.data;
};

// Business Anomalies
export const getBusinessAnomalies = async (datasetId) => {
  const response = await api.get(
    `/api/analytics/${datasetId}/business-anomalies`
  );

  return response.data;
};

// Business Insights
export const getBusinessInsights = async (datasetId) => {
  const response = await api.get(
    `/api/insights/${datasetId}`
  );

  return response.data;
};
