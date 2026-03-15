import { useEffect, useState } from "react";
import axios from "axios";
import { FaBook } from "react-icons/fa";

function StudentSubjects(){

const API = import.meta.env.VITE_API_URL;

const [subjects,setSubjects] = useState([]);

useEffect(()=>{

const token = localStorage.getItem("token");

axios.get(
`${API}/api/student/subjects`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
)
.then(res=>setSubjects(res.data))
.catch(err=>console.log(err));

},[]);

return(

<div className="p-4 md:p-6">

<h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">
My Subjects
</h2>

{subjects.length === 0 ? (

<p>No subjects found</p>

) : (

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

{subjects.map((s,i)=>(

<div
key={i}
className="bg-white shadow-md rounded-lg p-5 border hover:shadow-lg transition duration-300 flex items-center gap-4"
>

<div className="bg-blue-100 p-3 rounded-full">
<FaBook className="text-blue-600 text-xl"/>
</div>

<div>

<h3 className="font-semibold text-lg text-gray-800">
{s.name}
</h3>

<p className="text-gray-500 text-sm">
{s.teacher ? `Teacher: ${s.teacher.name}` : "No Teacher Assigned"}
</p>

</div>

</div>

))}

</div>

)}

</div>

)

}

export default StudentSubjects;