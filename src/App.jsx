import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import ProfilePage from "./components/ProfilePage";
import SettingsPage from "./components/SettingsPage";
import NearbySubmissions from "./components/NearbySubmissions";
import { useAuth } from "./hooks/useAuth";
import { authStorage, apiCall } from "./lib/api";

// const SsoHandler = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const token = params.get("token");
//     if (!token) {
//       navigate("/", { replace: true });
//       return;
//     }
//     const verify = async () => {
//       try {
//         await apiCall("/api/auth/token/verify/", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ token }),
//         });
//         authStorage.setTokens({ access: token });
//       } catch {
//         authStorage.clear();
//       } finally {
//         navigate("/", { replace: true }); //for web
//       }
//     };
//     verify();
//   }, [location.search, navigate]);

//   return null;
// };


const SsoHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    // If there's no token in the URL, go to the homepage.
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    const verifyAndLogin = async () => {
      try {
        // 1. Verify the token is valid with your backend.
        await apiCall("/api/auth/token/verify/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        // 2. If verification succeeds, store the token in local storage.
        authStorage.setTokens({ access: token });

        // 3. THE FIX: Force a full page reload to the homepage.
        // This ensures the app re-initializes, reads the new token,
        // and renders the correct authenticated state.
        window.location.replace("/");

      } catch (error) {
        console.error("SSO token verification failed:", error);
        // If verification fails, clear any old tokens and also redirect.
        authStorage.clear();
        window.location.replace("/");
      }
    };

    verifyAndLogin();
    // We only need to run this effect when the component mounts.
    // The dependencies are technically location.search and navigate, but since
    // we are doing a hard reload, it will only ever run once.
  }, [location.search, navigate]);

  // This component doesn't render anything, it just handles the redirect logic.
  return null;
};




const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, loading: authLoading, error: authError, login, logout } = useAuth();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              user={user}
              loading={authLoading}
              error={authError}
              login={login}
              logout={logout}
              isLoginOpen={isLoginOpen}
              setIsLoginOpen={setIsLoginOpen}
            />
          }
        />
        <Route path="/sso" element={<SsoHandler />} />
        <Route path="/profile/" element={<ProfilePage />} />
        <Route path="/settings/" element={<SettingsPage />} />
        <Route path="/duplicates/" element={<NearbySubmissions />} />
      </Routes>
    </Router>
  );
};

export default App;
