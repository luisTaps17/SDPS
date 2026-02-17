export const SENSORS = [
  { id: "SN-001", location: "Main Canal A",     waterLevel: 78, waste: 62, status: "warning",  lastPing: "10s ago", temp: "28°C" },
  { id: "SN-002", location: "Branch Line B1",   waterLevel: 34, waste: 22, status: "ok",       lastPing: "12s ago", temp: "27°C" },
  { id: "SN-003", location: "Outlet C-West",    waterLevel: 91, waste: 85, status: "critical", lastPing: "8s ago",  temp: "29°C" },
  { id: "SN-004", location: "Junction D-North", waterLevel: 45, waste: 30, status: "ok",       lastPing: "15s ago", temp: "27°C" },
  { id: "SN-005", location: "Reservoir Gate E", waterLevel: 55, waste: 48, status: "ok",       lastPing: "11s ago", temp: "28°C" },
  { id: "SN-006", location: "Sub-drain F2",     waterLevel: 12, waste: 8,  status: "offline",  lastPing: "5m ago",  temp: "--"   },
];

export const ALERTS = [
  { id: 1, type: "critical", title: "Critical Water Level — Outlet C-West",       desc: "Water level reached 91%. Immediate action required.", time: "2 min ago",  location: "SN-003" },
  { id: 2, type: "critical", title: "Severe Waste Accumulation — Outlet C-West",  desc: "Waste sensor at 85%. Drainage blockage imminent.",    time: "4 min ago",  location: "SN-003" },
  { id: 3, type: "warning",  title: "Elevated Water Level — Main Canal A",        desc: "Water level at 78%, approaching critical threshold.",  time: "11 min ago", location: "SN-001" },
  { id: 4, type: "warning",  title: "Waste Level Warning — Main Canal A",         desc: "Waste accumulation at 62%. Schedule maintenance.",     time: "18 min ago", location: "SN-001" },
  { id: 5, type: "info",     title: "Sensor SN-006 Offline",                      desc: "Sub-drain F2 has not responded for over 5 minutes.",  time: "25 min ago", location: "SN-006" },
  { id: 6, type: "resolved", title: "Water Level Normalized — Branch Line B1",    desc: "Water level returned to safe range (34%).",           time: "1 hr ago",   location: "SN-002" },
];

export const CHART_DATA = [
  { label: "Mon", water: 42, waste: 30 },
  { label: "Tue", water: 55, waste: 38 },
  { label: "Wed", water: 48, waste: 44 },
  { label: "Thu", water: 70, waste: 58 },
  { label: "Fri", water: 65, waste: 52 },
  { label: "Sat", water: 80, waste: 70 },
  { label: "Sun", water: 91, waste: 85 },
];

export const GAUGES = [
  { location: "Main Canal A",  pct: 78, status: "warning" },
  { location: "Outlet C-West", pct: 91, status: "danger"  },
  { location: "Branch B1",     pct: 34, status: "normal"  },
];
