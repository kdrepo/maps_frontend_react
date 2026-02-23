# Persistent Login & CSRF Security - Frontend Implementation

## ✅ Changes Made

### 1. **API Utility Module** (`src/lib/api.js`)
Enhanced with universal CSRF and cookie handling:
- `apiCall()` - Universal API function with automatic CSRF token injection
- `getCsrfTokenFromCookie()` - Extracts CSRF token from browser cookies
- `getCookie()` - Generic cookie getter
- All requests automatically include `credentials: 'include'`
- All POST/PUT/DELETE/PATCH requests automatically add `X-CSRFToken` header

### 2. **Components Updated**

#### ProfilePage.jsx
- ✅ Now uses `apiCall()` from `/lib/api.js`
- ✅ Automatically sends cookies with profile fetch
- ✅ CSRF token handled automatically for any mutations

#### NearbySubmissions.jsx
- ✅ Now uses `apiCall()` for nearby submissions POST request
- ✅ Cookies sent with geolocation data
- ✅ CSRF token automatically injected

#### useAuth.js (Already Configured)
- ✅ All API calls have `credentials: 'include'`
- ✅ CSRF token extraction from cookies
- ✅ CSRF token added to POST/PUT/DELETE/PATCH headers
- ✅ Auth status check includes credentials

### 3. **Request Flow**

**GET Requests (e.g., fetching profile):**
```javascript
const data = await apiCall("/api/profile/", {
  method: "GET"
});
// Automatically sends:
// - credentials: 'include' (sends session cookie)
// - Content-Type: application/json
// - Accept: application/json
```

**POST Requests (e.g., checking nearby submissions):**
```javascript
const data = await apiCall("/api/submissions/nearby/", {
  method: "POST",
  body: JSON.stringify({
    client_lat: latitude,
    client_lng: longitude
  })
});
// Automatically sends:
// - credentials: 'include' (sends session cookie)
// - X-CSRFToken header (from csrftoken cookie)
// - Content-Type: application/json
```

## 🔐 Security Implementation

### CSRF Token Handling
1. **Cookie Extraction**: `getCsrfTokenFromCookie()` reads the `csrftoken` cookie set by Django
2. **Header Injection**: Token automatically added as `X-CSRFToken` header for state-changing requests
3. **Console Logging**: `[API] CSRF token added to POST /endpoint` confirms token injection

### Session Cookie Management
1. **Automatic Transmission**: `credentials: 'include'` ensures session cookie is sent with every request
2. **Backend Integration**: Django matches session cookie + CSRF token for validation
3. **Persistent Login**: User session maintained across page refreshes (via session cookie)

## 🧪 Testing Persistent Login

1. **Login** with your credentials
2. **Refresh page** (F5) - Should stay logged in
3. **Check DevTools** → Network tab:
   - Look for API requests
   - Verify `Cookie` header contains `sessionid` or your session cookie name
   - Verify POST requests have `X-CSRFToken` header
4. **Check DevTools** → Application tab → Cookies:
   - Should see `csrftoken` cookie
   - Should see `sessionid` or similar session cookie

## 📋 All Components with Credentials

| Component | Endpoint | Method | Credentials | CSRF |
|-----------|----------|--------|-------------|------|
| useAuth.js | /api/auth/login/ | POST | ✅ | ✅ |
| useAuth.js | /api/auth/logout/ | POST | ✅ | ✅ |
| useAuth.js | /api/auth/status/ | GET | ✅ | - |
| ProfilePage | /api/profile/ | GET | ✅ | - |
| NearbySubmissions | /api/submissions/nearby/ | POST | ✅ | ✅ |

## 🔄 Backend Requirements Met

✅ `credentials: 'include'` on all fetch requests  
✅ CSRF token reading from `csrftoken` cookie  
✅ `X-CSRFToken` header on all state-changing requests  
✅ `CORS_ALLOWED_ORIGINS` includes `http://localhost:5173`  
✅ `CORS_ALLOW_CREDENTIALS = True`  

## 🐛 Debugging

Console messages for debugging:
- `[API]` - API request/response info
- `[AUTH]` - Authentication status checks
- `[CSRF]` - CSRF token operations
- `[PROFILE]` - Profile page operations
- `[NEARBY]` - Nearby submissions operations

All logs timestamped and include relevant endpoint/data for troubleshooting.

## 📝 Notes

- Universal `apiCall()` function handles all common cases
- CSRF token is read fresh from cookie on each POST request (always current)
- Session cookie automatically managed by browser
- Works across domain boundaries if CORS is properly configured
- No additional setup needed - everything is automatic after these changes
