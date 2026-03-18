"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { dealer } from "@/app/components/services/dealerService";
    
export default function AddDealer() {

  const router = useRouter();

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
    country: ""
  });

  const [loading, setLoading] = useState(false);

  /* =========================
     HANDLE INPUT
  ========================= */

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  /* =========================
     HANDLE IMAGE
  ========================= */

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be < 2MB");
      return;
    }

    setForm({
      ...form,
      business_logo: file
    });
  };

  /* =========================
     VALIDATION
  ========================= */

  const validate = () => {

    if (!form.name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!form.phone_number.trim()) {
      toast.error("Phone number required");
      return false;
    }

    if (!form.company_name.trim()) {
      toast.error("Company name required");
      return false;
    }

    return true;
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async () => {

    if (!validate()) return;

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("email", form.email.trim());
      formData.append("phone_number", form.phone_number.trim());
      formData.append("whatsapp_number", form.whatsapp_number.trim());
      formData.append("company_name", form.company_name.trim());
      formData.append("billing_address", form.billing_address);
      formData.append("shipping_address", form.shipping_address);
      formData.append("city", form.city);
      formData.append("country", form.country);

      if (form.business_logo) {
        formData.append("business_logo", form.business_logo);
      }

      const res = await fetch("/dealers/create", {
        method: "POST",
        credentials: "include",
        body: formData
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Dealer created successfully");

      router.push("/dealers");

    } catch (err: any) {
      toast.error(err.message || "Failed to create dealer");
    } finally {
      setLoading(false);
    }
  };

return (
<div className="p-4 md:p-8 bg-gray-100 min-h-screen">

{/* HEADER */}

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

{/* BASIC INFO */}

<div className="bg-gray-100 rounded-3xl p-4 md:p-6 shadow-sm mb-4 border border-gray-200 w-full">

<h3 className="text-sm font-semibold text-gray-700 mb-5">
Basic Info
</h3>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

{/* LEFT */}

<div className="flex flex-col gap-4">

<div>
<label className="text-xs text-gray-500">Dealer Name</label>
<input
name="name"
value={form.name}
onChange={handleChange}
type="text"
placeholder="Dealer Name"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
/>
</div>

<div>
<label className="text-xs text-gray-500">Email</label>
<input
name="email"
value={form.email}
onChange={handleChange}
type="email"
placeholder="Email"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
/>
</div>

<div>
<label className="text-xs text-gray-500">Phone Number</label>
<input
name="phone_number"
value={form.phone_number}
onChange={handleChange}
type="text"
placeholder="Phone Number"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
/>
</div>

<div>
<label className="text-xs text-gray-500">WhatsApp Number</label>
<input
name="whatsapp_number"
value={form.whatsapp_number}
onChange={handleChange}
type="text"
placeholder="WhatsApp Number"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
/>
</div>

<div>
<label className="text-xs text-gray-500">Company Name</label>
<input
name="company_name"
value={form.company_name}
onChange={handleChange}
type="text"
placeholder="Company Name"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
/>
</div>

</div>

{/* RIGHT */}

<div className="flex flex-col gap-4">

<div>
<label className="text-xs text-gray-500">Business Logo</label>
<input
type="file"
accept="image/*"
onChange={handleImageChange}
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none"
/>
</div>

<div>
<label className="text-xs text-gray-500">Billing Address</label>
<input
name="billing_address"
value={form.billing_address}
onChange={handleChange}
type="text"
placeholder="Billing Address"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
/>
</div>

<div>
<label className="text-xs text-gray-500">Shipping Address</label>
<input
name="shipping_address"
value={form.shipping_address}
onChange={handleChange}
type="text"
placeholder="Shipping Address"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
/>
</div>

<div>
<label className="text-xs text-gray-500">City</label>
<input
name="city"
value={form.city}
onChange={handleChange}
type="text"
placeholder="City"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
/>
</div>

<div>
<label className="text-xs text-gray-500">Country</label>
<input
name="country"
value={form.country}
onChange={handleChange}
type="text"
placeholder="Country"
className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
/>
</div>

</div>

</div>

</div>

</div>
);} 