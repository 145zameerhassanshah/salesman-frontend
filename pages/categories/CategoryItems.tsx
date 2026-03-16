"use client";

import { Trash2 } from "lucide-react";

export default function CategoryItems() {

const products = [
{
name:"GS-40L Super Series Electric Geyser",
code:"#22134",
price:"Rs.30,000",
qty:2,
discount:"5%",
amount:1500,
total:"Rs.57,000"
},
{
name:"GS-40L Super Series Electric Geyser",
code:"#22134",
price:"Rs.30,000",
qty:2,
discount:"5%",
amount:1500,
total:"Rs.57,000"
}
]

return (

<div className="bg-gray-100 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm">

<h2 className="text-base md:text-lg font-semibold mb-4 text-gray-700">
Category Items
</h2>

{/* Desktop Table */}

<div className="hidden md:block overflow-x-auto">

<table className="w-full text-sm">

<thead className="text-gray-500 border-b bg-gray-200">

<tr className="text-center">
<th className="text-left py-3 w-[32%]">Product</th>
<th className="w-[10%]">Code</th>
<th className="w-[12%]">Price</th>
<th className="w-[8%]">Qty</th>
<th className="w-[10%]">Discount</th>
<th className="w-[10%]">Amount</th>
<th className="w-[12%]">Total</th>
<th className="w-[6%]"></th>
</tr>

</thead>

<tbody>

{products.map((p,i)=>(
<tr key={i} className="border-b hover:bg-gray-200 transition text-center">

<td className="text-left flex items-center gap-3 py-3">

<img
src="/product.png"
className="w-10 h-10 rounded-lg"
/>

<span className="text-gray-700">
{p.name}
</span>

</td>

<td className="text-gray-600">{p.code}</td>

<td className="text-gray-600">{p.price}</td>

<td className="text-gray-600">{p.qty}</td>

<td className="text-gray-600">{p.discount}</td>

<td className="text-gray-600">{p.amount}</td>

<td className="text-gray-800 font-medium">{p.total}</td>

<td>
<button className="p-2 hover:bg-red-200 rounded text-red-500">
<Trash2 size={16}/>
</button>
</td>

</tr>
))}

</tbody>

</table>

</div>


{/* Mobile Rows */}

<div className="flex flex-col gap-4 md:hidden">

{products.map((p,i)=>(

<div
key={i}
className="border border-gray-300 bg-gray-100 rounded-xl p-3 flex flex-col gap-2"
>

<div className="flex gap-3 items-center">

<img
src="/product.png"
className="w-10 h-10 rounded"
/>

<p className="text-sm font-medium text-gray-700">
{p.name}
</p>

</div>

<div className="grid grid-cols-2 text-xs gap-2 text-gray-600">

<p><span className="font-medium">Code:</span> {p.code}</p>
<p><span className="font-medium">Price:</span> {p.price}</p>
<p><span className="font-medium">Qty:</span> {p.qty}</p>
<p><span className="font-medium">Discount:</span> {p.discount}</p>
<p><span className="font-medium">Amount:</span> {p.amount}</p>
<p className="text-gray-800 font-medium">Total: {p.total}</p>

</div>

<button className="mt-2 text-red-500 text-xs flex items-center gap-1">
<Trash2 size={14}/>
Remove
</button>

</div>

))}

</div>

</div>

)
}