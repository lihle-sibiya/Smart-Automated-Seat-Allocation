import React, { useState } from "react";
import EventsTab from "./pages/EventsTab";
import SessionsPage from "./pages/SessionsPage";
import AllocateSeatsPage from "./pages/AllocateSeatsPage";
import AllocatedAttendeesPage from "./pages/AllocatedAttendeesPage";

// ── EVENTS ─────────────────────────────────────────────
const MOCK_EVENTS = [
  {
    id: 1,
    name: "Internal Training Programme",
    date: "2025-09-12",
    venue: "Company HQ",
  },
];

// ── FIXED TIME SLOTS ───────────────────────────────────
const MOCK_SESSIONS = {
  1: [
    { id: 101, name: "Morning Session", time: "09:00 - 10:30", room: "Room A", capacity: 20 },
    { id: 102, name: "Midday Session", time: "11:00 - 12:30", room: "Room B", capacity: 20 },
    { id: 103, name: "Afternoon Session", time: "13:00 - 14:30", room: "Room C", capacity: 20 },
  ],
};

// PARTICIPANTS ──────────────────────────────────────
const DIVISION_PARTICIPANTS = [
  { id: "P001", name: "Sipho Nkosi", email: "sipho@example.com", dept: "Engineering" },
  { id: "P002", name: "Ayanda Dlamini", email: "ayanda@example.com", dept: "Marketing" },
  { id: "P003", name: "Lerato Mokoena", email: "lerato@example.com", dept: "Finance" },
  { id: "P004", name: "Thabo Sithole", email: "thabo@example.com", dept: "HR" },
  { id: "P005", name: "Nomvula Zulu", email: "nomvula@example.com", dept: "IT" },
];

// ── DIVISION RULES ─────────────────────────────────────
const getDivision = (dept) => {
  switch (dept) {
    case "Engineering":
    case "IT":
      return "A";
    case "Marketing":
    case "Operations":
      return "B";
    default:
      return "C";
  }
};

// ── APP ────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("events");

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  const [allocations, setAllocations] = useState({});

  const navigate = (to, extras = {}) => {
    if (extras.event) setSelectedEvent(extras.event);
    if (extras.session) setSelectedSession(extras.session);
    setPage(to);
  };

  // ── SAFE ALLOCATION ───────────────────────────────────
  const allocateParticipant = (sessionId, participantId) => {
    const participant = DIVISION_PARTICIPANTS.find(
      (p) => p.id === participantId
    );

    if (!participant) return;

    const division = getDivision(participant.dept);
    const current = allocations[sessionId] || [];

    // session capacity rule
    if (current.length >= 20) {
      alert("Session full (max 20)");
      return;
    }

    // division limits
    const divisionCount = current.filter((id) => {
      const p = DIVISION_PARTICIPANTS.find((x) => x.id === id);
      return p && getDivision(p.dept) === division;
    }).length;

    const limit = division === "A" ? 8 : 6;

    if (divisionCount >= limit) {
      alert(`Division ${division} limit reached`);
      return;
    }

    setAllocations((prev) => ({
      ...prev,
      [sessionId]: [...current, participantId],
    }));
  };

  const removeAllocation = (sessionId, participantId) => {
    setAllocations((prev) => ({
      ...prev,
      [sessionId]: (prev[sessionId] || []).filter(
        (id) => id !== participantId
      ),
    }));
  };

  const getAllocated = (sessionId) =>
    (allocations[sessionId] || [])
      .map((id) => DIVISION_PARTICIPANTS.find((p) => p.id === id))
      .filter(Boolean);

  const getUnallocated = (sessionId) => {
    const allocated = allocations[sessionId] || [];
    return DIVISION_PARTICIPANTS.filter(
      (p) => !allocated.includes(p.id)
    );
  };

  // ── RENDER ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-base-200">

      <main className="p-6 max-w-4xl mx-auto">

        {page === "events" && (
          <EventsTab
            events={MOCK_EVENTS}
            onSelectEvent={(event) =>
              navigate("sessions", { event })
            }
          />
        )}

        {page === "sessions" && (
          <SessionsPage
            event={selectedEvent}
            sessions={MOCK_SESSIONS[selectedEvent?.id] || []}
            allocations={allocations}
            onSelectSession={(session) =>
              navigate("allocate", { session })
            }
            onBack={() => navigate("events")}
          />
        )}

        {page === "allocate" && (
          <AllocateSeatsPage
            session={selectedSession}
            event={selectedEvent}
            allocatedCount={
              (allocations[selectedSession?.id] || []).length
            }
            onViewAttendees={() => navigate("attendees")}
            onBack={() =>
              navigate("sessions", { event: selectedEvent })
            }
          />
        )}

        {page === "attendees" && selectedSession && (
          <AllocatedAttendeesPage
            session={selectedSession}
            event={selectedEvent}
            allocated={getAllocated(selectedSession.id)}
            unallocated={getUnallocated(selectedSession.id)}
            onAllocate={(pid) =>
              allocateParticipant(selectedSession.id, pid)
            }
            onRemove={(pid) =>
              removeAllocation(selectedSession.id, pid)
            }
            onDone={() =>
              navigate("sessions", { event: selectedEvent })
            }
          />
        )}

      </main>
    </div>
  );
}