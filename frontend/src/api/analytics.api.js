import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getOverview = async (
  datasetId
) => {
  const response = await axios.get(
    `${API_BASE_URL}/analytics/${datasetId}/overview`
  );

  return response.data;
};

export const getRevenueByMonth = async (
  datasetId
) => {
  const response = await axios.get(
    `${API_BASE_URL}/analytics/${datasetId}/revenue-by-month`
  );

  return response.data;
};

export const getRevenueByProduct = async (
  datasetId
) => {
  const response = await axios.get(
    `${API_BASE_URL}/analytics/${datasetId}/revenue-by-product`
  );

  return response.data;
};

export const getRevenueByCategory = async (
  datasetId
) => {
  const response = await axios.get(
    `${API_BASE_URL}/analytics/${datasetId}/revenue-by-category`
  );

  return response.data;
};

export const getRevenueByRegion = async (
  datasetId
) => {
  const response = await axios.get(
    `${API_BASE_URL}/analytics/${datasetId}/revenue-by-region`
  );

  return response.data;
};

export const getQuantityByProduct = async (
  datasetId
) => {
  const response = await axios.get(
    `${API_BASE_URL}/analytics/${datasetId}/quantity-by-product`
  );

  return response.data;
};

export const getQuantityByCategory = async (
  datasetId
) => {
  const response = await axios.get(
    `${API_BASE_URL}/analytics/${datasetId}/quantity-by-category`
  );

  return response.data;
};

export const getRevenueByChannel = async (
  datasetId
) => {
  const response = await axios.get(
    `${API_BASE_URL}/analytics/${datasetId}/revenue-by-channel`
  );

  return response.data;
};

export const getProductPerformance = async (
  datasetId
) => {
  const response = await axios.get(
    `${API_BASE_URL}/analytics/${datasetId}/product-performance`
  );

  return response.data;
};

export const getDataQuality = async (
  datasetId
) => {
  const response = await axios.get(
    `${API_BASE_URL}/analytics/${datasetId}/data-quality`
  );

  return response.data;
};

export const getBusinessInsights = async (
  datasetId
) => {
  const response = await axios.get(
    `${API_BASE_URL}/insights/${datasetId}`
  );

  return response.data;
};

