"use client";

import QuotationService from "@/app/components/services/quotationService";
import { useQuotations } from "@/hooks/useQuotations";
import { useCategory } from "@/hooks/useCategory";
import { useProductsByCategory } from "@/hooks/useProductByCategory";
import {
  Eye,
  Plus,
  Search,
  SlidersHorizontal,
  Pencil,
  X,
  Check,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo,useEffect } from "react";
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
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | "delete" | null
  >(null);

 const [statusFilter, setStatusFilter] = useState("");

const filtered = useMemo(() => {
  let result = data;
  if (search.trim()) {
    result = result?.filter((q: any) =>
      q?.quotation_number?.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (statusFilter) {
    result = result?.filter((q: any) =>
      q?.status?.toLowerCase() === statusFilter.toLowerCase()
    );
  }
  return result;
}, [search, statusFilter, data]);

  const formatStatus = (status: string) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";
  };


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

  if (editItems.length > 0) {
    loadProducts();
  }
}, [editItems]);
  /* ── VIEW ── */
  const handleView = async (id: string) => {
    setViewLoading(true);
    try {
      const res = await QuotationService.getQuotationById(id);
      if (!res.success)
        return toast.error(res?.message || "Failed to load quotation");
      setViewQuotation(res?.quotation);
      setViewItems(res?.items);
    } catch {
      toast.error("Failed to load quotation details");
    } finally {
      setViewLoading(false);
    }
  };

  const closeView = () => {
    setViewQuotation(null);
    setViewItems([]);
  };

  /* ── EDIT ── */
  const openEdit = async (quotation: any) => {
  setEditFetchLoading(true);
  setEditQuotation(quotation);

  // ✅ back-calculate raw input from stored amounts
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
        })),
      );
    }
  } catch {
    toast.error("Failed to load quotation items");
  } finally {
    setEditFetchLoading(false);
  }
};

  const closeEdit = () => {
    setEditQuotation(null);
    setEditForm({});
    setEditItems([]);
  };

const updateEditItem = (index: number, key: string, value: any) => {
  const updated = [...editItems];

  // force number conversion for numeric fields
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
      notes: editForm.notes,
      discount: editForm.discount,           // ✅ raw input
      discount_type: editForm.discount_type,
      tax: editForm.tax,                     // ✅ raw input
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
        total: Number(item.total),           // ✅ send item.total so backend can use it
      })),
    };

    const res = await QuotationService.updateQuotation(payload, editQuotation._id);
    if (!res.success) {
      toast.error(res?.message || "Update failed");
      return;
    }
    toast.success(res?.message || "Quotation updated");
    await refetch();
    closeEdit();
  } catch {
    toast.error("Update failed");
  } finally {
    setEditLoading(false);
  }
};

  /* ── CONFIRM ── */
  const handleConfirm = async () => {
    if (!confirmId || !confirmAction) return;
    try {
      if (confirmAction === "approve") {
        const res = await QuotationService.updateQuotationStatus(
          confirmId,
          "approved",
        );
        if (!res.success)
          return toast.error(res?.message || "Failed to approve");
        toast.success(res?.message || "Quotation approved");
      } else if (confirmAction === "reject") {
        const res = await QuotationService.updateQuotationStatus(
          confirmId,
          "rejected",
        );
        if (!res.success)
          return toast.error(res?.message || "Failed to reject");
        toast.success(res?.message || "Quotation rejected");
      } else if (confirmAction === "delete") {
        const res = await QuotationService.deleteQuotation(confirmId);
        if (!res.success)
          return toast.error(res?.message || "Failed to delete");
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
    const subtotal = editItems.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0,
    );

    let discountAmount = 0;
    if (editForm.discount_type === "percentage") {
      discountAmount = (subtotal * Number(editForm.discount || 0)) / 100;
    } else {
      discountAmount = Number(editForm.discount || 0);
    }

    let taxAmount = 0;
    if (editForm.tax_type === "percentage") {
      taxAmount =
        ((subtotal - discountAmount) * Number(editForm.tax || 0)) / 100;
    } else {
      taxAmount = Number(editForm.tax || 0);
    }

    const total = subtotal - discountAmount + taxAmount;

    return {
      subtotal,
      discountAmount,
      taxAmount,
      total,
    };
  }, [editItems, editForm]);

  /* ── PERMISSIONS ── */
  const canEdit = (q: any) => {
    const status = q?.status?.toLowerCase();
    if (user?.user_type === "admin")
      return status === "pending" || status === "approved";
    if (user?.user_type === "salesman" && q?.created_by?._id === user?._id)
      return status === "pending" || status === "rejected";
    return false;
  };

  const canDelete = (q: any) => {
    const status = q?.status?.toLowerCase();
    if (user?.user_type === "salesman" && q?.created_by?._id === user?._id)
      return status === "pending" || status === "rejected";
    return false;
  };

  const canApproveReject = (q: any) => {
    return (
      user?.user_type === "admin" && q?.status?.toLowerCase() === "pending"
    );
  };

  const modalTitle =
    confirmAction === "approve"
      ? "Approve Quotation?"
      : confirmAction === "reject"
        ? "Reject Quotation?"
        : "Delete Quotation?";

  const modalMessage =
    confirmAction === "approve"
      ? "Are you sure you want to approve this quotation?"
      : confirmAction === "reject"
        ? "Are you sure you want to reject this quotation? This action cannot be undone."
        : "Are you sure you want to delete this quotation? This action cannot be undone.";

  const modalBtnClass =
    confirmAction === "approve"
      ? "bg-green-500 hover:bg-green-600"
      : "bg-red-500 hover:bg-red-600";

  const modalBtnLabel =
    confirmAction === "approve"
      ? "Approve"
      : confirmAction === "reject"
        ? "Reject"
        : "Delete";

  const field = "border p-2 rounded-lg text-sm w-full focus:outline-none";

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      {/* CONFIRM MODAL */}
      {confirmId && confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {modalTitle}
            </h2>
            <p className="text-sm text-gray-500 mb-6">{modalMessage}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setConfirmId(null);
                  setConfirmAction(null);
                }}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-lg text-white text-sm ${modalBtnClass}`}
              >
                {modalBtnLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Quotation</h2>
              <button onClick={closeEdit}>
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {editFetchLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
                Loading...
              </div>
            ) : (
              <>
                {/* BASIC FIELDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-sm text-gray-500">Valid Until</label>
                    <input
                      type="date"
                      value={editForm.valid_until}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          valid_until: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">
                      Delivery Notes
                    </label>
                    <textarea
                      rows={1}
                      value={editForm.deliveryNotes}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          deliveryNotes: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">Discount</label>
                    <div className="flex gap-2 mt-1">
                      <select
                        value={editForm.discount_type}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            discount_type: e.target.value,
                          })
                        }
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
                      >
                        <option value="fixed">Amount</option>
                        <option value="percentage">Percent</option>
                      </select>
                      <input
                        type="number"
                        value={editForm.discount}
                        onChange={(e) =>
                          setEditForm({ ...editForm, discount: e.target.value })
                        }
                        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">Tax</label>
                    <div className="flex gap-2 mt-1">
                      <select
                        value={editForm.tax_type}
                        onChange={(e) =>
                          setEditForm({ ...editForm, tax_type: e.target.value })
                        }
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
                      >
                        <option value="fixed">Amount</option>
                        <option value="percentage">Percent</option>
                      </select>
                      <input
                        type="number"
                        value={editForm.tax}
                        onChange={(e) =>
                          setEditForm({ ...editForm, tax: e.target.value })
                        }
                        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* ITEMS */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">
                      Quotation Items
                    </p>
                    <button
                      onClick={addEditItem}
                      className="text-xs bg-black text-white px-3 py-1 rounded-lg"
                    >
                      + Add Item
                    </button>
                  </div>

                  {editItems.map((item, index) => {
const rowProducts = productMap[item.category_id] || [];
                    return (
                      <div
                        key={index}
                        className="border rounded-xl p-4 mb-3 bg-gray-50 shadow-sm"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                          {/* CATEGORY */}
                          <div>
                            <label className="text-xs text-gray-500">
                              Category
                            </label>
                            <select
                              value={item.category_id}
onChange={async (e) => {
  const categoryId = e.target.value;

  updateEditItem(index, "category_id", categoryId);
  updateEditItem(index, "product_id", "");
  updateEditItem(index, "item_name", "");

  if (!productMap[categoryId]) {
    const res = await QuotationService.getProductsByCategory(categoryId);

    setProductMap((prev: any) => ({
      ...prev,
      [categoryId]: res.products || res, // FIX 🔥
    }));
  }
}}
                              className={field}
                            >
                              <option value="">Select</option>
                              {categories.map((c: any) => (
                                <option key={c._id} value={c._id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* PRODUCT */}
                          <div>
                            <label className="text-xs text-gray-500">
                              Product
                            </label>
                            <select
                              value={item.product_id}
onChange={(e) => {
  const product = rowProducts.find(
    (p: any) => String(p._id) === String(e.target.value)
  );

  updateEditItem(index, "product_id", e.target.value);
  updateEditItem(index, "item_name", product?.name || "");
  updateEditItem(index, "unit_price", product?.mrp || 0);
  updateEditItem(index, "discount_percent", 0);
  
}}
                              className={field}
                            >
                              <option value="">Select</option>
                              {rowProducts.map((p: any) => (
                                <option key={p._id} value={p._id}>
                                  {p.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* UNIT PRICE */}
                          <div>
                            <label className="text-xs text-gray-500">
                              Unit Price
                            </label>
                            <input
                              type="number"
                              value={item.unit_price}
                              onChange={(e) =>
                                updateEditItem(
                                  index,
                                  "unit_price",
                                  e.target.value,
                                )
                              }
                              className={field}
                            />
                          </div>

                          {/* QTY */}
                          <div>
                            <label className="text-xs text-gray-500">Qty</label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateEditItem(
                                  index,
                                  "quantity",
                                  e.target.value,
                                )
                              }
                              className={field}
                            />
                          </div>

                          {/* TOTAL */}
                          <div>
                            <label className="text-xs text-gray-500">
                              Total
                            </label>
                            <input
                              value={Number(item.total).toFixed(2)}
                              readOnly
                              className="border p-2 rounded-lg bg-gray-100 text-sm w-full"
                            />
                          </div>

                          {/* DELETE */}
                          <div className="flex items-end">
                            <button
                              onClick={() => removeEditItem(index)}
                              className="w-full p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ✅ TOTAL SECTION (OUTSIDE LOOP) */}
                <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">
                      {computedTotals.subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Discount</span>
                    <span className="text-red-500 font-medium">
                      - {computedTotals.discountAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span className="text-green-600 font-medium">
                      + {computedTotals.taxAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-semibold border-t pt-3">
                    <span>Total</span>
                    <span className="text-black">
                      {computedTotals.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeEdit}
                    className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={editLoading}
                    className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-50"
                  >
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {(viewQuotation || viewLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {viewLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
                Loading...
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {viewQuotation?.quotation_number}
                    </h2>
                    <span
                      className={`text-xs px-2 py-1 rounded-md font-medium ${statusStyle[formatStatus(viewQuotation?.status)] || ""}`}
                    >
                      {formatStatus(viewQuotation?.status)}
                    </span>
                  </div>
                  <button onClick={closeView}>
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Dealer</p>
                    <p className="text-sm font-medium">
                      {viewQuotation?.dealer_id?.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 mb-1">
                      Created By
                    </p>
                    <p className="text-sm">
                      {viewQuotation?.created_by?.name} (
                      {viewQuotation?.created_by?.user_type === "admin"
                        ? "Director"
                        : "Salesman"}
                      )
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Quotation Date</p>
                    <p className="text-sm font-medium">
                      {viewQuotation?.quotation_date
                        ? new Date(
                            viewQuotation.quotation_date,
                          ).toLocaleDateString("en-GB")
                        : "-"}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 mb-1">
                      Valid Until
                    </p>
                    <p className="text-sm font-medium">
                      {viewQuotation?.valid_until
                        ? new Date(
                            viewQuotation.valid_until,
                          ).toLocaleDateString("en-GB")
                        : "-"}
                    </p>
                  </div>
                </div>

                {viewQuotation?.deliveryNotes && (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-5">
                    <p className="text-xs text-yellow-600 font-medium mb-1">
                      Delivery Notes
                    </p>
                    <p className="text-sm text-gray-700">
                      {viewQuotation.deliveryNotes}
                    </p>
                  </div>
                )}

                <div className="mb-5">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Quotation Items
                  </p>
                  <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-500 text-xs">
                        <tr>
                          <th className="text-left px-4 py-3">Product</th>
                          <th className="px-4 py-3">Qty</th>
                          <th className="px-4 py-3">Unit Price</th>
                          <th className="px-4 py-3">Discount</th>
                          <th className="px-4 py-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewItems.map((item: any, i: number) => (
                          <tr key={i} className="border-t">
                            <td className="px-4 py-3">
                              {item?.item_name || item?.product_id?.name}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {item?.quantity}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {item?.unit_price}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {item?.discount_percent}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {item?.total?.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{viewQuotation?.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount</span>
                    <span>- {viewQuotation?.discount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax</span>
                    <span>+ {viewQuotation?.tax}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>{viewQuotation?.total}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-semibold">Quotations</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
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
              <th><select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  className="px-3 py-2 rounded-lg bg-white text-sm focus:outline-none text-gray-600"
>
  <option value="">Status</option>
  <option value="pending">Pending</option>
  <option value="approved">Approved</option>
  <option value="rejected">Rejected</option>
</select></th>
              <th>Due Date</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map((quotation: any, i: number) => (
              <tr key={i} className="border-b last:border-none">
                <td className="py-4 font-medium">
                  {quotation?.quotation_number}
                </td>
                <td>{quotation?.dealer_id?.name}</td>
                <td>
                  {quotation?.created_by?.name} (
                  {quotation?.created_by?.user_type === "admin"
                    ? "Director"
                    : "Salesman"}
                  )
                </td>
                <td>{quotation?.total}</td>
                <td>{quotation?.discount}</td>
                <td>
                  <span
                    className={`px-3 py-1 text-xs rounded-md font-medium ${statusStyle[formatStatus(quotation?.status)] || ""}`}
                  >
                    {formatStatus(quotation?.status)}
                  </span>
                </td>
                <td>
                  {quotation?.valid_until
                    ? new Date(quotation.valid_until).toLocaleDateString(
                        "en-GB",
                      )
                    : "-"}
                </td>
                <td>
                  <div className="flex justify-center gap-2">
                    {canApproveReject(quotation) && (
                      <>
                        <button
                          onClick={() => {
                            setConfirmId(quotation._id);
                            setConfirmAction("approve");
                          }}
                          className="p-2 bg-green-100 text-green-600 rounded-md"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setConfirmId(quotation._id);
                            setConfirmAction("reject");
                          }}
                          className="p-2 bg-red-100 text-red-600 rounded-md"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}

                    {canDelete(quotation) && (
                      <button
                        onClick={() => {
                          setConfirmId(quotation._id);
                          setConfirmAction("delete");
                        }}
                        className="p-2 bg-red-100 text-red-600 rounded-md"
                      >
                        <X size={16} />
                      </button>
                    )}

                    <button
                      onClick={() => handleView(quotation._id)}
                      className="p-2 bg-gray-100 text-gray-600 rounded-md"
                    >
                      <Eye size={16} />
                    </button>

                                       
                    {(user?.user_type === "admin" ||
                      (user?.user_type === "salesman" && quotation.status === "approved")) && (
                      <button
onClick={async () => {
  try {
    await QuotationService.downloadPdf(quotation._id);
  } catch {
    toast.error("Download failed");
  }
}}
                        className="p-2 bg-black text-white rounded-md"
                      >
                        PDF
                      </button>
                    )}
                    
                  </div>
                </td>
              </tr>
            ))}

            {filtered?.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-10 text-gray-400 text-sm"
                >
                  No quotations found for "{search}"
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 text-sm text-gray-500">
          <p>Total Quotations: {filtered?.length || 0}</p>
        </div>
      </div>
    </div>
  );
}
