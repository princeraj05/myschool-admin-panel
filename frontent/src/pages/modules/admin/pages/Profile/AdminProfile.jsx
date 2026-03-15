import { useEffect, useState } from "react";
import axios from "axios";
import {
FaUserCircle,
FaEnvelope,
FaUserShield,
FaEdit,
FaSave
} from "react-icons/fa";

function AdminProfile(){

const API = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

const [admin,setAdmin] = useState({
name:"",
email:"",
role:""
});

const [editMode,setEditMode] = useState(false);

useEffect(()=>{
fetchProfile();
},[]);

const fetchProfile = ()=>{

axios
.get(`${API}/api/admin/profile`,{
headers:{ Authorization:`Bearer ${token}` }
})
.then(res=>{
if(res.data.success){
setAdmin(res.data.admin);
}
})
.catch(err=>{
console.log(err);
});

};

const handleChange = (e)=>{

setAdmin({
...admin,
[e.target.name]:e.target.value
});

};

const handleSave = ()=>{

axios
.put(
`${API}/api/admin/profile/update`,
{
name:admin.name,
email:admin.email
},
{
headers:{ Authorization:`Bearer ${token}` }
}
)

.then(()=>{
setEditMode(false);
fetchProfile();
})

.catch(err=>{
console.log(err);
});

};

return(

<div className="p-4 sm:p-6 flex justify-center">

<div className="w-full max-w-md">

<h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left">
Admin Profile
</h1>

<div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full">

<div className="flex flex-col items-center mb-6">

<div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-600 text-white flex items-center justify-center rounded-full text-2xl sm:text-3xl font-bold shadow">

{admin.name ? admin.name.charAt(0).toUpperCase() : "A"}

</div>

<h2 className="text-lg sm:text-xl font-semibold mt-4 text-center">
{admin.name}
</h2>

<p className="text-gray-500 text-sm sm:text-base">
{admin.role}
</p>

</div>

<div className="space-y-4">

<div className="flex items-center gap-3 text-gray-700">

<FaUserCircle className="text-blue-600"/>

{editMode ? (

<input
type="text"
name="name"
value={admin.name}
onChange={handleChange}
className="border p-2 rounded w-full"
/>

) : (

<span className="text-sm sm:text-base">
<strong>Name:</strong> {admin.name}
</span>

)}

</div>

<div className="flex items-center gap-3 text-gray-700">

<FaEnvelope className="text-green-600"/>

{editMode ? (

<input
type="email"
name="email"
value={admin.email}
onChange={handleChange}
className="border p-2 rounded w-full"
/>

) : (

<span className="text-sm sm:text-base">
<strong>Email:</strong> {admin.email}
</span>

)}

</div>

<div className="flex items-center gap-3 text-gray-700">

<FaUserShield className="text-purple-600"/>

<span className="text-sm sm:text-base">
<strong>Role:</strong> {admin.role}
</span>

</div>

</div>

{editMode ? (

<button
onClick={handleSave}
className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
>

<FaSave/>

Save Profile

</button>

) : (

<button
onClick={()=>setEditMode(true)}
className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
>

<FaEdit/>

Edit Profile

</button>

)}

</div>

</div>

</div>

)

}

export default AdminProfile;