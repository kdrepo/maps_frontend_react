import { useAuth } from "../hooks/useAuth";
import { ArrowLeft, Bell, Lock, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // Only redirect if we've finished loading AND there's no user
    if (!loading && !user) {
      navigate("/");
      return;
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Only redirect if we've finished loading AND there's no user
    if (!loading && !user) {
      navigate("/");
      return;
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-orange-950 dark:via-slate-900 dark:to-slate-800 pt-6">
        <div className="mx-auto max-w-2xl px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 rounded-lg bg-orange-200 dark:bg-orange-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 pb-16 text-orange-900 dark:from-orange-950 dark:via-slate-900 dark:to-slate-800 dark:text-orange-100">
      <header className="mx-auto flex max-w-2xl items-center gap-4 px-6 pt-12">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 rounded-full border border-orange-300 px-4 py-2 text-sm font-medium text-orange-700 transition hover:bg-orange-100 dark:border-orange-600 dark:text-orange-300 dark:hover:bg-orange-900/30"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-2xl font-semibold text-orange-900 dark:text-orange-200">
          Settings
        </h1>
      </header>

      <main className="mx-auto mt-8 max-w-2xl px-6 space-y-6">
        {/* Notifications Settings */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center gap-3 pb-6 border-b border-orange-200 dark:border-orange-800">
            <Bell className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h2 className="text-lg font-semibold text-orange-900 dark:text-orange-200">
              Notifications
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            {/* Email Notifications Toggle */}
            <label className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition hover:bg-orange-50 dark:hover:bg-orange-900/30">
              <div>
                <p className="font-medium text-orange-900 dark:text-orange-100">
                  Email Notifications
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Receive email updates about incidents
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="h-5 w-5 rounded border-orange-300 accent-orange-600"
              />
            </label>

            {/* Push Notifications Toggle */}
            <label className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition hover:bg-orange-50 dark:hover:bg-orange-900/30">
              <div>
                <p className="font-medium text-orange-900 dark:text-orange-100">
                  Push Notifications
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Receive browser notifications
                </p>
              </div>
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="h-5 w-5 rounded border-orange-300 accent-orange-600"
              />
            </label>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center gap-3 pb-6 border-b border-orange-200 dark:border-orange-800">
            <Lock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h2 className="text-lg font-semibold text-orange-900 dark:text-orange-200">
              Privacy & Security
            </h2>
          </div>

          <div className="mt-6 space-y-3">
            <button className="w-full rounded-lg bg-orange-100 px-4 py-3 text-left font-medium text-orange-900 transition hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-100 dark:hover:bg-orange-900/50">
              Change Password
            </button>
            <button className="w-full rounded-lg bg-orange-100 px-4 py-3 text-left font-medium text-orange-900 transition hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-100 dark:hover:bg-orange-900/50">
              Two-Factor Authentication
            </button>
            <button className="w-full flex items-center justify-between rounded-lg bg-orange-100 px-4 py-3 font-medium text-orange-900 transition hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-100 dark:hover:bg-orange-900/50">
              <span>Active Sessions</span>
              <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                1
              </span>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-panel rounded-2xl border border-red-300 p-6 dark:border-red-900">
          <div className="flex items-center gap-3 pb-6 border-b border-red-200 dark:border-red-900">
            <Eye className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h2 className="text-lg font-semibold text-red-900 dark:text-red-100">
              Danger Zone
            </h2>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full rounded-lg border border-red-300 px-4 py-3 font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              {loggingOut ? "Logging out..." : "Log Out"}
            </button>
            <button
              disabled
              className="w-full rounded-lg border border-red-400 px-4 py-3 font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 cursor-not-allowed"
              title="Contact support to delete your account"
            >
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
