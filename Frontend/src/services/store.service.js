import API from "./api";
import { API_ENDPOINTS } from "../constants/api";

const getStores = async (params = {}) => {
  const response = await API.get(API_ENDPOINTS.GET_STORES, {
    params,
  });

  return response.data;
};

const getStoreById = async (id) => {
  const endpoint = API_ENDPOINTS.GET_STORE.replace(":id", id);

  const response = await API.get(endpoint);

  return response.data;
};

export default {
  getStores,
  getStoreById,
};