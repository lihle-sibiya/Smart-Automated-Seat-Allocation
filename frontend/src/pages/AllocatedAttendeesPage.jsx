import { useState } from "react";

export default function AllocatedAttendeesPage({
  session,
  event,
  allocated = [],
  unallocated = [],
  onAllocate,
  onRemove,
  onDone,
}) {
  const safeUnallocated = Array.isArray(unallocated) ? unallocated : [];
  const safeAllocated = Array.isArray(allocated) ? allocated : [];

  const [showAddPanel, setShowAddPanel] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [justAdded, setJustAdded] = useState(null);

  // 🛑 HARD SAFETY (prevents blank crash)
  if (!session) {
    return (
      <div className="text-center p-10 text-gray-500">
        No session selected
      </div>
    );
  }

  // ✅ SAFE find (THIS IS THE FIX)
  const selectedParticipant = safeUnallocated.find(
    (p) => p.id === selectedId
  );

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
    }, 400);
  };

  return (
    <div className="max-w-2xl mx-auto">

      {/* HEADER */}
      <h1 className="text-2xl font-bold">
        {session.name}
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        {event?.name} · {session.room}
      </p>

      {/* ADD BUTTON */}
      {!showAddPanel && (
        <button
          className="btn btn-primary w-full mb-6"
          onClick={() => setShowAddPanel(true)}
        >
          + Add Participant
        </button>
      )}

      {/* ADD PANEL */}
      {showAddPanel && (
        <div className="border p-4 rounded mb-6">

          <select
            className="select select-bordered w-full mb-4"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">Select participant</option>

            {safeUnallocated.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.dept}
              </option>
            ))}
          </select>

          {selectedParticipant && (
            <p className="text-sm mb-3">
              Selected: {selectedParticipant.name}
            </p>
          )}

          <div className="flex gap-2">

            <button
              className="btn btn-success flex-1"
              disabled={!selectedId || confirming}
              onClick={handleConfirm}
            >
              {confirming ? "Allocating..." : "Confirm"}
            </button>

            <button
              className="btn btn-outline flex-1"
              onClick={() => setShowAddPanel(false)}
            >
              Cancel
            </button>

          </div>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-2">

        {safeAllocated.map((p) => (
          <div
            key={p.id}
            className={`p-3 border rounded flex justify-between ${
              justAdded === p.id ? "bg-green-100" : ""
            }`}
          >
            <span>{p.name}</span>

            <button
              className="text-red-500"
              onClick={() => onRemove(p.id)}
            >
              Remove
            </button>
          </div>
        ))}

      </div>

      {/* DONE */}
      <button
        className="btn btn-primary w-full mt-6"
        onClick={onDone}
      >
        Done — Back to Sessions
      </button>

    </div>
  );
}