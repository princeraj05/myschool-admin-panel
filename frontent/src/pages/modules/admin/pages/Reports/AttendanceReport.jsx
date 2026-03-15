import { useEffect, useState } from "react";
import axios from "axios";

function AttendanceReport() {

const API = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {

const fetchAttendance = async () => {

try {

const res = await axios.get(
`${API}/api/attendance/report`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

setData(res.data);

} catch (err) {

console.log(err);

} finally {

setLoading(false);

}

};

fetchAttendance();

}, []);

return (

<div className="p-4 sm:p-6">

<h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
Attendance Report
</h1>

<div className="bg-white rounded-xl shadow overflow-x-auto">

{loading ? (

<div className="p-6 text-center text-gray-500">
Loading attendance...
</div>

) : (

<table className="min-w-[700px] w-full">

<thead className="bg-gray-100 text-gray-700 text-sm sm:text-base">

<tr>
<th className="px-4 sm:px-6 py-3 text-left">Student</th>
<th className="px-4 sm:px-6 py-3 text-left">Class</th>
<th className="px-4 sm:px-6 py-3 text-left">Teacher</th>
<th className="px-4 sm:px-6 py-3 text-left">Status</th>
<th className="px-4 sm:px-6 py-3 text-left">Date</th>
</tr>

</thead>

<tbody>

{data.length === 0 ? (

<tr>
<td colSpan="5" className="p-6 text-center text-gray-500">
No attendance found
</td>
</tr>

) : (

data.map(item => (

<tr key={item._id} className="border-t hover:bg-gray-50 transition">

<td className="px-4 sm:px-6 py-4 flex items-center gap-3">

<div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
{item.student?.name?.charAt(0).toUpperCase()}
</div>

<span className="font-medium text-gray-800 text-sm sm:text-base">
{item.student?.name}
</span>

</td>

<td className="px-4 sm:px-6 py-4 text-gray-700 text-sm sm:text-base">
{item.class?.name}
</td>

<td className="px-4 sm:px-6 py-4 text-gray-700 text-sm sm:text-base">
{item.teacher?.name}
</td>

<td className="px-4 sm:px-6 py-4">

<span
className={`px-3 py-1 text-xs sm:text-sm rounded-full font-medium ${
item.status === "Present"
? "bg-green-100 text-green-700"
: "bg-red-100 text-red-700"
}`}
>

{item.status}

</span>

</td>

<td className="px-4 sm:px-6 py-4 text-gray-600 text-sm sm:text-base">
{new Date(item.date).toLocaleDateString()}
</td>

</tr>

))

)}

</tbody>

</table>

)}

</div>

</div>

);

}

export default AttendanceReport;