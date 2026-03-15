import { useEffect,useState } from "react";
import axios from "axios";

function MyStudents(){

const API = import.meta.env.VITE_API_URL;

const [students,setStudents] = useState([]);
const [loading,setLoading] = useState(true);

useEffect(()=>{

const fetchStudents = async()=>{

try{

const token = localStorage.getItem("token");

const res = await axios.get(
`${API}/api/teacher/my-students`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

setStudents(res.data);
setLoading(false);

}catch(err){
console.log(err);
setLoading(false);
}

};

fetchStudents();

},[]);


return(

<div className="p-4">

<h1 className="text-2xl font-bold mb-4">
My Students
</h1>

<p className="mb-4">
List of students assigned to this teacher
</p>

{loading ? (
<p>Loading students...</p>
) : students.length === 0 ? (
<p>No students assigned</p>
) : (

<div className="overflow-x-auto">

<table className="min-w-full border">

<thead className="bg-gray-200">
<tr>
<th className="p-2 border text-left">Name</th>
<th className="p-2 border text-left">Email</th>
</tr>
</thead>

<tbody>

{students.map((s)=>(
<tr key={s._id} className="hover:bg-gray-50">
<td className="p-2 border">{s.name}</td>
<td className="p-2 border break-all">{s.email}</td>
</tr>
))}

</tbody>

</table>

</div>

)}

</div>

)

}

export default MyStudents;