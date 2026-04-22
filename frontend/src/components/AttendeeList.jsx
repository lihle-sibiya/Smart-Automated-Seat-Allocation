const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:8080/api";

// ── Mock data (60 participants) ──────────────────────────────────────────────
const MOCK_PARTICIPANTS = (() => {
  const config   = [
    { dept: "Division A", perSession: [8, 8, 8] },
    { dept: "Division B", perSession: [6, 6, 6] },
    { dept: "Division C", perSession: [6, 6, 6] },
  ];
  const sessions   = ["Morning", "Midday", "Afternoon"];
  const firstNames = ["Thabo","Sipho","Nomsa","Zanele","Lerato","Kefilwe","Andile",
    "Bongani","Precious","Thandeka","Lungelo","Nandi","Siyanda","Mpho","Rethabile",
    "Kgomotso","Ntombi","Lebo","Jabu","Vusi","Ayanda","Sanele","Sne","Nhlanhla"];
  const lastNames  = ["Nkosi","Dlamini","Ndlovu","Khumalo","Mthembu","Sithole",
    "Zulu","Mkhize","Shabalala","Cele","Ntuli","Mhlongo","Vilakazi","Ngcobo","Buthelezi"];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  let id = 1;
  const list = [];
  config.forEach(({ dept, perSession }) => {
    sessions.forEach((session, si) => {
      for (let j = 0; j < perSession[si]; j++) {
        const name = `${pick(firstNames)} ${pick(lastNames)}`;
        list.push({
          id,
          employeeId: `EMP${String(id).padStart(3, "0")}`,
          name,
          email: `${name.toLowerCase().replace(" ", ".")}@company.co.za`,
          department: dept,
          session,
        });
        id++;
      }
    });
  });
  return list;
})();

const DEPT_BADGE = {
  "Division A": "badge-info",
  "Division B": "badge-secondary",
  "Division C": "badge-success",
};
const SESSION_BADGE = {
  Morning:   "badge-warning",
  Midday:    "badge-error",
  Afternoon: "badge-info",
};
const SESSION_ICON = { Morning: "🌅", Midday: "☀️", Afternoon: "🌤️" };

const DEPTS    = ["All", "Division A", "Division B", "Division C"];
const SESSIONS = ["All", "Morning", "Midday", "Afternoon", "Unassigned"];
const PAGE_SIZE = 15;

export default function AttendeeList() {
  const [participants,  setParticipants]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [deptFilter,    setDeptFilter]    = useState("All");
  const [sessionFilter, setSessionFilter] = useState("All");
  const [sortField,     setSortField]     = useState("name");
  const [sortDir,       setSortDir]       = useState("asc");
  const [page,          setPage]          = useState(1);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/allocations`);
      if (!res.ok) throw new Error();
      setParticipants(await res.json());
    } catch {
      setParticipants(MOCK_PARTICIPANTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchParticipants(); }, []);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...participants];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.employeeId.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q)
      );
    }
    if (deptFilter !== "All")
      list = list.filter((p) => p.department === deptFilter);
    if (sessionFilter !== "All") {
      if (sessionFilter === "Unassigned")
        list = list.filter((p) => !p.session);
      else
        list = list.filter((p) => p.session === sessionFilter);
    }

    list.sort((a, b) => {
      let va = (a[sortField] ?? "").toString().toLowerCase();
      let vb = (b[sortField] ?? "").toString().toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ?  1 : -1;
      return 0;
    });
    return list;
  }, [participants, search, deptFilter, sessionFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
    setPage(1);
  };

  const sortIcon = (field) =>
    sortField !== field ? " ⇅" : sortDir === "asc" ? " ▲" : " ▼";

  const stats = useMemo(() => {
    const assigned   = participants.filter((p) => p.session).length;
    return { total: participants.length, assigned, unassigned: participants.length - assigned };
  }, [participants]);

  const clearFilters = () => {
    setSearch(""); setDeptFilter("All"); setSessionFilter("All");
    setSortField("name"); setSortDir("asc"); setPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-10">

      {/* Page title */}
      <div className="mb-6 pt-2">
        <h2 className="text-2xl font-extrabold tracking-tight">Attendees</h2>
        <p className="text-sm text-base-content/50">All 60 participants · session allocations</p>
      </div>

      {/* Summary stats */}
      <div className="stats shadow w-full mb-6 border border-base-200">
        <div className="stat">
          <div className="stat-figure text-primary text-2xl">👥</div>
          <div className="stat-title">Total</div>
          <div className="stat-value text-primary">{stats.total}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-success text-2xl">✅</div>
          <div className="stat-title">Assigned</div>
          <div className="stat-value text-success">{stats.assigned}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-warning text-2xl">⏳</div>
          <div className="stat-title">Unassigned</div>
          <div className="stat-value text-warning">{stats.unassigned}</div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <input
          type="text"
          placeholder="🔍 Search name, ID or email…"
          className="input input-bordered input-sm flex-1 min-w-48"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className="select select-bordered select-sm"
          value={deptFilter}
          onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
        >
          {DEPTS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select
          className="select select-bordered select-sm"
          value={sessionFilter}
          onChange={(e) => { setSessionFilter(e.target.value); setPage(1); }}
        >
          {SESSIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
          Clear
        </button>
        <span className="text-xs text-base-content/40 ml-auto">
          {filtered.length} of {participants.length} shown
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-200 shadow">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                {[
                  { label: "Emp ID",     field: "employeeId"  },
                  { label: "Name",       field: "name"        },
                  { label: "Email",      field: "email"       },
                  { label: "Department", field: "department"  },
                  { label: "Session",    field: "session"     },
                ].map(({ label, field }) => (
                  <th
                    key={field}
                    className="cursor-pointer select-none hover:bg-base-300 transition-colors"
                    onClick={() => handleSort(field)}
                  >
                    {label}
                    <span className="text-base-content/30 text-xs">{sortIcon(field)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-base-content/40">
                    No participants match your filters.
                  </td>
                </tr>
              ) : (
                paginated.map((p) => (
                  <tr key={p.id} className="hover">
                    <td className="font-mono text-xs text-base-content/60">{p.employeeId}</td>
                    <td className="font-semibold">{p.name}</td>
                    <td className="text-xs text-base-content/60">{p.email}</td>
                    <td>
                      <span className={`badge ${DEPT_BADGE[p.department]} badge-sm font-semibold`}>
                        {p.department}
                      </span>
                    </td>
                    <td>
                      {p.session ? (
                        <span className={`badge ${SESSION_BADGE[p.session]} badge-sm font-semibold`}>
                          {SESSION_ICON[p.session]} {p.session}
                        </span>
                      ) : (
                        <span className="badge badge-ghost badge-sm">⏳ Unassigned</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="join">
            <button
              className="join-item btn btn-sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              «
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`join-item btn btn-sm ${p === page ? "btn-active" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="join-item btn btn-sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
