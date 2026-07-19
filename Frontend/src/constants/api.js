export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  UPDATE_PASSWORD: '/auth/password',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',

  ADMIN_CREATE_USER: '/admin/users',
  ADMIN_GET_USERS: '/admin/users',
  ADMIN_GET_USER: '/admin/users/:id',
  ADMIN_UPDATE_USER: '/admin/users/:id',    // ✅ Add this
  ADMIN_DELETE_USER: '/admin/users/:id',    // ✅ Add this

  ADMIN_CREATE_STORE: '/admin/stores',
  ADMIN_GET_STORES: '/admin/stores',
  ADMIN_GET_STORE: '/admin/stores/:id',
  ADMIN_UPDATE_STORE: '/admin/stores/:id',  // ✅ Add this (for later)
  ADMIN_DELETE_STORE: '/admin/stores/:id',  // ✅ Add this (for later)

  // Store Owner
  OWNER_DASHBOARD: '/store-owner/dashboard',
  OWNER_GET_RATERS: '/store-owner/raters',

  // Stores
  GET_STORES: '/stores',
  GET_STORE: '/stores/:id',

  // Ratings
  SUBMIT_RATING: '/ratings',
  UPDATE_RATING: '/ratings/:id',
};