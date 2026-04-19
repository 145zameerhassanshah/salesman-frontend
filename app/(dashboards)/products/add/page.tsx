"use client";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ProductService from "@/app/components/services/productService";
import { category } from "@/app/components/services/categoryService";

export default function AddProduct() {
  const router = useRouter();
  const user = useSelector((state: any) => state.user.user);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    mrp: "",
    discount_percent: "",
    order_no: "",
    description: "",
    category_id: "",
    image: null as File | null,
    is_active: true,
  });

  useEffect(() => {
    if (!user?.industry) return;
    async function fetchCategories() {
      const res = await category.getIndustryCategories(user.industry);
      setCategories(res || []);
    }
    fetchCategories();
  }, [user?.industry]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Only image allowed"); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be < 2MB"); return; }
    setForm({ ...form, image: file });
  };

  const validate = () => {
    if (!form.name.trim()) return "Product name is required";
    if (!form.sku.trim()) return "SKU is required";
    if (!form.mrp || Number(form.mrp) <= 0) return "MRP must be greater than 0";
    if (!form.category_id) return "Select category";
    if (!form.image) return "Product image required";
    if (form.discount_percent && Number(form.discount_percent) < 0) return "Discount cannot be negative";
    if (Number(form.discount_percent) > 30) return "Discount cannot exceed 30%";
    if (form.order_no && Number(form.order_no) <= 0) return "Order number cannot be 0";
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) { toast.error(error); return; }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("sku", form.sku.trim());
      formData.append("mrp", String(Number(form.mrp)));
      formData.append("discount_percent", String(Number(form.discount_percent || 0)));
      formData.append("order_no", String(Number(form.order_no || 0)));
      formData.append("description", form.description);
      formData.append("category_id", form.category_id);
      formData.append("is_active", String(form.is_active));
      if (form.image) formData.append("image", form.image);
      const res = await ProductService.addProduct(formData, user?.industry);
      if (!res.success) { toast.error(res.message); return; }
      toast.success("Product added successfully");
      router.push("/products");
    } catch (err: any) {
      toast.error(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder-gray-400";

  const labelClass = "text-xs font-medium text-gray-500 flex items-center gap-0.5";

  return (
    <div className="max-w-4xl mx-auto px-3 py-4 md:px-6 md:py-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Products › Add</p>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Add Product</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/products")}
            className="px-3 py-2 text-xs md:text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 md:px-5 py-2 text-xs md:text-sm bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition disabled:opacity-60 cursor-pointer flex items-center gap-1.5"
          >
            {loading ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Product
              </>
            )}
          </button>
        </div>
      </div>

      {/* BASIC INFO CARD */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 mb-3 shadow-sm">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Basic Info</h3>

        {/* IMAGE UPLOAD — full width on top */}
        <div className="mb-4">
          <label className={labelClass}>
            Product Image <span className="text-red-500">*</span>
          </label>
          <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Preview */}
            <div className="w-16 h-16 flex-shrink-0 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
              {form.image ? (
                <img src={URL.createObjectURL(form.image)} className="w-full h-full object-cover" alt="preview" />
              ) : (
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>

            {/* Upload area */}
            <label className="cursor-pointer w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-xl hover:bg-gray-700 transition whitespace-nowrap">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {form.image ? "Change Image" : "Browse Image"}
                </span>
                <span className="text-xs text-gray-400">
                  {form.image ? form.image.name : "PNG, JPG up to 2MB"}
                </span>
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* GRID FIELDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* Product Name */}
          <div>
            <label className={labelClass}>
              Product Name <span className="text-red-500">*</span>
            </label>
            <input name="name" value={form.name} onChange={handleChange}
              type="text" placeholder="e.g. Air Cooler, Geysers"
              className={inputClass} />
          </div>

          {/* SKU */}
          <div>
            <label className={labelClass}>
              SKU <span className="text-red-500">*</span>
            </label>
            <input name="sku" value={form.sku} onChange={handleChange}
              type="text" placeholder="e.g. FLW-001"
              className={inputClass} />
          </div>

          {/* MRP */}
          <div>
            <label className={labelClass}>
              MRP (Rs.) <span className="text-red-500">*</span>
            </label>
            <input name="mrp" value={form.mrp} onChange={handleChange}
              type="number" placeholder="0"
              className={inputClass} />
          </div>

          {/* Discount */}
          <div>
            <label className={labelClass}>Discount %</label>
            <input name="discount_percent" value={form.discount_percent} onChange={handleChange}
              type="number" max={30} min={0} placeholder="0"
              className={inputClass} />
          </div>

          {/* Sort Order */}
          <div>
            <label className={labelClass}>
              Sort Order <span className="text-red-500">*</span>
            </label>
            <input name="order_no" value={form.order_no} onChange={handleChange}
              type="number" placeholder="1" min={1}
              className={inputClass} />
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>
              Category <span className="text-red-500">*</span>
            </label>
            <select name="category_id" value={form.category_id} onChange={handleChange}
              className={inputClass}>
              <option value="">Select Category</option>
              {categories.map((c: any) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Description — full width */}
          <div className="sm:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={3} placeholder="Short product description..."
              className={`${inputClass} resize-none`} />
          </div>

        </div>
      </div>

      {/* ACTIVE STATUS CARD */}
      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 md:px-5 shadow-sm flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-800">Active Status</p>
          <p className="text-xs text-gray-400">Enable or disable this product globally</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
          <input type="checkbox" name="is_active" checked={form.is_active}
            onChange={handleChange} className="sr-only peer" />
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