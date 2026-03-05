import { NavLink } from "react-router-dom";

export default function Sidebar({ alertCount, systemStatus }) {
  const navItems = [
    { to: "/dashboard", label: "Dashboard",   icon: "📊" },
    { to: "/sensors",   label: "Sensor Data", icon: "📡" },
    { to: "/alerts",    label: "Alerts",      icon: "🔔", badge: alertCount },
    { to: "/threshold", label: "Thresholds",  icon: "⚙️" },
    { to: "/settings",  label: "Settings",    icon: "🛠️" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">💧</div>
        <div>
          <div className="sidebar-brand-name">SDPS Admin</div>
          <div className="sidebar-brand-sub">Smart Drainage System</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-label">Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <span className="nav-item-icon">{item.icon}</span>
            {item.label}
            {item.badge > 0 && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-status">
          <span className={`dot ${systemStatus === "maintenance" ? "dot-warn" : ""}`} />
          {systemStatus === "maintenance" ? "Maintenance Mode" : "System Online"}
        </div>
        <div>6 Sensors Linked</div>
        <div style={{ marginTop: 2 }}>v2.4.1</div>
      </div>
    </aside>
  );
}