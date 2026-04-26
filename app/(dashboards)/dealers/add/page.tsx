"use client";

import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import DealerService from "@/app/components/services/dealerService";
import UserService from "@/app/components/services/userService";

export default function AddDealer() {
  const router = useRouter();
  const user = useSelector((state: any) => state.user.user);
  const [salesmen, setSalesmen] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSalesmen = async () => {
      if (user?.user_type !== "admin") return;
      const res = await UserService.getSalesmen(user?.industry);
      if (res.success) setSalesmen(res.salesmen);
    };
    if (user?.industry) fetchSalesmen();
  }, [user]);

  const [form, setForm] = useState({
    name: "", email: "", phone_number: "", whatsapp_number: "",
    company_name: "", business_logo: null as File | null,
    billing_address: "", shipping_address: "",
    city: "", country: "", is_active: true, userId: "",
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Only image allowed"); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be < 2MB"); return; }
    setForm({ ...form, business_logo: file });
  };

  const validate = () => {
    if (!form.name.trim()) return "Dealer name is required";
    if (!form.email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email format";
    if (!form.phone_number.trim()) return "Phone number is required";
    if (!/^[0-9]{10,15}$/.test(form.phone_number)) return "Phone must be 10–15 digits";
    if (!form.whatsapp_number.trim()) return "WhatsApp number is required";
    if (!/^[0-9]{10,15}$/.test(form.whatsapp_number)) return "WhatsApp must be 10–15 digits";
    if (!form.company_name.trim()) return "Company name is required";
    if (!form.billing_address.trim()) return "Billing address is required";
    if (!form.shipping_address.trim()) return "Shipping address is required";
    if (!form.city.trim()) return "City is required";
    if (!form.country.trim()) return "Country is required";
    if (user?.user_type === "admin" && !form.userId) return "Salesman is required";
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) { toast.error(error); return; }
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
      formData.append("is_active", String(form.is_active));
      if (user?.user_type === "admin") formData.append("userId", form.userId);
      if (form.business_logo) formData.append("business_logo", form.business_logo);
      const res = await DealerService.createDealer(formData, user?.industry);
      if (!res.success) { toast.error(res?.message); return; }
      toast.success("Dealer created successfully");
      router.push("/dealers");
      setForm({ name: "", email: "", phone_number: "", whatsapp_number: "", company_name: "", business_logo: null, billing_address: "", shipping_address: "", city: "", country: "", is_active: true, userId: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to create dealer");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder-gray-400 min-w-0";
  const labelCls = "text-xs font-medium text-gray-500";

  return (
    <div className="w-full max-w-4xl mx-auto px-2 py-3 md:px-6 md:py-6 overflow-hidden">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="min-w-0">
          <p className="text-xs text-gray-400 mb-0.5">Dealers › Add</p>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">Add Dealer</h1>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => router.push("/dealers")}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition cursor-pointer whitespace-nowrap">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition disabled:opacity-60 cursor-pointer flex items-center gap-1 whitespace-nowrap">
            {loading ? (
              <>
                <svg className="w-3 h-3 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Dealer
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── BASIC INFO CARD ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-3 md:p-5 mb-3 shadow-sm overflow-hidden">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Basic Info</h3>

        {/* Logo upload */}
        <div className="mb-3">
          <label className={labelCls}>Business Logo</label>
          <div className="mt-1 flex items-center gap-3">
            <div className="w-14 h-14 flex-shrink-0 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
              {form.business_logo ? (
                <img src={URL.createObjectURL(form.business_logo)} className="w-full h-full object-cover" alt="logo" />
              ) : (
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {form.business_logo ? "Change" : "Browse"}
                </span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              <span className="text-xs text-gray-400 truncate max-w-[160px]">
                {form.business_logo ? form.business_logo.name : "PNG, JPG up to 2MB"}
              </span>
            </div>
          </div>
        </div>

        {/* Fields grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">

          <div className="min-w-0">
            <label className={labelCls}>Dealer Name <span className="text-red-500">*</span></label>
            <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Full name" className={inputCls} />
          </div>

          <div className="min-w-0">
            <label className={labelCls}>Email <span className="text-red-500">*</span></label>
            <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="email@example.com" className={inputCls} />
          </div>

          <div className="min-w-0">
            <label className={labelCls}>Phone Number <span className="text-red-500">*</span></label>
            <input name="phone_number" value={form.phone_number} onChange={handleChange} type="text" placeholder="03001234567" className={inputCls} />
          </div>

          <div className="min-w-0">
            <label className={labelCls}>WhatsApp Number <span className="text-red-500">*</span></label>
            <input name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} type="text" placeholder="03001234567" className={inputCls} />
          </div>

          <div className="min-w-0">
            <label className={labelCls}>Company Name <span className="text-red-500">*</span></label>
            <input name="company_name" value={form.company_name} onChange={handleChange} type="text" placeholder="Company Pvt Ltd" className={inputCls} />
          </div>

          <div className="min-w-0">
            <label className={labelCls}>City <span className="text-red-500">*</span></label>
            <input name="city" value={form.city} onChange={handleChange} type="text" placeholder="Lahore" className={inputCls} />
          </div>

          <div className="min-w-0">
            <label className={labelCls}>Country <span className="text-red-500">*</span></label>
            <input name="country" value={form.country} onChange={handleChange} type="text" placeholder="Pakistan" className={inputCls} />
          </div>

          {user?.user_type === "admin" && (
            <div className="min-w-0">
              <label className={labelCls}>Assign Salesman <span className="text-red-500">*</span></label>
              <select name="userId" value={form.userId} onChange={handleChange} className={inputCls}>
                <option value="">Select Salesman</option>
                {salesmen.map((s: any) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="sm:col-span-2 min-w-0">
            <label className={labelCls}>Billing Address <span className="text-red-500">*</span></label>
            <input name="billing_address" value={form.billing_address} onChange={handleChange} type="text" placeholder="Street, Area, City" className={inputCls} />
          </div>

          <div className="sm:col-span-2 min-w-0">
            <label className={labelCls}>Shipping Address <span className="text-red-500">*</span></label>
            <input name="shipping_address" value={form.shipping_address} onChange={handleChange} type="text" placeholder="Street, Area, City" className={inputCls} />
          </div>

        </div>

        {user?.user_type === "salesman" && (
          <p className="text-xs text-gray-400 mt-3">Dealer will be assigned to you automatically.</p>
        )}
      </div>

      {/* ── ACTIVE STATUS ── */}
      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 md:px-5 shadow-sm flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-800">Active Status</p>
          <p className="text-xs text-gray-400">Enable or disable this dealer</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
          <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="sr-only peer" />
          <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-gray-900
            after:content-[''] after:absolute after:top-[2px] after:left-[2px]
            after:bg-white after:h-4 after:w-4 after:rounded-full
            after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
        </label>
      </div>

    </div>
  );
}