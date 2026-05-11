import { useState } from "react";

export default function AllocatedAttendeesPage({
  session,
  event,
  allocated,
  unallocated,
  onAllocate,
  onRemove,
  onDone,
}) {
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [justAdded, setJustAdded] = useState(null);

  const selectedParticipant = unallocated.find((p) => p.id === selectedId);

  const handleConfirm = () => {
    if (!selectedId) return;

    setConfirming(true);

    setTimeout(() => {
      onAllocate(selectedId);
      setJustAdded(selectedId);
      setSelectedId("");
      setShowAddPanel(false);
      setConfirming(false);

      setTimeout(() => setJustAdded(null), 2000);
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <div className="badge badge-accent badge-outline mb-2">
          Seat Allocation
        </div>

        <h1 className="text-2xl font-bold">
          {session?.name}
        </h1>

        <p className="text-base-content/60 text-sm">
          {event?.name} · {session?.room}
        </p>
      </div>

      {/* Stats */}
      <div className="stats stats-horizontal bg-base-100 border border-base-300 shadow w-full mb-6">
        <div className="stat place-items-center py-3">
          <div className="stat-title text-xs">Allocated</div>
          <div className="stat-value text-primary text-2xl">
            {allocated.length}
          </div>
        </div>

        <div className="stat place-items-center py-3">
          <div className="stat-title text-xs">Remaining Seats</div>
          <div className="stat-value text-2xl">
            {session?.capacity - allocated.length}
          </div>
        </div>

        <div className="stat place-items-center py-3">
          <div className="stat-title text-xs">Capacity</div>
          <div className="stat-value text-2xl">
            {session?.capacity}
          </div>
        </div>
      </div>

      {/* Add Button */}
      {!showAddPanel && (
        <button
          className="btn btn-success w-full mb-6 gap-2"
          disabled={unallocated.length === 0}
          onClick={() => setShowAddPanel(true)}
        >
          ＋ Add Attendee / Participant
        </button>
      )}

      {/* Add Panel */}
      {showAddPanel && (
        <div className="card bg-base-100 border border-success/40 shadow-lg mb-6">
          <div className="card-body gap-4">

            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                Add Participant
              </h3>

              <button
                className="btn btn-ghost btn-sm btn-circle"
                onClick={() => {
                  setShowAddPanel(false);
                  setSelectedId("");
                }}
              >
                ✕
              </button>
            </div>

            {/* Dropdown */}
            <select
              className="select select-bordered w-full"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="">
                — Choose a participant —
              </option>

              {unallocated.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.dept}
                </option>
              ))}
            </select>

            {/* Preview */}
            {selectedParticipant && (
              <div className="bg-success/10 border border-success/30 rounded-xl p-3">
                <p className="font-semibold text-sm">
                  {selectedParticipant.name}
                </p>
                <p className="text-xs text-base-content/60">
                  {selectedParticipant.email} · {selectedParticipant.dept}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                className={`btn btn-primary flex-1 ${
                  confirming ? "loading" : ""
                }`}
                disabled={!selectedId || confirming}
                onClick={handleConfirm}
              >
                {confirming ? "Allocating..." : "Confirm Allocation"}
              </button>

              <button
                className="btn btn-ghost flex-1"
                onClick={() => {
                  setShowAddPanel(false);
                  setSelectedId("");
                }}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Allocated List */}
      <div className="card bg-base-100 border border-base-300 shadow">
        <div className="card-body p-0">

          <div className="px-5 py-4 border-b">
            <h2 className="font-semibold">
              Allocated Attendees ({allocated.length})
            </h2>
          </div>

          {allocated.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No attendees allocated yet.</p>
            </div>
          ) : (
            <ul className="divide-y">

              {allocated.map((p) => (
                <li
                  key={p.id}
                  className={`flex justify-between px-5 py-3 ${
                    justAdded === p.id ? "bg-success/10" : ""
                  }`}
                >
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-gray-500">
                      {p.email} · {p.dept}
                    </p>
                  </div>

                  <button
                    className="text-red-500 text-sm"
                    onClick={() => onRemove(p.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}

            </ul>
          )}

        </div>
      </div>

      {/* ✅ FIXED BUTTON (IMPORTANT CHANGE) */}
      <div className="mt-6">
        <button
          className="btn btn-primary w-full"
          onClick={onDone}
        >
          ✔ Done — Back to Sessions
        </button>
      </div>

    </div>
  );
}