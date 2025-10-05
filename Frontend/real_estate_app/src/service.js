import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export const getLocations = async () => {
  const response = await axios.get(`${API_BASE_URL}/locations`);
  return response.data.locations;
};

export const getPredictedPrice = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/predict`, formData);
  return response.data.estimated_price;
};
