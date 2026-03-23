import { useEffect, useState } from "react";
import axios from "axios";
import { FaBook, FaChalkboardTeacher, FaSearch, FaLayerGroup } from "react-icons/fa";

const CARD_ACCENTS = [
  { bg: "bg-teal-50", border: "border-teal-100", icon: "text-teal-500", iconBg: "bg-teal-100", dot: "bg-teal-400" },
  { bg: "bg-emerald-50", border: "border-emerald-100", icon: "text-emerald-500", iconBg: "bg-emerald-100", dot: "bg-emerald-400" },
  { bg: "bg-indigo-50", border: "border-indigo-100", icon: "text-indigo-500", iconBg: "bg-indigo-100", dot: "bg-indigo-400" },
  { bg: "bg-amber-50", border: "border-amber-100", icon: "text-amber-500", iconBg: "bg-amber-100", dot: "bg-amber-400" },
  { bg: "bg-cyan-50", border: "border-cyan-100", icon: "text-cyan-500", iconBg: "bg-cyan-100", dot: "bg-cyan-400" },
  { bg: "bg-violet-50", border: "border-violet-100", icon: "text-violet-500", iconBg: "bg-violet-100", dot: "bg-violet-400" },
];

function StudentSubjects() {
  const API = import.meta.env.VITE_API_URL;
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API}/api/student/subjects`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSubjects(res.data))
      .catch((err) => console.log(err));
  }, []);

  const filtered = subjects.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.teacher?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          My Subjects
        </h1>
        <p className="text-sm text-slate-400 mt-1">All subjects enrolled for this academic year.</p>
      </div>

      {/* Summary + Search row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* count pill */}
        <div className="flex items-center gap-2 bg-[#0f172a] text-white px-4 py-2 rounded-xl w-fit shadow-md shadow-slate-900/20">
          <FaLayerGroup className="text-teal-400 text-sm" />
          <span className="text-sm font-semibold">
            {subjects.length} Subject{subjects.length !== 1 ? "s" : ""} Enrolled
          </span>
        </div>

        {/* search */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            placeholder="Search subject or teacher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition w-60 shadow-sm"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <FaBook className="text-5xl text-slate-200 mb-3" />
          <p className="text-base font-semibold text-slate-500">No subjects found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s, i) => {
            const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
            return (
              <div
                key={i}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden"
              >
                {/* Decorative corner blob */}
                <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-40 blur-xl ${accent.dot}`} />

                <div className="flex items-start gap-4 relative z-10">
                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${accent.iconBg} ${accent.border}`}>
                    <FaBook className={`text-base ${accent.icon}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-base leading-tight truncate group-hover:text-teal-600 transition-colors">
                      {s.name}
                    </h3>

                    <div className="flex items-center gap-1.5 mt-1.5">
                      <FaChalkboardTeacher className="text-slate-400 text-xs shrink-0" />
                      <p className="text-xs text-slate-500 truncate">
                        {s.teacher ? s.teacher.name : "No Teacher Assigned"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom accent strip */}
                <div className={`mt-4 h-1 w-full rounded-full ${accent.iconBg}`}>
                  <div className={`h-1 w-1/3 rounded-full ${accent.dot} group-hover:w-full transition-all duration-500`} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');`}</style>
    </div>
  );
}

export default StudentSubjects;