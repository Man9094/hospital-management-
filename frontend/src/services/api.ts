/**
 * MedCore HMS Centralized API Client
 * Provides typed, credentials-enabled requests to the separated Express/MongoDB backend.
 */

export const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim()) {
    const clean = envUrl.trim().replace(/\/+$/, "");
    return clean.endsWith("/api") ? clean : `${clean}/api`;
  }
  // In development fallback to localhost:5000 if not specified in env
  if (process.env.NODE_ENV === "development") {
    return typeof window !== "undefined" ? "/api" : "http://localhost:5000/api";
  }
  // In production, fallback to relative /api
  return "/api";
};

export const API_BASE_URL = getApiBaseUrl();

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export function buildApiUrl(endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  const base = getApiBaseUrl().replace(/\/+$/, "");
  const path = endpoint.replace(/^\/?api\/?/, "").replace(/^\/+/, "");
  return path ? `${base}/${path}` : base;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, ...restOptions } = options;

  let url = buildApiUrl(endpoint);

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  // Include Bearer token from localStorage as fallback for cross-domain deployments
  const authHeaders: Record<string, string> = {};
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("medcore-auth-token");
    if (token) {
      authHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...headers,
    },
    ...restOptions,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `HTTP error ${response.status}`;
    const error = new Error(errorMsg);
    (error as any).status = response.status;
    (error as any).data = data;
    throw error;
  }

  return data;
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { method: "GET", ...options }),
  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
  patch: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiClient<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),
  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { method: "DELETE", ...options }),
};

export default api;
