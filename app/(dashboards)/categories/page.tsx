"use client";

import { category } from "@/app/components/services/categoryService";
import { Search, Filter, Plus, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [editItem, setEditItem] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: "", is_active: true });

  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();

  /* ============================== FETCH CATEGORIES ============================== */
  useEffect(() => {
    if (!user?.industry) return;

    async function getMyCategory() {
      try {
        const data = await category.getIndustryCategories(user.industry);
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    }

    getMyCategory();
  }, [user?.industry]);

  /* ============================== STATUS COLOR ============================== */
  const statusColor = (status: boolean) => {
    if (status === true) return "bg-green-100 text-green-600";
    if (status === false) return "bg-gray-200 text-gray-500";
    return "bg-teal-100 text-teal-600";
  };

  /* ============================== DELETE CATEGORY ============================== */
  const deleteCategory = async (id: any) => {
    const res = await category.removeCategory(id);
    if (res?.status === false) return toast.error(res?.message);

    setCategories((prev) => prev.filter((c) => c._id !== id));
    toast.success(res?.message);
  };

  /* ============================== UPDATE CATEGORY ============================== */
  const handleUpdate = async () => {
    try {
      const res = await category.updateCategory(editForm, editItem._id);
      if (!res.success) return toast.error(res.message);

      setCategories((prev) =>
        prev.map((c) => (c._id === editItem._id ? res.data : c))
      );

      toast.success("Category updated");
      setEditItem(null);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-semibold">Categories</h1>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="flex items-center bg-white/60 rounded-xl px-3 py-2">
            <Search size={16} className="text-gray-500 mr-2" />
            <input
              placeholder="Search"
              className="bg-transparent outline-none text-sm w-32 md:w-48"
            />
          </div>

          {/* Filter */}
          <button className="bg-white/60 p-2 rounded-xl">
            <Filter size={18} />
          </button>

          {/* Add Category */}
          <button
            onClick={() => router.push("/categories/add")}
            className="bg-black text-white flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
          >
            Add Category
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white/60 backdrop-blur rounded-3xl p-4 md:p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="text-left py-3">Category Name</th>
                <th className="text-left">Active</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((item, i) => (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-4 flex items-center gap-3">{item?.name}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-md text-xs ${statusColor(
                        item?.is_active
                      )}`}
                    >
                      {item?.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {/* EDIT */}
                      <button
                        onClick={() => {
                          setEditItem(item);
                          setEditForm({
                            name: item?.name,
                            is_active: item?.is_active,
                          });
                        }}
                        className="bg-gray-100 p-2 rounded-lg"
                      >
                        <Pencil size={14} />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => deleteCategory(item._id)}
                        className="bg-red-100 p-2 rounded-lg text-red-600 hover:bg-red-200"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-xs md:text-sm gap-3">
          <p className="text-gray-500">Total Categories: {categories.length}</p>
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[320px] space-y-4">
            <h2 className="text-lg font-semibold">Edit Category</h2>

            {/* Name */}
            <input
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className="w-full border p-2 rounded"
              placeholder="Category Name"
            />

            {/* Status */}
            <select
              value={editForm?.is_active ? "true" : "false"}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  is_active: e.target.value === "true",
                })
              }
              className="w-full border p-2 rounded"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditItem(null)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-black text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
