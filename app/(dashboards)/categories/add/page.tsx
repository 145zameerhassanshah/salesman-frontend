"use client";

import { category } from "@/app/components/services/categoryService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function AddCategory() {
const router=useRouter();
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

    /* ✅ VALIDATION */

    if (!formData.name.trim()) {
      return toast.error("Category name is required");
    }

    if (!formData.order_no || Number(formData.order_no) <0) {
      return toast.error("Sequence number must be greater than 0");
    }

    /* API CALL */

    const data = await category.addCategory(formData, user?.industry);

    if (!data.success) return toast.error(data?.message);

    toast.success(data?.message);
    router.push("/categories");

  } catch (error) {
    toast.error("Something went wrong");
  }
};

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">

        <div>
          <p className="text-sm text-gray-400">Categories ›</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Add Category
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3">

          <button
            onClick={handleSubmit}
            className="bg-black text-white px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm flex items-center gap-2"
          >
            ✓ Save Changes
          </button>

        </div>

      </div>

      {/* Basic Info Card */}

      <div className="bg-gray-100 rounded-3xl p-4 md:p-6 shadow-sm mb-4 border border-gray-200 w-full">

        <h3 className="text-sm font-semibold text-gray-700 mb-5">
          Basic Info
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left Side */}

          <div className="flex flex-col gap-4">

            <div>
              <label className="text-xs text-gray-500">
                Category Name
              </label> <span className="text-red-500">*</span>

              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Category Name"
                className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">
                Sequence No (No at which you want to show this category)
              </label><span className="text-red-500">*</span>

              <input
                type="number"
                name="order_no"
                required
                value={formData.order_no}
                onChange={handleChange}
                placeholder="0"
                min={1}
                className="w-full mt-1 bg-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

          </div>

        </div>

      </div>

      {/* Active Status */}

      <div className="bg-gray-100 rounded-3xl p-4 md:p-6 shadow-sm border border-gray-200 flex items-center justify-between w-full">

        <div>
          <h4 className="text-sm font-semibold text-gray-700">
            Active
          </h4>
          <p className="text-xs text-gray-400">
            Enable or disable this category globally.
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">

          <input
            type="checkbox"
            name="is_active"
            required
            checked={formData.is_active}
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