// src/pages/SensorData.jsx
import { useEffect, useState } from "react";
import BarChart    from "../components/BarChart";
import SensorTable from "../components/SensorTable";
import { apiGet }  from "../api";
import { CHART_DATA } from "../data/mockData";

// Map API SensorData + DrainageLocation into the shape SensorTable expects
function mapToTableRow(reading, locations) {
  const loc = locations.find((l) => l.id === reading.location);
  const waterLevel = Math.round(reading.water_level ?? 0);
  const status =
    reading.blockage_detected    ? "critical" :
    waterLevel > 85              ? "critical" :
    waterLevel > 65              ? "warning"  : "ok";

  return {
    id:         `SN-${String(reading.id).padStart(3, "0")}`,
    location:   loc?.name ?? `Location ${reading.location}`,
    waterLevel,
    waste:      Math.round(reading.turbidity ?? 0),
    status,
    lastPing:   new Date(reading.timestamp).toLocaleTimeString(),
    temp:       reading.temperature != null ? `${reading.temperature}°C` : "--",
    _raw:       reading,
  };
}

export default function SensorData() {
  const [sensors,      setSensors]      = useState([]);
  const [locations,    setLocations]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sensorStates, setSensorStates] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sensorRes, locationRes] = await Promise.all([
          apiGet("/sensor-data/"),
          apiGet("/locations/"),
        ]);
        setLocations(locationRes);
        const mapped = sensorRes.map((r) => mapToTableRow(r, locationRes));
        setSensors(mapped);
        // default all to active
        setSensorStates(Object.fromEntries(mapped.map((s) => [s.id, s.status !== "offline"])));
      } catch {
        setError("Failed to load sensor data.");
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const toggleSensor = (id) => {
    setSensorStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = sensors.filter((s) => {
    const isActive = sensorStates[s.id];
    if (filterStatus === "active")   return isActive;
    if (filterStatus === "inactive") return !isActive;
    return true;
  });

  const activeCount = Object.values(sensorStates).filter(Boolean).length;

  return (
    <>
      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card blue">
          <div className="stat-icon">📡</div>
          <div>
            <div className="stat-value">
              {loading ? "—" : activeCount}
              <span className="stat-unit"> / {sensors.length}</span>
            </div>
            <div className="stat-label">Active Sensors</div>
          </div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">🔴</div>
          <div>
            <div className="stat-value">{loading ? "—" : sensors.length - activeCount}</div>
            <div className="stat-label">Inactive / Off</div>
          </div>
        </div>
      </div>

      {/* Chart */}
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

      {/* Sensor Table */}
      <div className="card">
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="card-title">
            🔬 All Sensor Readings
            <span className="card-tag">
              {loading ? "Loading..." : `${sensors.length} records`}
            </span>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            {["all", "active", "inactive"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                style={{
                  padding: "4px 12px", borderRadius: 6,
                  border: "1px solid #334155",
                  background: filterStatus === f ? "#3b82f6" : "#1e293b",
                  color: "#fff", cursor: "pointer", fontSize: 12,
                  textTransform: "capitalize",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {loading && (
            <div style={{ textAlign: "center", padding: 32, color: "var(--text-light)" }}>
              Loading sensor data...
            </div>
          )}
          {!loading && error && (
            <div style={{ textAlign: "center", padding: 32, color: "var(--red)" }}>
              ❌ {error}
            </div>
          )}
          {!loading && !error && sensors.length === 0 && (
            <div style={{ textAlign: "center", padding: 32, color: "var(--text-light)" }}>
              No sensor readings found. Add data via the admin panel or API.
            </div>
          )}
          {!loading && !error && sensors.length > 0 && (
            <SensorTable
              sensors={filtered}
              sensorStates={sensorStates}
              onToggle={toggleSensor}
            />
          )}
        </div>
      </div>
    </>
  );
}
