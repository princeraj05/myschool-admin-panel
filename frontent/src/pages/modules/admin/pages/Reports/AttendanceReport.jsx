import { useEffect, useState } from "react";
import axios from "axios";

function AttendanceReport() {
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(`${API}/api/attendance/report`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const filtered =
    filter === "All" ? data : data.filter((d) => d.status === filter);

  const presentCount = data.filter((d) => d.status === "Present").length;
  const absentCount = data.filter((d) => d.status === "Absent").length;
  const rate =
    data.length > 0 ? Math.round((presentCount / data.length) * 100) : 0;

  const initials = (name) =>
    name
      ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
      : "?";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        .report-wrap { font-family: 'Sora', sans-serif; }

        .glass {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .dot-pattern {
          background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 24px 24px;
        }

        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: border-color 0.2s, transform 0.2s;
        }
        .stat-card:hover { border-color: rgba(99,102,241,0.35); transform: translateY(-2px); }

        .filter-btn {
          border: 1.5px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.45);
          background: transparent;
          transition: all 0.2s;
          cursor: pointer;
        }
        .filter-btn:hover { border-color: rgba(99,102,241,0.5); color: white; }
        .filter-btn.active-all  { background: linear-gradient(135deg,#6366f1,#8b5cf6); border-color: transparent; color: white; box-shadow: 0 4px 14px rgba(99,102,241,0.4); }
        .filter-btn.active-present { background: rgba(16,185,129,0.2); border-color: #10b981; color: #6ee7b7; }
        .filter-btn.active-absent  { background: rgba(239,68,68,0.15); border-color: #ef4444; color: #fca5a5; }

        .table-row { border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.15s; }
        .table-row:hover { background: rgba(255,255,255,0.04); }

        .avatar-present { background: linear-gradient(135deg,#6366f1,#8b5cf6); }
        .avatar-absent  { background: linear-gradient(135deg,#ef4444,#f97316); }
        .avatar-default { background: linear-gradient(135deg,#475569,#64748b); }

        .badge-present { background: rgba(16,185,129,0.15); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.3); }
        .badge-absent  { background: rgba(239,68,68,0.12); color: #fca5a5; border: 1px solid rgba(239,68,68,0.3); }

        .progress-bar { background: rgba(255,255,255,0.07); border-radius: 999px; overflow: hidden; }
        .progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #6366f1, #10b981);
          transition: width 0.8s ease;
        }

        .top-bar { background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899); }

        ::-webkit-scrollbar { height: 5px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 99px; }
      `}</style>

      <div className="report-wrap max-w-6xl mx-auto">

        {/* Page header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
          <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase">
            Admin Console
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
        </div>

        <h1 className="text-white text-2xl sm:text-3xl font-bold text-center mb-6 tracking-tight">
          Attendance Report
        </h1>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">

          {/* Total */}
          <div className="stat-card rounded-2xl p-4 sm:p-5">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-1">
              Total Records
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-white">
              {data.length}
            </p>
            <p className="text-xs text-slate-600 mt-1">all entries</p>
          </div>

          {/* Present */}
          <div className="stat-card rounded-2xl p-4 sm:p-5">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-1">
              Present
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400">
              {presentCount}
            </p>
            <p className="text-xs text-slate-600 mt-1">students attended</p>
          </div>

          {/* Absent */}
          <div className="stat-card rounded-2xl p-4 sm:p-5 col-span-2 sm:col-span-1">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-1">
              Absent
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-red-400">
              {absentCount}
            </p>
            <p className="text-xs text-slate-600 mt-1">students missed</p>
          </div>

        </div>

        {/* Attendance rate bar */}
        <div className="glass rounded-2xl p-4 sm:p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400 font-medium">
              Overall Attendance Rate
            </span>
            <span className="text-sm font-bold text-white">{rate}%</span>
          </div>
          <div className="progress-bar h-2">
            <div className="progress-fill" style={{ width: `${rate}%` }} />
          </div>
        </div>

        {/* Main table card */}
        <div className="glass rounded-2xl dot-pattern overflow-hidden">
          <div className="top-bar h-1 w-full" />

          {/* Filter + count row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 pt-5 pb-4">
            <p className="text-slate-400 text-sm">
              Showing{" "}
              <span className="text-white font-semibold">{filtered.length}</span>{" "}
              record{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="flex gap-2 flex-wrap">
              {["All", "Present", "Absent"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`filter-btn px-4 py-1.5 rounded-xl text-xs font-semibold ${
                    filter === f
                      ? f === "All"
                        ? "active-all"
                        : f === "Present"
                        ? "active-present"
                        : "active-absent"
                      : ""
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <p className="text-slate-500 text-sm">Loading attendance...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-2xl mb-1">
                📋
              </div>
              <p className="text-slate-400 font-medium">No records found</p>
              <p className="text-slate-600 text-sm">Try changing the filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr>
                    {["Student", "Class", "Teacher", "Status", "Date"].map((h) => (
                      <th
                        key={h}
                        className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest border-b border-white/5"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item._id} className="table-row">

                      {/* Student */}
                      <td className="px-4 sm:px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                              item.status === "Present"
                                ? "avatar-present"
                                : item.status === "Absent"
                                ? "avatar-absent"
                                : "avatar-default"
                            }`}
                          >
                            {initials(item.student?.name)}
                          </div>
                          <span className="text-white text-sm font-medium whitespace-nowrap">
                            {item.student?.name || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="px-4 sm:px-6 py-3.5">
                        <span className="text-slate-300 text-sm">
                          {item.class?.name || "—"}
                        </span>
                      </td>

                      {/* Teacher */}
                      <td className="px-4 sm:px-6 py-3.5">
                        <span className="text-slate-300 text-sm">
                          {item.teacher?.name || "—"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 sm:px-6 py-3.5">
                        <span
                          className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                            item.status === "Present"
                              ? "badge-present"
                              : "badge-absent"
                          }`}
                        >
                          {item.status === "Present" ? "✓ Present" : "✗ Absent"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 sm:px-6 py-3.5">
                        <span className="text-slate-400 text-sm whitespace-nowrap">
                          {new Date(item.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-4 sm:px-6 py-4 border-t border-white/5">
            <p className="text-xs text-slate-600 text-center">
              Data is fetched live from server · Last refreshed on page load
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AttendanceReport;