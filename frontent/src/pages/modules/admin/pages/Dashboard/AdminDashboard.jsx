import { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaSchool,
  FaCalendarAlt,
  FaArrowUp,
} from "react-icons/fa";

const SORA = "'Sora', sans-serif";

// Custom Recharts tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg">
        <p className="text-slate-400 mb-0.5">{label}</p>
        <p className="text-teal-400 text-base">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

function AdminDashboard() {
  const API = import.meta.env.VITE_API_URL;

  const [data, setData] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    subjects: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.log("Dashboard error:", err);
      }
    };
    fetchDashboard();
  }, [API]);

  const chartData = [
    { name: "Students", value: data.students },
    { name: "Teachers", value: data.teachers },
    { name: "Classes",  value: data.classes  },
    { name: "Subjects", value: data.subjects },
  ];

  const BAR_COLORS = ["#14b8a6", "#06b6d4", "#6366f1", "#f59e0b"];

  const stats = [
    {
      label: "Total Students",
      value: data.students,
      icon: <FaUserGraduate />,
      grad: "from-teal-400 to-emerald-500",
      shadow: "shadow-teal-400/30",
      light: "bg-teal-50 text-teal-600",
    },
    {
      label: "Total Teachers",
      value: data.teachers,
      icon: <FaChalkboardTeacher />,
      grad: "from-cyan-400 to-teal-500",
      shadow: "shadow-cyan-400/30",
      light: "bg-cyan-50 text-cyan-600",
    },
    {
      label: "Total Classes",
      value: data.classes,
      icon: <FaSchool />,
      grad: "from-indigo-400 to-blue-500",
      shadow: "shadow-indigo-400/30",
      light: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Total Subjects",
      value: data.subjects,
      icon: <FaBook />,
      grad: "from-amber-400 to-orange-500",
      shadow: "shadow-amber-400/30",
      light: "bg-amber-50 text-amber-600",
    },
  ];

  const infoRows = [
    { icon: <FaSchool className="text-teal-500" />,         label: "Total Classes",        value: data.classes  },
    { icon: <FaUserGraduate className="text-cyan-500" />,   label: "Students Registered",  value: data.students },
    { icon: <FaChalkboardTeacher className="text-indigo-500" />, label: "Teachers Registered", value: data.teachers },
    { icon: <FaCalendarAlt className="text-amber-500" />,   label: "Academic Year",        value: "2026"        },
  ];

  return (
    <div style={{ fontFamily: SORA }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');`}</style>

      {/* ── Page Header ── */}
      <div className="mb-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal-500 mb-1">Overview</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back! Here's what's happening in TeachHub.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2.5 w-fit text-xs font-bold text-slate-500">
          <FaCalendarAlt className="text-slate-400" />
          Academic Year 2026
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden`}
          >
            {/* gradient top bar */}
            <div className={`h-1 w-full bg-gradient-to-r ${s.grad}`} />

            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center text-white text-lg shadow-md ${s.shadow}`}>
                  {s.icon}
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <FaArrowUp className="text-xs" />
                  Active
                </span>
              </div>
              <p className="text-3xl font-extrabold text-slate-800 mb-1">{s.value}</p>
              <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Bar Chart — wider */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">System Overview</h2>
              <p className="text-xs text-slate-400 mt-0.5">Total count per category</p>
            </div>
            <span className="text-xs font-bold bg-teal-50 text-teal-600 px-3 py-1 rounded-full border border-teal-100">
              Live
            </span>
          </div>
          <div className="p-5 sm:p-6">
            <div className="w-full h-[220px] sm:h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={36}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontFamily: SORA, fill: "#94a3b8", fontWeight: 600 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontFamily: SORA, fill: "#cbd5e1" }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9", radius: 8 }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chartData.map((_, idx) => (
                      <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Info Panel — narrower */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">System Info</h2>
            <p className="text-xs text-slate-400 mt-0.5">Quick snapshot</p>
          </div>
          <div className="p-5 sm:p-6 space-y-3">
            {infoRows.map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{row.icon}</span>
                  <span className="text-sm font-semibold text-slate-600">{row.label}</span>
                </div>
                <span className="text-sm font-extrabold text-slate-800">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Mini legend */}
          <div className="px-5 sm:px-6 pb-5 pt-1">
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-xl px-4 py-3 text-xs text-teal-700 font-semibold">
              🎓 TeachHub is running smoothly. All systems active.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;