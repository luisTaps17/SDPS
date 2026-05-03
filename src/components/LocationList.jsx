// src/components/LocationList.jsx
export default function LocationList({ locations, loading, error }) {
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-light)", fontSize: 13 }}>
        Loading locations...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0", color: "var(--red)", fontSize: 13 }}>
        ❌ {error}
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-light)", fontSize: 13 }}>
        No drainage locations found.
      </div>
    );
  }

  const statusColor = {
    active:      "var(--green)",
    inactive:    "var(--text-light)",
    maintenance: "var(--yellow)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {locations.map((loc) => (
        <div
          key={loc.id}
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "14px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>
              {loc.name}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-light)" }}>{loc.address}</div>
            {loc.description && (
              <div style={{ fontSize: 11, color: "var(--text-light)", marginTop: 2 }}>{loc.description}</div>
            )}
          </div>

          <div style={{ textAlign: "right", minWidth: 120 }}>
            <div style={{
              fontSize: 12,
              fontWeight: 600,
              color: statusColor[loc.status] ?? "var(--text-light)",
              textTransform: "capitalize",
              marginBottom: 4,
            }}>
              ● {loc.status}
            </div>
            {loc.active_alerts_count > 0 && (
              <div style={{ fontSize: 11, color: "var(--red)" }}>
                🚨 {loc.active_alerts_count} alert{loc.active_alerts_count > 1 ? "s" : ""}
              </div>
            )}
            {loc.latest_water_level !== null && loc.latest_water_level !== undefined && (
              <div style={{ fontSize: 11, color: "var(--blue)" }}>
                💧 {loc.latest_water_level} cm
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
