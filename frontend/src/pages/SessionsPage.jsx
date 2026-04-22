export default function SessionsPage({
  event,
  sessions,
  allocations,
  onSelectSession,
  onBack,
}) {
  return (
    <div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="text-sm text-blue-600 hover:underline mb-6 flex items-center gap-1"
      >
        ← Back to Training Home
      </button>

      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
          Sessions
        </span>

        <h1 className="text-2xl font-bold text-gray-800 mt-2">
          {event?.name}
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          📍 {event?.venue} · 📅{" "}
          {event &&
            new Date(event.date).toLocaleDateString("en-ZA", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
        </p>
      </div>

      {/* Sessions list */}
      <div className="flex flex-col gap-4">

        {sessions?.map((session, i) => {
          const count = (allocations?.[session.id] || []).length;
          const pct = session.capacity
            ? Math.round((count / session.capacity) * 100)
            : 0;

          return (
            <div
              key={session.id}
              onClick={() => onSelectSession(session)}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                {/* Index */}
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-800">
                    {session.name}
                  </h2>

                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-gray-500 mt-1">
                    <span>🕐 {session.time}</span>
                    <span>🏛 {session.room}</span>
                    <span>👥 {session.capacity} seats</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Allocated</span>
                      <span className="font-medium text-blue-600">
                        {count} / {session.capacity}
                      </span>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={() => onSelectSession(session)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shrink-0"
                >
                  Allocate Seats →
                </button>

              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {(!sessions || sessions.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            No sessions found for this training programme.
          </div>
        )}

      </div>
    </div>
  );
}