# Login & Authentication Setup Guide

## Overview

The frontend now includes a complete authentication system with login, logout, and user profile management. The system uses session-based authentication with the backend API.

## Features Implemented

### 1. **Login Modal** (`src/components/LoginModal.jsx`)
- Beautiful modal dialog matching the orange/black theme
- Email/phone and password input fields
- Error display and validation
- Loading state during authentication

### 2. **Profile Dropdown** (`src/components/ProfileDropdown.jsx`)
- User avatar with initials
- Quick access to user profile
- Settings link
- Logout button
- Closes when clicking outside

### 3. **Authentication Hook** (`src/hooks/useAuth.js`)
- Manages user authentication state
- Handles login, logout, signup, and OTP verification
- Automatic session restoration on app load
- Error handling and loading states

## Setup Instructions

### 1. Configure Backend URL

Create or update `.env.local` in the frontend directory:

```env
VITE_API_BASE_URL=http://3.111.187.105
```

Replace `http://localhost:8000` with your actual backend URL if different.

### 2. Backend Requirements

Ensure your backend API provides these endpoints:

**Login Endpoint:**
```
POST /api/auth/login/
Headers: Content-Type: application/json
Body: {
  "identifier": "email@example.com or 9876543210",
  "password": "user_password"
}
Response: {
  "detail": "Logged in.",
  "user_id": 1
}
```

**Auth Status Check (Optional but recommended):**
```
GET /api/auth/status/
Headers: Cookie: (session cookie)
Response: {
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "email@example.com",
    "identifier": "9876543210",
    "phone": "9876543210"
  }
}
```

**Logout Endpoint:**
```
POST /api/auth/logout/
Headers: Cookie: (session cookie)
```

### 3. Session Cookies Configuration

Ensure your backend is configured for session-based authentication:

```python
# Django settings.py example
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_COOKIE_HTTPONLY = False  # Allow JS to access (or use secure tokens)
SESSION_COOKIE_SAMESITE = 'Lax'  # For cross-origin requests, use 'None' and HTTPS
SESSION_COOKIE_SECURE = False    # Set to True in production with HTTPS
CSRF_TRUSTED_ORIGINS = ['http://localhost:5173']  # Add frontend URL
```

### 4. CORS Configuration (if needed)

If frontend and backend are on different domains, configure CORS:

```python
# Django with django-cors-headers
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True
```

## Usage

### For Users

1. **Sign In**: Click the "Sign In" button in the header
2. **Enter Credentials**: 
   - Email or 10-digit phone number
   - Password (minimum 8 characters)
3. **After Login**: 
   - Profile avatar appears in header
   - Click avatar to see profile menu
   - Access "My Profile", "Settings", or "Log Out"

### For Developers

#### Using the useAuth Hook

```jsx
import { useAuth } from "./hooks/useAuth";

function MyComponent() {
  const { user, loading, error, login, logout, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await login("user@example.com", "password");
      // User is now logged in
    } catch (err) {
      console.error("Login failed:", err.message);
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </>
  );
}
```

## File Structure

```
src/
├── components/
│   ├── LoginModal.jsx           # Login form modal
│   ├── ProfileDropdown.jsx      # User profile menu
├── hooks/
│   └── useAuth.js              # Authentication state management
└── App.jsx                      # Integrated with login/profile UI
```

## Customization

### Styling

All components use Tailwind CSS classes with the orange/black theme. To customize colors:

1. Edit color classes in components (e.g., `text-orange-600` → `text-your-color`)
2. Or modify the CSS custom variables in `src/index.css`

### API Integration

To use different API endpoints, modify the `API_BASE_URL` in `src/hooks/useAuth.js`:

```javascript
const API_BASE_URL = "https://your-api.com";
```

Or use the environment variable:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://3.111.187.105";
```

## Testing

### Local Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Ensure backend is running on `http://localhost:8000`

3. Click "Sign In" in the header

4. Test with valid credentials

### Test Credentials (if available from backend)
- Email: `test@example.com`
- Phone: `9876543210`
- Password: `Test@123`

## Troubleshooting

### "Failed to fetch" Error (Even with 200 Status)

This is a **CORS (Cross-Origin Resource Sharing)** issue. The browser is blocking the response from your backend.

#### Solution: Configure your Django backend

Add these settings to your Django `settings.py`:

```python
# Install django-cors-headers first: pip install django-cors-headers

INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this at the top
    'django.middleware.common.CommonMiddleware',
    ...
]

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",   # For local development
    "http://localhost:3000",   # Alternative port
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True  # Allow cookies to be sent

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Session settings for cross-origin
SESSION_COOKIE_SAMESITE = 'Lax'  # Important for credentials: 'include'
SESSION_COOKIE_HTTPONLY = False  # Allow JS to access session
SESSION_COOKIE_SECURE = False    # Set to True with HTTPS in production
```

#### Verify CORS Headers in Response

Open browser DevTools (F12) and check the Network tab:

1. Click on a failed API request
2. Go to "Response Headers" tab
3. Look for these headers:
   - `Access-Control-Allow-Origin: http://localhost:5173`
   - `Access-Control-Allow-Credentials: true`
   - `Access-Control-Allow-Methods: POST, GET, OPTIONS`

If these are missing, CORS is not configured.

#### For Production (HTTPS)

```python
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
]

SESSION_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = 'Strict'  # or 'Lax'
```

### No Credentials in Requests

Make sure your fetch requests include credentials:

```javascript
fetch(url, {
  credentials: "include",  // This is critical for cookies
  headers: {
    "Content-Type": "application/json",
  },
})
```

This is already configured in the updated `useAuth.js`.

### Check Browser Console

Open DevTools → Console tab and look for:
- `[API]` logs showing the request/response
- Detailed error messages

### Session Cookie Not Being Set

1. Check if login response includes `Set-Cookie` header
2. Verify `CORS_ALLOW_CREDENTIALS = True`
3. Check if `SessionMiddleware` is in `MIDDLEWARE`
4. Ensure `django.contrib.sessions` is in `INSTALLED_APPS`

### Login Button Not Appearing
- Check if `useAuth` hook is imported in App.jsx
- Verify environment variables are loaded (check browser console)

### Session Not Persisting
- Check if cookies are being saved (DevTools → Application → Cookies)
- Verify `SESSION_COOKIE_HTTPONLY = False` if needed for JS
- Check `SESSION_COOKIE_SAMESITE` setting for cross-origin

### User Data Not Loading
- Implement `/api/auth/status/` endpoint on backend
- Or fetch user data from `/profile/` endpoint after login
- Update `useAuth` hook to call the correct endpoint

## Security Notes

⚠️ **Important for Production:**

1. **HTTPS Only**: Use HTTPS in production
2. **Secure Cookies**: Set `SESSION_COOKIE_SECURE = True`
3. **SameSite**: Use `SESSION_COOKIE_SAMESITE = 'Strict'` or `'Lax'`
4. **CSRF Protection**: Ensure CSRF tokens are properly handled
5. **Password Validation**: Enforce strong password requirements on backend
6. **Rate Limiting**: Implement rate limiting on login attempts
7. **2FA**: Consider implementing two-factor authentication

## Next Steps

- [ ] Implement signup/OTP verification flow
- [ ] Add "Forgot Password" functionality
- [ ] Add email verification for new registrations
- [ ] Implement refresh token rotation
- [ ] Add user preference storage
- [ ] Create protected routes for authenticated users
