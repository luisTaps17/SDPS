export default function WaterGauges({ gauges }) {
  return (
    <div className="gauges-row">
      {gauges.map((g, i) => (
        <div key={i} className="gauge-item">
          <div className="gauge-loc">{g.location}</div>
          <div className="gauge-tube">
            <div
              className={`gauge-fill fill-${g.status}`}
              style={{ height: `${g.pct}%` }}
            />
          </div>
          <div className={`gauge-pct pct-${g.status}`}>{g.pct}%</div>
          <div style={{ fontSize: 10, color: "var(--text-light)", textTransform: "uppercase", letterSpacing: 1 }}>
            {g.status === "normal" ? "Normal" : g.status === "warning" ? "Warning" : "Danger"}
          </div>
        </div>
      ))}
    </div>
  );
}
