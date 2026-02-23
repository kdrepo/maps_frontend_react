const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export const authStorage = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  setTokens: ({ access, refresh }) => {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

/**
 * Build full API URL
 */
export const buildApiUrl = (pathOrUrl) => {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  return `${API_BASE}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
};

const withAuth = (options = {}) => {
  const access = authStorage.getAccess();
  if (!access) return options;
  return {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${access}`,
    },
  };
};

/**
 * Make an authenticated API request (JWT + optional session)
 */
export const apiCall = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  const method = options.method?.toUpperCase() || "GET";

  const defaultOptions = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  };

  let finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  finalOptions = withAuth(finalOptions);

  try {
    console.log(`[API] ${method} ${endpoint}`);
    let response = await fetch(url, finalOptions);

    console.log(`[API] Response status: ${response.status}`);

    if (response.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) {
        finalOptions = withAuth(finalOptions);
        response = await fetch(url, finalOptions);
      }
    }

    // Handle response
    let data = null;
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } catch (parseErr) {
      console.error(`[API] Failed to parse response:`, parseErr);
      data = null;
    }

    if (!response.ok) {
      const errorMessage =
        data?.detail ||
        data?.error ||
        data?.message ||
        `HTTP Error: ${response.status} ${response.statusText}`;

      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`[API] Error on ${endpoint}:`, error);

    if (error.message === "Failed to fetch") {
      throw new Error(
        "Failed to connect to server. Check CORS settings and that backend is running."
      );
    }

    throw error;
  }
};

/**
 * Fetch JSON with credentials (GET requests)
 */
export const fetchJson = async (pathOrUrl, options = {}) => {
  return apiCall(pathOrUrl, {
    method: "GET",
    ...options,
  });
};

export const login = async (identifier, password) => {
  const data = await apiCall("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
  authStorage.setTokens(data);
  return data;
};

export const verifyOtp = async (phone, otp) => {
  const data = await apiCall("/api/auth/verify-otp/", {
    method: "POST",
    body: JSON.stringify({ phone, otp }),
  });
  authStorage.setTokens(data);
  return data;
};

export const refreshToken = async () => {
  const refresh = authStorage.getRefresh();
  if (!refresh) return false;
  const res = await fetch(buildApiUrl("/api/auth/token/refresh/"), {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) {
    authStorage.clear();
    return false;
  }
  const data = await res.json();
  authStorage.setTokens(data);
  return true;
};

export const logout = () => {
  authStorage.clear();
};

/**
 * Absolutize media URLs
 */
export const absolutizeMediaUrl = (pathOrUrl) => {
  if (!pathOrUrl) return null;
  return buildApiUrl(pathOrUrl);
};
