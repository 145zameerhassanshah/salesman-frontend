"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import UserService from "@/app/components/services/userService";
import { useRouter } from "next/navigation";

export default function AddSalesman() {
  const router = useRouter();
  const user = useSelector((state: any) => state.user.user);

  const emptyForm = {
    name: "", email: "", phone_number: "", 
    city: "", address: "", territory: "", designation: "",
    password: "", profile_image: null as File | null,
  };

  const [form, setForm] = useState(emptyForm);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Only image allowed"); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be < 2MB"); return; }
    setForm({ ...form, profile_image: file });
  };

  const handleSubmit = async () => {
    const { name, email, phone_number,  city, address, password, territory, designation } = form;
    if (!name || !email || !phone_number  || !city || !address || !password || !territory || !designation)
      return toast.error("Please fill all required fields");
    if (territory.length < 3) return toast.error("Territory must be at least 3 characters");
    if (designation.length < 2) return toast.error("Designation is too short");
    if (!user?.industry) return toast.error("Industry not found");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone_number", form.phone_number);
      formData.append("city", form.city);
      formData.append("address", form.address);
      formData.append("password", form.password);
      formData.append("user_type", "salesman");
      formData.append("industry", user.industry);
      formData.append("territory", form.territory);
      formData.append("designation", form.designation);
      if (form.profile_image) formData.append("profile_image", form.profile_image);

      const res = await UserService.createTeamMember(formData);
      if (!res.success) return toast.error(res.message);
      toast.success("Salesman created successfully");
      router.push("/saleman");
      setForm(emptyForm);
    } catch (err: any) {
      toast.error(err.message || "Failed to create salesman");
    }
  };

  const inputClass = "w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder-gray-400 min-w-0";
  const labelClass = "text-xs font-medium text-gray-500";

  return (
    <div className="w-full mx-auto px-2 py-3 md:px-6 md:py-6 overflow-hidden">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="min-w-0">
          <p className="text-xs text-gray-400 mb-0.5">Salesmen › Add</p>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">Add Salesman</h1>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => { setForm(emptyForm); router.push("/saleman"); }}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition cursor-pointer whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition cursor-pointer flex items-center gap-1 whitespace-nowrap"
          >
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save
          </button>
        </div>
      </div>

      {/* ── PROFILE IMAGE ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-3 md:p-5 mb-3 shadow-sm overflow-hidden">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Profile Image</h3>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 flex-shrink-0 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
            {form.profile_image ? (
              <img src={URL.createObjectURL(form.profile_image)} className="w-full h-full object-cover" alt="preview" />
            ) : (
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {form.profile_image ? "Change" : "Browse"}
              </span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            <span className="text-xs text-gray-400 truncate max-w-[180px]">
              {form.profile_image ? form.profile_image.name : "PNG, JPG up to 2MB"}
            </span>
          </div>
        </div>
      </div>

      {/* ── PERSONAL INFO ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-3 md:p-5 mb-3 shadow-sm overflow-hidden">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Personal Information</h3>

        {/* ✅ mobile: 1 column, sm+: 2 column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">

          <div className="min-w-0">
            <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
            <input name="name" value={form.name} onChange={handleChange}
              type="text" placeholder="John Doe" className={inputClass} />
          </div>

          <div className="min-w-0">
            <label className={labelClass}>Email <span className="text-red-500">*</span></label>
            <input name="email" value={form.email} onChange={handleChange}
              type="email" placeholder="john@email.com" className={inputClass} />
          </div>

          <div className="min-w-0">
            <label className={labelClass}>Phone <span className="text-red-500">*</span></label>
            <input name="phone_number" value={form.phone_number} onChange={handleChange}
              type="text" placeholder="+92 300 0000000" className={inputClass} />
          </div>


          <div className="min-w-0">
            <label className={labelClass}>Designation <span className="text-red-500">*</span></label>
            <input name="designation" value={form.designation} onChange={handleChange}
              type="text" placeholder="Sales Executive" className={inputClass} />
          </div>

          <div className="min-w-0">
            <label className={labelClass}>Territory <span className="text-red-500">*</span></label>
            <input name="territory" value={form.territory} onChange={handleChange}
              type="text" placeholder="Lahore Region" className={inputClass} />
          </div>

          <div className="min-w-0">
            <label className={labelClass}>City <span className="text-red-500">*</span></label>
            <input name="city" value={form.city} onChange={handleChange}
              type="text" placeholder="Lahore" className={inputClass} />
          </div>

          <div className="min-w-0">
            <label className={labelClass}>Password <span className="text-red-500">*</span></label>
            <input name="password" value={form.password} onChange={handleChange}
              type="password" placeholder="••••••••" className={inputClass} />
          </div>

          {/* ✅ Address — full width on sm+ */}
          <div className="sm:col-span-2 min-w-0">
            <label className={labelClass}>Address <span className="text-red-500">*</span></label>
            <input name="address" value={form.address} onChange={handleChange}
              type="text" placeholder="Street, House no. etc" className={inputClass} />
          </div>

        </div>
      </div>

    </div>
  );
}