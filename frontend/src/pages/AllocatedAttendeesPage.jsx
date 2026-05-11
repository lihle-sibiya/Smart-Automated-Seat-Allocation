import { useState } from "react";

const MOCK_ATTENDEES = [
  { id: "1", name: "James Williams", dept: "Engineering" },
  { id: "2", name: "Sarah Johnson", dept: "Marketing" },
  { id: "3", name: "Michael Chen", dept: "Product" },
  { id: "4", name: "Emma Davis", dept: "Design" },
  { id: "5", name: "David Rodriguez", dept: "Engineering" },
  { id: "6", name: "Lisa Anderson", dept: "Sales" },
  { id: "7", name: "Christopher Martinez", dept: "HR" },
  { id: "8", name: "Rachel Thompson", dept: "Finance" },
  { id: "9", name: "Daniel Lee", dept: "Operations" },
  { id: "10", name: "Jessica White", dept: "Engineering" },
];

export default function AllocatedAttendeesPage({
  session,
  event,
  allocated = [],
  unallocated = [],
  onAllocate,
  onRemove,
  onDone,
}) {
  console.log("🟢 AllocatedAttendeesPage RENDERED");
  
  const MAX_ATTENDEES = 6;
  const unallocatedArray = unallocated || [];
  const safeUnallocated = (Array.isArray(unallocatedArray) && unallocatedArray.length > 0) ? unallocatedArray : MOCK_ATTENDEES;
  const safeAllocated = Array.isArray(allocated) ? allocated : [];
  const slotsRemaining = Math.max(0, MAX_ATTENDEES - safeAllocated.length);
  const hasAvailableSlots = slotsRemaining > 0;
  const hasAvailableAttendees = safeUnallocated.length > 0;

  const [showAddPanel, setShowAddPanel] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [justAdded, setJustAdded] = useState(null);

  console.log("showAddPanel state:", showAddPanel);
  console.log("hasAvailableAttendees:", hasAvailableAttendees);
  console.log("safeUnallocated length:", safeUnallocated.length);

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

      <p className="text-sm text-gray-500 mb-4">
        {event?.name} · {session.room}
      </p>

      {/* SLOTS REMAINING */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
        <p className="text-lg font-semibold">
          Slots Remaining: <span className="text-blue-600">{slotsRemaining}</span> / {MAX_ATTENDEES}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {safeAllocated.length} attendee{safeAllocated.length !== 1 ? 's' : ''} allocated
        </p>
      </div>

      {/* ADD BUTTON */}
      {!showAddPanel && (
        <button
          className="w-full mb-6 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded cursor-pointer"
          onClick={() => {
            console.log("🔵 Button clicked! Current showAddPanel:", showAddPanel);
            setShowAddPanel(true);
            console.log("🔵 setShowAddPanel(true) called");
          }}
        >
          + Add Participant
        </button>
      )}

      {/* ADD PANEL */}
      {showAddPanel ? (
        <div className="border-4 border-red-500 bg-yellow-100 p-6 rounded mb-6">
          <h3 className="font-semibold mb-3 text-lg">🔴 DEBUG: Panel is showing!</h3>
          <p>Safe Unallocated Count: {safeUnallocated.length}</p>

          <select
            className="select select-bordered w-full mb-4 mt-3"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">Choose from {safeUnallocated.length} available attendee{safeUnallocated.length !== 1 ? 's' : ''}...</option>

            {safeUnallocated.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.dept ? `· ${p.dept}` : ''}
              </option>
            ))}
          </select>

          {selectedParticipant && (
            <div className="bg-white p-3 rounded mb-3 border-l-4 border-blue-500">
              <p className="text-sm font-semibold">Selected:</p>
              <p className="text-lg font-bold">{selectedParticipant.name}</p>
              {selectedParticipant.dept && <p className="text-sm text-gray-600">{selectedParticipant.dept}</p>}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button
              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded cursor-pointer"
              onClick={handleConfirm}
            >
              {confirming ? "Allocating..." : "Confirm"}
            </button>

            <button
              className="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded cursor-pointer"
              onClick={() => {
                console.log("Cancel clicked!");
                setShowAddPanel(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-3 text-gray-600">Panel is hidden (showAddPanel = false)</div>
      )}

      {/* LIST */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Allocated Attendees</h2>
        {safeAllocated.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No attendees allocated yet</p>
        ) : (
          <div className="space-y-2">
            {safeAllocated.map((p, index) => (
              <div
                key={p.id}
                className={`p-4 border rounded flex items-center justify-between cursor-pointer transition-colors ${
                  justAdded === p.id ? "bg-green-100 border-green-400" : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded">
                    {index + 1}
                  </span>
                  <span className="font-medium">{p.name}</span>
                  {p.dept && <span className="text-sm text-gray-600">({p.dept})</span>}
                </div>

                <button
                  className="btn btn-sm btn-error"
                  onClick={() => onRemove(p.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DONE */}
      <button
        className="w-full mt-6 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded cursor-pointer"
        onClick={() => {
          console.log("✅ Done button clicked!");
          onDone();
        }}
      >
        ✓ Done — Back to Sessions
      </button>

    </div>
  );
}