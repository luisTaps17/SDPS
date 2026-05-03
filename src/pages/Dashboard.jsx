// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import StatCard    from "../components/StatCard";
import BarChart    from "../components/BarChart";
import WaterGauges from "../components/WaterGauges";
import AlertList   from "../components/AlertList";
import LocationList from "../components/LocationList";
import { apiGet }  from "../api";
import { CHART_DATA } from "../data/mockData";

export default function Dashboard() {
  const [alerts,    setAlerts]    = useState([]);
  const [locations, setLocations] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [alertsData, locationsData, sensorRes] = await Promise.all([
          apiGet("/alerts/"),
          apiGet("/locations/"),
          apiGet("/sensor-data/"),
        ]);
        setAlerts(alertsData);
        setLocations(locationsData);
        setSensorData(sensorRes);
      } catch {
        setError("Failed to load dashboard data.");
      }
      setLoading(false);
    };
    loadAll();
  }, []);

  // Stats derived from API data
  const critCount     = alerts.filter((a) => !a.is_resolved && a.severity === "critical").length;
  const unresolvedCount = alerts.filter((a) => !a.is_resolved).length;
  const activeLocations = locations.filter((l) => l.status === "active").length;

  // Build gauges from locations + latest sensor data
  const gauges = locations.slice(0, 3).map((loc) => {
    const reading = sensorData.find((s) => s.location === loc.id);
    const pct = reading ? Math.round(reading.water_level) : 0;
    const status = pct > 85 ? "danger" : pct > 65 ? "warning" : "normal";
    return { location: loc.name, pct, status };
  });

  // Build chart data from sensor readings grouped by day
  const chartData = CHART_DATA; // keep mock chart for now — real chart needs time-series API

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-light)" }}>
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "var(--red)" }}>
        ❌ {error}
      </div>
    );
  }

  return (
    <>
      {/* Stat Cards */}
      <div className="stat-grid">
        <StatCard
          label="Active Locations"
          value={activeLocations}
          unit={`/${locations.length}`}
          icon="📍"
          color="blue"
          sub={`${locations.length - activeLocations} inactive`}
        />
        <StatCard
          label="Critical Alerts"
          value={critCount}
          icon="🚨"
          color="red"
          sub="Requires immediate action"
        />
        <StatCard
          label="Active Alerts"
          value={unresolvedCount}
          icon="⚠️"
          color="yellow"
          sub="Unresolved alerts"
        />
        <StatCard
          label="Sensor Readings"
          value={sensorData.length}
          icon="📡"
          color="green"
          sub="Total records"
        />
      </div>

      {/* Chart + Gauges */}
      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              📈 Weekly Sensor Readings
              <span className="card-tag">7-Day</span>
            </div>
          </div>
          <div className="card-body">
            <BarChart data={chartData} />
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
            {gauges.length > 0
              ? <WaterGauges gauges={gauges} />
              : <div style={{ color: "var(--text-light)", fontSize: 13, textAlign: "center", padding: 24 }}>No sensor data yet.</div>
            }
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
          <AlertList alerts={alerts.slice(0, 4)} />
        </div>
      </div>

      {/* Drainage Locations */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <div className="card-title">
            🗺️ Drainage Locations
            <span className="card-tag">{locations.length} Total</span>
          </div>
        </div>
        <div className="card-body">
          <LocationList locations={locations} loading={false} error={null} />
        </div>
      </div>
    </>
  );
}
