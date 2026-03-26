"use client";

import { Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import ProductService from "@/app/components/services/productService";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function ProductsTable({ products, refetch }: any) {
  const user = useSelector((state: any) => state.user.user);

  const [editProduct, setEditProduct] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const openEdit = (p: any) => {
    setEditProduct(p);
    setForm({
      name: p.name,
      sku: p.sku,
      mrp: p.mrp,
      discount_percent: p.discount_percent,
      is_active: p.is_active,
      industry: user?.industry,
    });
    setImageFile(null);
  };

  const closeEdit = () => {
    setEditProduct(null);
    setForm({});
    setImageFile(null);
  };

  const handleUpdate = async () => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, String(val)));
    if (imageFile) formData.append("image", imageFile);

    const res = await ProductService.updateProduct(formData, editProduct._id);

    if (!res.success) {
      toast.error(res?.message);
      setLoading(false);
      return;
    }

    toast.success(res?.message);
    setLoading(false);
    await refetch();
    closeEdit();
  };

  const handleDelete = async () => {
    const res = await ProductService.deleteProduct(deleteProductId);
    if (!res?.success) return toast.error(res?.message);
    toast.success(res?.message);
    setDeleteProductId(null);
    await refetch();
  };

  const statusColor = (status: boolean) =>
    status ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600";

  return (
    <>
      {/* EDIT MODAL — ADMIN ONLY */}
      {editProduct && user?.user_type === "admin" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Product</h2>
              <button onClick={closeEdit}>
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-3">

              <div>
                <label className="text-sm text-gray-500">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">SKU</label>
                <input
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm text-gray-500">MRP</label>
                  <input
                    type="number"
                    value={form.mrp}
                    onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-500">Discount %</label>
                  <input
                    type="number"
                    value={form.discount_percent}
                    onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Status</label>
                <select
                  value={form.is_active ? "true" : "false"}
                  onChange={(e) => setForm({ ...form, is_active: e.target.value === "true" })}
                  className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-500">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-sm mt-1"
                />
                {editProduct.image && !imageFile && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${editProduct.image}`}
                    className="w-16 h-16 rounded-lg object-cover mt-2"
                  />
                )}
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeEdit}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Delete Product?</h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteProductId(null)}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left py-3">Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>MRP</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products?.map((p: any) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">

                <td className="flex items-center gap-3 py-4">
                  <img
                    src={
                      p.image
                        ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${p.image}`
                        : "/placeholder.png"
                    }
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <p className="font-medium">{p.name}</p>
                </td>

                <td>{p.sku}</td>

                <td>
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md text-xs">
                    {p.category_id?.name}
                  </span>
                </td>

                <td>{p.mrp}</td>

                <td>
                  <span className={`px-2 py-1 rounded-md text-xs ${statusColor(p.is_active)}`}>
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="text-center">
                  <div className="flex justify-center gap-2">

                    {/* EDIT — ADMIN ONLY */}
                    {user?.user_type === "admin" && (
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg"
                      >
                        <Pencil size={14} />
                      </button>
                    )}

                    <button
                      onClick={() => setDeleteProductId(p._id)}
                      className="bg-red-100 text-red-600 p-2 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* FOOTER */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-sm gap-3">
        <p className="text-gray-500">Total Products: {products?.length}</p>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded">1</button>
          <button className="px-3 py-1">2</button>
          <button className="px-3 py-1">3</button>
        </div>
      </div>
    </>
  );
}