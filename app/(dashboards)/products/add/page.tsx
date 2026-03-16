"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import ProductService from "@/app/components/services/productService";

export default function AddProduct() {

const [form,setForm] = useState({
name:"",
sku:"",
mrp:"",
discount_percent:"",
order_no:"",
description:"",
category_id:"",
subcategory_id:"",
image:null as File | null,
is_active:true
});

const handleChange = (e:any)=>{
const {name,value,type,checked} = e.target;

setForm({
...form,
[name]: type === "checkbox" ? checked : value
});
};

const handleImageChange = (e:any)=>{
setForm({
...form,
image:e.target.files[0]
});
};

const handleSubmit = async ()=>{

try{

const formData = new FormData();

formData.append("name",form.name);
formData.append("sku",form.sku);
formData.append("mrp",form.mrp);
formData.append("discount_percent",form.discount_percent);
formData.append("order_no",form.order_no);
formData.append("description",form.description);
formData.append("category_id",form.category_id);
formData.append("subcategory_id",form.subcategory_id);
formData.append("is_active",String(form.is_active));

if(form.image){
formData.append("image",form.image);
}

const res = await ProductService.addProduct(formData);

if(!res.success){
toast.error(res.message);
return;
}

toast.success("Product added successfully");

}catch(err){
console.log(err);
toast.error("Failed to add product");
}

};

return (

<div className="p-4 md:p-8 bg-gray-100 min-h-screen">

{/* HEADER */}

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">

<div>
<p className="text-sm text-gray-400">Products ›</p>
<h1 className="text-2xl md:text-3xl font-bold text-gray-800">
Add Product
</h1>
</div>

<div className="flex flex-wrap gap-2 md:gap-3">

<button
type="button"
onClick={handleSubmit}
className="bg-black text-white px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm flex items-center gap-2"
>
✓ Save Product
</button>

<button className="border border-gray-300 px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm text-gray-600 hover:bg-gray-200">
Save Draft
</button>

<button className="border border-gray-300 px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm text-red-500 hover:bg-red-100">
Cancel
</button>

</div>

</div>


{/* BASIC INFO */}

<div className="bg-gray-100 rounded-3xl p-4 md:p-6 shadow-sm mb-4 border border-gray-200 w-full">

<h3 className="text-sm font-semibold text-gray-700 mb-5">
Basic Info
</h3>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

{/* LEFT */}

<div className="flex flex-col gap-4">

<div>
<label className="text-xs text-gray-500">Product Name</label>
<input
name="name"
value={form.name}
onChange={handleChange}
type="text"
placeholder="Product Name"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
/>
</div>

<div>
<label className="text-xs text-gray-500">SKU</label>
<input
name="sku"
value={form.sku}
onChange={handleChange}
type="text"
placeholder="SKU Code"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
/>
</div>

<div>
<label className="text-xs text-gray-500">MRP</label>
<input
name="mrp"
value={form.mrp}
onChange={handleChange}
type="number"
placeholder="0"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
/>
</div>

<div>
<label className="text-xs text-gray-500">Discount %</label>
<input
name="discount_percent"
value={form.discount_percent}
onChange={handleChange}
type="number"
placeholder="0"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
/>
</div>

<div>
<label className="text-xs text-gray-500">Sort Order</label>
<input
name="order_no"
value={form.order_no}
onChange={handleChange}
type="number"
placeholder="0"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
/>
</div>

</div>


{/* RIGHT */}

<div className="flex flex-col gap-4">

<div>
<label className="text-xs text-gray-500">Category</label>
<select
name="category_id"
value={form.category_id}
onChange={handleChange}
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none"
>
<option value="">Select Category</option>
</select>
</div>

<div>
<label className="text-xs text-gray-500">Subcategory</label>
<select
name="subcategory_id"
value={form.subcategory_id}
onChange={handleChange}
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none"
>
<option value="">Select Subcategory</option>
</select>
</div>

<div>
<label className="text-xs text-gray-500">Product Image</label>
<input
type="file"
accept="image/*"
onChange={handleImageChange}
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none"
/>
</div>

<div>
<label className="text-xs text-gray-500">Description</label>
<textarea
name="description"
value={form.description}
onChange={handleChange}
rows={5}
placeholder="Product description"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none resize-none"
/>
</div>

</div>

</div>

</div>


{/* ACTIVE STATUS */}

<div className="bg-gray-100 rounded-3xl p-4 md:p-6 shadow-sm border border-gray-200 flex items-center justify-between w-full">

<div>
<h4 className="text-sm font-semibold text-gray-700">
Active Status
</h4>
<p className="text-xs text-gray-400">
Enable or disable this product globally.
</p>
</div>

<label className="relative inline-flex items-center cursor-pointer">

<input
type="checkbox"
name="is_active"
checked={form.is_active}
onChange={handleChange}
className="sr-only peer"
/>

<div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-gray-800
after:content-[''] after:absolute after:top-[2px] after:left-[2px]
after:bg-white after:h-5 after:w-5 after:rounded-full
after:transition-all peer-checked:after:translate-x-full"></div>

</label>

</div>

</div>

);
}