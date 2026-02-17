export default function StatCard({ label, value, unit, icon, color, sub }) {
  return (
    <div className={`stat-card ${color}-tint`}>
      <div className="stat-label">{label}</div>
      <div className="stat-row">
        <div className={`stat-value ${color}`}>
          {value}
          {unit && <span style={{ fontSize: 14, fontWeight: 400, color: "var(--text-light)", marginLeft: 4 }}>{unit}</span>}
        </div>
        <div className="stat-icon">{icon}</div>
      </div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}
