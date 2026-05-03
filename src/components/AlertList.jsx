// src/components/AlertList.jsx
const ICONS = {
  // original types
  critical: "🚨",
  warning:  "⚠️",
  info:     "ℹ️",
  resolved: "✅",
  // SDPS API alert_type values
  flood:        "🌊",
  blockage:     "🚧",
  sensor_fault: "⚙️",
  maintenance:  "🔧",
};

export default function AlertList({ alerts, onDismiss }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-light)", fontSize: 13 }}>
        ✓ No active alerts
      </div>
    );
  }

  return (
    <div className="alert-list">
      {alerts.map((a) => {
        // Support both mock data fields and API fields
        const type     = a.type      ?? a.alert_type;
        const title    = a.title     ?? a.alert_type?.replace(/_/g, " ").toUpperCase();
        const desc     = a.desc      ?? a.message;
        const location = a.location  ?? a.location_name ?? "Unknown Location";
        const time     = a.time      ?? new Date(a.created_at).toLocaleString();
        const resolved = a.type === "resolved" || a.is_resolved === true;

        return (
          <div key={a.id} className={`alert-item ${type}`}>
            <div className="alert-icon">{ICONS[type] ?? "🔔"}</div>

            <div className="alert-body">
              <div className="alert-title">{title}</div>
              <div className="alert-desc">{desc}</div>
              <div className="alert-meta">{location} · {time}</div>
            </div>

            <div className="alert-right">
              <span className={`type-badge badge-${type}`}>{type}</span>
              {!resolved && onDismiss && (
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn-ack">Acknowledge</button>
                  <button
                    className="btn-dismiss"
                    onClick={() => onDismiss(a.id)}
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
