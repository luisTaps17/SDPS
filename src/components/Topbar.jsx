import { useState, useEffect } from "react";

const PAGE_TITLES = {
  dashboard: { title: "Dashboard",         crumb: "Overview" },
  sensors:   { title: "Sensor Data",       crumb: "Visualization" },
  alerts:    { title: "Alert Management",  crumb: "Warnings & History" },
  threshold: { title: "Threshold Config",  crumb: "System Settings" },
};

export default function Topbar({ page, onLogout }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { title, crumb } = PAGE_TITLES[page] || PAGE_TITLES.dashboard;

  const formatted = time.toLocaleString("en-PH", {
    weekday: "short", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-title">{title}</div>
        <div className="topbar-breadcrumb">Admin / {crumb}</div>
      </div>

      <div className="topbar-right">
        <div className="topbar-time">{formatted}</div>
        <div className="topbar-user">
          <div className="user-avatar">👤</div>
          Admin
        </div>
        <button className="btn-logout" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}
