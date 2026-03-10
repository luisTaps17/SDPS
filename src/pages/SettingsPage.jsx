import { useState } from "react";

export default function SettingsPage({ userInfo, setUserInfo, systemStatus, setSystemStatus }) {
  
  const [form, setForm] = useState({
    name:             userInfo?.name  || "Admin",
    email:            userInfo?.email || "admin@sdps.local",
    notifications:    true,
    emailAlerts:      false,
    alertSound:       true,
    refreshInterval:  "10",
    theme:            "dark",
    timezone:         "Asia/Manila",
    language:         "en",
  });

  const [maintenanceToggle, setMaintenanceToggle] = useState(systemStatus === "maintenance");
  const [toast, setToast]   = useState("");
  const [errors, setErrors] = useState({});

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const e = {...prev}; delete e[key]; return e; });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address.";
    return e;
  };

  const saveProfile = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setUserInfo({ name: form.name, email: form.email });
    showToast("✅ Profile saved successfully.");
  };

  const saveSystemPrefs = () => {
    const newStatus = maintenanceToggle ? "maintenance" : "online";
    setSystemStatus(newStatus);
    showToast(`✅ System preferences saved. Status: ${newStatus}.`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  return (
    <>
      {/* User Profile Form */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div className="card-title">
            👤 User Profile
            <span className="card-tag">Account</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: "16px 24px" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input
                className={`form-input${errors.name ? " input-error" : ""}`}
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Enter display name"
              />
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className={`form-input${errors.email ? " input-error" : ""}`}
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="Enter email"
              />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div className="form-group">
              <label className="form-label">Language</label>
              <select
                className="form-input"
                value={form.language}
                onChange={(e) => update("language", e.target.value)}
              >
                <option value="en">English</option>
                <option value="fil">Filipino</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Timezone</label>
              <select
                className="form-input"
                value={form.timezone}
                onChange={(e) => update("timezone", e.target.value)}
              >
                <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (GMT-5)</option>
              </select>
            </div>
          </div>

          <button className="btn-login" style={{ width: "auto", padding: "9px 28px" }} onClick={saveProfile}>
            Save Profile
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div className="card-title">
            🔔 Notification Preferences
            <span className="card-tag">Alerts</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: "16px 24px" }}>
          {[
            { key: "notifications", label: "Enable In-App Notifications",  sub: "Show alert banners inside the dashboard" },
            { key: "emailAlerts",   label: "Email Alerts",                  sub: "Send critical alerts to your email address" },
            { key: "alertSound",    label: "Alert Sound Effects",           sub: "Play a sound when new alerts arrive" },
          ].map(({ key, label, sub }) => (
            <div key={key} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 0", borderBottom: "1px solid #1e293b"
            }}>
              <div>
                <div style={{ color: "var(--text)", fontWeight: 500, fontSize: 13 }}>{label}</div>
                <div style={{ color: "var(--text-light)", fontSize: 11, marginTop: 2 }}>{sub}</div>
              </div>
              <button
                onClick={() => update(key, !form[key])}
                style={{
                  width: 46, height: 24, borderRadius: 12, border: "none",
                  background: form[key] ? "#3b82f6" : "#334155",
                  cursor: "pointer", position: "relative", transition: "background 0.2s",
                }}
              >
                <span style={{
                  position: "absolute", top: 3,
                  left: form[key] ? 24 : 4,
                  width: 18, height: 18, borderRadius: "50%",
                  background: "#fff", transition: "left 0.2s",
                }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* System Preferences */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            ⚙️ System Preferences
            <span className="card-tag">Admin Only</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: "16px 24px" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div className="form-group">
              <label className="form-label">Dashboard Refresh Interval</label>
              <select
                className="form-input"
                value={form.refreshInterval}
                onChange={(e) => update("refreshInterval", e.target.value)}
              >
                <option value="5">Every 5 seconds</option>
                <option value="10">Every 10 seconds</option>
                <option value="30">Every 30 seconds</option>
                <option value="60">Every 60 seconds</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">UI Theme</label>
              <select
                className="form-input"
                value={form.theme}
                onChange={(e) => update("theme", e.target.value)}
              >
                <option value="dark">Dark (Default)</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>

          {/* Maintenance Mode toggle — updates systemStatus in App.jsx */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: maintenanceToggle ? "#451a03" : "#ffffff",
            border: `1px solid ${maintenanceToggle ? "#f59e0b" : "#1e293b"}`,
            borderRadius: 8, padding: "14px 18px", marginBottom: 20
          }}>
            <div>
              <div style={{ color: maintenanceToggle ? "#f59e0b" : "var(--text)", fontWeight: 600, fontSize: 13 }}>
                🔧 Maintenance Mode
              </div>
              <div style={{ color: "var(--text-light)", fontSize: 11, marginTop: 3 }}>
                Puts system in maintenance — shown in topbar and sidebar. Disables live alerts.
              </div>
            </div>
            <button
              onClick={() => setMaintenanceToggle((v) => !v)}
              style={{
                width: 46, height: 24, borderRadius: 12, border: "none",
                background: maintenanceToggle ? "#f59e0b" : "#334155",
                cursor: "pointer", position: "relative",
              }}
            >
              <span style={{
                position: "absolute", top: 3,
                left: maintenanceToggle ? 24 : 4,
                width: 18, height: 18, borderRadius: "50%",
                background: "#fff", transition: "left 0.2s",
              }} />
            </button>
          </div>

          <button className="btn-login" style={{ width: "auto", padding: "9px 28px" }} onClick={saveSystemPrefs}>
            Save System Preferences
          </button>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}