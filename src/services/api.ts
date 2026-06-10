import axios, { AxiosError, isAxiosError } from "axios";
import { EnvConfig } from "../config/env.config";

const API_TIMEOUT_MS = 60_000;
const AUTH_STORAGE_KEY = "gastroplan_auth";

function getStoredAccessToken(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { accessToken?: unknown };
    return typeof parsed.accessToken === "string" ? parsed.accessToken : null;
  } catch {
    return null;
  }
}

const createApiInstance = (baseURL?: string | null) => {
  const axiosInstance = axios.create({
    baseURL: baseURL || undefined,
    timeout: API_TIMEOUT_MS,
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      const token = getStoredAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log("🚀 Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
      return config;
    },
    (error: AxiosError) => {
      console.error("❌ Request Error:", error);
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      console.log("✅ Response Success:", {
        status: response.status,
        data: response.data,
      });
      return response;
    },
    async (error: AxiosError) => {
      console.error("❌ Response Error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });

      if (!error.response) {
        error.message =
          "Erro de conexão - verifique se o servidor está rodando";
      }

      return Promise.reject(error);
    },
  );

  return axiosInstance;
};

export const apiInventory = () => createApiInstance(EnvConfig.BASE_URL_API);
export const apiUsers = () => createApiInstance(EnvConfig.BASE_URL_API);
export const apiAulas = () => createApiInstance(EnvConfig.BASE_URL_API);
export const apiAuth = () => createApiInstance(EnvConfig.BASE_URL_API);

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const data = error.response?.data as { message?: string } | undefined;
  return data?.message ?? error.message ?? fallback;
}
