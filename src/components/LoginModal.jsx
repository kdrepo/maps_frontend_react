import { useState } from "react";
import { X, Mail, Lock, Loader } from "lucide-react";

const LoginModal = ({ isOpen, onClose, onLogin, loading, error }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [formError, setFormError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!identifier || !password) {
      setFormError("Please fill in all fields");
      return;
    }

    try {
      await onLogin(identifier, password);
      setIdentifier("");
      setPassword("");
      onClose();
    } catch (err) {
      setFormError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass-panel relative w-full max-w-md rounded-3xl p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-orange-600 transition hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-8">
          <h2 className="font-display text-2xl font-semibold text-orange-900 dark:text-orange-200">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-orange-700 dark:text-orange-100">
            Sign in to your account to continue
          </p>
        </div>

        {(formError || error) && (
          <div className="mb-6 rounded-lg bg-orange-100 p-4 text-sm text-orange-800 dark:bg-orange-900/30 dark:text-orange-200">
            {formError || error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-orange-900 dark:text-orange-200">
              Email or Phone Number
            </label>
            <div className="relative mt-2">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-500" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@example.com or 9876543210"
                className="w-full rounded-xl border border-orange-200 bg-white py-3 pl-12 pr-4 text-orange-900 placeholder-orange-400 focus:border-orange-400 focus:outline-none dark:border-orange-800 dark:bg-orange-950 dark:text-orange-100 dark:placeholder-orange-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-900 dark:text-orange-200">
              Password
            </label>
            <div className="relative mt-2">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-orange-200 bg-white py-3 pl-12 pr-4 text-orange-900 placeholder-orange-400 focus:border-orange-400 focus:outline-none dark:border-orange-800 dark:bg-orange-950 dark:text-orange-100 dark:placeholder-orange-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 py-3 font-medium text-white transition hover:from-orange-700 hover:to-orange-600 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-orange-200 pt-6 dark:border-orange-800">
          <p className="text-center text-sm text-orange-800 dark:text-orange-100">
            Don't have an account?{" "}
            <button
              onClick={() => setShowSignup(true)}
              className="font-medium text-orange-600 transition hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
