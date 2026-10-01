import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getDataset = async (datasetId) => {
  const response = await axios.get(
    `${API_BASE_URL}/datasets/${datasetId}`
  );

  return response.data;
};

export const getDatasetRows = async (
  datasetId,
  page = 1,
  limit = 50
) => {
  const response = await axios.get(
    `${API_BASE_URL}/datasets/${datasetId}/rows`,
    {
      params: {
        page,
        limit,
      },
    }
  );

  return response.data;
};

export const uploadDataset = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axios.post(
    `${API_BASE_URL}/datasets/upload`,
    formData
  );

  return response.data;
};

export const getDatasets = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/datasets`
  );

  return response.data;
};