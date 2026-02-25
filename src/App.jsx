import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import ProfilePage from "./components/ProfilePage";
import SettingsPage from "./components/SettingsPage";
import NearbySubmissions from "./components/NearbySubmissions";
import { useAuth } from "./hooks/useAuth";
import SSOLandingPage from "./components/SSOLandingPage";

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
        <Route path="/sso" element={<SSOLandingPage />} />
        <Route path="/profile/" element={<ProfilePage />} />
        <Route path="/settings/" element={<SettingsPage />} />
        <Route path="/duplicates/" element={<NearbySubmissions />} />
      </Routes>
    </Router>
  );
};

export default App;
