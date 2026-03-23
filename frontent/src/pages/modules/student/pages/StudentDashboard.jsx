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
import { FaBook, FaClipboardCheck, FaFileAlt, FaCalendarAlt } from "react-icons/fa";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f172a] border border-white/10 rounded-xl px-4 py-2 shadow-xl">
        <p className="text-teal-400 font-semibold text-sm">{label}</p>
        <p className="text-white text-base font-bold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

function StudentDashboard() {
  const API = import.meta.env.VITE_API_URL;
  const [data, setData] = useState({ subjects: 0, attendance: 0, exams: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API}/api/student/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.log("Student Dashboard Error:", err));
  }, []);

  const chartData = [
    { name: "Subjects", value: data.subjects },
    { name: "Attendance", value: data.attendance },
    { name: "Exams", value: data.exams },
  ];

  const BAR_COLORS = ["#2dd4bf", "#34d399", "#818cf8"];

  const cards = [
    {
      label: "Total Subjects",
      value: data.subjects,
      icon: <FaBook size={22} />,
      from: "from-teal-500",
      to: "to-teal-600",
      shadow: "shadow-teal-500/30",
      suffix: "",
    },
    {
      label: "Attendance",
      value: data.attendance,
      icon: <FaClipboardCheck size={22} />,
      from: "from-emerald-500",
      to: "to-emerald-600",
      shadow: "shadow-emerald-500/30",
      suffix: "%",
    },
    {
      label: "Upcoming Exams",
      value: data.exams,
      icon: <FaFileAlt size={22} />,
      from: "from-indigo-500",
      to: "to-indigo-600",
      shadow: "shadow-indigo-500/30",
      suffix: "",
    },
  ];

  const quickInfo = [
    { emoji: "📚", label: "Subjects Enrolled", val: data.subjects },
    { emoji: "📊", label: "Attendance", val: `${data.attendance}%` },
    { emoji: "📝", label: "Upcoming Exams", val: data.exams },
    { emoji: "📅", label: "Academic Year", val: "2026" },
  ];

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* Page Header */}
      <div className="mb-7">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          Student Dashboard
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Here's an overview of your academic activity.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {cards.map(({ label, value, icon, from, to, shadow, suffix }) => (
          <div
            key={label}
            className={`bg-gradient-to-br ${from} ${to} text-white p-6 rounded-2xl shadow-lg ${shadow} relative overflow-hidden`}
          >
            {/* Decorative circle */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute -bottom-6 -right-2 w-16 h-16 rounded-full bg-white/5" />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white/75 mb-1">{label}</p>
                <p className="text-4xl font-extrabold tracking-tight">
                  {value}
                  <span className="text-2xl">{suffix}</span>
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                {icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-800">Student Overview</h2>
            <span className="text-xs bg-teal-50 text-teal-600 font-semibold px-3 py-1 rounded-full border border-teal-100">
              2026
            </span>
          </div>
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={36}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontFamily: "'Sora', sans-serif" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontFamily: "'Sora', sans-serif" }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148,163,184,0.08)" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-800">Quick Info</h2>
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
              <FaCalendarAlt className="text-teal-500 text-sm" />
            </div>
          </div>

          <ul className="space-y-3">
            {quickInfo.map(({ emoji, label, val }) => (
              <li
                key={label}
                className="flex items-center justify-between bg-slate-50 hover:bg-teal-50/50 border border-slate-100 hover:border-teal-100 rounded-xl px-4 py-3 transition-colors"
              >
                <span className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                  <span className="text-base">{emoji}</span>
                  {label}
                </span>
                <span className="text-slate-800 font-bold text-sm">{val}</span>
              </li>
            ))}
          </ul>

          {/* Attendance progress bar */}
          <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>Attendance Progress</span>
              <span className="text-teal-600">{data.attendance}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(data.attendance, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              {data.attendance >= 75 ? "✅ You're on track!" : "⚠️ Below 75% threshold"}
            </p>
          </div>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');`}</style>
    </div>
  );
}

export default StudentDashboard;