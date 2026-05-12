// src/components/LocationList.jsx
import { useState } from "react";
import { apiPost, apiPut, apiDelete } from "../api";

const STATUS_OPTIONS = ["active", "inactive", "maintenance"];

const statusColor = {
  active:      "var(--green)",
  inactive:    "var(--text-light)",
  maintenance: "var(--yellow)",
};

// ✅ added latitude & longitude
const EMPTY_FORM = { name: "", address: "", description: "", status: "active", latitude: "", longitude: "" };

function LocationModal({ initial, onSave, onClose, saving }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const update = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => { const e = { ...p }; delete e[k]; return e; });
  };

  // ✅ added latitude & longitude validation
  const validate = () => {
    const e = {};
    if (!form.name.trim())                              e.name      = "Name is required.";
    if (!form.address.trim())                           e.address   = "Address is required.";
    if (form.latitude === "" || isNaN(form.latitude))   e.latitude  = "Valid latitude required.";
    if (form.longitude === "" || isNaN(form.longitude)) e.longitude = "Valid longitude required.";
    return e;
  };

  // ✅ cast latitude & longitude to numbers
  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, latitude: Number(form.latitude), longitude: Number(form.longitude) });
  };

  const isEdit = !!initial?.id;

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
            {isEdit ? "✏️ Edit Location" : "➕ Add Location"}
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "var(--text-light, #94a3b8)",
            fontSize: 20, cursor: "pointer", lineHeight: 1,
          }}>×</button>
        </div>

        {/* Name */}
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Location Name *</label>
          <input
            className={`form-input${errors.name ? " input-error" : ""}`}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Main Canal"
          />
          {errors.name && <div className="field-error">{errors.name}</div>}
        </div>

        {/* Address */}
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Address *</label>
          <input
            className={`form-input${errors.address ? " input-error" : ""}`}
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="e.g. Brgy. Lapasan, CDO"
          />
          {errors.address && <div className="field-error">{errors.address}</div>}
        </div>

        {/* ✅ NEW: Latitude + Longitude */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div className="form-group">
            <label className="form-label">Latitude *</label>
            <input
              className={`form-input${errors.latitude ? " input-error" : ""}`}
              type="number" step="any"
              value={form.latitude}
              onChange={(e) => update("latitude", e.target.value)}
              placeholder="e.g. 8.4542"
            />
            {errors.latitude && <div className="field-error">{errors.latitude}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Longitude *</label>
            <input
              className={`form-input${errors.longitude ? " input-error" : ""}`}
              type="number" step="any"
              value={form.longitude}
              onChange={(e) => update("longitude", e.target.value)}
              placeholder="e.g. 124.6319"
            />
            {errors.longitude && <div className="field-error">{errors.longitude}</div>}
          </div>
        </div>

        {/* Description */}
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Description</label>
          <textarea
            className="form-input"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Optional notes about this location"
            rows={2}
            style={{ resize: "vertical", fontFamily: "inherit" }}
          />
        </div>

        {/* Status */}
        <div className="form-group" style={{ marginBottom: 22 }}>
          <label className="form-label">Status</label>
          <select
            className="form-input"
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "8px 20px", borderRadius: 7,
            border: "1px solid var(--border, #334155)",
            background: "transparent", color: "var(--text-light, #94a3b8)",
            cursor: "pointer", fontSize: 13,
          }}>Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-login"
            style={{ width: "auto", padding: "8px 24px", opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "Saving..." : isEdit ? "Update" : "Add Location"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ location, onConfirm, onClose, deleting }) {
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
          🗑️ Delete Location
        </div>
        <div style={{ fontSize: 13, color: "var(--text-light, #94a3b8)", marginBottom: 24 }}>
          Are you sure you want to delete <strong style={{ color: "var(--text)" }}>{location.name}</strong>? This cannot be undone.
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "8px 20px", borderRadius: 7,
            border: "1px solid var(--border, #334155)",
            background: "transparent", color: "var(--text-light, #94a3b8)",
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

export default function LocationList({ locations, loading, error, onRefresh }) {
  const [modal,    setModal]    = useState(null);
  const [confirm,  setConfirm]  = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast,    setToast]    = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const handleAdd = async (form) => {
    setSaving(true);
    try {
      await apiPost("/locations/", form);
      setModal(null);
      showToast("✅ Location added successfully.");
      if (onRefresh) onRefresh();
    } catch {
      showToast("❌ Failed to add location.");
    }
    setSaving(false);
  };

  const handleEdit = async (form) => {
    setSaving(true);
    try {
      await apiPut(`/locations/${modal.data.id}/`, form);
      setModal(null);
      showToast("✅ Location updated successfully.");
      if (onRefresh) onRefresh();
    } catch {
      showToast("❌ Failed to update location.");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiDelete(`/locations/${confirm.id}/`);
      setConfirm(null);
      showToast("✅ Location deleted.");
      if (onRefresh) onRefresh();
    } catch {
      showToast("❌ Failed to delete location.");
    }
    setDeleting(false);
  };

  if (loading) return (
    <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-light)", fontSize: 13 }}>
      Loading locations...
    </div>
  );

  if (error) return (
    <div style={{ textAlign: "center", padding: "32px 0", color: "var(--red)", fontSize: 13 }}>
      ❌ {error}
    </div>
  );

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button
          onClick={() => setModal({ mode: "add" })}
          style={{
            padding: "7px 18px", borderRadius: 7,
            border: "1px solid #3b82f6", background: "#3b82f6",
            color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}
        >➕ Add Location</button>
      </div>

      {(!locations || locations.length === 0) ? (
        <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-light)", fontSize: 13 }}>
          No drainage locations found. Add one above!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {locations.map((loc) => (
            <div key={loc.id} style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "14px 18px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>
                {loc.name}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-light)" }}>{loc.address}</div>
              {loc.description && (
                <div style={{ fontSize: 11, color: "var(--text-light)", marginTop: 2 }}>{loc.description}</div>
              )}
              {(loc.latitude != null && loc.longitude != null) && (
                <div style={{ fontSize: 11, color: "var(--text-light)", marginTop: 2 }}>
                  📍 {loc.latitude}, {loc.longitude}
                </div>
              )}
            </div>

              <div style={{ textAlign: "right", minWidth: 120, marginRight: 16 }}>
                <div style={{
                  fontSize: 12, fontWeight: 600,
                  color: statusColor[loc.status] ?? "var(--text-light)",
                  textTransform: "capitalize", marginBottom: 4,
                }}>● {loc.status}</div>
                {loc.active_alerts_count > 0 && (
                  <div style={{ fontSize: 11, color: "var(--red)" }}>
                    🚨 {loc.active_alerts_count} alert{loc.active_alerts_count > 1 ? "s" : ""}
                  </div>
                )}
                {loc.latest_water_level != null && (
                  <div style={{ fontSize: 11, color: "var(--blue)" }}>
                    💧 {loc.latest_water_level} cm
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => setModal({ 
                    mode: "edit", 
        data: { 
    ...loc, 
    latitude: loc.latitude ?? "", 
    longitude: loc.longitude ?? "" 
  } 
})}
                  style={{
                    padding: "5px 12px", borderRadius: 6,
                    border: "1px solid #334155", background: "#1e293b",
                    color: "#94a3b8", cursor: "pointer", fontSize: 12,
                  }}
                >✏️ Edit</button>
                <button
                  onClick={() => setConfirm(loc)}
                  style={{
                    padding: "5px 12px", borderRadius: 6,
                    border: "1px solid #ef444440", background: "#ef444415",
                    color: "#ef4444", cursor: "pointer", fontSize: 12,
                  }}
                >🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <LocationModal
          initial={modal.mode === "edit" ? modal.data : null}
          onSave={modal.mode === "edit" ? handleEdit : handleAdd}
          onClose={() => setModal(null)}
          saving={saving}
        />
      )}

      {confirm && (
        <ConfirmModal
          location={confirm}
          onConfirm={handleDelete}
          onClose={() => setConfirm(null)}
          deleting={deleting}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}