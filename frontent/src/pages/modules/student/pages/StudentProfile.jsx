import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserGraduate, FaEnvelope, FaUserTag, FaIdBadge } from "react-icons/fa";

function StudentProfile() {
  const API = import.meta.env.VITE_API_URL;
  const [student, setStudent] = useState({ name: "", email: "", role: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API}/api/student/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStudent(res.data))
      .catch((err) => console.log("Profile Error:", err));
  }, []);

  const initials = student.name ? student.name.charAt(0).toUpperCase() : "S";

  const fields = [
    {
      icon: <FaUserGraduate />,
      label: "Full Name",
      value: student.name || "—",
      iconBg: "bg-teal-50 border-teal-100",
      iconColor: "text-teal-500",
    },
    {
      icon: <FaEnvelope />,
      label: "Email Address",
      value: student.email || "—",
      iconBg: "bg-emerald-50 border-emerald-100",
      iconColor: "text-emerald-500",
    },
    {
      icon: <FaUserTag />,
      label: "Account Role",
      value: null,
      badge: student.role,
      iconBg: "bg-indigo-50 border-indigo-100",
      iconColor: "text-indigo-500",
    },
  ];

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          My Profile
        </h1>
        <p className="text-sm text-slate-400 mt-1">View your account information.</p>
      </div>

      <div className="max-w-2xl">
        {/* Hero card */}
        <div className="bg-[#0f172a] rounded-2xl overflow-hidden shadow-xl shadow-slate-900/20 mb-5 relative">
          {/* bg grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#e2e8f0 1px,transparent 1px),linear-gradient(90deg,#e2e8f0 1px,transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* blobs */}
          <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-5 px-6 py-7">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-2xl md:text-3xl font-extrabold shadow-lg shadow-teal-500/40">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#0f172a]" />
            </div>

            <div>
              <p className="text-xs font-semibold text-teal-400 tracking-widest uppercase mb-1">
                Student Account
              </p>
              <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
                {student.name || "Loading…"}
              </h2>
              <p className="text-slate-400 text-sm mt-0.5">{student.email}</p>
            </div>

            {/* Badge top-right */}
            <div className="ml-auto hidden sm:flex">
              <span className="flex items-center gap-1.5 bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                <FaIdBadge className="text-[10px]" />
                {student.role || "Student"}
              </span>
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">
              Account Details
            </h3>
          </div>

          <div className="divide-y divide-slate-50">
            {fields.map(({ icon, label, value, badge, iconBg, iconColor }) => (
              <div
                key={label}
                className="flex items-center gap-4 px-6 py-4 hover:bg-teal-50/30 transition-colors"
              >
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${iconBg}`}>
                  <span className={`text-sm ${iconColor}`}>{icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
                  {badge ? (
                    <span className="inline-flex items-center px-3 py-1 bg-teal-50 border border-teal-100 text-teal-700 text-sm font-semibold rounded-full capitalize">
                      {badge}
                    </span>
                  ) : (
                    <p className="text-slate-800 font-semibold text-sm truncate">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');`}</style>
    </div>
  );
}

export default StudentProfile;