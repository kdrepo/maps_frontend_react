import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, LogOut, Settings } from "lucide-react";

const ProfileDropdown = ({ user, onLogout, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await onLogout();
    setIsOpen(false);
  };

  if (!user) return null;

  // Extract name or use identifier
  const displayName = user.name || user.identifier || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center rounded-full border border-orange-300 bg-orange-50 p-2.5 transition hover:bg-orange-100 dark:border-orange-600 dark:bg-orange-900/30 dark:hover:bg-orange-900/50"
        title="Profile menu"
      >
        <User className="h-5 w-5 text-orange-700 dark:text-orange-300" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-2xl border border-orange-200 bg-white shadow-xl dark:border-orange-800 dark:bg-orange-950">
          <div className="border-b border-orange-200 px-4 py-3 dark:border-orange-800">
            <p className="text-sm font-semibold text-orange-900 dark:text-orange-200">
              {displayName}
            </p>
            <p className="text-xs text-orange-700 dark:text-orange-100">
              {user.identifier || user.phone || user.email}
            </p>
          </div>

          <div className="space-y-1 p-2">
            <Link
              to="/profile/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-orange-900 transition hover:bg-orange-100 dark:text-orange-200 dark:hover:bg-orange-900/40"
            >
              <User className="h-4 w-4" />
              My Profile
            </Link>

            <Link
              to="/settings/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-orange-900 transition hover:bg-orange-100 dark:text-orange-200 dark:hover:bg-orange-900/40"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>

            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-100 disabled:opacity-50 dark:text-orange-400 dark:hover:bg-orange-900/40"
            >
              <LogOut className="h-4 w-4" />
              {loading ? "Logging out..." : "Log Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
