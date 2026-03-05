import BarChart    from "../components/BarChart";
import SensorTable from "../components/SensorTable";
import { SENSORS, CHART_DATA } from "../data/mockData";

export default function SensorData() {
  return (
    <>
      
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
        <div className="card-header">
          <div className="card-title">
            🔬 All Sensor Readings
            <span className="card-tag">Live</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <SensorTable sensors={SENSORS} />
        </div>
      </div>
    </>
  );
}
