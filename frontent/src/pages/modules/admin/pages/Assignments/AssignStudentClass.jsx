import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserGraduate, FaSchool, FaCheckCircle } from "react-icons/fa";

function AssignStudentClass() {
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [classId, setClassId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { fetchClasses(); fetchStudents(); }, []);

  const fetchClasses = async () => {
    const res = await axios.get(`${API}/api/admin/classes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setClasses(res.data);
  };

  const fetchStudents = async () => {
    const res = await axios.get(`${API}/api/admin/users/students`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStudents(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${API}/api/admin/assign/assign-student-class`,
        { classId, studentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setClassId("");
      setStudentId("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  const selectedClass   = classes.find((c) => c._id === classId);
  const selectedStudent = students.find((s) => s._id === studentId);

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Assign Student</h1>
        <p className="text-sm text-slate-500 mt-1">Assign a student to a class section</p>
      </div>

      <div className="max-w-xl">

        {/* Success banner */}
        {success && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-4 mb-5 text-sm font-semibold">
            <FaCheckCircle className="text-emerald-500 text-lg flex-shrink-0" />
            Student assigned successfully!
          </div>
        )}

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 to-teal-400" />

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-md shadow-cyan-400/30">
                <FaUserGraduate className="text-white text-base" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Assign Student to Class</h2>
                <p className="text-xs text-slate-400 mt-0.5">Select a class and student below</p>
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
                    className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent appearance-none cursor-pointer transition"
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

              {/* Select Student */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Student
                </label>
                <div className="relative">
                  <FaUserGraduate className="absolute top-1/2 -translate-y-1/2 left-3.5 text-slate-400 text-sm pointer-events-none" />
                  <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent appearance-none cursor-pointer transition"
                  >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preview pill */}
              {selectedClass && selectedStudent && (
                <div className="flex flex-wrap items-center gap-2 bg-cyan-50 border border-cyan-100 rounded-xl px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 bg-white border border-cyan-200 text-cyan-700 text-xs font-bold px-3 py-1.5 rounded-full">
                    <FaSchool className="text-xs" />
                    Class {selectedClass.name} – {selectedClass.section}
                  </span>
                  <span className="text-slate-400 text-xs font-bold">←</span>
                  <span className="inline-flex items-center gap-1.5 bg-white border border-teal-200 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-full">
                    <FaUserGraduate className="text-xs" />
                    {selectedStudent.name}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 active:scale-[0.98] text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-cyan-400/30 transition-all disabled:opacity-60 mt-2"
              >
                {loading ? "Assigning…" : "Assign Student →"}
              </button>
            </form>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4 text-center">
          Assigning a student will update their class enrollment record.
        </p>
      </div>
    </div>
  );
}

export default AssignStudentClass;