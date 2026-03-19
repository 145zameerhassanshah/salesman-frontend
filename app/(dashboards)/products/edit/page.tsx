"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProductService from "@/app/components/services/productService";
import { category } from "@/app/components/services/categoryService";

export default function EditProduct() {

const { id } = useParams();
const router = useRouter();

const [categories, setCategories] = useState<any[]>([]);
const [loading, setLoading] = useState(false);

const [form, setForm] = useState({
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

/* ================= FETCH DATA ================= */

useEffect(()=>{

async function fetchData(){

try{

// 🔥 get product
const res = await ProductService.getProductById(id);

if(res.success){

const p = res.product;

setForm({
name:p.name || "",
sku:p.sku || "",
mrp:String(p.mrp || ""),
discount_percent:String(p.discount_percent || ""),
order_no:String(p.order_no || ""),
description:p.description || "",
category_id:p.category_id?._id || "",
subcategory_id:p.subcategory_id?._id || "",
image:null,
is_active:p.is_active
});

}

// 🔥 categories
const catRes = await category.getAllCategories();
if(catRes) setCategories(catRes);

}catch{
toast.error("Failed to load data");
}

}

fetchData();

},[id]);

/* ================= HANDLE ================= */

const handleChange = (e:any)=>{
const {name,value,type,checked} = e.target;

setForm({
...form,
[name]: type === "checkbox" ? checked : value
});
};

const handleImageChange = (e:any)=>{
const file = e.target.files[0];

if(!file) return;

if(!file.type.startsWith("image/")){
toast.error("Only image allowed");
return;
}

if(file.size > 2 * 1024 * 1024){
toast.error("Image must be < 2MB");
return;
}

setForm({
...form,
image:file
});
};

/* ================= VALIDATION ================= */

const validate = ()=>{

if(!form.name.trim()){
toast.error("Product name is required");
return false;
}

if(!form.sku.trim()){
toast.error("SKU is required");
return false;
}

if(!form.mrp || Number(form.mrp) <= 0){
toast.error("MRP must be greater than 0");
return false;
}

if(!form.category_id){
toast.error("Select category");
return false;
}

return true;
};

/* ================= UPDATE ================= */

const handleUpdate = async ()=>{

if(!validate()) return;

try{

setLoading(true);

const formData = new FormData();

formData.append("name",form.name.trim());
formData.append("sku",form.sku.trim());
formData.append("mrp",String(Number(form.mrp)));
formData.append("discount_percent",String(Number(form.discount_percent || 0)));
formData.append("order_no",String(Number(form.order_no || 0)));
formData.append("description",form.description);
formData.append("category_id",form.category_id);
formData.append("subcategory_id",form.subcategory_id);
formData.append("is_active",String(form.is_active));

// 🔥 image optional
if(form.image){
formData.append("image",form.image);
}

const res = await ProductService.updateProduct(formData,id);

toast.success("Product updated successfully");

// redirect back
router.push("/products");

}catch(err:any){
toast.error(err.message || "Update failed");
}finally{
setLoading(false);
}

};

/* ================= UI ================= */

return (

<div className="p-4 md:p-8 bg-gray-100 min-h-screen">

{/* HEADER */}

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">

<div>
<p className="text-sm text-gray-400">Products ›</p>
<h1 className="text-2xl md:text-3xl font-bold text-gray-800">
Edit Product
</h1>
</div>

<div className="flex flex-wrap gap-2 md:gap-3">

<button
onClick={handleUpdate}
disabled={loading}
className="bg-black text-white px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm"
>
{loading ? "Updating..." : "✓ Update Product"}
</button>

<button
onClick={()=>router.push("/products")}
className="border border-gray-300 px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm text-red-500 hover:bg-red-100"
>
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

<input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="input"/>
<input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" className="input"/>
<input name="mrp" value={form.mrp} onChange={handleChange} type="number" placeholder="MRP" className="input"/>
<input name="discount_percent" value={form.discount_percent} onChange={handleChange} type="number" placeholder="Discount %" className="input"/>
<input name="order_no" value={form.order_no} onChange={handleChange} type="number" placeholder="Order No" className="input"/>

</div>

{/* RIGHT */}

<div className="flex flex-col gap-4">

<select name="category_id" value={form.category_id} onChange={handleChange} className="input">
<option value="">Select Category</option>
{categories.map((c:any)=>(
<option key={c._id} value={c._id}>{c.name}</option>
))}
</select>

<input type="file" onChange={handleImageChange} className="input"/>

<textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input"/>

</div>

</div>

</div>

{/* STATUS */}

<div className="bg-gray-100 rounded-3xl p-4 md:p-6 border flex justify-between items-center">

<p className="text-sm">Active Status</p>

<input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange}/>

</div>

</div>

);
}