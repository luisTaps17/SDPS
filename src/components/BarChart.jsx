export default function BarChart({ data }) {
  const max = Math.max(...data.map((d) => Math.max(d.water, d.waste)));

  return (
    <div className="chart-wrap">
      <div className="chart-bars">
        {data.map((d, i) => (
          <div key={i} className="bar-group">
            <div className="bar-pair">
              <div
                className="bar bar-blue"
                style={{ height: `${(d.water / max) * 100}%` }}
                title={`Water: ${d.water}%`}
              />
              <div
                className="bar bar-orange"
                style={{ height: `${(d.waste / max) * 100}%` }}
                title={`Waste: ${d.waste}%`}
              />
            </div>
            <span className="bar-label">{d.label}</span>
          </div>
        ))}
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: "var(--blue)" }} />
          Water Level (%)
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: "var(--orange)" }} />
          Waste Accumulation (%)
        </div>
      </div>
    </div>
  );
}
