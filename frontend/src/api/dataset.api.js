
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5009";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Get a single dataset
export const getDataset = async (datasetId) => {
  const response = await api.get(
    `/api/datasets/${datasetId}`
  );

  return response.data;
};

// Get dataset rows with pagination
export const getDatasetRows = async (
  datasetId,
  page = 1,
  limit = 50
) => {
  const response = await api.get(
    `/api/datasets/${datasetId}/rows`,
    {
      params: {
        page,
        limit,
      },
    }
  );

  return response.data;
};

// Upload a dataset
export const uploadDataset = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    "/api/datasets/upload",
    formData
  );

  return response.data;
};

// Get all datasets belonging to the authenticated user
export const getDatasets = async () => {
  const response = await api.get("/api/datasets");

  return response.data;
};
