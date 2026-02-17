import { useState } from "react";
import "./styles/global.css";

import LoginPage      from "./pages/LoginPage";
import Dashboard      from "./pages/Dashboard";
import SensorData     from "./pages/SensorData";
import AlertsPage     from "./pages/AlertsPage";
import ThresholdConfig from "./pages/ThresholdConfig";

import Sidebar from "./components/Sidebar";
import Topbar  from "./components/Topbar";

import { ALERTS } from "./data/mockData";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage]         = useState("dashboard");

  const critCount = ALERTS.filter((a) => a.type === "critical").length;

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="app-layout">
      <Sidebar
        page={page}
        setPage={setPage}
        alertCount={critCount}
      />

      <div className="main-wrapper">
        <Topbar
          page={page}
          onLogout={() => { setLoggedIn(false); setPage("dashboard"); }}
        />

        <main className="page-content">
          {page === "dashboard" && <Dashboard />}
          {page === "sensors"   && <SensorData />}
          {page === "alerts"    && <AlertsPage />}
          {page === "threshold" && <ThresholdConfig />}
        </main>
      </div>
    </div>
  );
}
