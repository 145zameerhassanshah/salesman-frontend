"use client";

import { category } from "@/app/components/services/categoryService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function AddCategory() {
  const router = useRouter();
  const user = useSelector((state: any) => state.user.user);

  const [formData, setFormData] = useState({
    name: "",
    order_no: 0,
    is_active: true,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) return toast.error("Category name is required");
      if (!formData.order_no || Number(formData.order_no) < 0) return toast.error("Sequence number must be greater than 0");
      const data = await category.addCategory(formData, user?.industry);
      if (!data.success) return toast.error(data?.message);
      toast.success(data?.message);
      router.push("/categories");
    } catch { toast.error("Something went wrong"); }
  };

  const inputCls = "w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder-gray-400 min-w-0";
  const labelCls = "text-xs font-medium text-gray-500";

  return (
    <div className="w-full  mx-auto  md:px-6 md:py-6 overflow-hidden">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="min-w-0">
          <p className="text-xs text-gray-400 mb-0.5">Categories › Add</p>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">Add Category</h1>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => router.push("/categories")}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition cursor-pointer whitespace-nowrap">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition cursor-pointer flex items-center gap-1 whitespace-nowrap">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Category
          </button>
        </div>
      </div>

      {/* ── BASIC INFO CARD ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-3 md:p-5 mb-3 shadow-sm">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Basic Info</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <div className="min-w-0">
            <label className={labelCls}>Category Name <span className="text-red-500">*</span></label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              placeholder="e.g. Electronics" className={inputCls} />
          </div>

          <div className="min-w-0">
            <label className={labelCls}>Sequence No <span className="text-red-500">*</span></label>
            <input type="number" name="order_no" value={formData.order_no} onChange={handleChange}
              placeholder="1" min={1} className={inputCls} />
            <p className="text-xs text-gray-400 mt-1">Order in which this category appears</p>
          </div>

        </div>
      </div>

      {/* ── ACTIVE STATUS ── */}
      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 md:px-5 shadow-sm flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-800">Active Status</p>
          <p className="text-xs text-gray-400">Enable or disable this category globally</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
          <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="sr-only peer" />
          <div className="w-10 h-5 bg-gray-200 rounded-full peer
            peer-checked:bg-gray-900
            after:content-[''] after:absolute after:top-[2px] after:left-[2px]
            after:bg-white after:h-4 after:w-4 after:rounded-full
            after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
        </label>
      </div>

    </div>
  );
}