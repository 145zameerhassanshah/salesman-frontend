"use client";
import QuotationService from "@/app/components/services/quotationService";
import { useQuotations } from "@/hooks/useQuotations";
import { useCategory } from "@/hooks/useCategory";
import {
  Eye,
  Plus,
  Search,
  SlidersHorizontal,
  Pencil,
  X,
  Check,
  Trash2,
  MoreVertical,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const statusStyle: any = {
  Pending: "bg-yellow-100 text-yellow-600",
  Active: "bg-blue-100 text-blue-600",
  Approved: "bg-green-100 text-green-600",
  Rejected: "bg-red-100 text-red-600",
  Delivered: "bg-green-100 text-green-600",
  Cancelled: "bg-orange-100 text-orange-600",
};

export default function QuotationsPage() {
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();
  const { data, refetch } = useQuotations(user?.industry);
  const { data: categories = [] } = useCategory(user?.industry);

  const [search, setSearch] = useState("");
  const [productMap, setProductMap] = useState<any>({});

  // VIEW STATE
  const [viewQuotation, setViewQuotation] = useState<any>(null);
  const [viewItems, setViewItems] = useState<any[]>([]);
  const [viewLoading, setViewLoading] = useState(false);

  // EDIT STATE
  const [editQuotation, setEditQuotation] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editItems, setEditItems] = useState<any[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editFetchLoading, setEditFetchLoading] = useState(false);

  // CONFIRM STATE
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | "delete" | null>(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null); // For 3-dot menu

  const filtered = useMemo(() => {
    let result = data || [];
    if (search.trim()) {
      result = result.filter((q: any) =>
        q?.quotation_number?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter) {
      result = result.filter((q: any) =>
        q?.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    return result;
  }, [search, statusFilter, data]);

  const formatStatus = (status: string) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";
  };

  const formatAmount = (value: any) => Number(value || 0).toFixed(0);
  // Load products for edit modal
  useEffect(() => {
    const loadProducts = async () => {
      const newMap: any = { ...productMap };
      for (const item of editItems) {
        if (item.category_id && !newMap[item.category_id]) {
          const res = await QuotationService.getProductsByCategory(item.category_id);
          newMap[item.category_id] = res.products || res;
        }
      }
      setProductMap(newMap);
    };

    if (editItems.length > 0) loadProducts();
  }, [editItems]);

  /* ── VIEW ── */
  const handleView = async (id: string) => {
    setViewLoading(true);
    try {
      const res = await QuotationService.getQuotationById(id);
      if (!res.success) return toast.error(res?.message || "Failed to load quotation");
      setViewQuotation(res?.quotation);
      setViewItems(res?.items || []);
    } catch {
      toast.error("Failed to load quotation details");
    } finally {
      setViewLoading(false);
    }
    setOpenMenuId(null);
  };

  const closeView = () => {
    setViewQuotation(null);
    setViewItems([]);
  };

  /* ── EDIT ── */
  const openEdit = async (quotation: any) => {
    setEditFetchLoading(true);
    setEditQuotation(quotation);

    const discountType = quotation?.discount_type || "fixed";
    const taxType = quotation?.tax_type || "fixed";

    const rawDiscount =
      discountType === "percentage" && quotation?.subtotal > 0
        ? ((quotation.discount / quotation.subtotal) * 100).toFixed(2)
        : quotation?.discount || 0;

    const rawTax =
      taxType === "percentage" && (quotation?.subtotal - quotation?.discount) > 0
        ? ((quotation.tax / (quotation.subtotal - quotation.discount)) * 100).toFixed(2)
        : quotation?.tax || 0;

    setEditForm({
      valid_until: quotation?.valid_until?.split("T")[0] || "",
      discount: rawDiscount,
      discount_type: discountType,
      tax: rawTax,
      tax_type: taxType,
      deliveryNotes: quotation?.deliveryNotes || "",
    });

    try {
      const res = await QuotationService.getQuotationById(quotation._id);
      if (res.success) {
        setEditItems(
          res.items.map((item: any) => ({
            ...item,
            product_id: item.product_id?._id || item.product_id,
            category_id: item.category_id || item.product_id?.category_id || "",
          }))
        );
      }
    } catch {
      toast.error("Failed to load quotation items");
    } finally {
      setEditFetchLoading(false);
    }
    setOpenMenuId(null);
  };

  const closeEdit = () => {
    setEditQuotation(null);
    setEditForm({});
    setEditItems([]);
  };

  const updateEditItem = (index: number, key: string, value: any) => {
    const updated = [...editItems];
    if (["unit_price", "quantity", "discount_percent"].includes(key)) {
      updated[index][key] = Number(value) || 0;
    } else {
      updated[index][key] = value;
    }

    const price = Number(updated[index].unit_price) || 0;
    const qty = Number(updated[index].quantity) || 0;
    const discount = Number(updated[index].discount_percent) || 0;
    const gross = price * qty;
    const discountAmount = (gross * discount) / 100;

    updated[index].total = Number((gross - discountAmount).toFixed(2));
    setEditItems(updated);
  };

  const addEditItem = () => {
    setEditItems([
      ...editItems,
      {
        product_id: "",
        category_id: "",
        item_name: "",
        unit_price: 0,
        discount_percent: 0,
        quantity: 1,
        total: 0,
      },
    ]);
  };

  const removeEditItem = (index: number) => {
    setEditItems(editItems.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    setEditLoading(true);
    try {
      const payload = {
        valid_until: editForm.valid_until,
        deliveryNotes: editForm.deliveryNotes,
        discount: editForm.discount,
        discount_type: editForm.discount_type,
        tax: editForm.tax,
        tax_type: editForm.tax_type,
        subtotal: computedTotals.subtotal,
        total: computedTotals.total,
        items: editItems.map((item) => ({
          product_id: item.product_id,
          category_id: item.category_id,
          item_name: item.item_name,
          unit_price: Number(item.unit_price),
          discount_percent: Number(item.discount_percent),
          quantity: Number(item.quantity),
          total: Number(item.total),
        })),
      };

      const res = await QuotationService.updateQuotation(payload, editQuotation._id);
      if (!res.success) return toast.error(res?.message || "Update failed");

      toast.success("Quotation updated successfully");
      await refetch();
      closeEdit();
    } catch {
      toast.error("Update failed");
    } finally {
      setEditLoading(false);
    }
  };

  /* ── DOWNLOAD PDF ── */
  const handleDownloadPDF = async (id: string) => {
    try {
      await QuotationService.downloadPdf(id);
      toast.success("Downloading PDF...");
    } catch {
      toast.error("Failed to download PDF");
    }
    setOpenMenuId(null);
  };

  /* ── CONFIRM ACTIONS ── */
  const handleConfirm = async () => {
    if (!confirmId || !confirmAction) return;
    try {
      if (confirmAction === "approve") {
        const res = await QuotationService.updateQuotationStatus(confirmId, "approved");
        toast.success(res?.message || "Quotation approved");
      } else if (confirmAction === "reject") {
        const res = await QuotationService.updateQuotationStatus(confirmId, "rejected");
        toast.success(res?.message || "Quotation rejected");
      } else if (confirmAction === "delete") {
        const res = await QuotationService.deleteQuotation(confirmId);
        toast.success(res?.message || "Quotation deleted");
      }
      await refetch();
    } catch {
      toast.error("Action failed");
    } finally {
      setConfirmId(null);
      setConfirmAction(null);
    }
  };
  

  const computedTotals = useMemo(() => {
    const subtotal = editItems.reduce((sum, item) => sum + Number(item.total || 0), 0);

    let discountAmount = 0;
    if (editForm.discount_type === "percentage") {
      discountAmount = (subtotal * Number(editForm.discount || 0)) / 100;
    } else {
      discountAmount = Number(editForm.discount || 0);
    }

    let taxAmount = 0;
    if (editForm.tax_type === "percentage") {
      taxAmount = ((subtotal - discountAmount) * Number(editForm.tax || 0)) / 100;
    } else {
      taxAmount = Number(editForm.tax || 0);
    }

    return {
      subtotal,
      discountAmount,
      taxAmount,
      total: subtotal - discountAmount + taxAmount,
    };
  }, [editItems, editForm]);

  /* ── PERMISSIONS ── */
  const canEdit = (q: any) => {
    const status = q?.status?.toLowerCase();
    if (user?.user_type === "admin") return status === "pending" || status === "approved" || status==="rejected";
    if (user?.user_type === "salesman" && q?.created_by?._id === user?._id)
      return status === "pending" || status === "rejected";
    return false;
  };

  const canDelete = (q: any) => {
    const status = q?.status?.toLowerCase();
    return ((user?.user_type === "salesman" && q?.created_by?._id === user?._id) && (status === "pending" || status === "rejected")) || ((user?.user_type==="admin") && (status === "pending" || status === "rejected" || status==="approved")); 
  
  };
  const canDownloadPDF = (q: any) => {
    return user?.user_type === "admin" || (user?.user_type === "salesman" && q?.status === "approved");
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      {/* Confirm Modal */}
      {confirmId && confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {confirmAction === "approve" ? "Approve Quotation?" :
               confirmAction === "reject" ? "Reject Quotation?" : "Delete Quotation?"}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {confirmAction === "approve" ? "Are you sure you want to approve this quotation?" :
               confirmAction === "reject" ? "Are you sure you want to reject this quotation? This action cannot be undone." :
               "Are you sure you want to delete this quotation? This action cannot be undone."}
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => { setConfirmId(null); setConfirmAction(null); }}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 text-sm">
                Cancel
              </button>
              <button onClick={handleConfirm}
                className={`px-4 py-2 rounded-lg text-white text-sm ${confirmAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
                {confirmAction === "approve" ? "Approve" : confirmAction === "reject" ? "Reject" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

     {/* EDIT MODAL */}
{editQuotation && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Edit Quotation</h2>
          <p className="text-sm text-gray-500">{editQuotation?.quotation_number}</p>
        </div>
        <button
          onClick={closeEdit}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <X size={18} />
        </button>
      </div>

      {editFetchLoading ? (
        <div className="p-6 text-sm text-gray-500">Loading quotation...</div>
      ) : (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Valid Until</label>
              <input
                type="date"
                value={editForm.valid_until || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, valid_until: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Discount</label>
              <input
                type="number"
                value={editForm.discount || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, discount: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Discount Type</label>
              <select
                value={editForm.discount_type || "fixed"}
                onChange={(e) =>
                  setEditForm({ ...editForm, discount_type: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="fixed">Amount</option>
                <option value="percentage">%</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Tax</label>
              <input
                type="number"
                value={editForm.tax || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, tax: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Tax Type</label>
              <select
                value={editForm.tax_type || "fixed"}
                onChange={(e) =>
                  setEditForm({ ...editForm, tax_type: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="fixed">Amount</option>
                <option value="percentage">%</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Delivery Notes</label>
            <textarea
              value={editForm.deliveryNotes || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, deliveryNotes: e.target.value })
              }
              rows={3}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-800">Items</h3>
              <button
                onClick={addEditItem}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm"
              >
                <Plus size={16} /> Add Item
              </button>
            </div>

            {editItems.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 border rounded-xl p-4"
              >
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Category</label>
                  <select
                    value={item.category_id || ""}
                    onChange={async (e) => {
                      const categoryId = e.target.value;
                      updateEditItem(index, "category_id", categoryId);
                      updateEditItem(index, "product_id", "");

                      const res = await QuotationService.getProductsByCategory(categoryId);
                      setProductMap((prev: any) => ({
                        ...prev,
                        [categoryId]: res.products || res || [],
                      }));
                    }}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Category</option>
                    {categories?.map((cat: any) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Product</label>
                  <select
                    value={item.product_id || ""}
                    onChange={(e) => {
                      const productId = e.target.value;
                      const selected =
                        productMap[item.category_id]?.find((p: any) => p._id === productId);

                      const updated = [...editItems];
                      updated[index] = {
                        ...updated[index],
                        product_id: productId,
                        item_name: selected?.name || "",
                        unit_price: Number(selected?.sale_price || selected?.price || 0),
                      };

                      const gross =
                        Number(updated[index].unit_price || 0) *
                        Number(updated[index].quantity || 0);
                      const discountAmount =
                        (gross * Number(updated[index].discount_percent || 0)) / 100;
                      updated[index].total = Number((gross - discountAmount).toFixed(2));

                      setEditItems(updated);
                    }}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Product</option>
                    {(productMap[item.category_id] || []).map((prod: any) => (
                      <option key={prod._id} value={prod._id}>
                        {prod.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Item Name</label>
                  <input
                    type="text"
                    value={item.item_name || ""}
                    onChange={(e) => updateEditItem(index, "item_name", e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Unit Price</label>
                  <input
                    type="number"
                    value={item.unit_price || 0}
                    onChange={(e) => updateEditItem(index, "unit_price", e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Discount %</label>
                  <input
                    type="number"
                    value={item.discount_percent || 0}
                    onChange={(e) =>
                      updateEditItem(index, "discount_percent", e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={item.quantity || 1}
                    onChange={(e) => updateEditItem(index, "quantity", e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Total</label>
                    <input
                      type="number"
                      value={item.total || 0}
                      readOnly
                      className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                    />
                  </div>
                  <button
                    onClick={() => removeEditItem(index)}
                    className="mt-2 text-red-600 text-sm hover:underline text-left"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4">
            <div>
              <p className="text-xs text-gray-500">Subtotal</p>
              <p className="font-semibold">{computedTotals.subtotal.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Discount</p>
              <p className="font-semibold">{computedTotals.discountAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Tax</p>
              <p className="font-semibold">{computedTotals.taxAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="font-semibold">{computedTotals.total.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={closeEdit}
              className="px-4 py-2 rounded-lg border text-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={editLoading}
              className="px-4 py-2 rounded-lg bg-black text-white"
            >
              {editLoading ? "Updating..." : "Update Quotation"}
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
)}

{/* VIEW MODAL */}
{(viewQuotation || viewLoading) && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Quotation Details</h2>
          <p className="text-sm text-gray-500">
            {viewQuotation?.quotation_number || "Loading..."}
          </p>
        </div>
        <button
          onClick={closeView}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <X size={18} />
        </button>
      </div>

      {viewLoading ? (
        <div className="p-6 text-sm text-gray-500">Loading details...</div>
      ) : viewQuotation ? (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">Dealer</p>
              <p className="font-medium">{viewQuotation?.dealer_id?.name || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Created By</p>
              <p className="font-medium">
                {viewQuotation?.created_by?.name || "-"} (
                {viewQuotation?.created_by?.user_type === "admin" ? "Director" : "Salesman"})
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p className="font-medium">{formatStatus(viewQuotation?.status)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Valid Until</p>
              <p className="font-medium">
                {viewQuotation?.valid_until
                  ? new Date(viewQuotation.valid_until).toLocaleDateString("en-GB")
                  : "-"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Delivery Notes</p>
            <p className="text-sm text-gray-700">
              {viewQuotation?.deliveryNotes || "-"}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-xl overflow-hidden">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left">
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Unit Price</th>
                  <th className="px-4 py-3">Discount %</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {viewItems?.length > 0 ? (
                  viewItems.map((item: any, index: number) => (
                    <tr key={index} className="border-b last:border-none">
                      <td className="px-4 py-3">
                        {item?.item_name || item?.product_id?.name || "-"}
                      </td>
                      <td className="px-4 py-3">{item?.unit_price || 0}</td>
                      <td className="px-4 py-3">{item?.discount_percent || 0}</td>
                      <td className="px-4 py-3">{item?.quantity || 0}</td>
                      <td className="px-4 py-3">{item?.total || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4">
            <div>
              <p className="text-xs text-gray-500">Subtotal</p>
              <p className="font-semibold">{viewQuotation?.subtotal || 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Discount</p>
              <p className="font-semibold">{viewQuotation?.discount || 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Tax</p>
              <p className="font-semibold">{viewQuotation?.tax || 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="font-semibold">{viewQuotation?.total || 0}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  </div>
)}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-semibold">Quotations</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by quotation #"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border focus:outline-none"
            />
          </div>
          <button className="p-2 bg-white border rounded-lg">
            <SlidersHorizontal size={18} />
          </button>
          <button
            onClick={() => router.push("/quotations/add")}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
          >
            Add Quotation <Plus size={16} />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="text-gray-500 border-b">
            <tr className="text-left">
              <th className="py-3">Quotation #</th>
              <th>Dealer</th>
              <th>Salesman/Director</th>
              <th>Total</th>
              <th>Discount</th>
              <th>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white text-sm focus:outline-none text-gray-600"
                >
                  <option value="">Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </th>
              <th>Due Date</th>
              <th className="text-center w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map((quotation: any) => (
              <tr key={quotation._id} className="border-b last:border-none hover:bg-gray-50">
                <td className="py-4 font-medium">{quotation.quotation_number}</td>
                <td>{quotation.dealer_id?.name}</td>
                <td>
                  {quotation.created_by?.name} (
                  {quotation.created_by?.user_type === "admin" ? "Director" : "Salesman"})
                </td>
                <td>{formatAmount(quotation.total)}</td>
                <td>{formatAmount(quotation.discount)}</td>
                <td>
                  <span className={`px-3 py-1 text-xs rounded-md font-medium ${statusStyle[formatStatus(quotation.status)] || ""}`}>
                    {formatStatus(quotation.status)}
                  </span>
                </td>
                <td>
                  {quotation.valid_until ? new Date(quotation.valid_until).toLocaleDateString("en-GB") : "-"}
                </td>
                <td className="text-center relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === quotation._id ? null : quotation._id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <MoreVertical size={18} className="text-gray-600" />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === quotation._id && (
                    <div className="absolute right-4 top-12 bg-white shadow-xl border rounded-xl py-2 w-48 z-50 text-left text-sm">
                      <button
                        onClick={() => handleView(quotation._id)}
                        className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-gray-700"
                      >
                        <Eye size={16} /> View Details
                      </button>

                      {canEdit(quotation) && (
                        <button
                          onClick={() => openEdit(quotation)}
                          className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-gray-700"
                        >
                          <Pencil size={16} /> Edit Quotation
                        </button>
                      )}
                      {quotation.status==="pending" || quotation.status==="rejected" && user?.user_type==="admin" && (
                      <>
                        <button
                          onClick={() => {
                            setConfirmId(quotation._id);
                            setConfirmAction("approve");
                          }}
                          className="p-2 bg-green-100 text-green-600 rounded-md"
                        >
                          Approve
                        </button>
                      </>
                    )}

                    {quotation.status==="pending" || quotation.status==="approved" && user?.user_type==="admin" &&   <button
                          onClick={() => {
                            setConfirmId(quotation._id);
                            setConfirmAction("reject");
                          }}
                          className="p-2 bg-red-100 text-red-600 rounded-md"
                        >
                          Reject
                        </button>}


                      {canDownloadPDF(quotation) && (
                        <button
                          onClick={() => handleDownloadPDF(quotation._id)}
                          className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-gray-700"
                        >
                          <Download size={16} /> Download PDF
                        </button>
                      )}

                      {canDelete(quotation) && (
                        <button
                          onClick={() => {
                            setConfirmId(quotation._id);
                            setConfirmAction("delete");
                          }}
                          className="w-full px-4 py-2 hover:bg-red-50 flex items-center gap-3 text-red-600"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {filtered?.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-400 text-sm">
                  No quotations found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-between mt-6 text-sm text-gray-500">
          <p>Total Quotations: {filtered?.length || 0}</p>
        </div>
      </div>
    </div>
  );
}