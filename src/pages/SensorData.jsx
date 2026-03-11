import { useState } from "react";
import BarChart    from "../components/BarChart";
import SensorTable from "../components/SensorTable";
import { SENSORS, CHART_DATA } from "../data/mockData";

export default function SensorData() {
  // active/inactive live
  const [sensorStates, setSensorStates] = useState(
    Object.fromEntries(SENSORS.map((s) => [s.id, s.status !== "offline"]))
  );
  const [filterStatus, setFilterStatus] = useState("all");

  const toggleSensor = (id) => {
    setSensorStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeSensors = SENSORS.filter((s) => {
    const isActive = sensorStates[s.id];
    if (filterStatus === "active")   return isActive;
    if (filterStatus === "inactive") return !isActive;
    return true;
  });

  const activeCount = Object.values(sensorStates).filter(Boolean).length;

  return (
    <>
      {/* live update sensor */}
      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card blue">
          <div className="stat-icon">📡</div>
          <div>
            <div className="stat-value">{activeCount} <span className="stat-unit">/ {SENSORS.length}</span></div>
            <div className="stat-label">Active Sensors</div>
          </div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">🔴</div>
          <div>
            <div className="stat-value">{SENSORS.length - activeCount}</div>
            <div className="stat-label">Inactive / Off</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            📈 Weekly Trend Analysis
            <span className="card-tag">Water & Waste</span>
          </div>
        </div>
        <div className="card-body">
          <BarChart data={CHART_DATA} />
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="card-title">
            🔬 All Sensor Readings
            <span className="card-tag">Live</span>
          </div>
          {/* filter buttons */}
          <div style={{ display: "flex", gap: 6 }}>
            {["all", "active", "inactive"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 6,
                  border: "1px solid #334155",
                  background: filterStatus === f ? "#3b82f6" : "#1e293b",
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
        <div className="card-body" style={{ padding: 0 }}>
          <SensorTable
            sensors={activeSensors}
            sensorStates={sensorStates}
            onToggle={toggleSensor}
          />
        </div>
      </div>
    </>
  );
}