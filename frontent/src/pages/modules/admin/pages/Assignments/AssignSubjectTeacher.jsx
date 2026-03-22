import { useEffect, useState } from "react";
import axios from "axios";
import { FaBook, FaChalkboardTeacher, FaCheckCircle } from "react-icons/fa";

function AssignSubjectTeacher() {
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { fetchSubjects(); fetchTeachers(); }, []);

  const fetchSubjects = async () => {
    const res = await axios.get(`${API}/api/admin/subjects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSubjects(res.data);
  };

  const fetchTeachers = async () => {
    const res = await axios.get(`${API}/api/admin/users/teachers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTeachers(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${API}/api/admin/assign/assign-subject-teacher`,
        { subjectId, teacherId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setSubjectId("");
      setTeacherId("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  const selectedSubject = subjects.find((s) => s._id === subjectId);
  const selectedTeacher = teachers.find((t) => t._id === teacherId);

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Assign Subject</h1>
        <p className="text-sm text-slate-500 mt-1">Assign a subject to a teacher</p>
      </div>

      <div className="max-w-xl">

        {/* Success banner */}
        {success && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-4 mb-5 text-sm font-semibold">
            <FaCheckCircle className="text-emerald-500 text-lg flex-shrink-0" />
            Subject assigned successfully!
          </div>
        )}

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-400 to-teal-400" />

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-teal-500 flex items-center justify-center shadow-md shadow-indigo-400/30">
                <FaBook className="text-white text-base" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Assign Subject to Teacher</h2>
                <p className="text-xs text-slate-400 mt-0.5">Select a subject and teacher below</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Select Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Subject
                </label>
                <div className="relative">
                  <FaBook className="absolute top-1/2 -translate-y-1/2 left-3.5 text-slate-400 text-sm pointer-events-none" />
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent appearance-none cursor-pointer transition"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} {s.class ? `— Class ${s.class.name} (${s.class.section})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Select Teacher */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Teacher
                </label>
                <div className="relative">
                  <FaChalkboardTeacher className="absolute top-1/2 -translate-y-1/2 left-3.5 text-slate-400 text-sm pointer-events-none" />
                  <select
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent appearance-none cursor-pointer transition"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live preview */}
              {selectedSubject && selectedTeacher && (
                <div className="flex flex-wrap items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 bg-white border border-indigo-200 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full">
                    <FaBook className="text-xs" />
                    {selectedSubject.name}
                  </span>
                  <span className="text-slate-400 text-xs font-bold">←</span>
                  <span className="inline-flex items-center gap-1.5 bg-white border border-teal-200 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-full">
                    <FaChalkboardTeacher className="text-xs" />
                    {selectedTeacher.name}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 active:scale-[0.98] text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-indigo-400/30 transition-all disabled:opacity-60 mt-2"
              >
                {loading ? "Assigning…" : "Assign Subject →"}
              </button>
            </form>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4 text-center">
          A teacher can be assigned multiple subjects. Existing assignments remain unchanged.
        </p>
      </div>
    </div>
  );
}

export default AssignSubjectTeacher;