import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBook, FaSchool, FaTrash, FaPlus,
  FaLayerGroup, FaSearch
} from "react-icons/fa";

function Subjects() {
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ name: "", classId: "" });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchClasses = async () => {
    const res = await axios.get(`${API}/api/admin/classes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setClasses(res.data);
  };

  const fetchSubjects = async () => {
    const res = await axios.get(`${API}/api/admin/subjects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSubjects(res.data);
  };

  useEffect(() => { fetchSubjects(); fetchClasses(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/api/admin/subjects`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ name: "", classId: "" });
      fetchSubjects();
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const deleteSubject = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    setDeleteId(id);
    try {
      await axios.delete(`${API}/api/admin/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSubjects();
    } catch (err) { console.log(err); }
    finally { setDeleteId(null); }
  };

  const palette = [
    { grad: "from-teal-400 to-emerald-500",   light: "bg-teal-50 text-teal-700",     cls: "bg-slate-100 text-slate-600" },
    { grad: "from-cyan-400 to-teal-500",       light: "bg-cyan-50 text-cyan-700",     cls: "bg-slate-100 text-slate-600" },
    { grad: "from-emerald-400 to-green-500",   light: "bg-emerald-50 text-emerald-700", cls: "bg-slate-100 text-slate-600" },
    { grad: "from-sky-400 to-cyan-500",        light: "bg-sky-50 text-sky-700",       cls: "bg-slate-100 text-slate-600" },
    { grad: "from-indigo-400 to-blue-500",     light: "bg-indigo-50 text-indigo-700", cls: "bg-slate-100 text-slate-600" },
    { grad: "from-violet-400 to-indigo-500",   light: "bg-violet-50 text-violet-700", cls: "bg-slate-100 text-slate-600" },
  ];

  const filtered = subjects.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.class?.name?.toString().includes(search)
  );

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,0.09); }
      `}</style>

      {/* ── Page Header ── */}
      <div className="mb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Subjects</h1>
          <p className="text-sm text-slate-500 mt-1">Add and manage subjects for each class</p>
        </div>
        <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-2xl px-4 py-2.5 w-fit">
          <FaBook className="text-teal-500" />
          <span className="text-sm font-bold text-teal-700">{subjects.length} Subjects</span>
        </div>
      </div>

      {/* ── Add Subject Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-400/30">
            <FaPlus className="text-white text-sm" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Add New Subject</h2>
            <p className="text-xs text-slate-400">Fill details and hit Add Subject</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          {/* Subject name */}
          <div className="relative flex-1">
            <FaBook className="absolute top-1/2 -translate-y-1/2 left-3.5 text-slate-400 text-sm pointer-events-none" />
            <input
              name="name"
              placeholder="Subject Name  (e.g. Mathematics)"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-slate-50 transition"
            />
          </div>

          {/* Class select */}
          <div className="relative flex-1">
            <FaSchool className="absolute top-1/2 -translate-y-1/2 left-3.5 text-slate-400 text-sm pointer-events-none" />
            <select
              name="classId"
              value={form.classId}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-slate-50 appearance-none cursor-pointer transition"
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  Class {c.name} — Section {c.section}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 active:scale-95 text-white px-7 py-3 rounded-xl text-sm font-bold shadow-md shadow-teal-400/30 transition-all disabled:opacity-60 whitespace-nowrap"
          >
            <FaPlus className="text-xs" />
            {loading ? "Adding…" : "Add Subject"}
          </button>
        </form>
      </div>

      {/* ── Subjects List ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-800">All Subjects</h2>
          <div className="relative w-full sm:w-56">
            <FaSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 text-xs pointer-events-none" />
            <input
              type="text"
              placeholder="Search subjects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-slate-50 transition"
            />
          </div>
        </div>

        {/* ── Mobile: Cards ── */}
        <div className="sm:hidden p-4 grid grid-cols-1 gap-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <FaBook className="text-slate-300 text-4xl mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-semibold">No subjects found</p>
            </div>
          ) : (
            filtered.map((s, i) => {
              const p = palette[i % palette.length];
              return (
                <div key={s._id} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-4 hover-lift">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.grad} flex items-center justify-center shadow-md`}>
                      <FaBook className="text-white text-sm" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{s.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Class {s.class?.name} · Sec {s.class?.section}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSubject(s._id)}
                    disabled={deleteId === s._id}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-500 text-red-400 hover:text-white transition-all"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* ── Desktop: Table ── */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-12">#</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Section</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center">
                    <FaBook className="text-slate-300 text-4xl mx-auto mb-3" />
                    <p className="text-slate-400 text-sm font-semibold">No subjects found</p>
                    <p className="text-slate-300 text-xs mt-1">Add your first subject above</p>
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => {
                  const p = palette[i % palette.length];
                  return (
                    <tr key={s._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-400 font-medium">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${p.grad} flex items-center justify-center shadow-sm`}>
                            <FaBook className="text-white text-xs" />
                          </div>
                          <span className="text-sm font-bold text-slate-700">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-xs font-bold">
                          <FaSchool className="text-xs" />
                          Class {s.class?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 ${p.light} px-3 py-1.5 rounded-full text-xs font-bold`}>
                          <FaLayerGroup className="text-xs" />
                          Section {s.class?.section}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteSubject(s._id)}
                          disabled={deleteId === s._id}
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                        >
                          <FaTrash className="text-xs" />
                          {deleteId === s._id ? "Deleting…" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Subjects;