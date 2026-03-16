"use client";

import { Pencil, Eye, MoreVertical } from "lucide-react";

type Product = {
  name: string;
  sku: string;
  size: string;
  category: string;
  selling: string;
  cost: string;
  status: string;
};

export default function ProductsTable({ products }: { products: Product[] }) {

const statusColor = (status:string)=>{

switch(status){

case "Active":
return "bg-green-100 text-green-600"

case "Low Stock":
return "bg-orange-100 text-orange-600"

case "Out of Stock":
return "bg-gray-200 text-gray-600"

case "Draft":
return "bg-yellow-100 text-yellow-600"

default:
return "bg-gray-200 text-gray-600"

}

}

return (

<div className="bg-gray-100 border border-gray-200 rounded-3xl p-4 md:p-6">

<div className="overflow-x-auto">

<table className="w-full min-w-[900px] text-sm">

{/* Header */}

<thead className="text-gray-500 border-b">

<tr className="text-left">

<th className="py-3 w-[30%]">Product</th>
<th className="w-[12%]">SKU</th>
<th className="w-[8%]">Size</th>
<th className="w-[12%]">Category</th>
<th className="w-[12%]">Selling Price</th>
<th className="w-[12%]">Cost Price</th>
<th className="w-[8%]">Status</th>
<th className="w-[10%]">Action</th>

</tr>

</thead>

{/* Rows */}

<tbody>

{products.map((p,i)=>(
<tr key={i} className="border-b hover:bg-gray-200 transition">

{/* Product */}

<td className="flex items-center gap-2 py-4">

<img
src="/product.png"
className="w-10 h-10 rounded-lg"
/>

<p className="text-gray-700 text-sm leading-tight">
{p.name}
</p>

</td>

{/* SKU */}

<td className="text-gray-600">
{p.sku}
</td>

{/* Size */}

<td className="text-gray-600">
{p.size}
</td>

{/* Category */}

<td>

<span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md text-xs">
{p.category}
</span>

</td>

{/* Selling */}

<td className="text-gray-700">
{p.selling}
</td>

{/* Cost */}

<td className="text-gray-700">
{p.cost}
</td>

{/* Status */}

<td>

<span className={`px-2 py-1 rounded-md text-xs ${statusColor(p.status)}`}>
{p.status}
</span>

</td>

{/* Actions */}

<td>

<div className="flex gap-2">

<button className="bg-gray-200 p-2 rounded-md hover:bg-gray-300">
<Pencil size={14}/>
</button>

<button className="bg-gray-200 p-2 rounded-md hover:bg-gray-300">
<Eye size={14}/>
</button>

<button className="bg-gray-200 p-2 rounded-md hover:bg-gray-300">
<MoreVertical size={14}/>
</button>

</div>

</td>

</tr>
))}

</tbody>

</table>

</div>

</div>

)

}