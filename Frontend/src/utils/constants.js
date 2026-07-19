/**
 * Application-wide constants.
 */

export const USER_ROLES = {
  ADMIN: "admin",
  NORMAL_USER: "normal_user",
  STORE_OWNER: "store_owner",
};

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
