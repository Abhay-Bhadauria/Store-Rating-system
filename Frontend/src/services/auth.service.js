import api from '@api';
import { API_ENDPOINTS } from '@constants';

export const authService = {
  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  updatePassword: async (passwordData) => {
    const response = await api.patch(API_ENDPOINTS.UPDATE_PASSWORD, passwordData);
    return response.data;
  },
};
