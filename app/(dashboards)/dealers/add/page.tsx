"use client";

import { useSelector } from "react-redux";
import { useState,useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import DealerService from "@/app/components/services/dealerService";
import UserService from "@/app/components/services/userService"; 

export default function AddDealer() {

  const router = useRouter();
  const user = useSelector((state:any)=>state.user.user);

  const [salesmen, setSalesmen] = useState([]); 

useEffect(() => {
  // console.log("USER:", user);
  // console.log("INDUSTRY:", user?.industry);
}, [user]);

// 🔥 FETCH SALESMEN
useEffect(() => {
  const fetchSalesmen = async () => {
    const res = await UserService.getSalesmen(user?.industry);
        // console.log("SALESMEN API RESPONSE:", res); 

    if (res.success) {
      setSalesmen(res.salesmen);
    }
  };

  if (user?.industry) fetchSalesmen();
}, [user]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    whatsapp_number: "",
    company_name: "",
    business_logo: null as File | null,
    billing_address: "",
    shipping_address: "",
    city: "",
    country: "",
    is_active: true,
    userId: "" 
  });

  const [loading, setLoading] = useState(false);

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

    setForm({...form, business_logo:file});
  };

  const validate = () => {
  if (!form.name.trim()) return "Dealer name is required";

  if (!form.email.trim()) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email format";

  if (!form.phone_number.trim()) return "Phone number is required";
  if (!/^[0-9]{10,15}$/.test(form.phone_number)) {
    return "Phone number must be 10–15 digits";
  }

  if (!form.whatsapp_number.trim()) return "WhatsApp number is required";
  if (!/^[0-9]{10,15}$/.test(form.whatsapp_number)) {
    return "WhatsApp number must be 10–15 digits";
  }

  if (!form.company_name.trim()) return "Company name is required";

  if (!form.billing_address.trim()) return "Billing address is required";
  if (!form.shipping_address.trim()) return "Shipping address is required";

  if (!form.city.trim()) return "City is required";
  if (!form.country.trim()) return "Country is required";

  if (!form.userId) return "Salesman is required"; // 🔥 ADD

  return null;
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
      formData.append("email",form.email.trim());
      formData.append("phone_number",form.phone_number.trim());
      formData.append("whatsapp_number",form.whatsapp_number.trim());
      formData.append("company_name",form.company_name.trim());
      formData.append("billing_address",form.billing_address);
      formData.append("shipping_address",form.shipping_address);
      formData.append("city",form.city);
      formData.append("country",form.country);
      formData.append("is_active",String(form.is_active));
      formData.append("userId", form.userId); // 🔥 ADD

      if(form.business_logo){
        formData.append("business_logo",form.business_logo);
      }

      const res = await DealerService.createDealer(formData, user?.industry);
      if(!res.success){
        toast.error(res?.message);
        return;
      }

      toast.success("Dealer created successfully");

      router.push("/dealers");

      setForm({
        name:"",
        email:"",
        phone_number:"",
        whatsapp_number:"",
        company_name:"",
        business_logo:null,
        billing_address:"",
        shipping_address:"",
        city:"",
        country:"",
        is_active:true,
        userId:"" 
      });

    }catch(err:any){
      toast.error(err.message || "Failed to create dealer");
    }finally{
      setLoading(false);
    }
  };

return (
<div className="p-4 md:p-8 bg-gray-100 min-h-screen">

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">

<div>
<p className="text-sm text-gray-400">Dealers ›</p>
<h1 className="text-2xl md:text-3xl font-bold text-gray-800">
Add Dealer
</h1>
</div>

<div className="flex flex-wrap gap-2 md:gap-3">

<button
onClick={handleSubmit}
disabled={loading}
className="bg-black text-white px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm flex items-center gap-2"
>
{loading ? "Saving..." : "✓ Save Dealer"}
</button>

<button
onClick={() => router.push("/dealers")}
className="border border-gray-300 px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm text-red-500 hover:bg-red-100"
>
Cancel
</button>

</div>

</div>

<div className="bg-gray-100 rounded-3xl p-4 md:p-6 shadow-sm mb-4 border border-gray-200 w-full">

<h3 className="text-sm font-semibold text-gray-700 mb-5">
Basic Info
</h3>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

<div className="flex flex-col gap-4">

<div>
<label className="text-xs text-gray-500">
Dealer Name <span className="text-red-500">*</span>
</label>
<input name="name" value={form.name} onChange={handleChange} type="text"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none"/>
</div>

<div>
<label className="text-xs text-gray-500">
Email <span className="text-red-500">*</span>
</label>
<input name="email" value={form.email} onChange={handleChange} type="email"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none"/>
</div>

<div>
<label className="text-xs text-gray-500">
Phone Number <span className="text-red-500">*</span>
</label>
<input name="phone_number" value={form.phone_number} onChange={handleChange} type="text"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none"/>
</div>

<div>
<label className="text-xs text-gray-500">
WhatsApp Number <span className="text-red-500">*</span>
</label>
<input name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} type="text"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none"/>
</div>

<div>
<label className="text-xs text-gray-500">
Company Name <span className="text-red-500">*</span>
</label>
<input name="company_name" value={form.company_name} onChange={handleChange} type="text"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none"/>
</div>

{/* 🔥 SALESMAN DROPDOWN */}
<div>
<label className="text-xs text-gray-500">
Assign Salesman <span className="text-red-500">*</span>
</label>
<select
name="userId"
value={form.userId}
onChange={handleChange}
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none"
>
<option value="">Select Salesman</option>
{salesmen.map((s:any)=>(
<option key={s._id} value={s._id}>
{s.name} 
</option>
))}
</select>
</div>

</div>

<div className="flex flex-col gap-4">

<div>
<label className="text-xs text-gray-500">Business Logo</label>
<input type="file" accept="image/*" onChange={handleImageChange}
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none"/>
</div>

<div>
<label className="text-xs text-gray-500">
Billing Address <span className="text-red-500">*</span>
</label>
<input name="billing_address" value={form.billing_address} onChange={handleChange} type="text"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none"/>
</div>

<div>
<label className="text-xs text-gray-500">
Shipping Address <span className="text-red-500">*</span>
</label>
<input name="shipping_address" value={form.shipping_address} onChange={handleChange} type="text"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none"/>
</div>

<div>
<label className="text-xs text-gray-500">
City <span className="text-red-500">*</span>
</label>
<input name="city" value={form.city} onChange={handleChange} type="text"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none"/>
</div>

<div>
<label className="text-xs text-gray-500">
Country <span className="text-red-500">*</span>
</label>
<input name="country" value={form.country} onChange={handleChange} type="text"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none"/>
</div>

</div>

</div>

</div>

{/* ACTIVE STATUS SAME */}
<div className="bg-gray-100 rounded-3xl p-4 md:p-6 shadow-sm border border-gray-200 flex items-center justify-between w-full">

<div>
<h4 className="text-sm font-semibold text-gray-700">
Active Status
</h4>
<p className="text-xs text-gray-400">
Enable or disable this dealer.
</p>
</div>

<label className="relative inline-flex items-center cursor-pointer">
<input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="sr-only peer"/>
<div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-gray-800
after:content-[''] after:absolute after:top-[2px] after:left-[2px]
after:bg-white after:h-5 after:w-5 after:rounded-full
after:transition-all peer-checked:after:translate-x-full"></div>
</label>

</div>

</div>
);
}