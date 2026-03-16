"use client";

import { useState } from "react";

export default function CategoryStatus() {

const [active,setActive] = useState(true)

return (

<div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">

<div>
<p className="font-medium text-sm md:text-base">
Active Status
</p>

<p className="text-xs text-gray-400">
Enable or disable this category globally
</p>

</div>

<button
onClick={()=>setActive(!active)}
className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
active ? "bg-blue-500" : "bg-gray-300"
}`}
>

<div
className={`bg-white w-4 h-4 rounded-full transition ${
active ? "ml-6" : ""
}`}
/>

</button>

</div>

)

}