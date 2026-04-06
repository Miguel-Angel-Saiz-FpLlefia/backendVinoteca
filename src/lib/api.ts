const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://127.0.0.1:4000/api");

export const getApiBaseUrl = () => API_BASE_URL;

export const getAssetUrl = (assetPath?: string) => {
  if (!assetPath) return "";
  if (assetPath.startsWith("http://") || assetPath.startsWith("https://")) {
    return assetPath;
  }

  const rootUrl = API_BASE_URL.replace(/\/api\/?$/, "");
  return `${rootUrl}/${assetPath.replace(/^\//, "")}`;
};

export const getAuthToken = () => localStorage.getItem("token");

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const apiRequest = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const message = payload?.error || payload?.msg || response.statusText;
    throw new Error(message || "Request failed");
  }

  return payload as T;
};
