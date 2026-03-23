import { useEffect, useState } from "react";
import axios from "axios";
import { FaBookOpen, FaCalendarAlt, FaClock, FaSearch } from "react-icons/fa";

function StudentExams() {
  const API = import.meta.env.VITE_API_URL;
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${API}/api/student/exams`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setExams(res.data))
      .catch((err) => console.log(err));
  }, []);

  const filtered = exams.filter((e) =>
    e.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const getDaysLeft = (dateStr) => {
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getBadge = (days) => {
    if (days < 0) return { label: "Passed", cls: "bg-slate-100 text-slate-400 border-slate-200" };
    if (days === 0) return { label: "Today!", cls: "bg-rose-50 text-rose-600 border-rose-200" };
    if (days <= 3) return { label: `${days}d left`, cls: "bg-rose-50 text-rose-600 border-rose-100" };
    if (days <= 7) return { label: `${days}d left`, cls: "bg-amber-50 text-amber-600 border-amber-100" };
    return { label: `${days}d left`, cls: "bg-teal-50 text-teal-600 border-teal-100" };
  };

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          Upcoming Exams
        </h1>
        <p className="text-sm text-slate-400 mt-1">Stay prepared — your exam schedule at a glance.</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-7">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-2xl p-5 shadow-lg shadow-teal-500/25 relative overflow-hidden">
          <div className="absolute -top-3 -right-3 w-20 h-20 rounded-full bg-white/10" />
          <p className="text-xs font-semibold text-white/70 mb-1">Total Exams</p>
          <p className="text-4xl font-extrabold">{exams.length}</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl p-5 shadow-lg shadow-indigo-500/25 relative overflow-hidden">
          <div className="absolute -top-3 -right-3 w-20 h-20 rounded-full bg-white/10" />
          <p className="text-xs font-semibold text-white/70 mb-1">This Week</p>
          <p className="text-4xl font-extrabold">
            {exams.filter((e) => { const d = getDaysLeft(e.date); return d >= 0 && d <= 7; }).length}
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-5 shadow-lg shadow-amber-500/25 relative overflow-hidden">
          <div className="absolute -top-3 -right-3 w-20 h-20 rounded-full bg-white/10" />
          <p className="text-xs font-semibold text-white/70 mb-1">Next Exam</p>
          <p className="text-lg font-extrabold leading-tight truncate">
            {exams.filter((e) => getDaysLeft(e.date) >= 0).sort((a, b) => new Date(a.date) - new Date(b.date))[0]?.subject || "—"}
          </p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Exam Schedule</h2>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search subject…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition w-52"
            />
          </div>
        </div>

        {/* Table (md+) / Cards (mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">#</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">Subject</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">Exam Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">Countdown</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-14 text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <FaBookOpen className="text-3xl text-slate-200" />
                      <span className="text-sm">No exams found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((e, i) => {
                  const days = getDaysLeft(e.date);
                  const badge = getBadge(days);
                  return (
                    <tr key={i} className="border-b border-slate-50 hover:bg-teal-50/40 transition-colors">
                      <td className="px-5 py-4 text-slate-400 font-medium">{i + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                            <FaBookOpen className="text-teal-500 text-xs" />
                          </div>
                          <span className="font-semibold text-slate-800">{e.subject}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <FaCalendarAlt className="text-teal-400 text-xs shrink-0" />
                          {new Date(e.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${badge.cls}`}>
                          <FaClock className="text-[9px]" />
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="text-center py-14 text-slate-400 flex flex-col items-center gap-2">
              <FaBookOpen className="text-3xl text-slate-200" />
              <span className="text-sm">No exams found</span>
            </div>
          ) : (
            filtered.map((e, i) => {
              const days = getDaysLeft(e.date);
              const badge = getBadge(days);
              return (
                <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-teal-50/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                      <FaBookOpen className="text-teal-500 text-sm" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{e.subject}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <FaCalendarAlt className="text-[10px]" />
                        {new Date(e.date).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${badge.cls}`}>
                    <FaClock className="text-[9px]" />
                    {badge.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');`}</style>
    </div>
  );
}

export default StudentExams;