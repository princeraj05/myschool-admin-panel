import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FaTachometerAlt,
  FaBook,
  FaClipboardCheck,
  FaFileAlt,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

function StudentLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const name = localStorage.getItem("name") || "Student";

  const navLinks = [
    { to: "/student/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
    { to: "/student/subjects", icon: <FaBook />, label: "My Subjects" },
    { to: "/student/attendance", icon: <FaClipboardCheck />, label: "My Attendance" },
    { to: "/student/exams", icon: <FaFileAlt />, label: "My Exams" },
    { to: "/student/profile", icon: <FaUser />, label: "Profile" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-[#0f172a] text-white flex flex-col transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-40 h-40 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#0f172a]">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
              TeachHub
            </span>
          </div>
          <button
            className="md:hidden text-slate-400 hover:text-white transition"
            onClick={() => setOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* Nav */}
        <nav className="relative z-10 flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3">
            Navigation
          </p>
          {navLinks.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="relative z-10 px-3 py-4 border-t border-white/10">
          <button
            onClick={() => { localStorage.clear(); navigate("/"); }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>

        <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');`}</style>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-slate-600 hover:text-teal-500 text-xl transition"
              onClick={() => setOpen(!open)}
            >
              <FaBars />
            </button>
            <div className="hidden md:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-sm text-slate-500 font-medium">Student Portal</span>
            </div>
          </div>

          <div
            onClick={() => navigate("/student/profile")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="hidden sm:block text-right">
              <p className="text-xs text-slate-400">Welcome back,</p>
              <p className="text-sm font-semibold text-slate-800">{name}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-teal-400/30 group-hover:shadow-teal-400/50 transition-shadow">
              {name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;