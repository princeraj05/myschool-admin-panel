import { useEffect, useState } from "react";
import axios from "axios";
import { FaSchool, FaLayerGroup, FaTrash, FaPlus, FaSearch, FaGraduationCap } from "react-icons/fa";

function Classes() {
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ name: "", section: "" });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchClasses(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.section) { alert("Please fill all fields"); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/api/admin/classes`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ name: "", section: "" });
      fetchClasses();
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const deleteClass = async (id) => {
    if (!window.confirm("Delete this class?")) return;
    setDeleteId(id);
    try {
      await axios.delete(`${API}/api/admin/classes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchClasses();
    } catch (err) { console.log(err); }
    finally { setDeleteId(null); }
  };

  const sectionColors = [
    { card: "from-teal-500 to-emerald-500", light: "bg-teal-50 text-teal-700", badge: "bg-teal-500" },
    { card: "from-cyan-500 to-teal-500",    light: "bg-cyan-50 text-cyan-700",  badge: "bg-cyan-500" },
    { card: "from-emerald-500 to-green-500",light: "bg-emerald-50 text-emerald-700", badge: "bg-emerald-500" },
    { card: "from-sky-500 to-cyan-500",     light: "bg-sky-50 text-sky-700",    badge: "bg-sky-500" },
    { card: "from-indigo-500 to-blue-500",  light: "bg-indigo-50 text-indigo-700", badge: "bg-indigo-500" },
    { card: "from-violet-500 to-indigo-500",light: "bg-violet-50 text-violet-700", badge: "bg-violet-500" },
  ];

  const filtered = classes.filter(
    (c) =>
      c.name?.toString().toLowerCase().includes(search.toLowerCase()) ||
      c.section?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        .glass-card { background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); }
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,0.10); }
      `}</style>

      {/* ── Page Header ── */}
      <div className="mb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Classes</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all school classes and sections</p>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-2xl px-4 py-2.5">
            <FaSchool className="text-teal-500" />
            <span className="text-sm font-bold text-teal-700">{classes.length} Classes</span>
          </div>
        </div>
      </div>

      {/* ── Add Class Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-400/30">
            <FaPlus className="text-white text-sm" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Create New Class</h2>
            <p className="text-xs text-slate-400">Enter class details below</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FaSchool className="absolute top-1/2 -translate-y-1/2 left-3.5 text-slate-400 text-sm pointer-events-none" />
            <input
              name="name"
              placeholder="Class Name  (e.g. 10)"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-slate-50 transition"
            />
          </div>
          <div className="relative flex-1">
            <FaLayerGroup className="absolute top-1/2 -translate-y-1/2 left-3.5 text-slate-400 text-sm pointer-events-none" />
            <input
              name="section"
              placeholder="Section  (e.g. A)"
              value={form.section}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-slate-50 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 active:scale-95 text-white px-7 py-3 rounded-xl text-sm font-bold shadow-md shadow-teal-400/30 transition-all disabled:opacity-60 whitespace-nowrap"
          >
            <FaPlus className="text-xs" />
            {loading ? "Adding…" : "Add Class"}
          </button>
        </form>
      </div>

      {/* ── Classes List ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Table toolbar */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-800">All Classes</h2>
          <div className="relative w-full sm:w-56">
            <FaSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 text-xs pointer-events-none" />
            <input
              type="text"
              placeholder="Search classes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-slate-50 transition"
            />
          </div>
        </div>

        {/* ── Mobile: Card Grid ── */}
        <div className="sm:hidden p-4 grid grid-cols-1 gap-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center col-span-2">
              <FaGraduationCap className="text-slate-300 text-4xl mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-semibold">No classes found</p>
            </div>
          ) : (
            filtered.map((c, i) => {
              const color = sectionColors[i % sectionColors.length];
              return (
                <div key={c._id} className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 border border-slate-100 hover-lift">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color.card} flex items-center justify-center shadow-md`}>
                      <span className="text-white font-extrabold text-sm">{c.name}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Class {c.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Section {c.section}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteClass(c._id)}
                    disabled={deleteId === c._id}
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
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Section</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center">
                    <FaGraduationCap className="text-slate-300 text-4xl mx-auto mb-3" />
                    <p className="text-slate-400 text-sm font-semibold">No classes found</p>
                    <p className="text-slate-300 text-xs mt-1">Add your first class above</p>
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => {
                  const color = sectionColors[i % sectionColors.length];
                  return (
                    <tr key={c._id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-6 py-4 text-sm text-slate-400 font-medium">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color.card} flex items-center justify-center shadow-sm`}>
                            <span className="text-white font-extrabold text-xs">{c.name}</span>
                          </div>
                          <span className="text-sm font-bold text-slate-700">Class {c.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 ${color.light} px-3 py-1.5 rounded-full text-xs font-bold`}>
                          <FaLayerGroup className="text-xs" />
                          Section {c.section}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteClass(c._id)}
                          disabled={deleteId === c._id}
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                        >
                          <FaTrash className="text-xs" />
                          {deleteId === c._id ? "Deleting…" : "Delete"}
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

export default Classes;