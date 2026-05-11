"use client";

import { useEffect, useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import DealerService from "@/app/components/services/dealerService";
import DealersTable from "@/app/components/dealers/allDealers";
import toast from "react-hot-toast";
import UserService from "@/app/components/services/userService";

export default function Page() {
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();

  const [dealers, setDealers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [editDealer, setEditDealer] = useState<any>(null);
  const [salesmen, setSalesmen] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  /* FETCH */
  const fetchDealers = async () => {
    try {
      const res = await DealerService.getAllDealers(user?.industry);
      if (res.success) { setDealers(res.dealers); setFiltered(res.dealers); }
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!user?.industry) return;
    fetchDealers();
  }, [user?.industry]);

  /* FILTER */
  useEffect(() => {
    let data = [...dealers];
    if (search) data = data.filter((d) => d.name?.toLowerCase().includes(search.toLowerCase()) || d.company_name?.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter) data = data.filter((d) => statusFilter === "active" ? d.is_active : !d.is_active);
    setFiltered(data);
  }, [search, statusFilter, dealers]);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 py-3 md:px-6 md:py-6 overflow-hidden">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">Dealers</h1>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Search desktop */}
          <div className="relative hidden md:block w-52">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input placeholder="Search dealer..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>

          {/* Status filter desktop */}
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="hidden md:block bg-white border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button onClick={() => router.push("/dealers/add")}
            className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-2 rounded-xl text-xs md:text-sm font-medium hover:bg-gray-700 transition whitespace-nowrap">
            <Plus size={14} />
            <span className="hidden sm:inline">Add Dealer</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Search + filter — mobile */}
      <div className="flex gap-2 md:hidden mb-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input placeholder="Search dealer..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-gray-200 px-2 py-2 rounded-xl text-sm focus:outline-none flex-shrink-0">
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* TABLE */}
      <div className=" rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <DealersTable
            dealers={filtered}
            refresh={fetchDealers}
            onEdit={(dealer: any) => setEditDealer(dealer)}
          />
        )}
      </div>

      {/* MODAL */}
      {editDealer && (
        <DealerEditModal
          dealer={editDealer}
          onClose={() => setEditDealer(null)}
          refresh={fetchDealers}
          user={user}
        />
      )}
    </div>
  );
}

/* ================= EDIT MODAL ================= */
function DealerEditModal({ dealer, onClose, refresh, user }: any) {
  const [salesmen, setSalesmen] = useState([]);

  const [form, setForm] = useState({
    name: dealer?.name || "",
    email: dealer?.email || "",
    phone_number: dealer?.phone_number || "",
    company_name: dealer?.company_name || "",
    billing_address: dealer?.billing_address || "",
    shipping_address: dealer?.shipping_address || "",
    city: dealer?.city || "",
    country: dealer?.country || "",
    is_active: dealer?.is_active ?? true,
    business_logo: null as File | null,
    userId: dealer?.assigned_to?._id || dealer?.assigned_to || "",
  });

  const [preview, setPreview] = useState(dealer?.business_logo);

  useEffect(() => {
    const fetchSalesmen = async () => {
      const res = await UserService.getSalesmen(dealer?.businessId);
      if (res.success) setSalesmen(res.salesmen);
    };
    if (dealer?.businessId) fetchSalesmen();
  }, [dealer]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

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
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    if (!form.phone_number.trim()) return "Phone is required";
    if (!form.company_name.trim()) return "Company is required";
    if (!form.billing_address.trim()) return "Billing address required";
    if (!form.shipping_address.trim()) return "Shipping address required";
    if (!form.city.trim()) return "City required";
    if (!form.country.trim()) return "Country required";
    if (!form.userId) return "Salesman required";
    return null;
  };

  const handleUpdate = async () => {
    const error = validate();
    if (error) { toast.error(error); return; }
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]: any) => {
        if (key !== "business_logo") formData.append(key, val);
      });
      if (form.business_logo) formData.append("business_logo", form.business_logo);
      const res = await DealerService.updateDealer(formData, dealer._id);
      if (!res.success) { toast.error(res.message); return; }
      toast.success("Dealer updated");
      refresh();
      onClose();
    } catch { toast.error("Update failed"); }
  };

  const inputCls = "w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder-gray-400 min-w-0";
  const labelCls = "text-xs font-medium text-gray-500";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:w-[460px] rounded-t-2xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-sm font-semibold text-gray-900">Edit Dealer</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-4 space-y-3">

          {/* Image upload */}
          <div>
            <p className={labelCls}>Business Logo </p>
            <div className="flex items-center gap-3 mt-1">
              <div className="w-14 h-14 flex-shrink-0 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" alt="logo" />
                ) : (
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition">
                  {preview ? "Change" : "Browse"}
                </span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Fields 2-col grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div className="min-w-0">
              <label className={labelCls}>Dealer Name <span className="text-red-500">*</span></label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" className={inputCls} />
            </div>

            <div className="min-w-0">
              <label className={labelCls}>Email <span className="text-red-500">*</span></label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className={inputCls} />
            </div>

            <div className="min-w-0">
              <label className={labelCls}>Phone <span className="text-red-500">*</span></label>
              <input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="+92 300 0000000" className={inputCls} />
            </div>


            <div className="min-w-0">
              <label className={labelCls}>Company Name <span className="text-red-500">*</span></label>
              <input name="company_name" value={form.company_name} onChange={handleChange} placeholder="Company" className={inputCls} />
            </div>

            <div className="min-w-0">
              <label className={labelCls}>City <span className="text-red-500">*</span></label>
              <input name="city" value={form.city} onChange={handleChange} placeholder="City" className={inputCls} />
            </div>

            <div className="min-w-0">
              <label className={labelCls}>Country <span className="text-red-500">*</span></label>
              <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className={inputCls} />
            </div>

            <div className="min-w-0">
              <label className={labelCls}>Status <span className="text-red-500">*</span></label>
              <select value={form.is_active ? "true" : "false"}
                onChange={(e) => setForm({ ...form, is_active: e.target.value === "true" })}
                className={inputCls}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div className="sm:col-span-2 min-w-0">
              <label className={labelCls}>Billing Address <span className="text-red-500">*</span></label>
              <input name="billing_address" value={form.billing_address} onChange={handleChange} placeholder="Billing address" className={inputCls} />
            </div>

            <div className="sm:col-span-2 min-w-0">
              <label className={labelCls}>Shipping Address <span className="text-red-500">*</span></label>
              <input name="shipping_address" value={form.shipping_address} onChange={handleChange} placeholder="Shipping address" className={inputCls} />
            </div>

            {user?.user_type === "admin" && (
              <div className="sm:col-span-2 min-w-0">
                <label className={labelCls}>Assign Salesman <span className="text-red-500">*</span></label>
                <select name="userId" value={String(form.userId)} onChange={handleChange} className={inputCls}>
                  <option value="">Select Salesman</option>
                  {salesmen.map((s: any) => (
                    <option key={s._id} value={String(s._id)}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-4 py-3 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleUpdate} className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition font-medium">Update</button>
        </div>

      </div>
    </div>
  );
}