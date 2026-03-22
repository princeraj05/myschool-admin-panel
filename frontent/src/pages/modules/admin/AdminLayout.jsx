import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import {
  FaTachometerAlt,
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaClipboardList,
  FaChartBar,
  FaCalendarAlt,
  FaUserCircle,
  FaAngleDown,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-8 h-8 rounded-lg bg-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/30 flex-shrink-0">
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#0f172a]">
        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
      </svg>
    </div>
    <span
      className="text-lg font-extrabold tracking-tight text-white"
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      TeachHub
    </span>
  </div>
);

function NavItem({ to, icon, label, onClick }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? "bg-teal-500 text-white shadow-md shadow-teal-500/30"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <span className="text-base">{icon}</span>
      {label}
    </Link>
  );
}

function Dropdown({ icon, label, children, open, onToggle }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
      >
        <span className="flex items-center gap-3">
          <span className="text-base">{icon}</span>
          {label}
        </span>
        <FaAngleDown
          className={`transition-transform duration-200 text-xs ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-1 ml-4 pl-3 border-l border-slate-700 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  );
}

function SubItem({ to, label, onClick }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-3 py-2 rounded-lg text-sm transition-all ${
        active
          ? "text-teal-400 font-semibold"
          : "text-slate-500 hover:text-white hover:bg-slate-800"
      }`}
    >
      {label}
    </Link>
  );
}

function AdminLayout() {
  const navigate = useNavigate();

  const [usersOpen, setUsersOpen] = useState(false);
  const [academicsOpen, setAcademicsOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const name = localStorage.getItem("name") || "Admin";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');`}</style>

      <div
        className="flex min-h-screen bg-slate-100 overflow-hidden"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        {/* ── Mobile Overlay ── */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={closeMenu}
          />
        )}

        {/* ── SIDEBAR ── */}
        <aside
          className={`
            fixed md:static top-0 left-0 h-full w-64 bg-[#0f172a] flex flex-col z-50
            transform transition-transform duration-300 ease-in-out
            ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          `}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
            <Logo />
            <button
              className="md:hidden text-slate-400 hover:text-white transition"
              onClick={closeMenu}
            >
              <FaTimes />
            </button>
          </div>

          {/* Admin Badge */}
          <div className="px-5 py-3 border-b border-slate-800">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal-400 bg-teal-400/10 px-2.5 py-1 rounded-full">
              Admin Panel
            </span>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            <NavItem
              to="/admin/dashboard"
              icon={<FaTachometerAlt />}
              label="Dashboard"
              onClick={closeMenu}
            />

            <Dropdown
              icon={<FaUsers />}
              label="Users"
              open={usersOpen}
              onToggle={() => setUsersOpen(!usersOpen)}
            >
              <SubItem to="/admin/teachers" label="Teachers" onClick={closeMenu} />
              <SubItem to="/admin/students" label="Students" onClick={closeMenu} />
            </Dropdown>

            <Dropdown
              icon={<FaBook />}
              label="Academics"
              open={academicsOpen}
              onToggle={() => setAcademicsOpen(!academicsOpen)}
            >
              <SubItem to="/admin/classes" label="Classes" onClick={closeMenu} />
              <SubItem to="/admin/subjects" label="Subjects" onClick={closeMenu} />
            </Dropdown>

            <Dropdown
              icon={<FaClipboardList />}
              label="Assignments"
              open={assignOpen}
              onToggle={() => setAssignOpen(!assignOpen)}
            >
              <SubItem to="/admin/assign-teacher-class" label="Assign Teacher" onClick={closeMenu} />
              <SubItem to="/admin/assign-student-class" label="Assign Student" onClick={closeMenu} />
              <SubItem to="/admin/assign-subject-teacher" label="Assign Subject" onClick={closeMenu} />
            </Dropdown>

            <Dropdown
              icon={<FaChartBar />}
              label="Reports"
              open={reportOpen}
              onToggle={() => setReportOpen(!reportOpen)}
            >
              <SubItem to="/admin/attendance-report" label="Attendance Report" onClick={closeMenu} />
              <SubItem to="/admin/exam-results" label="Exam Results" onClick={closeMenu} />
            </Dropdown>

            <NavItem
              to="/admin/exam-schedule"
              icon={<FaCalendarAlt />}
              label="Exam Schedule"
              onClick={closeMenu}
            />

            <NavItem
              to="/admin/profile"
              icon={<FaUserCircle />}
              label="Profile"
              onClick={closeMenu}
            />
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* ── TOP NAVBAR ── */}
          <header className="flex items-center justify-between bg-white px-4 md:px-6 py-3.5 shadow-sm border-b border-slate-200 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              {/* Hamburger */}
              <button
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <FaBars />
              </button>

              {/* Mobile logo */}
              <div className="md:hidden">
                <Logo />
              </div>

              {/* Desktop breadcrumb label */}
              <div className="hidden md:block">
                <h1
                  className="text-base font-bold text-slate-800"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  Admin Dashboard
                </h1>
                <p className="text-xs text-slate-400">Manage TeachHub</p>
              </div>
            </div>

            {/* Right side */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate("/admin/profile")}
            >
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-sm font-semibold text-slate-700 group-hover:text-teal-600 transition">
                  {name}
                </p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-teal-500/30 group-hover:bg-teal-600 transition">
                {name.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>

          {/* ── PAGE CONTENT ── */}
          <main className="flex-1 p-4 md:p-6 overflow-x-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default AdminLayout;