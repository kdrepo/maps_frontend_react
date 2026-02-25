import { useCallback, useEffect, useState } from "react";
import { authStorage, login as apiLogin, verifyOtp as apiVerifyOtp, apiCall, logout as apiLogout } from "../lib/api";

const USER_KEY = "user_data";

const loadUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

const saveUser = (user) => {
  if (!user) {
    localStorage.removeItem(USER_KEY);
    return;
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const useAuth = () => {
  const [user, setUser] = useState(loadUser());
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await apiCall("api/api/auth/status/");
      setUser(userData);
      saveUser(userData);
    } catch (err) {
      // This can happen if the token is invalid
      authStorage.clear();
      setUser(null);
      saveUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const boot = async () => {
      const access = authStorage.getAccess();
      if (access) {
        await fetchUser(); // Fetch user if token exists
      } else {
        setLoading(false); // No token, not loading
      }
    };
    boot();
  }, [fetchUser]);

  const ssoLogin = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      // Directly set the token received from SSO
      authStorage.setTokens({ access: token });
      // Fetch user data using the new token
      await fetchUser();
    } catch (err) {
      setError(err.message);
      authStorage.clear();
      setUser(null);
      saveUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUser]);

  const login = useCallback(async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      await apiLogin(identifier, password);
      await fetchUser();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUser]);

  const verifyOtp = useCallback(async (phone, otp) => {
    setLoading(true);
    setError(null);
    try {
      await apiVerifyOtp(phone, otp);
      await fetchUser();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUser]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      apiLogout(); // Clears tokens from storage
      setUser(null);
      saveUser(null);
      // For React Native WebView integration
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage('logout');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    ssoLogin,
    logout,
    verifyOtp,
    isAuthenticated: !!user,
  };
};
