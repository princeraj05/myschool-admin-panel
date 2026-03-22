import { useEffect, useState } from "react";
import axios from "axios";
import { FaBook, FaSchool, FaTrash, FaPlus, FaLayerGroup } from "react-icons/fa";

function Subjects() {
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ name: "", classId: "" });
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/api/admin/subjects`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ name: "", classId: "" });
      fetchSubjects();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    try {
      await axios.delete(`${API}/api/admin/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSubjects();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">Subjects</h1>
        <p className="text-sm text-slate-500 mt-0.5">Add and manage subjects for each class</p>
      </div>

      {/* Add Subject Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
            <FaPlus className="text-white text-xs" />
          </div>
          <h2 className="text-base font-bold text-slate-700">Add New Subject</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          {/* Subject Name */}
          <div className="relative flex-1">
            <FaBook className="absolute top-1/2 -translate-y-1/2 left-3.5 text-slate-400 text-sm" />
            <input
              name="name"
              placeholder="Subject Name (e.g. Mathematics)"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition bg-slate-50"
            />
          </div>

          {/* Class Select */}
          <div className="relative flex-1">
            <FaSchool className="absolute top-1/2 -translate-y-1/2 left-3.5 text-slate-400 text-sm pointer-events-none" />
            <select
              name="classId"
              value={form.classId}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition bg-slate-50 appearance-none cursor-pointer"
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
            className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 active:scale-[0.98] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-teal-500/25 transition-all disabled:opacity-60 whitespace-nowrap"
          >
            <FaPlus className="text-xs" />
            {loading ? "Adding…" : "Add Subject"}
          </button>
        </form>
      </div>

      {/* Subjects Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-700">All Subjects</h2>
          <span className="text-xs font-semibold bg-teal-50 text-teal-600 px-2.5 py-1 rounded-full">
            {subjects.length} total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 sm:px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
                <th className="px-5 sm:px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                <th className="px-5 sm:px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Class</th>
                <th className="px-5 sm:px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center">
                    <FaBook className="text-slate-300 text-3xl mx-auto mb-2" />
                    <p className="text-slate-400 text-sm font-medium">No subjects found</p>
                    <p className="text-slate-300 text-xs mt-1">Add your first subject above</p>
                  </td>
                </tr>
              ) : (
                subjects.map((s, i) => (
                  <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 sm:px-6 py-4 text-sm text-slate-400 font-medium">{i + 1}</td>
                    <td className="px-5 sm:px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">
                        <FaBook className="text-xs" />
                        {s.name}
                      </span>
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-semibold">
                        <FaLayerGroup className="text-xs" />
                        {s.class?.name} — {s.class?.section}
                      </span>
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <button
                        onClick={() => deleteSubject(s._id)}
                        className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      >
                        <FaTrash className="text-xs" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Subjects;