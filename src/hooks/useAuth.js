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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const boot = async () => {
      const access = authStorage.getAccess();
      if (!access) return;
      try {
        setLoading(true);
        await apiCall("/api/auth/token/verify/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: access }),
        });
      } catch {
        authStorage.clear();
        setUser(null);
        saveUser(null);
      } finally {
        setLoading(false);
      }
    };
    boot();
  }, []);

  const login = useCallback(async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiLogin(identifier, password);
      const userData = {
        id: data.user_id,
        identifier,
      };
      setUser(userData);
      saveUser(userData);
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
      const data = await apiVerifyOtp(phone, otp);
      const userData = {
        id: data.user_id,
        phone,
      };
      setUser(userData);
      saveUser(userData);
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
      apiLogout();
      setUser(null);
      saveUser(null);
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
    verifyOtp,
    isAuthenticated: !!user,
  };
};
