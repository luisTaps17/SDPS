import StatCard from "../components/StatCard";
import AlertList from "../components/AlertList";
import { ALERTS } from "../data/mockData";

export default function AlertsPage() {
  const counts = {
    critical: ALERTS.filter((a) => a.type === "critical").length,
    warning:  ALERTS.filter((a) => a.type === "warning").length,
    info:     ALERTS.filter((a) => a.type === "info").length,
    resolved: ALERTS.filter((a) => a.type === "resolved").length,
  };

  return (
    <>
      {/* Summary */}
      <div className="stat-grid">
        <StatCard label="Critical" value={counts.critical} icon="🚨" color="red"    sub="Immediate action needed" />
        <StatCard label="Warnings" value={counts.warning}  icon="⚠️" color="yellow" sub="Needs monitoring" />
        <StatCard label="Info"     value={counts.info}     icon="ℹ️" color="blue"   sub="Informational only" />
        <StatCard label="Resolved" value={counts.resolved} icon="✅" color="green"  sub="Cleared alerts" />
      </div>

      {/* Full Alert List */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            🔔 Alert History
            <span className="card-tag">All Alerts</span>
          </div>
        </div>
        <div className="card-body">
          <AlertList alerts={ALERTS} />
        </div>
      </div>
    </>
  );
}
