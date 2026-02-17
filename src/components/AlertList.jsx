import { useState } from "react";

const ICONS = {
  critical: "🚨",
  warning:  "⚠️",
  info:     "ℹ️",
  resolved: "✅",
};

export default function AlertList({ alerts }) {
  const [dismissed, setDismissed] = useState([]);

  const visible = alerts.filter((a) => !dismissed.includes(a.id));

  if (visible.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-light)", fontSize: 13 }}>
        ✓ No active alerts
      </div>
    );
  }

  return (
    <div className="alert-list">
      {visible.map((a) => (
        <div key={a.id} className={`alert-item ${a.type}`}>
          <div className="alert-icon">{ICONS[a.type]}</div>

          <div className="alert-body">
            <div className="alert-title">{a.title}</div>
            <div className="alert-desc">{a.desc}</div>
            <div className="alert-meta">{a.location} · {a.time}</div>
          </div>

          <div className="alert-right">
            <span className={`type-badge badge-${a.type}`}>{a.type}</span>
            {a.type !== "resolved" && (
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn-ack">Acknowledge</button>
                <button
                  className="btn-dismiss"
                  onClick={() => setDismissed((d) => [...d, a.id])}
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
