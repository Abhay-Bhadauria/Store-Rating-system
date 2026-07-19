import api from '@api';
import { API_ENDPOINTS } from '@constants';

export const adminService = {
  getDashboard: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN_DASHBOARD);
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.ADMIN_GET_USERS, { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(API_ENDPOINTS.ADMIN_GET_USER.replace(':id', id));
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post(API_ENDPOINTS.ADMIN_CREATE_USER, userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(API_ENDPOINTS.ADMIN_UPDATE_USER.replace(':id', id), userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(API_ENDPOINTS.ADMIN_DELETE_USER.replace(':id', id));
    return response.data;
  },

  getStores: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.ADMIN_GET_STORES, { params });
    return response.data;
  },

  getStoreById: async (id) => {
    const response = await api.get(API_ENDPOINTS.ADMIN_GET_STORE.replace(':id', id));
    return response.data;
  },
};
