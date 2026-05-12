// src/pages/AlertsPage.jsx
import { useEffect, useState } from "react";
import StatCard  from "../components/StatCard";
import AlertList from "../components/AlertList";
import { apiGet, apiPost, apiPut, apiDelete } from "../api";

const ALERT_TYPES      = ["flood", "blockage", "sensor_fault", "maintenance"];
const SEVERITY_OPTIONS = ["low", "medium", "high", "critical"];
const EMPTY_FORM       = { alert_type: "flood", severity: "medium", message: "", location: "" };

// ─── Create Modal ───────────────────────────────────────────────────────────
function CreateAlertModal({ locations, onSave, onClose, saving }) {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const update = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => { const e = { ...p }; delete e[k]; return e; });
  };

  const validate = () => {
    const e = {};
    if (!form.message.trim()) e.message  = "Message is required.";
    if (!form.location)       e.location = "Location is required.";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, location: Number(form.location) });
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
            🔔 Create Alert
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "var(--text-light)",
            fontSize: 20, cursor: "pointer", lineHeight: 1,
          }}>×</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div className="form-group">
            <label className="form-label">Alert Type</label>
            <select className="form-input" value={form.alert_type} onChange={(e) => update("alert_type", e.target.value)}>
              {ALERT_TYPES.map((t) => (
                <option key={t} value={t}>{t.replace(/_/g, " ").toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Severity</label>
            <select className="form-input" value={form.severity} onChange={(e) => update("severity", e.target.value)}>
              {SEVERITY_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
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

        <div className="form-group" style={{ marginBottom: 22 }}>
          <label className="form-label">Message *</label>
          <textarea
            className={`form-input${errors.message ? " input-error" : ""}`}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Describe the alert..."
            rows={3}
            style={{ resize: "vertical", fontFamily: "inherit" }}
          />
          {errors.message && <div className="field-error">{errors.message}</div>}
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
            {saving ? "Creating..." : "Create Alert"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ──────────────────────────────────────────────────────────────
function EditAlertModal({ alert, locations, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    alert_type: alert.alert_type,
    severity:   alert.severity,
    message:    alert.message,
    location:   alert.location,
  });
  const [errors, setErrors] = useState({});

  const update = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => { const e = { ...p }; delete e[k]; return e; });
  };

  const validate = () => {
    const e = {};
    if (!form.message.trim()) e.message  = "Message is required.";
    if (!form.location)       e.location = "Location is required.";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, location: Number(form.location) });
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
            ✏️ Edit Alert
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "var(--text-light)",
            fontSize: 20, cursor: "pointer", lineHeight: 1,
          }}>×</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div className="form-group">
            <label className="form-label">Alert Type</label>
            <select className="form-input" value={form.alert_type} onChange={(e) => update("alert_type", e.target.value)}>
              {ALERT_TYPES.map((t) => (
                <option key={t} value={t}>{t.replace(/_/g, " ").toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Severity</label>
            <select className="form-input" value={form.severity} onChange={(e) => update("severity", e.target.value)}>
              {SEVERITY_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
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

        <div className="form-group" style={{ marginBottom: 22 }}>
          <label className="form-label">Message *</label>
          <textarea
            className={`form-input${errors.message ? " input-error" : ""}`}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Describe the alert..."
            rows={3}
            style={{ resize: "vertical", fontFamily: "inherit" }}
          />
          {errors.message && <div className="field-error">{errors.message}</div>}
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
            {saving ? "Saving..." : "Update Alert"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Confirm Delete Modal ────────────────────────────────────────────────────
function ConfirmDeleteModal({ alert, onConfirm, onClose, deleting }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "var(--card, #1e293b)",
        border: "1px solid #ef4444",
        borderRadius: 12, padding: "28px 32px", width: "100%", maxWidth: 400,
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#ef4444", marginBottom: 10 }}>
          🗑️ Delete Alert
        </div>
        <div style={{ fontSize: 13, color: "var(--text-light, #94a3b8)", marginBottom: 24 }}>
          Are you sure you want to delete this <strong style={{ color: "var(--text)" }}>{alert.alert_type.toUpperCase()}</strong> alert? This cannot be undone.
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "8px 20px", borderRadius: 7,
            border: "1px solid var(--border, #334155)",
            background: "transparent", color: "var(--text-light)",
            cursor: "pointer", fontSize: 13,
          }}>Cancel</button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            style={{
              padding: "8px 24px", borderRadius: 7, border: "none",
              background: "#ef4444", color: "#fff",
              cursor: deleting ? "not-allowed" : "pointer",
              fontSize: 13, fontWeight: 600, opacity: deleting ? 0.7 : 1,
            }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AlertsPage({ onCritCountChange }) {
  const [alerts,      setAlerts]      = useState([]);
  const [locations,   setLocations]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [filter,      setFilter]      = useState("all");
  const [toast,       setToast]       = useState("");
  const [showModal,   setShowModal]   = useState(false);
  const [editAlert,   setEditAlert]   = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(null);
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(false);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const [alertsData, locationsData] = await Promise.all([
        apiGet("/alerts/"),
        apiGet("/locations/"),
      ]);
      setAlerts(alertsData);
      setLocations(locationsData);
      const critCount = alertsData.filter((a) => !a.is_resolved && a.severity === "critical").length;
      if (onCritCountChange) onCritCountChange(critCount);
    } catch {
      setError("Failed to load alerts. Is the server running?");
    }
    setLoading(false);
  };

  useEffect(() => { loadAlerts(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const handleDismiss = async (id) => {
    try {
      await apiPost(`/alerts/${id}/resolve/`, {});
      showToast("✅ Alert resolved successfully.");
      loadAlerts();
    } catch {
      showToast("❌ Failed to resolve alert.");
    }
  };

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      await apiPost("/alerts/", form);
      setShowModal(false);
      showToast("✅ Alert created successfully.");
      loadAlerts();
    } catch {
      showToast("❌ Failed to create alert.");
    }
    setSaving(false);
  };

  const handleEdit = async (form) => {
    setSaving(true);
    try {
      await apiPut(`/alerts/${editAlert.id}/`, form);
      setEditAlert(null);
      showToast("✅ Alert updated successfully.");
      loadAlerts();
    } catch {
      showToast("❌ Failed to update alert.");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiDelete(`/alerts/${deleteAlert.id}/`);
      setDeleteAlert(null);
      showToast("✅ Alert deleted.");
      loadAlerts();
    } catch {
      showToast("❌ Failed to delete alert.");
    }
    setDeleting(false);
  };

  const filterOptions = ["all", "flood", "blockage", "sensor_fault", "maintenance"];
  const filterColors  = {
    all: "#3b82f6", flood: "#ef4444", blockage: "#f59e0b",
    sensor_fault: "#8b5cf6", maintenance: "#22c55e",
  };

  const visible = alerts.filter((a) => filter === "all" || a.alert_type === filter);

  const counts = {
    critical:   alerts.filter((a) => a.severity === "critical" && !a.is_resolved).length,
    unresolved: alerts.filter((a) => !a.is_resolved).length,
    resolved:   alerts.filter((a) => a.is_resolved).length,
    total:      alerts.length,
  };

  return (
    <>
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
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: "4px 14px", borderRadius: 6,
                border: "1px solid #3b82f6", background: "#3b82f6",
                color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600,
              }}
            >➕ Create</button>

            <button
              onClick={loadAlerts}
              style={{
                padding: "4px 12px", borderRadius: 6,
                border: "1px solid #334155", background: "#1e293b",
                color: "#fff", cursor: "pointer", fontSize: 12,
              }}
            >🔄 Refresh</button>

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
              >{f.replace(/_/g, " ")}</button>
            ))}
          </div>
        </div>

        <div className="card-body">
          {loading && <div style={{ color: "var(--text-light)", textAlign: "center", padding: 32 }}>Loading alerts...</div>}
          {!loading && error && <div style={{ color: "var(--red)", textAlign: "center", padding: 32 }}>❌ {error}</div>}
          {!loading && !error && visible.length === 0 && (
            <div style={{ color: "var(--text-light)", textAlign: "center", padding: 32 }}>No alerts match the current filter.</div>
          )}
          {!loading && !error && visible.length > 0 && (
            <AlertList
              alerts={visible}
              onDismiss={handleDismiss}
              onEdit={(alert) => setEditAlert(alert)}
              onDelete={(alert) => setDeleteAlert(alert)}
            />
          )}
        </div>
      </div>

      {showModal && (
        <CreateAlertModal
          locations={locations}
          onSave={handleCreate}
          onClose={() => setShowModal(false)}
          saving={saving}
        />
      )}

      {editAlert && (
        <EditAlertModal
          alert={editAlert}
          locations={locations}
          onSave={handleEdit}
          onClose={() => setEditAlert(null)}
          saving={saving}
        />
      )}

      {deleteAlert && (
        <ConfirmDeleteModal
          alert={deleteAlert}
          onConfirm={handleDelete}
          onClose={() => setDeleteAlert(null)}
          deleting={deleting}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}