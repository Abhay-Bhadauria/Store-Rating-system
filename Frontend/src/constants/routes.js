export const ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAILS: '/admin/users/:id',
  ADMIN_STORES: '/admin/stores',
  ADMIN_STORE_DETAILS: '/admin/stores/:id',

  // Store Owner
  OWNER_DASHBOARD: '/owner/dashboard',
  OWNER_RATERS: '/owner/raters',

  // User
  HOME: '/',
  STORES: '/stores',
  STORE_DETAILS: '/stores/:id',
  MY_RATINGS: '/my-ratings',

  // Common
  PROFILE: '/profile',
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/403',
};
