export const API_BACKEND_URL = "https://gastroplan-api.onrender.com";

export const EnvConfig = {
  BASE_URL_API: import.meta.env.VITE_BASE_URL_API?.trim() || "/api",
  PRIMARY_COLOR: import.meta.env.VITE_PRIMARY_COLOR ?? "#165dfc",
  SECONDARY_COLOR: import.meta.env.VITE_SECONDARY_COLOR ?? "#eff6ff",
  APP_NAME: import.meta.env.VITE_APP_NAME ?? "GastroPlan",
};
