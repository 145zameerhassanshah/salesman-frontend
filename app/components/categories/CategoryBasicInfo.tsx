export default function CategoryBasicInfo() {

return (

<div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm">

<h2 className="text-base md:text-lg font-semibold mb-4">
Basic Info
</h2>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

<div className="flex flex-col gap-2">
<label className="text-xs md:text-sm text-gray-500">
Category Name
</label>

<input
className="bg-gray-100 rounded-lg px-3 py-2 outline-none text-sm"
defaultValue="Heaters"
/>
</div>

<div className="flex flex-col gap-2 md:row-span-2">
<label className="text-xs md:text-sm text-gray-500">
Description
</label>

<textarea
className="bg-gray-100 rounded-lg px-3 py-2 outline-none h-28 md:h-full text-sm"
placeholder="Enter a detailed description..."
/>

</div>

<div className="flex flex-col gap-2">
<label className="text-xs md:text-sm text-gray-500">
Sort Order
</label>

<input
className="bg-gray-100 rounded-lg px-3 py-2 outline-none text-sm"
defaultValue="0"
/>
</div>

</div>

</div>

)

}