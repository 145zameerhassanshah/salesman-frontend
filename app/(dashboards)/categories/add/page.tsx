"use client";

export default function AddCategory() {

return (

<div className="p-4 md:p-8 bg-gray-100  min-h-screen">

{/* Header */}

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">

<div>
<p className="text-sm text-gray-400">Categories ›</p>
<h1 className="text-2xl md:text-3xl font-bold text-gray-800">
Add Category
</h1>
</div>

<div className="flex flex-wrap gap-2 md:gap-3">

<button className="bg-black text-white px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm flex items-center gap-2">
✓ Save Category
</button>

<button className="border border-gray-300 px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm text-gray-600 hover:bg-gray-200">
Save Draft
</button>

<button className="border border-gray-300 px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm text-red-500 hover:bg-red-100">
Cancel
</button>

</div>

</div>


{/* Basic Info Card */}

<div className="bg-gray-100 rounded-3xl p-4 md:p-6 shadow-sm mb-4 border border-gray-200 w-full">

<h3 className="text-sm font-semibold text-gray-700 mb-5">
Basic Info
</h3>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

{/* Left Side */}

<div className="flex flex-col gap-4">

<div>
<label className="text-xs text-gray-500">
Category Name
</label>

<input
type="text"
placeholder="Category Name"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
/>
</div>


<div>
<label className="text-xs text-gray-500">
Sort Order
</label>

<input
type="number"
placeholder="0"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
/>
</div>

</div>


{/* Right Side */}

<div className="flex flex-col">

<label className="text-xs text-gray-500">
Description
</label>

<textarea
rows={6}
placeholder="Enter a detailed description for this category..."
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-gray-400"
/>

</div>

</div>

</div>


{/* Active Status */}

<div className="bg-gray-100 rounded-3xl p-4 md:p-6 shadow-sm border border-gray-200 flex items-center justify-between w-full">

<div>
<h4 className="text-sm font-semibold text-gray-700">
Active Status
</h4>

<p className="text-xs text-gray-400">
Enable or disable this category globally.
</p>
</div>


{/* Toggle */}

<label className="relative inline-flex items-center cursor-pointer">

<input type="checkbox" className="sr-only peer" defaultChecked />

<div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-gray-800
after:content-[''] after:absolute after:top-[2px] after:left-[2px]
after:bg-white after:h-5 after:w-5 after:rounded-full
after:transition-all peer-checked:after:translate-x-full"></div>

</label>

</div>

</div>

)
}