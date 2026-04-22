import { useState, useEffect } from "react";

const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:8080/api";

const MOCK_SESSIONS = [
  {
    id: 1,
    name: "Morning",
    timeSlot: "09:00 – 10:30",
    capacity: 20,
    enrolled: 14,
    departmentBreakdown: {
      "Division A": { max: 8, enrolled: 6 },
      "Division B": { max: 6, enrolled: 4 },
      "Division C": { max: 6, enrolled: 4 },
    },
  },
  {
    id: 2,
    name: "Midday",
    timeSlot: "11:00 – 12:30",
    capacity: 20,
    enrolled: 9,
    departmentBreakdown: {
      "Division A": { max: 8, enrolled: 4 },
      "Division B": { max: 6, enrolled: 3 },
      "Division C": { max: 6, enrolled: 2 },
    },
  },
  {
    id: 3,
    name: "Afternoon",
    timeSlot: "13:00 – 14:30",
    capacity: 20,
    enrolled: 20,
    departmentBreakdown: {
      "Division A": { max: 8, enrolled: 8 },
      "Division B": { max: 6, enrolled: 6 },
      "Division C": { max: 6, enrolled: 6 },
    },
  },
];

const SESSION_META = {
  Morning:   { icon: "🌅" },
  Midday:    { icon: "☀️"  },
  Afternoon: { icon: "🌤️" },
};

const DEPT_PROGRESS_CLASS = {
  "Division A": "progress-info",
  "Division B": "progress-secondary",
  "Division C": "progress-success",
};

function StatusBadge({ enrolled, capacity }) {
  const available = capacity - enrolled;
  if (available === 0)
    return <span className="badge badge-error font-bold">FULL</span>;
  if (available <= 3)
    return <span className="badge badge-warning font-bold">{available} LEFT</span>;
  return <span className="badge badge-success font-bold">{available} OPEN</span>;
}

function SessionCard({ session }) {
  const available = session.capacity - session.enrolled;
  const fillPct   = Math.round((session.enrolled / session.capacity) * 100);
  const isFull    = available === 0;
  const meta      = SESSION_META[session.name];

  const progressColor = isFull
    ? "progress-error"
    : fillPct > 80
    ? "progress-warning"
    : "progress-primary";

  return (
    <div className={`card bg-base-100 shadow border ${isFull ? "border-error" : "border-base-200"}`}>
      <div className="card-body gap-4">

        {/* Header row */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{meta.icon}</span>
              <h3 className="card-title">{session.name} Session</h3>
            </div>
            <p className="text-sm text-base-content/50 mt-0.5">🕐 {session.timeSlot}</p>
          </div>
          <StatusBadge enrolled={session.enrolled} capacity={session.capacity} />
        </div>

        {/* Main fill progress */}
        <div>
          <div className="flex justify-between text-sm font-semibold mb-1">
            <span>{session.enrolled} / {session.capacity} seats filled</span>
            <span className={isFull ? "text-error" : ""}>{fillPct}%</span>
          </div>
          <progress
            className={`progress w-full ${progressColor}`}
            value={session.enrolled}
            max={session.capacity}
          />
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 gap-3">
          <div className="stat bg-base-200 rounded-box p-3 text-center">
            <div className="stat-title text-xs">Total Capacity</div>
            <div className="stat-value text-xl">🪑 {session.capacity}</div>
          </div>
          <div className="stat bg-base-200 rounded-box p-3 text-center">
            <div className="stat-title text-xs">Available Seats</div>
            <div className={`stat-value text-xl ${isFull ? "text-error" : "text-success"}`}>
              {isFull ? "❌" : "✅"} {available}
            </div>
          </div>
        </div>

        {/* Department breakdown collapsible */}
        <div className="collapse collapse-arrow border border-base-200 rounded-box bg-base-100">
          <input type="checkbox" />
          <div className="collapse-title text-sm font-semibold">
            Department Breakdown
          </div>
          <div className="collapse-content flex flex-col gap-3 pt-1">
            {Object.entries(session.departmentBreakdown).map(([dept, data]) => (
              <div key={dept}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>{dept}</span>
                  <span>{data.enrolled} / {data.max} seats</span>
                </div>
                <progress
                  className={`progress w-full ${DEPT_PROGRESS_CLASS[dept]}`}
                  value={data.enrolled}
                  max={data.max}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function TimeSlots() {
  const [sessions,     setSessions]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [lastRefresh,  setLastRefresh]  = useState(new Date());

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/sessions`);
      if (!res.ok) throw new Error();
      setSessions(await res.json());
    } catch {
      // Backend not running yet — use mock data
      setSessions(MOCK_SESSIONS);
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  };

  useEffect(() => { fetchSessions(); }, []);

  const totalEnrolled  = sessions.reduce((s, x) => s + x.enrolled,  0);
  const totalCapacity  = sessions.reduce((s, x) => s + x.capacity,  0);
  const totalAvailable = totalCapacity - totalEnrolled;

  return (
    <div className="max-w-2xl mx-auto px-4 pb-10">

      {/* Page title */}
      <div className="mb-6 pt-2">
        <h2 className="text-2xl font-extrabold tracking-tight">Training Sessions</h2>
        <p className="text-sm text-base-content/50">3 sessions · Same day · 1.5 hrs each</p>
      </div>

      {/* Summary stats bar */}
      <div className="stats shadow w-full mb-6 border border-base-200">
        <div className="stat">
          <div className="stat-figure text-primary text-2xl">👥</div>
          <div className="stat-title">Enrolled</div>
          <div className="stat-value text-primary">{totalEnrolled}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-accent text-2xl">🪑</div>
          <div className="stat-title">Total Seats</div>
          <div className="stat-value text-accent">{totalCapacity}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-success text-2xl">🟢</div>
          <div className="stat-title">Available</div>
          <div className="stat-value text-success">{totalAvailable}</div>
        </div>
      </div>

      {/* Refresh row */}
      <div className="flex justify-end items-center gap-3 mb-4">
        <span className="text-xs text-base-content/40">
          Updated {lastRefresh.toLocaleTimeString()}
        </span>
        <button
          className={`btn btn-primary btn-sm ${loading ? "loading" : ""}`}
          onClick={fetchSessions}
          disabled={loading}
        >
          {!loading && "↻"} Refresh
        </button>
      </div>

      {/* Session cards */}
      {loading && sessions.length === 0 ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}

    </div>
  );
}
