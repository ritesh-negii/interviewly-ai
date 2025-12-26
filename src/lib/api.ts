// src/lib/api.ts
type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  // ✅ CRITICAL: Get token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      // ✅ CRITICAL: Send Authorization header with Bearer token
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  };

  if (body && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}${endpoint}`, config);

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.message || "Request failed");
    }

    return data;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error.message || "Network error");
  }
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: "GET" }),
  
  post: <T>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, { method: "POST", body }),
  
  put: <T>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, { method: "PUT", body }),
  
  patch: <T>(endpoint: string, body?: any) =>
    apiRequest<T>(endpoint, { method: "PATCH", body }),
  
  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "DELETE" }),
};