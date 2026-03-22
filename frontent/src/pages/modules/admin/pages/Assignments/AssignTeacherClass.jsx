import { useEffect, useState } from "react";
import axios from "axios";
import { FaSchool, FaChalkboardTeacher, FaCheckCircle, FaLayerGroup } from "react-icons/fa";

function AssignTeacherClass() {
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classId, setClassId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { fetchClasses(); fetchTeachers(); }, []);

  const fetchClasses = async () => {
    const res = await axios.get(`${API}/api/admin/classes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setClasses(res.data);
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
        `${API}/api/admin/assign/assign-teacher-class`,
        { classId, teacherId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setClassId("");
      setTeacherId("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  const selectedClass   = classes.find((c) => c._id === classId);
  const selectedTeacher = teachers.find((t) => t._id === teacherId);

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Assign Teacher</h1>
        <p className="text-sm text-slate-500 mt-1">Assign a teacher to a class section</p>
      </div>

      <div className="max-w-xl">

        {/* Success banner */}
        {success && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-4 mb-5 text-sm font-semibold">
            <FaCheckCircle className="text-emerald-500 text-lg flex-shrink-0" />
            Teacher assigned successfully!
          </div>
        )}

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Card header accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-teal-400 to-emerald-400" />

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-400/30">
                <FaChalkboardTeacher className="text-white text-base" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Assign Teacher to Class</h2>
                <p className="text-xs text-slate-400 mt-0.5">Select a class and teacher below</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Select Class */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Class
                </label>
                <div className="relative">
                  <FaSchool className="absolute top-1/2 -translate-y-1/2 left-3.5 text-slate-400 text-sm pointer-events-none" />
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent appearance-none cursor-pointer transition"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        Class {cls.name} — Section {cls.section}
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
                    className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent appearance-none cursor-pointer transition"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preview pill */}
              {selectedClass && selectedTeacher && (
                <div className="flex flex-wrap items-center gap-2 bg-teal-50 border border-teal-100 rounded-xl px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 bg-white border border-teal-200 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-full">
                    <FaSchool className="text-xs" />
                    Class {selectedClass.name} – {selectedClass.section}
                  </span>
                  <span className="text-slate-400 text-xs font-bold">←</span>
                  <span className="inline-flex items-center gap-1.5 bg-white border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full">
                    <FaChalkboardTeacher className="text-xs" />
                    {selectedTeacher.name}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 active:scale-[0.98] text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-teal-400/30 transition-all disabled:opacity-60 mt-2"
              >
                {loading ? "Assigning…" : "Assign Teacher →"}
              </button>
            </form>
          </div>
        </div>

        {/* Info note */}
        <p className="text-xs text-slate-400 mt-4 text-center">
          A teacher can be assigned to multiple classes. Previous assignments remain unchanged.
        </p>
      </div>
    </div>
  );
}

export default AssignTeacherClass;