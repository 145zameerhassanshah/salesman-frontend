// "use client";

// import { Pencil, Trash2, X, Package } from "lucide-react";
// import { useState } from "react";
// import ProductService from "@/app/components/services/productService";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";

// export default function ProductsTable({ products, refetch,count }: any) {
//   const user = useSelector((state: any) => state.user.user);

//   const [editProduct, setEditProduct] = useState<any>(null);
//   const [form, setForm] = useState<any>({});
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

//   const openEdit = (p: any) => {
//     setEditProduct(p);
//     setForm({
//       name: p.name,
//       sku: p.sku,
//       mrp: p.mrp,
//       discount_percent: p.discount_percent,
//       is_active: p.is_active,
//       industry: user?.industry,
//     });
//     setImageFile(null);
//   };

//   const closeEdit = () => {
//     setEditProduct(null);
//     setForm({});
//     setImageFile(null);
//   };

//   const handleUpdate = async () => {
//     setLoading(true);
//     const formData = new FormData();
//     Object.entries(form).forEach(([key, val]) => formData.append(key, String(val)));
//     if (imageFile) formData.append("image", imageFile);
//     const res = await ProductService.updateProduct(formData, editProduct._id);
//     if (!res.success) {
//       toast.error(res?.message);
//       setLoading(false);
//       return;
//     }
//     toast.success(res?.message);
//     setLoading(false);
//     await refetch();
//     closeEdit();
//   };

//   const handleDelete = async () => {
//     const res = await ProductService.deleteProduct(deleteProductId);
//     if (!res?.success) return toast.error(res?.message);
//     toast.success(res?.message);
//     setDeleteProductId(null);
//     await refetch();
//   };

//   const statusColor = (status: boolean) =>
//     status ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600";

//   return (
//     <>
//       {/* ── EDIT MODAL — ADMIN ONLY ───────────────────────── */}
//       {editProduct && user?.user_type === "admin" && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
//           <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-semibold">Edit Product</h2>
//               <button onClick={closeEdit}>
//                 <X size={18} className="text-gray-500" />
//               </button>
//             </div>
//             <div className="space-y-3">
//               <div>
//                 <label className="text-sm text-gray-500">Name</label>
//                 <input
//                   value={form.name}
//                   onChange={(e) => setForm({ ...form, name: e.target.value })}
//                   className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm text-gray-500">SKU</label>
//                 <input
//                   value={form.sku}
//                   onChange={(e) => setForm({ ...form, sku: e.target.value })}
//                   className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none"
//                 />
//               </div>
//               <div className="flex gap-3">
//                 <div className="flex-1">
//                   <label className="text-sm text-gray-500">MRP</label>
//                   <input
//                     type="number"
//                     value={form.mrp}
//                     onChange={(e) => setForm({ ...form, mrp: e.target.value })}
//                     className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <label className="text-sm text-gray-500">Discount %</label>
//                   <input
//                     type="number"
//                     value={form.discount_percent}
//                     min={0}
//                     onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
//                     className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="text-sm text-gray-500">Status</label>
//                 <select
//                   value={form.is_active ? "true" : "false"}
//                   onChange={(e) => setForm({ ...form, is_active: e.target.value === "true" })}
//                   className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none"
//                 >
//                   <option value="true">Active</option>
//                   <option value="false">Inactive</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="text-sm text-gray-500">Image</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => setImageFile(e.target.files?.[0] || null)}
//                   className="w-full text-sm mt-1"
//                 />
//                 {editProduct.image && !imageFile && (
//                   <img src={editProduct.image} className="w-16 h-16 rounded-lg object-cover mt-2" />
//                 )}
//               </div>
//             </div>
//             <div className="flex justify-end gap-3 mt-6">
//               <button onClick={closeEdit} className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 text-sm">
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdate}
//                 disabled={loading}
//                 className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-50"
//               >
//                 {loading ? "Saving..." : "Save Changes"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── DELETE MODAL ─────────────────────────────────── */}
//       {deleteProductId && (
//         <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4 pb-6 sm:pb-0">
//           <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
//             <h2 className="text-lg font-semibold text-gray-800 mb-2">Delete Product?</h2>
//             <p className="text-sm text-gray-500 mb-6">
//               Are you sure you want to delete this product? This action cannot be undone.
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setDeleteProductId(null)}
//                 className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── MOBILE: CARDS ─────────────────────────────────── */}
//       <div className="md:hidden space-y-2.5">
//         {products && products.length > 0 ? (
//           products.map((p: any) => (
//             <div
//               key={p._id}
//               className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
//             >
//               <div className="flex items-center gap-3 p-3">
//                 {/* Image */}
//                 <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
//                   {p.image ? (
//                     <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <Package size={20} className="text-gray-400" />
//                     </div>
//                   )}
//                 </div>

//                 {/* Info */}
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between gap-1">
//                     <p className="font-semibold text-sm text-gray-900 truncate leading-tight">
//                       {p.name ?? "—"}
//                     </p>
//                     <span
//                       className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor(p.is_active)}`}
//                     >
//                       <span className={`w-1.5 h-1.5 rounded-full ${p.is_active ? "bg-green-500" : "bg-red-500"}`} />
//                       {p.is_active ? "Active" : "Inactive"}
//                     </span>
//                   </div>

//                   <p className="text-xs text-gray-400 mt-0.5 truncate">
//                     {p.category_id?.name ?? "Uncategorised"}
//                   </p>

//                   <div className="flex items-center gap-3 mt-0.5">
//                     {p.sku && (
//                       <p className="text-xs text-gray-400">SKU: {p.sku}</p>
//                     )}
//                     {p.mrp !== undefined && (
//                       <p className="text-sm font-bold text-gray-800">
//                         Rs {typeof p.mrp === "number" ? p.mrp.toLocaleString() : p.mrp}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Action Bar */}
//               <div className="border-t border-gray-100 flex">
//                 {user?.user_type === "admin" && (
//                   <button
//                     onClick={() => openEdit(p)}
//                     className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition"
//                   >
//                     <Pencil size={13} />
//                     Edit
//                   </button>
//                 )}
//                 {user?.user_type === "admin" && <div className="w-px bg-gray-100" />}
//                 <button
//                   onClick={() => setDeleteProductId(p._id)}
//                   className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 active:bg-red-100 transition"
//                 >
//                   <Trash2 size={13} />
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-16 text-gray-400 text-sm">
//             No products found.
//           </div>
//         )}
//       </div>

//       {/* ── DESKTOP: TABLE ────────────────────────────────── */}
//       <div className="hidden md:block">
//         <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
//           <table className="w-full table-fixed text-sm">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="w-[32%] px-4 py-3 text-left font-semibold text-gray-600">Product</th>
//                 <th className="w-[16%] px-4 py-3 text-center font-semibold text-gray-600">SKU</th>
//                 <th className="w-[18%] px-4 py-3 text-center font-semibold text-gray-600">Category</th>
//                 <th className="w-[14%] px-4 py-3 text-center font-semibold text-gray-600">MRP</th>
//                 <th className="w-[10%] px-4 py-3 text-center font-semibold text-gray-600">Status</th>
//                 <th className="w-[10%] px-4 py-3 text-center font-semibold text-gray-600">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products?.map((p: any) => (
//                 <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                   <td className="px-4 py-4 align-middle">
//                     <div className="flex items-center gap-3 min-w-0">
//                       <img
//                         src={p.image}
//                         alt={p.name}
//                         className="w-11 h-11 rounded-xl object-cover border border-gray-200 shrink-0"
//                       />
//                       <div className="min-w-0">
//                         <p className="font-medium text-gray-800 truncate">{p.name}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-4 text-center text-gray-700 align-middle break-words">{p.sku || "-"}</td>
//                   <td className="px-4 py-4 text-center align-middle">
//                     <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
//                       {p.category_id?.name || "-"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4 text-center text-gray-700 align-middle">{p.mrp ?? "-"}</td>
//                   <td className="px-4 py-4 text-center align-middle">
//                     <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${statusColor(p.is_active)}`}>
//                       {p.is_active ? "Active" : "Inactive"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4 text-center align-middle">
//                     <div className="flex items-center justify-center gap-2">
//                       {user?.user_type === "admin" && (
//                         <button
//                           onClick={() => openEdit(p)}
//                           className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
//                         >
//                           <Pencil size={14} />
//                         </button>
//                       )}
//                       <button
//                         onClick={() => setDeleteProductId(p._id)}
//                         className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
//                       >
//                         <Trash2 size={14} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Footer */}
//         <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-sm gap-3">
//           <p className="text-gray-500">Total Products: {count}</p>
//         </div>
//       </div>
//     </>
//   );
// }


"use client";

import { Eye, Pencil, Trash2, X, Package, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCategory } from "@/hooks/useCategory";
import ProductService from "@/app/components/services/productService";
import AuditLogService from "@/app/components/services/AuditLogService";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function ProductsTable({ products = [], refetch }: any) {
    const user = useSelector((state: any) => state.user.user);
    const { data: categories = [] } = useCategory(user?.industry);

  const [editProduct, setEditProduct] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const [activityProduct, setActivityProduct] = useState<any>(null);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const isAdmin = user?.user_type === "admin";

  const openEdit = (p: any) => {
    setEditProduct(p);
    setForm({
      name: p.name || "",
      sku: p.sku || "",
      mrp: p.mrp || 0,
      discount_percent: p.discount_percent || 0,
      order_no: p.order_no || 0,
      description: p.description || "",
      category_id: p.category_id?._id || p.category_id || "",
      is_active: Boolean(p.is_active),
      industry: user?.industry,
    });
    setImageFile(null);
  };

  const closeEdit = () => {
    setEditProduct(null);
    setForm({});
    setImageFile(null);
  };

const openActivity = async (p: any) => {
  setActivityProduct(p);
  setActivityLogs([]);
  setActivityLoading(true);

  try {
    const productRes = await ProductService.getProductById(p._id);

    if (productRes?.success) {
      setActivityProduct(productRes.product);
    }

    const logsRes = await ProductService.getProductAuditLogs(p._id, 1, 20);

    if (logsRes?.success) {
      setActivityLogs(logsRes?.data || []);
    } else {
      setActivityLogs([]);
    }
  } catch {
    toast.error("Failed to load product details");
    setActivityLogs([]);
  } finally {
    setActivityLoading(false);
  }
};
  const closeActivity = () => {
    setActivityProduct(null);
    setActivityLogs([]);
  };

  const handleUpdate = async () => {
    if (!editProduct?._id) return;

    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(key, String(val));
        }
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await ProductService.updateProduct(formData, editProduct._id);

      if (!res?.success) {
        toast.error(res?.message || "Product update failed");
        return;
      }

      toast.success(res?.message || "Product updated successfully");
      await refetch?.();
      closeEdit();
    } catch {
      toast.error("Product update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;

    const res = await ProductService.deleteProduct(deleteProductId);

    if (!res?.success) {
      toast.error(res?.message || "Delete failed");
      return;
    }

    toast.success(res?.message || "Product deleted successfully");
    setDeleteProductId(null);
    await refetch?.();
  };

  const statusColor = (status: boolean) =>
    status ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600";

  const getPerformedByText = (log: any) => {
    const name = log?.performedBy?.name || log?.performedByName || "System";
    const role =
      log?.performedBy?.user_type ||
      log?.performedBy?.role ||
      log?.performedByRole ||
      "";

    return role ? `${name} (${role})` : name;
  };

const formatAuditValue = (field: string, value: any) => {
  if (value === null || value === undefined || value === "") return "-";

  if (field === "category_id") {
    if (typeof value === "object") return value?.name || "-";

    const foundCategory = categories.find(
      (cat: any) => String(cat._id) === String(value)
    );

    return foundCategory?.name || "Category changed";
  }

  if (field === "is_active") {
    return value ? "Active" : "Inactive";
  }

  if (typeof value === "object") {
    if (value?.name) return value.name;
    if (value?.businessName) return value.businessName;
    if (value?.sku) return value.sku;
    return "-";
  }

  return String(value);
};  return (
    <>
      {/* ACTIVITY MODAL */}
{/* PRODUCT DETAILS + ACTIVITY MODAL */}
{activityProduct && (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4 pb-6 sm:pb-0">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-800">
            Product Details
          </h2>
          <p className="text-xs text-gray-400">
            Complete product information and activity history
          </p>
        </div>

        <button
          onClick={closeActivity}
          className="p-1.5 hover:bg-gray-100 rounded-lg"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>

      <div className="overflow-y-auto p-5 space-y-5">
        {/* Product Info */}
        <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4">
          <div className="w-full h-32 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
            {activityProduct?.image ? (
              <img
                src={activityProduct.image}
                alt={activityProduct?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package size={28} className="text-gray-400" />
            )}
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400">Product Name</p>
              <h3 className="text-lg font-semibold text-gray-900">
                {activityProduct?.name || "-"}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400">SKU</p>
                <p className="font-medium text-gray-800">
                  {activityProduct?.sku || "-"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400">Category</p>
                <p className="font-medium text-gray-800">
                  {activityProduct?.category_id?.name || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Details */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Pricing Details
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">MRP</p>
              <p className="font-semibold text-gray-900">
                Rs {Number(activityProduct?.mrp || 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Discount</p>
              <p className="font-semibold text-gray-900">
                {activityProduct?.discount_percent || 0}%
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Discount Amount</p>
              <p className="font-semibold text-red-500">
                Rs {Number(activityProduct?.discountAmount || 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Sale Price</p>
              <p className="font-semibold text-green-600">
                Rs {Number(activityProduct?.salePrice || activityProduct?.mrp || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Other Details */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Other Details
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Status</p>
              <span
                className={`inline-flex mt-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                  activityProduct?.is_active
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {activityProduct?.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Order No</p>
              <p className="font-medium text-gray-800">
                {activityProduct?.order_no ?? "-"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Created At</p>
              <p className="font-medium text-gray-800">
                {activityProduct?.createdAt
                  ? new Date(activityProduct.createdAt).toLocaleString()
                  : "-"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Updated At</p>
              <p className="font-medium text-gray-800">
                {activityProduct?.updatedAt
                  ? new Date(activityProduct.updatedAt).toLocaleString()
                  : "-"}
              </p>
            </div>
          </div>

          {activityProduct?.description && (
            <div className="bg-gray-50 rounded-xl p-3 mt-3 text-sm">
              <p className="text-xs text-gray-400 mb-1">Description</p>
              <p className="text-gray-700">{activityProduct.description}</p>
            </div>
          )}
        </div>

        {/* Activity History */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Activity History
          </p>

          <div className="space-y-2">
            {activityLoading ? (
              <div className="py-8 flex items-center justify-center gap-2 text-gray-400 text-sm bg-gray-50 rounded-xl">
                <Loader2 size={16} className="animate-spin" />
                Loading activity...
              </div>
            ) : activityLogs.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm bg-gray-50 rounded-xl">
                No activity found
              </div>
            ) : (
              activityLogs.map((log: any, index: number) => (
                <div
                  key={log?._id || index}
                  className="border border-gray-100 rounded-xl p-3 text-xs bg-gray-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-700">
                      {String(log.action || "").replaceAll("_", " ")}
                    </p>
                    <p className="text-gray-400">
                      {log.createdAt
                        ? new Date(log.createdAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>

                  <p className="text-gray-500 mt-1">
                    {log.description || "Action performed"}
                  </p>

                  <p className="text-gray-400 mt-1">
                    by {getPerformedByText(log)}
                  </p>

                  {log.changes && Object.keys(log.changes).length > 0 && (
                    <div className="mt-2 space-y-1">
                      {Object.entries(log.changes)
                        .filter(
                          ([field]) =>
                            ![
                              "_id",
                              "__v",
                              "businessId",
                              "createdAt",
                              "updatedAt",
                            ].includes(field)
                        )
                        .slice(0, 6)
                        .map(([field, value]: any) => (
                          <p key={field} className="text-gray-500">
                            <span className="font-medium">
                              {String(field).replaceAll("_", " ")}
                            </span>
{formatAuditValue(field, value?.from)} → {formatAuditValue(field, value?.to)}
                          </p>
                        ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      {/* EDIT MODAL */}
      {editProduct && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Product</h2>
              <button onClick={closeEdit}>
                <X size={18} className="text-gray-500" />
              </button>
            </div>

<div className="space-y-3">
  <div>
    <label className="text-sm text-gray-500">Product Name</label>
    <input
      value={form.name || ""}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none"
    />
  </div>

  <div>
    <label className="text-sm text-gray-500">SKU</label>
    <input
      value={form.sku || ""}
      onChange={(e) => setForm({ ...form, sku: e.target.value })}
      className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none"
    />
  </div>

  <div>
    <label className="text-sm text-gray-500">Category</label>
    <select
      value={form.category_id || ""}
      onChange={(e) => setForm({ ...form, category_id: e.target.value })}
      className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none bg-white"
    >
      <option value="">Select Category</option>
      {categories.map((cat: any) => (
        <option key={cat._id} value={cat._id}>
          {cat.name}
        </option>
      ))}
    </select>
  </div>

  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className="text-sm text-gray-500">MRP</label>
      <input
        type="number"
        value={form.mrp || ""}
        onChange={(e) => setForm({ ...form, mrp: e.target.value })}
        className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none"
      />
    </div>

    <div>
      <label className="text-sm text-gray-500">Discount %</label>
      <input
        type="number"
        value={form.discount_percent || ""}
        min={0}
        onChange={(e) =>
          setForm({ ...form, discount_percent: e.target.value })
        }
        className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none"
      />
    </div>
  </div>

  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className="text-sm text-gray-500">Order No</label>
      <input
        type="number"
        value={form.order_no || ""}
        onChange={(e) => setForm({ ...form, order_no: e.target.value })}
        className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none"
      />
    </div>

    <div>
      <label className="text-sm text-gray-500">Status</label>
      <select
        value={form.is_active ? "true" : "false"}
        onChange={(e) =>
          setForm({
            ...form,
            is_active: e.target.value === "true",
          })
        }
        className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none bg-white"
      >
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
    </div>
  </div>

  <div>
    <label className="text-sm text-gray-500">Description</label>
    <textarea
      rows={3}
      value={form.description || ""}
      onChange={(e) => setForm({ ...form, description: e.target.value })}
      className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none resize-none"
      placeholder="Product description..."
    />
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
        src={editProduct.image}
        alt={editProduct.name}
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

      {/* DELETE MODAL */}
      {deleteProductId && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4 pb-6 sm:pb-0">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Product?
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this product? This action cannot be
              undone.
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

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-2.5">
        {products.length > 0 ? (
          products.map((p: any) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="flex items-center gap-3 p-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={20} className="text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-semibold text-sm text-gray-900 truncate leading-tight">
                      {p.name ?? "—"}
                    </p>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor(
                        p.is_active,
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          p.is_active ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {p.category_id?.name ?? "Uncategorised"}
                  </p>

                  <div className="flex items-center gap-3 mt-0.5">
                    {p.sku && (
                      <p className="text-xs text-gray-400">SKU: {p.sku}</p>
                    )}

                    {p.mrp !== undefined && (
                      <p className="text-sm font-bold text-gray-800">
                        Rs{" "}
                        {typeof p.mrp === "number"
                          ? p.mrp.toLocaleString()
                          : p.mrp}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 flex">
                <button
                  onClick={() => openActivity(p)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  <Eye size={13} />
                  Activity
                </button>

                {isAdmin && (
                  <>
                    <div className="w-px bg-gray-100" />
                    <button
                      onClick={() => openEdit(p)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>

                    <div className="w-px bg-gray-100" />
                    <button
                      onClick={() => setDeleteProductId(p._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 transition"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-gray-400 text-sm">
            No products found.
          </div>
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-[30%] px-4 py-3 text-left font-semibold text-gray-600">
                  Product
                </th>
                <th className="w-[14%] px-4 py-3 text-center font-semibold text-gray-600">
                  SKU
                </th>
                <th className="w-[18%] px-4 py-3 text-center font-semibold text-gray-600">
                  Category
                </th>
                <th className="w-[12%] px-4 py-3 text-center font-semibold text-gray-600">
                  MRP
                </th>
                <th className="w-[10%] px-4 py-3 text-center font-semibold text-gray-600">
                  Status
                </th>
                <th className="w-[16%] px-4 py-3 text-center font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {products.length > 0 ? (
                products.map((p: any) => (
                  <tr
                    key={p._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 align-middle">
                      <div className="flex items-center gap-3 min-w-0">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-11 h-11 rounded-xl object-cover border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                            <Package size={18} className="text-gray-400" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate">
                            {p.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center text-gray-700 align-middle break-words">
                      {p.sku || "-"}
                    </td>

                    <td className="px-4 py-4 text-center align-middle">
                      <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                        {p.category_id?.name || "-"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center text-gray-700 align-middle">
                      {p.mrp ?? "-"}
                    </td>

                    <td className="px-4 py-4 text-center align-middle">
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${statusColor(
                          p.is_active,
                        )}`}
                      >
                        {p.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openActivity(p)}
                          className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition"
                        >
                          <Eye size={14} />
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              onClick={() => openEdit(p)}
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                            >
                              <Pencil size={14} />
                            </button>

                            <button
                              onClick={() => setDeleteProductId(p._id)}
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}