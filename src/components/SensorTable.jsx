function ProgressBar({ value }) {
  const color =
    value > 85 ? "var(--red)" :
    value > 65 ? "var(--yellow)" :
    "var(--green)";

  return (
    <div className="prog-wrap">
      <div className="prog-bar">
        <div className="prog-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span style={{ fontSize: 12, color, fontWeight: 600, minWidth: 32 }}>{value}%</span>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    ok:       { cls: "pill-ok",      label: "Normal"   },
    warning:  { cls: "pill-warn",    label: "Warning"  },
    critical: { cls: "pill-crit",    label: "Critical" },
    offline:  { cls: "pill-offline", label: "Offline"  },
  };
  const { cls, label } = map[status] || map.offline;
  return <span className={`pill ${cls}`}>{label}</span>;
}

export default function SensorTable({ sensors }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Sensor ID</th>
            <th>Location</th>
            <th>Water Level</th>
            <th>Waste Accum.</th>
            <th>Temp</th>
            <th>Last Ping</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sensors.map((s) => (
            <tr key={s.id}>
              <td style={{ fontFamily: "var(--font-mono)", color: "var(--blue)", fontWeight: 600 }}>
                {s.id}
              </td>
              <td style={{ color: "var(--text)", fontWeight: 500 }}>{s.location}</td>
              <td><ProgressBar value={s.waterLevel} /></td>
              <td>
                <div className="prog-wrap">
                  <div className="prog-bar">
                    <div className="prog-fill" style={{
                      width: `${s.waste}%`,
                      background: s.waste > 80 ? "var(--red)" : s.waste > 55 ? "var(--orange)" : "var(--green)"
                    }} />
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 600, minWidth: 32,
                    color: s.waste > 80 ? "var(--red)" : s.waste > 55 ? "var(--orange)" : "var(--green)"
                  }}>{s.waste}%</span>
                </div>
              </td>
              <td style={{ fontFamily: "var(--font-mono)" }}>{s.temp}</td>
              <td style={{
                fontFamily: "var(--font-mono)",
                color: s.status === "offline" ? "var(--red)" : "var(--text-light)"
              }}>{s.lastPing}</td>
              <td><StatusPill status={s.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
