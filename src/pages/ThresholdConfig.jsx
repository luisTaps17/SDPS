import { useState } from "react";

const THRESHOLDS = [
  { key: "waterWarn",  label: "Water Level — Warning",  sub: "Trigger alert at this level",        min: 30, max: 95, defaultVal: 70, unit: "%" },
  { key: "waterCrit",  label: "Water Level — Critical",  sub: "Emergency threshold",                 min: 50, max: 99, defaultVal: 85, unit: "%" },
  { key: "wasteWarn",  label: "Waste Accumulation — Warning",  sub: "Schedule maintenance alert",   min: 20, max: 90, defaultVal: 60, unit: "%" },
  { key: "wasteCrit",  label: "Waste Accumulation — Critical", sub: "Blockage imminent threshold",  min: 40, max: 99, defaultVal: 80, unit: "%" },
  { key: "cooldown",   label: "Alert Cooldown",           sub: "Min time between repeated alerts",   min: 1,  max: 60, defaultVal: 5,  unit: "min" },
];

export default function ThresholdConfig() {
  const [vals, setVals] = useState(
    Object.fromEntries(THRESHOLDS.map((t) => [t.key, t.defaultVal]))
  );
  const [toast, setToast] = useState(false);

  const update = (key, value) => setVals((prev) => ({ ...prev, [key]: Number(value) }));

  const save = (key) => {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            ⚙️ Sensor Thresholds
            <span className="card-tag">Configurable</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: "8px 18px" }}>
          <div className="threshold-list">
            {THRESHOLDS.map((t, i) => (
              <div key={t.key}>
                <div className="threshold-row">
                  {/* Label */}
                  <div>
                    <div className="threshold-name">{t.label}</div>
                    <div className="threshold-sub">{t.sub}</div>
                  </div>

                  {/* Slider */}
                  <div>
                    <input
                      type="range"
                      min={t.min}
                      max={t.max}
                      value={vals[t.key]}
                      onChange={(e) => update(t.key, e.target.value)}
                    />
                    <div className="range-labels">
                      <span>{t.min}{t.unit}</span>
                      <span>{t.max}{t.unit}</span>
                    </div>
                  </div>

                  {/* Value display */}
                  <div>
                    <div className="threshold-val">{vals[t.key]}</div>
                    <span className="threshold-unit">{t.unit}</span>
                  </div>

                  {/* Save button */}
                  <button className="btn-save" onClick={() => save(t.key)}>
                    Save
                  </button>
                </div>
                {i < THRESHOLDS.length - 1 && <div className="threshold-divider" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast">
          ✅ Threshold saved successfully
        </div>
      )}
    </>
  );
}
