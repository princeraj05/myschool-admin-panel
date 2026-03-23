import { useEffect, useState } from "react";
import axios from "axios";
import { FaCalendarCheck, FaCalendarTimes, FaFilter } from "react-icons/fa";

function StudentAttendance() {
  const API = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API}/api/student/attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const filtered = filter === "All" ? data : data.filter((a) => a.status === filter);
  const present = data.filter((a) => a.status === "Present").length;
  const absent = data.filter((a) => a.status === "Absent").length;
  const percent = data.length ? Math.round((present / data.length) * 100) : 0;

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          My Attendance
        </h1>
        <p className="text-sm text-slate-400 mt-1">Track your presence across all sessions.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-2xl p-5 shadow-lg shadow-teal-500/25 relative overflow-hidden">
          <div className="absolute -top-3 -right-3 w-20 h-20 rounded-full bg-white/10" />
          <p className="text-xs font-semibold text-white/70 mb-1">Total Classes</p>
          <p className="text-4xl font-extrabold">{data.length}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-5 shadow-lg shadow-emerald-500/25 relative overflow-hidden">
          <div className="absolute -top-3 -right-3 w-20 h-20 rounded-full bg-white/10" />
          <p className="text-xs font-semibold text-white/70 mb-1">Present</p>
          <p className="text-4xl font-extrabold">{present}</p>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-2xl p-5 shadow-lg shadow-rose-500/25 relative overflow-hidden">
          <div className="absolute -top-3 -right-3 w-20 h-20 rounded-full bg-white/10" />
          <p className="text-xs font-semibold text-white/70 mb-1">Absent</p>
          <p className="text-4xl font-extrabold">{absent}</p>
        </div>
      </div>

      {/* Progress bar */}
      {data.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
          <div className="flex justify-between text-sm font-semibold text-slate-600 mb-2">
            <span>Attendance Rate</span>
            <span className={percent >= 75 ? "text-teal-600" : "text-rose-500"}>{percent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                percent >= 75
                  ? "bg-gradient-to-r from-teal-400 to-emerald-400"
                  : "bg-gradient-to-r from-rose-400 to-red-400"
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {percent >= 75 ? "✅ You meet the 75% attendance requirement." : "⚠️ Below the 75% minimum threshold."}
          </p>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Attendance Records</h2>
          <div className="flex items-center gap-2">
            <FaFilter className="text-slate-400 text-xs" />
            {["All", "Present", "Absent"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  filter === f
                    ? "bg-teal-500 text-white shadow-sm shadow-teal-400/30"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  #
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Date
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-14 text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <FaCalendarCheck className="text-3xl text-slate-200" />
                      <span className="text-sm">No attendance records found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((a, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-50 hover:bg-teal-50/40 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-slate-400 font-medium">{i + 1}</td>
                    <td className="px-5 py-3.5 text-slate-700 font-medium">
                      <div className="flex items-center gap-2">
                        <FaCalendarCheck className="text-teal-400 text-xs shrink-0" />
                        {new Date(a.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${
                          a.status === "Present"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}
                      >
                        {a.status === "Present" ? (
                          <FaCalendarCheck className="text-[10px]" />
                        ) : (
                          <FaCalendarTimes className="text-[10px]" />
                        )}
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');`}</style>
    </div>
  );
}

export default StudentAttendance;