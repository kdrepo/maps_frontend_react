# CSRF/CORS Configuration Fix

## The Problem

You're getting: `CSRF Failed: Origin checking failed - http://localhost:5173 does not match any trusted origins`

This happens because Django's CSRF protection doesn't recognize your frontend's origin, even though CORS is configured.

## The Solution

Update your Django `settings.py`:

```python
# CSRF Configuration - ADD THIS
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True

# Session Configuration
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_HTTPONLY = False
SESSION_COOKIE_SECURE = False  # Set to True with HTTPS in production

# Middleware order matters!
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # MUST be first
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',  # CSRF middleware
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Optional: For development, you can disable CSRF for API endpoints
CSRF_EXEMPT_PATHS = ['/api/auth/login/', '/api/auth/send-otp/']  # If using custom middleware
```

## Alternative: Disable CSRF for API (Development Only)

If you want to use CSRF tokens (recommended for production), follow the CSRF Token approach below.

For quick development testing, you can disable CSRF on specific endpoints:

```python
# settings.py
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

Then in your auth views:

```python
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt  # Only for development!
@require_http_methods(["POST"])
def login(request):
    # your login logic
    pass
```

⚠️ **WARNING**: `@csrf_exempt` is NOT safe for production!

## Recommended: Use CSRF Tokens (Production Safe)

### Step 1: Get CSRF Token from Backend

Add this endpoint to your backend:

```python
# views.py
from django.http import JsonResponse
from django.middleware.csrf import get_token

def get_csrf_token(request):
    """Return CSRF token for forms"""
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

# urls.py
urlpatterns = [
    path('api/auth/csrf/', get_csrf_token, name='csrf_token'),
    ...
]
```

### Step 2: Update Frontend to Fetch & Send CSRF Token

Update your `useAuth.js`:

```javascript
import { useState, useCallback, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

let cachedCsrfToken = null;

// Get CSRF token from backend
const getCsrfToken = async () => {
  if (cachedCsrfToken) return cachedCsrfToken;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/csrf/`, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      cachedCsrfToken = data.csrfToken;
      return cachedCsrfToken;
    }
  } catch (error) {
    console.error("Failed to get CSRF token:", error);
  }

  return null;
};

// Helper function to make API calls with proper error handling
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get CSRF token for POST/PUT/DELETE requests
  let csrfToken = null;
  if (["POST", "PUT", "DELETE", "PATCH"].includes(options.method?.toUpperCase())) {
    csrfToken = await getCsrfToken();
  }
  
  const defaultOptions = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Add CSRF token if available
  if (csrfToken) {
    finalOptions.headers["X-CSRFToken"] = csrfToken;
  }

  try {
    console.log(`[API] ${finalOptions.method || "GET"} ${endpoint}`);
    
    const response = await fetch(url, finalOptions);
    
    console.log(`[API] Response status: ${response.status}`);

    let data = null;
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } catch (parseError) {
      console.error(`[API] Failed to parse response:`, parseError);
      data = null;
    }

    if (!response.ok) {
      const errorMessage = 
        data?.detail || 
        data?.error || 
        data?.message || 
        `HTTP Error: ${response.status}`;
      
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

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Pre-fetch CSRF token on mount
    getCsrfToken();

    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const data = await apiCall("/api/auth/status/", {
          method: "GET",
        });

        if (data && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.log("Not logged in or auth check failed:", err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = useCallback(async (identifier, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall("/api/auth/login/", {
        method: "POST",
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      setUser({
        id: data.user_id,
        identifier,
      });

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await apiCall("/api/auth/logout/", {
        method: "POST",
      });

      setUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name, phone, email, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall("/api/auth/send-otp/", {
        method: "POST",
        body: JSON.stringify({
          name,
          phone,
          email,
          password,
        }),
      });

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (phone, otp) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall("/api/auth/verify-otp/", {
        method: "POST",
        body: JSON.stringify({
          phone,
          otp,
        }),
      });

      setUser({
        id: data.user_id,
        phone,
      });

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
    signup,
    verifyOtp,
    isAuthenticated: !!user,
  };
};
```

## Which Approach to Use?

| Approach | Security | Difficulty | When to Use |
|----------|----------|-----------|------------|
| `@csrf_exempt` | ❌ Low | ✅ Easy | Development only, testing |
| `CSRF_TRUSTED_ORIGINS` + Manual Token | ✅ Good | 🟡 Medium | **Recommended for production** |
| `CSRF_TRUSTED_ORIGINS` only | 🟡 Medium | ✅ Easy | Development/trusted networks |

## Quick Fix for Immediate Testing

If you just want to get it working now:

```python
# settings.py
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CSRF_COOKIE_SECURE = False
CSRF_COOKIE_HTTPONLY = False
```

Then use **CSRF token approach** from frontend (see code above).

## Verify CSRF Token is Being Sent

1. Open DevTools (F12) → Network tab
2. Look for POST request to `/api/auth/login/`
3. Go to "Request Headers"
4. Verify `X-CSRFToken` header is present with a token value

If not present → CSRF token not being fetched or sent properly.
