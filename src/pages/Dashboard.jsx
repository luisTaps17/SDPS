import StatCard    from "../components/StatCard";
import BarChart    from "../components/BarChart";
import WaterGauges from "../components/WaterGauges";
import AlertList   from "../components/AlertList";
import { ALERTS, CHART_DATA, GAUGES } from "../data/mockData";

export default function Dashboard() {
  const critCount = ALERTS.filter((a) => a.type === "critical").length;
  const warnCount = ALERTS.filter((a) => a.type === "warning").length;

  return (
    <>
      {/* Stat Cards */}
      <div className="stat-grid">
        <StatCard label="Active Sensors"  value="5" unit="/6" icon="📡" color="blue"   sub="1 sensor offline" />
        <StatCard label="Critical Alerts" value={critCount}   icon="🚨" color="red"    sub="Requires immediate action" />
        <StatCard label="Warnings"        value={warnCount}   icon="⚠️" color="yellow" sub="Monitor closely" />
        <StatCard label="Sensors OK"      value="3"           icon="✅" color="green"  sub="Operating normally" />
      </div>

      {/* Charts Row */}
      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              📈 Weekly Sensor Readings
              <span className="card-tag">7-Day</span>
            </div>
          </div>
          <div className="card-body">
            <BarChart data={CHART_DATA} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              💧 Live Water Levels
              <span className="card-tag">Real-Time</span>
            </div>
          </div>
          <div className="card-body">
            <WaterGauges gauges={GAUGES} />
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            🔔 Recent Alerts
            <span className="card-tag">Latest 4</span>
          </div>
        </div>
        <div className="card-body">
          <AlertList alerts={ALERTS.slice(0, 4)} />
        </div>
      </div>
    </>
  );
}
