// src/pages/SensorData.jsx
import { useEffect, useState } from "react";
import BarChart    from "../components/BarChart";
import SensorTable from "../components/SensorTable";
import { apiGet, apiPost } from "../api";  // ✅ added apiPost
import { CHART_DATA } from "../data/mockData";

function mapToTableRow(reading, locations) {
  const loc        = locations.find((l) => l.id === reading.location);
  const waterLevel = Math.round(reading.water_level ?? 0);
  const status     =
    reading.blockage_detected ? "critical" :
    waterLevel > 85           ? "critical" :
    waterLevel > 65           ? "warning"  : "ok";

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

const EMPTY_FORM = {
  location:          "",
  water_level:       "",
  turbidity:         "",
  temperature:       "",
  blockage_detected: false,
};

// ✅ NEW: Submit Reading modal
function SubmitReadingModal({ locations, onSave, onClose, saving }) {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const update = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => { const e = { ...p }; delete e[k]; return e; });
  };

  const validate = () => {
    const e = {};
    if (!form.location)                                     e.location    = "Location is required.";
    if (form.water_level === "" || isNaN(form.water_level)) e.water_level = "Valid water level required.";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({
      location:          Number(form.location),
      water_level:       Number(form.water_level),
      turbidity:         form.turbidity   !== "" ? Number(form.turbidity)   : undefined,
      temperature:       form.temperature !== "" ? Number(form.temperature) : undefined,
      blockage_detected: form.blockage_detected,
    });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "var(--card, #1e293b)",
        border: "1px solid var(--border, #334155)",
        borderRadius: 12, padding: "28px 32px", width: "100%", maxWidth: 480,
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text, #f1f5f9)" }}>
            📡 Submit Sensor Reading
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "var(--text-light)",
            fontSize: 20, cursor: "pointer", lineHeight: 1,
          }}>×</button>
        </div>

        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Location *</label>
          <select
            className={`form-input${errors.location ? " input-error" : ""}`}
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
          >
            <option value="">— Select location —</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
          {errors.location && <div className="field-error">{errors.location}</div>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div className="form-group">
            <label className="form-label">Water Level (%) *</label>
            <input
              className={`form-input${errors.water_level ? " input-error" : ""}`}
              type="number" min="0" max="100" step="0.1"
              value={form.water_level}
              onChange={(e) => update("water_level", e.target.value)}
              placeholder="0 – 100"
            />
            {errors.water_level && <div className="field-error">{errors.water_level}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Turbidity (%)</label>
            <input
              className="form-input" type="number" min="0" max="100" step="0.1"
              value={form.turbidity}
              onChange={(e) => update("turbidity", e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Temperature (°C)</label>
          <input
            className="form-input" type="number" step="0.1"
            value={form.temperature}
            onChange={(e) => update("temperature", e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: form.blockage_detected ? "#451a03" : "#0f172a",
          border: `1px solid ${form.blockage_detected ? "#f59e0b" : "#334155"}`,
          borderRadius: 8, padding: "12px 16px", marginBottom: 22,
        }}>
          <div>
            <div style={{ color: form.blockage_detected ? "#f59e0b" : "var(--text)", fontWeight: 600, fontSize: 13 }}>
              🚧 Blockage Detected
            </div>
            <div style={{ color: "var(--text-light)", fontSize: 11, marginTop: 2 }}>
              Toggle if a blockage was observed at this sensor.
            </div>
          </div>
          <button
            onClick={() => update("blockage_detected", !form.blockage_detected)}
            style={{
              width: 46, height: 24, borderRadius: 12, border: "none",
              background: form.blockage_detected ? "#f59e0b" : "#334155",
              cursor: "pointer", position: "relative",
            }}
          >
            <span style={{
              position: "absolute", top: 3,
              left: form.blockage_detected ? 24 : 4,
              width: 18, height: 18, borderRadius: "50%",
              background: "#fff", transition: "left 0.2s",
            }} />
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "8px 20px", borderRadius: 7,
            border: "1px solid var(--border)", background: "transparent",
            color: "var(--text-light)", cursor: "pointer", fontSize: 13,
          }}>Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-login"
            style={{ width: "auto", padding: "8px 24px", opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "Submitting..." : "Submit Reading"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SensorData() {
  const [sensors,      setSensors]      = useState([]);
  const [locations,    setLocations]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sensorStates, setSensorStates] = useState({});
  // ✅ NEW state
  const [showModal,    setShowModal]    = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [toast,        setToast]        = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [sensorRes, locationRes] = await Promise.all([
        apiGet("/sensor-data/"),
        apiGet("/locations/"),
      ]);
      setLocations(locationRes);
      const mapped = sensorRes.map((r) => mapToTableRow(r, locationRes));
      setSensors(mapped);
      setSensorStates(Object.fromEntries(mapped.map((s) => [s.id, s.status !== "offline"])));
    } catch {
      setError("Failed to load sensor data.");
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const toggleSensor = (id) =>
    setSensorStates((prev) => ({ ...prev, [id]: !prev[id] }));

  // ✅ NEW: submit reading
  const handleSubmit = async (form) => {
    setSaving(true);
    try {
      await apiPost("/sensor-data/", form);
      setShowModal(false);
      showToast("✅ Reading submitted successfully.");
      loadData();
    } catch {
      showToast("❌ Failed to submit reading.");
    }
    setSaving(false);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
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
            <span className="card-tag">
              {loading ? "Loading..." : `${sensors.length} records`}
            </span>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            {/* ✅ NEW: Submit Reading button */}
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: "4px 14px", borderRadius: 6,
                border: "1px solid #3b82f6", background: "#3b82f6",
                color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600,
              }}
            >➕ Submit Reading</button>

            {/* ✅ NEW: Refresh button */}
            <button
              onClick={loadData}
              style={{
                padding: "4px 12px", borderRadius: 6,
                border: "1px solid #334155", background: "#1e293b",
                color: "#fff", cursor: "pointer", fontSize: 12,
              }}
            >🔄 Refresh</button>

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
              >{f}</button>
            ))}
          </div>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {loading && <div style={{ textAlign: "center", padding: 32, color: "var(--text-light)" }}>Loading sensor data...</div>}
          {!loading && error && <div style={{ textAlign: "center", padding: 32, color: "var(--red)" }}>❌ {error}</div>}
          {!loading && !error && sensors.length === 0 && (
            <div style={{ textAlign: "center", padding: 32, color: "var(--text-light)" }}>
              No sensor readings found. Submit one above!
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

      {/* ✅ NEW: modal */}
      {showModal && (
        <SubmitReadingModal
          locations={locations}
          onSave={handleSubmit}
          onClose={() => setShowModal(false)}
          saving={saving}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}