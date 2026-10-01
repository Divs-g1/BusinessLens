import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

export const getDataset = async (datasetId) => {
  const response = await axios.get(
    `${API_BASE_URL}/datasets/${datasetId}`
  );

  return response.data;
};