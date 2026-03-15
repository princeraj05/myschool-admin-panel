import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
FaTachometerAlt,
FaUserGraduate,
FaClipboardCheck,
FaBook,
FaCalendarAlt,
FaAngleDown,
FaSignOutAlt,
FaSchool,
FaBars
} from "react-icons/fa";

function TeacherLayout() {

const navigate = useNavigate();

const [studentsOpen, setStudentsOpen] = useState(false);
const [attendanceOpen, setAttendanceOpen] = useState(false);
const [menuOpen,setMenuOpen] = useState(false);

const name = localStorage.getItem("name") || "Teacher";

const handleLogout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");
navigate("/");
};

const closeMenu = () => {
setMenuOpen(false);
};

return (

<div className="flex min-h-screen bg-gray-100 overflow-hidden">

{/* MOBILE OVERLAY */}

{menuOpen && (
<div
className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
onClick={()=>setMenuOpen(false)}
></div>
)}

{/* SIDEBAR */}

<div
className={`
fixed md:static top-0 left-0 h-full w-64 bg-slate-900 text-white p-4
flex flex-col justify-between
transform ${menuOpen ? "translate-x-0" : "-translate-x-full"}
md:translate-x-0
transition-transform duration-300
z-50
`}
>

<div className="overflow-y-auto">

<h2 className="text-xl font-bold mb-6">
MySchool Teacher
</h2>

<nav className="space-y-2">

<Link
onClick={closeMenu}
to="/teacher/dashboard"
className="flex items-center gap-3 p-2 rounded hover:bg-slate-700"
>
<FaTachometerAlt/> Dashboard
</Link>

<Link
onClick={closeMenu}
to="/teacher/my-classes"
className="flex items-center gap-3 p-2 hover:bg-slate-700 rounded"
>
<FaSchool/> My Classes
</Link>

<button
onClick={()=>setStudentsOpen(!studentsOpen)}
className="flex items-center justify-between w-full p-2 hover:bg-slate-700 rounded"
>
<span className="flex items-center gap-3">
<FaUserGraduate/> Students
</span>
<FaAngleDown/>
</button>

{studentsOpen && (
<div className="ml-6 space-y-1">
<Link
onClick={closeMenu}
to="/teacher/my-students"
className="p-2 block hover:bg-slate-700 rounded"
>
My Students
</Link>
</div>
)}

<button
onClick={()=>setAttendanceOpen(!attendanceOpen)}
className="flex items-center justify-between w-full p-2 hover:bg-slate-700 rounded"
>
<span className="flex items-center gap-3">
<FaClipboardCheck/> Attendance
</span>
<FaAngleDown/>
</button>

{attendanceOpen && (
<div className="ml-6 space-y-1">

<Link
onClick={closeMenu}
to="/teacher/mark-attendance"
className="p-2 block hover:bg-slate-700 rounded"
>
Mark Attendance
</Link>

<Link
onClick={closeMenu}
to="/teacher/attendance-report"
className="p-2 block hover:bg-slate-700 rounded"
>
Attendance Report
</Link>

</div>
)}

<Link
onClick={closeMenu}
to="/teacher/my-subjects"
className="flex items-center gap-3 p-2 hover:bg-slate-700 rounded"
>
<FaBook/> My Subjects
</Link>

<Link
onClick={closeMenu}
to="/teacher/exam-schedule"
className="flex items-center gap-3 p-2 hover:bg-slate-700 rounded"
>
<FaCalendarAlt/> Exam Schedule
</Link>

</nav>

</div>

<button
onClick={handleLogout}
className="flex items-center gap-3 p-2 bg-red-600 hover:bg-red-700 rounded mt-4"
>
<FaSignOutAlt/> Logout
</button>

</div>

{/* MAIN AREA */}

<div className="flex-1 flex flex-col min-w-0">

{/* TOPBAR */}

<div className="flex justify-between items-center bg-white px-4 md:px-6 py-3 shadow">

<div className="flex items-center gap-3">

<button
className="md:hidden text-xl"
onClick={()=>setMenuOpen(!menuOpen)}
>
<FaBars/>
</button>

<h2 className="font-semibold text-lg">
Teacher Panel
</h2>

</div>

<div
onClick={()=>navigate("/teacher/profile")}
className="flex items-center gap-3 cursor-pointer"
>

<p className="text-gray-700 hidden sm:block">
Welcome, <span className="font-semibold">{name}</span>
</p>

<div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
{name.charAt(0).toUpperCase()}
</div>

</div>

</div>

{/* PAGE CONTENT */}

<div className="p-4 md:p-6 flex-1 overflow-x-auto">
<Outlet/>
</div>

</div>

</div>

);

}

export default TeacherLayout;