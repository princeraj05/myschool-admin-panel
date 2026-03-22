import { useEffect, useState } from "react";
import axios from "axios";
import { FaCalendarAlt, FaBook, FaSchool, FaTrash, FaPlus } from "react-icons/fa";

function ExamSchedule() {
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ classId: "", subjectId: "", date: "" });

  useEffect(() => {
    fetchExams();
    fetchClasses();
    fetchSubjects();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await axios.get(`${API}/api/exams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExams(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/api/exams`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ classId: "", subjectId: "", date: "" });
      fetchExams();
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteExam = async (id) => {
    await axios.delete(`${API}/api/exams/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setExams(exams.filter((e) => e._id !== id));
  };

  // Count exams per subject for the stat pills
  const upcomingCount = exams.filter(
    (e) => new Date(e.date) >= new Date()
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        .exam-wrap { font-family: 'Sora', sans-serif; }

        .glass {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .dot-pattern {
          background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .top-bar { background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899); }

        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: border-color 0.2s, transform 0.2s;
        }
        .stat-card:hover { border-color: rgba(99,102,241,0.35); transform: translateY(-2px); }

        /* Form fields */
        .field-wrap {
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-wrap:focus-within {
          border-color: rgba(99,102,241,0.6);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .field-wrap select,
        .field-wrap input[type="date"] {
          background: transparent;
          color: white;
          outline: none;
          width: 100%;
          padding: 10px 8px;
          font-family: 'Sora', sans-serif;
          font-size: 0.875rem;
        }
        .field-wrap select option { background: #1e293b; color: white; }
        .field-wrap input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.5);
          cursor: pointer;
        }
        select:invalid, select option[value=""] { color: rgba(255,255,255,0.35); }

        .icon-badge {
          width: 32px; height: 32px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* Submit button */
        .btn-submit {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 14px;
          font-family: 'Sora', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          padding: 11px 28px;
          cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(99,102,241,0.4);
        }
        .btn-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(99,102,241,0.55); }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Table */
        .table-row { border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.15s; }
        .table-row:hover { background: rgba(255,255,255,0.04); }

        .badge-class {
          background: rgba(99,102,241,0.15);
          color: #a5b4fc;
          border: 1px solid rgba(99,102,241,0.3);
          padding: 3px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 500;
        }
        .badge-subject {
          background: rgba(168,85,247,0.15);
          color: #d8b4fe;
          border: 1px solid rgba(168,85,247,0.3);
          padding: 3px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 500;
        }
        .badge-upcoming {
          background: rgba(16,185,129,0.12);
          color: #6ee7b7;
          border: 1px solid rgba(16,185,129,0.25);
          padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 600;
        }
        .badge-past {
          background: rgba(100,116,139,0.15);
          color: #94a3b8;
          border: 1px solid rgba(100,116,139,0.2);
          padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 600;
        }

        /* Delete button */
        .btn-delete {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          color: #fca5a5;
          border-radius: 10px;
          padding: 5px 14px;
          font-size: 0.78rem;
          font-weight: 600;
          display: flex; align-items: center; gap: 5px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
          font-family: 'Sora', sans-serif;
        }
        .btn-delete:hover { background: rgba(239,68,68,0.22); border-color: #ef4444; color: white; transform: scale(1.04); }

        ::-webkit-scrollbar { height: 5px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 99px; }
      `}</style>

      <div className="exam-wrap max-w-6xl mx-auto">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
          <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase">
            Admin Console
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
        </div>

        <h1 className="text-white text-2xl sm:text-3xl font-bold text-center mb-6 tracking-tight">
          Exam Schedule
        </h1>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="stat-card rounded-2xl p-4 sm:p-5">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-1">Total Exams</p>
            <p className="text-2xl sm:text-3xl font-bold text-white">{exams.length}</p>
            <p className="text-xs text-slate-600 mt-1">all scheduled</p>
          </div>
          <div className="stat-card rounded-2xl p-4 sm:p-5">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-1">Upcoming</p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400">{upcomingCount}</p>
            <p className="text-xs text-slate-600 mt-1">from today</p>
          </div>
          <div className="stat-card rounded-2xl p-4 sm:p-5 col-span-2 sm:col-span-1">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-1">Past</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-400">{exams.length - upcomingCount}</p>
            <p className="text-xs text-slate-600 mt-1">already held</p>
          </div>
        </div>

        {/* Create Exam Card */}
        <div className="glass rounded-2xl dot-pattern overflow-hidden mb-6">
          <div className="top-bar h-1 w-full" />
          <div className="p-5 sm:p-6">

            <div className="flex items-center gap-3 mb-5">
              <div className="icon-badge bg-indigo-500/20">
                <FaPlus className="text-indigo-400 text-sm" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-base">Schedule New Exam</h2>
                <p className="text-slate-500 text-xs mt-0.5">Fill in the details below to add an exam</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">

                {/* Class */}
                <div className="field-wrap flex items-center px-3">
                  <div className="icon-badge bg-indigo-500/20 mr-2">
                    <FaSchool className="text-indigo-400 text-xs" />
                  </div>
                  <select name="classId" value={form.classId} onChange={handleChange} required>
                    <option value="" disabled>Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name} ({cls.section})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div className="field-wrap flex items-center px-3">
                  <div className="icon-badge bg-purple-500/20 mr-2">
                    <FaBook className="text-purple-400 text-xs" />
                  </div>
                  <select name="subjectId" value={form.subjectId} onChange={handleChange} required>
                    <option value="" disabled>Select Subject</option>
                    {subjects.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="field-wrap flex items-center px-3 sm:col-span-2 lg:col-span-1">
                  <div className="icon-badge bg-pink-500/20 mr-2">
                    <FaCalendarAlt className="text-pink-400 text-xs" />
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <FaPlus className="text-xs" />
                      Add Exam
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>

        {/* Exams Table */}
        <div className="glass rounded-2xl dot-pattern overflow-hidden">
          <div className="top-bar h-1 w-full" />

          <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4">
            <div>
              <h2 className="text-white font-semibold text-base">All Exams</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                {exams.length} exam{exams.length !== 1 ? "s" : ""} total
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <p className="text-slate-500 text-sm">Loading exams...</p>
            </div>
          ) : exams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-2xl mb-1">
                📅
              </div>
              <p className="text-slate-400 font-medium">No exams scheduled yet</p>
              <p className="text-slate-600 text-sm">Use the form above to add one</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px]">
                <thead>
                  <tr>
                    {["Class", "Subject", "Date", "Status", "Action"].map((h) => (
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
                  {exams.map((e) => {
                    const isUpcoming = new Date(e.date) >= new Date();
                    return (
                      <tr key={e._id} className="table-row">

                        {/* Class */}
                        <td className="px-4 sm:px-6 py-3.5">
                          <span className="badge-class">
                            {e.class?.name} {e.class?.section ? `(${e.class.section})` : ""}
                          </span>
                        </td>

                        {/* Subject */}
                        <td className="px-4 sm:px-6 py-3.5">
                          <span className="badge-subject">{e.subject?.name || "—"}</span>
                        </td>

                        {/* Date */}
                        <td className="px-4 sm:px-6 py-3.5">
                          <span className="text-slate-300 text-sm whitespace-nowrap">
                            {new Date(e.date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 sm:px-6 py-3.5">
                          <span className={isUpcoming ? "badge-upcoming" : "badge-past"}>
                            {isUpcoming ? "Upcoming" : "Past"}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-4 sm:px-6 py-3.5">
                          <button
                            onClick={() => deleteExam(e._id)}
                            className="btn-delete"
                          >
                            <FaTrash className="text-xs" />
                            Delete
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-5 sm:px-6 py-4 border-t border-white/5">
            <p className="text-xs text-slate-600 text-center">
              Upcoming exams are highlighted · Past exams remain for records
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ExamSchedule;