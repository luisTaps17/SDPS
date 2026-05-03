// src/App.jsx
import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import "./styles/global.css";

import LoginPage       from "./pages/LoginPage";
import Dashboard       from "./pages/Dashboard";
import SensorData      from "./pages/SensorData";
import AlertsPage      from "./pages/AlertsPage";
import ThresholdConfig from "./pages/ThresholdConfig";
import SettingsPage    from "./pages/SettingsPage";

import Sidebar from "./components/Sidebar";
import Topbar  from "./components/Topbar";

export default function App() {
  // Check localStorage for existing token on load
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState({
    name:  localStorage.getItem("username") || "Admin",
    email: "admin@sdps.local",
  });
  const [systemStatus, setSystemStatus] = useState("online");
  const [critCount, setCritCount] = useState(0); // updated by AlertsPage

  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogin = (info) => {
    if (info) setUserInfo(info);
    setLoggedIn(true);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setLoggedIn(false);
    navigate("/");
  };

  if (!loggedIn) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
      </Routes>
    );
  }

  const currentPage = location.pathname.replace("/", "") || "dashboard";

  return (
    <div className="app-layout">
      <Sidebar
        page={currentPage}
        alertCount={critCount}
        systemStatus={systemStatus}
      />

      <div className="main-wrapper">
        <Topbar
          page={currentPage}
          userInfo={userInfo}
          systemStatus={systemStatus}
          onLogout={handleLogout}
        />

        <main className="page-content">
          <Routes>
            <Route path="/"          element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sensors"   element={<SensorData />} />
            <Route path="/alerts"    element={<AlertsPage onCritCountChange={setCritCount} />} />
            <Route path="/threshold" element={<ThresholdConfig />} />
            <Route path="/settings"  element={
              <SettingsPage
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                systemStatus={systemStatus}
                setSystemStatus={setSystemStatus}
              />
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
