import { useState } from "react";
import StatCard from "../components/StatCard";
import AlertList from "../components/AlertList";
import { ALERTS } from "../data/mockData";

export default function AlertsPage() {
  // Task 1: State — active filter + dismissed set
  const [filter, setFilter] = useState("all");
  const [dismissed, setDismissed] = useState(new Set());

  const dismiss = (id) => setDismissed((prev) => new Set([...prev, id]));

  const visible = ALERTS.filter((a) => {
    if (dismissed.has(a.id)) return false;
    if (filter === "all") return true;
    return a.type === filter;
  });

  const counts = {
    critical: ALERTS.filter((a) => a.type === "critical").length,
    warning:  ALERTS.filter((a) => a.type === "warning").length,
    info:     ALERTS.filter((a) => a.type === "info").length,
    resolved: ALERTS.filter((a) => a.type === "resolved").length,
  };

  const filterOptions = ["all", "critical", "warning", "info", "resolved"];
  const filterColors = { all: "#3b82f6", critical: "#ef4444", warning: "#f59e0b", info: "#3b82f6", resolved: "#22c55e" };

  return (
    <>
      <div className="stat-grid">
        <StatCard label="Critical" value={counts.critical} icon="🚨" color="red"    sub="Immediate action needed" />
        <StatCard label="Warnings" value={counts.warning}  icon="⚠️" color="yellow" sub="Needs monitoring" />
        <StatCard label="Info"     value={counts.info}     icon="ℹ️" color="blue"   sub="Informational only" />
        <StatCard label="Resolved" value={counts.resolved} icon="✅" color="green"  sub="Cleared alerts" />
      </div>

      <div className="card">
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="card-title">
            🔔 Alert History
            <span className="card-tag">
              {visible.length} shown{dismissed.size > 0 ? ` · ${dismissed.size} dismissed` : ""}
            </span>
          </div>

          
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {filterOptions.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 6,
                  border: "1px solid #334155",
                  background: filter === f ? filterColors[f] : "#1e293b",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 12,
                  textTransform: "capitalize",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="card-body">
          {visible.length === 0 ? (
            <div style={{ color: "var(--text-light)", textAlign: "center", padding: 32 }}>
              No alerts match the current filter.
            </div>
          ) : (
            <AlertList alerts={visible} onDismiss={dismiss} />
          )}
        </div>
      </div>
    </>
  );
}