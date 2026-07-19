import API from "./api";

export const storeOwnerService = {
  getDashboard: async () => {
    const response = await API.get("/store-owner/dashboard");
    return response.data;
  },

  getStoreRaters: async (params = {}) => {
    const response = await API.get("/store-owner/raters", {
      params,
    });

    return response.data;
  },
};