export default function EventsTab({ onSelectEvent }) {
  const trainingEvent = {
    id: 1,
    name: "Internal Training Programme",
    date: "2025-09-12",
    venue: "Company HQ"
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">
        🏢 Internal Training Programme
      </h1>

      <p className="text-gray-500 mt-2">
        Manage session seat allocations for internal employees.
      </p>

      <div className="card bg-base-100 shadow-md mt-6 p-4">
        <h2 className="text-xl font-semibold">{trainingEvent.name}</h2>

        <p className="text-sm text-gray-500 mt-1">
          📅 {trainingEvent.date} · 📍 {trainingEvent.venue}
        </p>

        <button
          className="btn btn-primary mt-4"
          onClick={() => onSelectEvent(trainingEvent)}
        >
          View Sessions →
        </button>
      </div>
    </div>
  );
}