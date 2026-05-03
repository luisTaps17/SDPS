// src/pages/AlertsPage.jsx
import { useEffect, useState } from "react";
import StatCard  from "../components/StatCard";
import AlertList from "../components/AlertList";
import { apiGet, apiPost } from "../api";

export default function AlertsPage({ onCritCountChange }) {
  const [alerts,    setAlerts]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [filter,    setFilter]    = useState("all");
  const [toast,     setToast]     = useState("");

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await apiGet("/alerts/");
      setAlerts(data);
      // Update sidebar badge count
      const critCount = data.filter((a) => !a.is_resolved && a.severity === "critical").length;
      if (onCritCountChange) onCritCountChange(critCount);
    } catch {
      setError("Failed to load alerts. Is the server running?");
    }
    setLoading(false);
  };

  useEffect(() => { loadAlerts(); }, []);

  // Resolve alert via API (replaces local dismiss)
  const handleDismiss = async (id) => {
    try {
      await apiPost(`/alerts/${id}/resolve/`, {});
      showToast("✅ Alert resolved successfully.");
      loadAlerts(); // refresh
    } catch {
      showToast("❌ Failed to resolve alert.");
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  // Filter logic using API fields
  const filterOptions = ["all", "flood", "blockage", "sensor_fault", "maintenance"];
  const filterColors  = {
    all:          "#3b82f6",
    flood:        "#ef4444",
    blockage:     "#f59e0b",
    sensor_fault: "#8b5cf6",
    maintenance:  "#22c55e",
  };

  const visible = alerts.filter((a) => {
    if (filter === "all") return true;
    return a.alert_type === filter;
  });

  // Stats using API fields
  const counts = {
    critical:  alerts.filter((a) => a.severity === "critical" && !a.is_resolved).length,
    unresolved: alerts.filter((a) => !a.is_resolved).length,
    resolved:  alerts.filter((a) => a.is_resolved).length,
    total:     alerts.length,
  };

  return (
    <>
      {/* Stat Cards */}
      <div className="stat-grid">
        <StatCard label="Critical"   value={counts.critical}   icon="🚨" color="red"    sub="Immediate action needed" />
        <StatCard label="Unresolved" value={counts.unresolved} icon="⚠️" color="yellow" sub="Needs attention" />
        <StatCard label="Resolved"   value={counts.resolved}   icon="✅" color="green"  sub="Cleared alerts" />
        <StatCard label="Total"      value={counts.total}      icon="🔔" color="blue"   sub="All time" />
      </div>

      <div className="card">
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="card-title">
            🔔 Alert History
            <span className="card-tag">
              {loading ? "Loading..." : `${visible.length} shown`}
            </span>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {/* Refresh button */}
            <button
              onClick={loadAlerts}
              style={{
                padding: "4px 12px", borderRadius: 6,
                border: "1px solid #334155", background: "#1e293b",
                color: "#fff", cursor: "pointer", fontSize: 12,
              }}
            >
              🔄 Refresh
            </button>

            {/* Filter buttons */}
            {filterOptions.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "4px 12px", borderRadius: 6,
                  border: "1px solid #334155",
                  background: filter === f ? filterColors[f] : "#1e293b",
                  color: "#fff", cursor: "pointer", fontSize: 12,
                  textTransform: "capitalize",
                }}
              >
                {f.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="card-body">
          {loading && (
            <div style={{ color: "var(--text-light)", textAlign: "center", padding: 32 }}>
              Loading alerts...
            </div>
          )}

          {!loading && error && (
            <div style={{ color: "var(--red)", textAlign: "center", padding: 32 }}>
              ❌ {error}
            </div>
          )}

          {!loading && !error && visible.length === 0 && (
            <div style={{ color: "var(--text-light)", textAlign: "center", padding: 32 }}>
              No alerts match the current filter.
            </div>
          )}

          {!loading && !error && visible.length > 0 && (
            <AlertList alerts={visible} onDismiss={handleDismiss} />
          )}
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
