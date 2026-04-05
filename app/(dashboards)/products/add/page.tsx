"use client";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ProductService from "@/app/components/services/productService";
import { category } from "@/app/components/services/categoryService";

export default function AddProduct() {
  const router = useRouter();
  const user=useSelector((state:any)=>state.user.user);

const [categories, setCategories] = useState<any[]>([]);

const [form,setForm] = useState({
name:"",
sku:"",
mrp:"",
discount_percent:"",
order_no:"",
description:"",
category_id:"",
image:null as File | null,
is_active:true
});

const [loading,setLoading] = useState(false);


useEffect(() => {
  if (!user?.industry) return; 

  async function fetchCategories() {
    const res = await category.getIndustryCategories(user.industry);
    setCategories(res || []);
  }

  fetchCategories();
}, [user?.industry]);
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



const validate = () => {
  if (!form.name.trim()) return "Product name is required";

  if (!form.sku.trim()) return "SKU is required";

  if (!form.mrp || Number(form.mrp) <= 0) {
    return "MRP must be greater than 0";
  }

  if (!form.category_id) return "Select category";

  if (!form.image) return "Product image required";

  // ✅ NEW (important improvements)

  if (form.discount_percent && Number(form.discount_percent) < 0) {
    return "Discount cannot be negative";
  }

  if (Number(form.discount_percent) >=30) {
    return "Discount cannot exceed 30%";
  }

  if (form.order_no && Number(form.order_no) < 0) {
    return "Order number cannot be negative";
  }

  return null; // ✅ VALID
};


const handleSubmit = async ()=>{
const error = validate();

if (error) {
  toast.error(error);
  return;
}

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
formData.append("is_active",String(form.is_active));

if(form.image){
formData.append("image",form.image);
}

const res = await ProductService.addProduct(formData,user?.industry);

if(!res.success){
toast.error(res.message);
return;
}

toast.success("Product added successfully");
router.push("/products");
setForm({
name:"",
sku:"",
mrp:"",
discount_percent:"",
order_no:"",
description:"",
category_id:"",
image:null,
is_active:true
});

}catch(err:any){
console.log(err);
toast.error(err.message || "Failed to add product");
}finally{
setLoading(false);
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
disabled={loading}
className="bg-black text-white px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm  cursor-pointer flex items-center gap-2"
>
{loading ? "Saving..." : "✓ Save Product"}
</button>

<button
onClick={() => router.push("/products")}
className="border border-gray-300 px-3 md:px-5 py-2 rounded-lg cursor-pointer text-xs md:text-sm text-red-500 hover:bg-red-100"
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


<div className="flex flex-col gap-4">

<div>
<label className="text-xs text-gray-500">Product Name</label><span className="text-red-500">*</span>
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
<label className="text-xs text-gray-500">SKU</label> <span className="text-red-500">*</span>
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
<label className="text-xs text-gray-500">MRP</label><span className="text-red-500">*</span>
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
max={100}
placeholder="0"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
/>
</div>

<div>
<label className="text-xs text-gray-500">Sort Order</label><span className="text-red-500">*</span>
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
<label className="text-xs text-gray-500">Category</label><span className="text-red-500">*</span>
<select
name="category_id"
value={form.category_id}
onChange={handleChange}
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none"
>
<option value="">Select Category</option>

{categories.map((c:any)=>(
<option key={c._id} value={c._id}>
{c.name}
</option>
))}

</select>
</div>

<div>
<label className="text-xs text-gray-500">Product Image</label><span className="text-red-500">*</span>
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