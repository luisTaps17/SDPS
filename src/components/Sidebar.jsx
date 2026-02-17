export default function Sidebar({ page, setPage, alertCount }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard",    icon: "📊" },
    { id: "sensors",   label: "Sensor Data",  icon: "📡" },
    { id: "alerts",    label: "Alerts",       icon: "🔔", badge: alertCount },
    { id: "threshold", label: "Thresholds",   icon: "⚙️" },
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
          <div
            key={item.id}
            className={`nav-item ${page === item.id ? "active" : ""}`}
            onClick={() => setPage(item.id)}
          >
            <span className="nav-item-icon">{item.icon}</span>
            {item.label}
            {item.badge > 0 && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-status">
          <span className="dot" />
          System Online
        </div>
        <div>6 Sensors Linked</div>
        <div style={{ marginTop: 2 }}>v2.4.1</div>
      </div>
    </aside>
  );
}
