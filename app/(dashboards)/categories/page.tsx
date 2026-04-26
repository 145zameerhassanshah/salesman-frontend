"use client";

import { category } from "@/app/components/services/categoryService";
import { Search, Filter, Plus, Pencil, Trash, X, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [editItem, setEditItem] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: "", is_active: true });
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();

  /* ============================== FETCH ============================== */
  useEffect(() => {
    if (!user?.industry) return;
    async function getMyCategory() {
      try {
        const data = await category.getIndustryCategories(user.industry);
        setCategories(data);
      } catch (error) { console.error(error); }
    }
    getMyCategory();
  }, [user?.industry]);

  const filtered = search.trim()
    ? categories.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()))
    : categories;

  /* ============================== STATUS ============================== */
  const statusCls = (status: boolean) =>
    status ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500";

  /* ============================== DELETE ============================== */
  const deleteCategory = async () => {
    if (!confirmId) return;
    const res = await category.removeCategory(confirmId);
    if (res?.status === false) return toast.error(res?.message);
    setCategories((prev) => prev.filter((c) => c._id !== confirmId));
    toast.success(res?.message);
    setConfirmId(null);
  };

  /* ============================== UPDATE ============================== */
  const handleUpdate = async () => {
    try {
      const res = await category.updateCategory(editForm, editItem._id);
      if (!res.success) return toast.error(res.message);
      setCategories((prev) => prev.map((c) => (c._id === editItem._id ? res.data : c)));
      toast.success("Category updated");
      setEditItem(null);
    } catch { toast.error("Update failed"); }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 bg-white";
  const labelCls = "text-xs font-medium text-gray-500 mb-1 block";

  return (
    <div className="w-full md:px-6 md:py-6 overflow-hidden">

      {/* ── CONFIRM DELETE MODAL ── */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-sm">
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-50 mx-auto mb-3">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 text-center mb-1">Delete Category</h2>
            <p className="text-sm text-gray-500 text-center mb-5">Are you sure? This action cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmId(null)}
                className="flex-1 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={deleteCategory}
                className="flex-1 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">Categories</h1>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Search desktop */}
          <div className="relative hidden md:block w-52">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input placeholder="Search category..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>
          <button onClick={() => router.push("/categories/add")}
            className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-2 rounded-xl text-xs md:text-sm font-medium hover:bg-gray-700 transition whitespace-nowrap">
            <Plus size={14} />
            <span className="hidden sm:inline">Add Category</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Search mobile */}
      <div className="relative md:hidden mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input placeholder="Search category..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900" />
      </div>

      {/* ── DESKTOP TABLE ── */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4 text-left font-medium">Category Name</th>
              <th className="py-3 px-4 text-left font-medium">Status</th>
              <th className="py-3 px-4 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition">
                <td className="py-3 px-4 font-medium text-gray-800">{item?.name}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusCls(item?.is_active)}`}>
                    {item?.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => { setEditItem(item); setEditForm({ name: item?.name, is_active: item?.is_active }); }}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                      <Pencil size={14} className="text-gray-600" />
                    </button>
                    <button onClick={() => setConfirmId(item._id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition">
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={3} className="py-12 text-center text-gray-400 text-sm">No categories found</td></tr>
            )}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          Total: <span className="font-medium text-gray-600">{categories.length}</span> categories
        </div>
      </div>

      {/* ── MOBILE CARDS ── */}
      <div className="md:hidden space-y-2">
        {filtered.map((item, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-3 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{item?.name}</p>
              <span className={`mt-1 inline-block px-2 py-0.5 text-xs rounded-lg font-medium ${statusCls(item?.is_active)}`}>
                {item?.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button onClick={() => { setEditItem(item); setEditForm({ name: item?.name, is_active: item?.is_active }); }}
                className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                <Pencil size={13} className="text-gray-600" />
              </button>
              <button onClick={() => setConfirmId(item._id)}
                className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition">
                <Trash2 size={13} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">
            No categories found
          </div>
        )}
        <p className="text-xs text-gray-400 text-center pt-1">
          Total: <span className="font-medium text-gray-600">{categories.length}</span> categories
        </p>
      </div>

      {/* ── EDIT MODAL ── */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full sm:w-[360px] rounded-t-2xl sm:rounded-2xl shadow-xl">

            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Edit Category</h2>
              <button onClick={() => setEditItem(null)} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className={labelCls}>Category Name</label>
                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Category name" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select value={editForm?.is_active ? "true" : "false"}
                  onChange={(e) => setEditForm({ ...editForm, is_active: e.target.value === "true" })}
                  className={inputCls}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
              <button onClick={() => setEditItem(null)}
                className="flex-1 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleUpdate}
                className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition font-medium">
                Update
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}