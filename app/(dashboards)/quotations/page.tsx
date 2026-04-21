// QuotationsPage — full updated component
"use client";
import QuotationService from "@/app/components/services/quotationService";
import { useQuotations } from "@/hooks/useQuotations";
import { useCategory } from "@/hooks/useCategory";
import { order } from "@/app/components/services/orderService";
import {
  Eye,
  Plus,
  Search,
  SlidersHorizontal,
  Pencil,
  X,
  Trash2,
  MoreVertical,
  Download,
  Save,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import DealerService from "@/app/components/services/dealerService";
import { useDealers } from "@/hooks/useDealers";

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
  const [statusFilter, setStatusFilter] = useState("");
  const [productMap, setProductMap] = useState<any>({});
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  // ── VIEW state
  const [viewQuotation, setViewQuotation] = useState<any>(null);
  const [viewItems, setViewItems] = useState<any[]>([]);
  const [viewLoading, setViewLoading] = useState(false);

  // ── EDIT state
  const [editQuotation, setEditQuotation] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editItems, setEditItems] = useState<any[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editFetchLoading, setEditFetchLoading] = useState(false);

  // ── CONFIRM state
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | "delete" | null
  >(null);

  // ── DEALERS state (for edit dealer dropdown)
  const { data: dealer } = useDealers(user?.industry);
  const dealers = dealer?.dealers;

  // ── Close menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // ── Load products when editItems change
  useEffect(() => {
    const loadProducts = async () => {
      const newMap: any = { ...productMap };
      for (const item of editItems) {
        if (item.category_id && !newMap[item.category_id]) {
          const res = await QuotationService.getProductsByCategory(
            item.category_id,
          );
          newMap[item.category_id] = res.products || res;
        }
      }
      setProductMap(newMap);
    };
    if (editItems.length > 0) loadProducts();
  }, [editItems]);

  const filtered = useMemo(() => {
    let result = data || [];
    if (search.trim())
      result = result.filter((q: any) =>
        q?.quotation_number?.toLowerCase().includes(search.toLowerCase()),
      );
    if (statusFilter)
      result = result.filter(
        (q: any) => q?.status?.toLowerCase() === statusFilter.toLowerCase(),
      );
    return result;
  }, [search, statusFilter, data]);

  const formatStatus = (s: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : "-";
  const formatAmount = (v: any) => Number(v || 0).toFixed(0);

  // ── VIEW
  const handleView = async (id: string) => {
    setViewLoading(true);
    try {
      const res = await QuotationService.getQuotationById(id);
      if (!res.success)
        return toast.error(res?.message || "Failed to load quotation");
      setViewQuotation(res?.quotation);
      setViewItems(res?.items || []);
    } catch {
      toast.error("Failed to load quotation details");
    } finally {
      setViewLoading(false);
    }
    setOpenMenu(null);
  };

  // ── EDIT
  const openEdit = async (quotation: any) => {
    setEditFetchLoading(true);
    setEditQuotation({ _placeholder: true });
    const discountType = quotation?.discount_type || "fixed";
    const taxType = quotation?.tax_type || "fixed";
    const rawDiscount =
      discountType === "percentage" && quotation?.subtotal > 0
        ? ((quotation.discount / quotation.subtotal) * 100).toFixed(2)
        : quotation?.discount || 0;
    const rawTax =
      taxType === "percentage" && quotation?.subtotal - quotation?.discount > 0
        ? (
            (quotation.tax / (quotation.subtotal - quotation.discount)) *
            100
          ).toFixed(2)
        : quotation?.tax || 0;

    setEditForm({
      valid_until: quotation?.valid_until?.split("T")[0] || "",
      discount: rawDiscount,
      discount_type: discountType,
      tax: rawTax,
      tax_type: taxType,
      deliveryNotes: quotation?.deliveryNotes || "",
      dealer_id: quotation?.dealer_id?._id || quotation?.dealer_id || "",
    });
    try {
      const res = await QuotationService.getQuotationById(quotation._id);
      if (res.success) {
        setEditQuotation(res.quotation);
        setEditItems(
          res.items.map((item: any) => ({
            ...item,
            product_id: item.product_id || "", // ✅ empty string for General
            category_id: item.category_id || "", // ✅ now populated correctly
          })),
        );
      }
    } catch {
      toast.error("Failed to load quotation items");
      setEditQuotation(null);
    } finally {
      setEditFetchLoading(false);
    }
    setOpenMenu(null);
  };

  const closeEdit = () => {
    setEditQuotation(null);
    setEditForm({});
    setEditItems([]);
  };

  const updateEditItem = (index: number, key: string, value: any) => {
    const updated = [...editItems];
    if (["unit_price", "quantity", "discount_percent"].includes(key))
      updated[index][key] = Number(value) || 0;
    else updated[index][key] = value;
    const gross =
      Number(updated[index].unit_price) * Number(updated[index].quantity);
    const disc = (gross * Number(updated[index].discount_percent)) / 100;
    updated[index].total = Number((gross - disc).toFixed(2));
    setEditItems(updated);
  };

  const addEditItem = () =>
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
  const removeEditItem = (i: number) =>
    setEditItems(editItems.filter((_, idx) => idx !== i));

  const computedTotals = useMemo(() => {
    const subtotal = editItems.reduce((s, i) => s + Number(i.total || 0), 0);
    const discountAmt =
      editForm.discount_type === "percentage"
        ? (subtotal * Number(editForm.discount || 0)) / 100
        : Number(editForm.discount || 0);
    const taxAmt =
      editForm.tax_type === "percentage"
        ? ((subtotal - discountAmt) * Number(editForm.tax || 0)) / 100
        : Number(editForm.tax || 0);
    return {
      subtotal,
      discountAmt,
      taxAmt,
      total: subtotal - discountAmt + taxAmt,
    };
  }, [editItems, editForm]);

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
        dealer_id: editForm.dealer_id,
        subtotal: computedTotals.subtotal,
        total: computedTotals.total,
        items: editItems.map((item) => ({
          product_id: item.product_id || null, // ✅ null for General
          category_id: item.category_id || null, // ✅ always send
          item_name: item.item_name,
          unit_price: Number(item.unit_price),
          discount_percent: Number(item.discount_percent),
          quantity: Number(item.quantity),
          total: Number(item.total),
        })),
      };

      const res = await QuotationService.updateQuotation(
        payload,
        editQuotation._id,
      );
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
  // ── DOWNLOAD
  const handleDownloadPDF = async (id: string) => {
    try {
      await QuotationService.downloadPdf(id);
      toast.success("Downloading PDF...");
    } catch {
      toast.error("Failed to download PDF");
    }
    setOpenMenu(null);
  };

  // ── CONFIRM
  const handleConfirm = async () => {
    if (!confirmId || !confirmAction) return;
    try {
      if (confirmAction === "approve")
        await QuotationService.updateQuotationStatus(confirmId, "approved");
      else if (confirmAction === "reject")
        await QuotationService.updateQuotationStatus(confirmId, "rejected");
      else if (confirmAction === "delete")
        await QuotationService.deleteQuotation(confirmId);
      toast.success(
        confirmAction === "delete"
          ? "Quotation deleted"
          : `Quotation ${confirmAction}d`,
      );
      await refetch();
    } catch {
      toast.error("Action failed");
    } finally {
      setConfirmId(null);
      setConfirmAction(null);
    }
  };

  // ── PERMISSIONS
  const canEdit = (q: any) => {
    const s = q?.status?.toLowerCase();
    if (user?.user_type === "admin")
      return ["pending", "approved", "rejected"].includes(s);
    if (user?.user_type === "salesman" && q?.created_by?._id === user?._id)
      return ["pending", "rejected"].includes(s);
    return false;
  };
  const canDelete = (q: any) => {
    const s = q?.status?.toLowerCase();
    return (
      (user?.user_type === "salesman" &&
        q?.created_by?._id === user?._id &&
        ["pending", "rejected"].includes(s)) ||
      (user?.user_type === "admin" &&
        ["pending", "rejected", "approved"].includes(s))
    );
  };
  const canDownloadPDF = (q: any) =>
    user?.user_type === "admin" ||
    (user?.user_type === "salesman" && q?.status === "approved");

  const isGeneralCategory = (categoryId) => {
    const cat = categories.find((c) => c._id === categoryId);
    return cat?.name === "General Appliances";
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      {/* ── CONFIRM MODAL ── */}
      {confirmId && confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {confirmAction === "approve"
                ? "Approve Quotation?"
                : confirmAction === "reject"
                  ? "Reject Quotation?"
                  : "Delete Quotation?"}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {confirmAction === "approve"
                ? "Are you sure you want to approve this quotation?"
                : confirmAction === "reject"
                  ? "Are you sure you want to reject this quotation? This cannot be undone."
                  : "Are you sure you want to delete this quotation? This cannot be undone."}
            </p>
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
                className={`px-4 py-2 rounded-lg text-white text-sm ${confirmAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
              >
                {confirmAction === "approve"
                  ? "Approve"
                  : confirmAction === "reject"
                    ? "Reject"
                    : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW MODAL (matches orders style) ── */}
      {(viewQuotation || viewLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {viewLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
                Loading...
              </div>
            ) : viewQuotation ? (
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
                  <button
                    onClick={() => {
                      setViewQuotation(null);
                      setViewItems([]);
                    }}
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>

                {/* Info grid — matches orders */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Dealer</p>
                    <p className="text-sm font-medium">
                      {viewQuotation?.dealer_id?.name || "-"}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 mb-1">
                      Created By
                    </p>
                    <p className="text-sm">
                      {viewQuotation?.created_by?.name || "-"} (
                      {viewQuotation?.created_by?.user_type === "admin"
                        ? "Director"
                        : "Salesman"}
                      )
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Status</p>
                    <p className="text-sm font-medium">
                      {formatStatus(viewQuotation?.status)}
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

                {/* Items table */}
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
                          <th className="px-4 py-3">Discount %</th>
                          <th className="px-4 py-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewItems?.length > 0 ? (
                          viewItems.map((item: any, i: number) => (
                            <tr key={i} className="border-t">
                              <td className="px-4 py-3">
                                {item?.item_name ||
                                  item?.product_id?.name ||
                                  "-"}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {item?.quantity || 0}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {item?.unit_price || 0}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {item?.discount_percent || 0}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {Number(item?.total || 0).toFixed(2)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-4 py-6 text-center text-gray-400"
                            >
                              No items found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals — matches orders */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{viewQuotation?.subtotal || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount</span>
                    <span>- {viewQuotation?.discount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax</span>
                    <span>+ {viewQuotation?.tax || 0}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>{viewQuotation?.total || 0}</span>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* ── EDIT MODAL (matches orders style) ── */}
      {editQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {editFetchLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-400 text-sm gap-2">
                <Loader2 size={18} className="animate-spin" /> Loading
                quotation...
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Edit Quotation — {editQuotation?.quotation_number}
                    </h2>
                    <span
                      className={`text-xs px-2 py-1 rounded-md font-medium ${statusStyle[formatStatus(editQuotation?.status)] || ""}`}
                    >
                      {formatStatus(editQuotation?.status)}
                    </span>
                  </div>
                  <button
                    onClick={closeEdit}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>

                {/* Info row — matches orders */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    {/* ✅ EDIT DEALER */}
                    <p className="text-xs text-gray-400 mb-1">Dealer</p>
                    <select
                      value={editForm.dealer_id || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, dealer_id: e.target.value })
                      }
                      className="w-full text-sm border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white"
                    >
                      <option value="">Select Dealer</option>
                      {dealers?.map((d: any) => (
                        <option key={d._id} value={d._id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-3 mb-1">
                      Created By
                    </p>
                    <p className="text-sm">
                      {editQuotation?.created_by?.name || "-"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Valid Until</p>
                    <input
                      type="date"
                      value={editForm.valid_until || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          valid_until: e.target.value,
                        })
                      }
                      className="w-full text-sm border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white"
                    />
                  </div>
                </div>

                {/* Delivery Notes */}
                <div className="mb-6">
                  <label className="text-xs text-gray-500 font-medium mb-1 block">
                    Delivery Notes
                  </label>
                  <textarea
                    rows={2}
                    value={editForm.deliveryNotes || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        deliveryNotes: e.target.value,
                      })
                    }
                    placeholder="Add delivery notes..."
                    className="w-full text-sm border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none"
                  />
                </div>

                {/* Items */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">
                      Quotation Items
                    </p>
                    <button
                      onClick={addEditItem}
                      className="flex items-center gap-1 text-xs bg-black text-white px-3 py-1 rounded-lg"
                    >
                      + Add Item
                    </button>
                  </div>
                  <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-500 text-xs">
                        <tr>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Product</th>
                          <th className="px-4 py-3">Qty</th>
                          <th className="px-4 py-3">Price</th>
                          <th className="px-4 py-3">Discount %</th>
                          <th className="px-4 py-3 text-right">Total</th>
                          <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editItems.map((item, index) => {
                          const rowProducts =
                            productMap[item.category_id] || [];
                          return (
                            <tr key={index} className="border-t">
                              {/* CATEGORY */}
                              <td className="px-2 py-2">
                                <select
                                  value={item.category_id || ""}
                                  onChange={async (e) => {
                                    const categoryId = e.target.value;
                                    updateEditItem(
                                      index,
                                      "category_id",
                                      categoryId,
                                    );
                                    updateEditItem(index, "product_id", "");
                                    updateEditItem(index, "item_name", "");
                                    if (!productMap[categoryId]) {
                                      const res =
                                        await QuotationService.getProductsByCategory(
                                          categoryId,
                                        );
                                      setProductMap((prev: any) => ({
                                        ...prev,
                                        [categoryId]: res.products || res || [],
                                      }));
                                    }
                                  }}
                                  className="w-full border rounded-lg px-2 py-1 text-sm"
                                >
                                  <option value="">Category</option>
                                  {categories
                                    ?.filter((c: any) => c.is_active)
                                    .map((cat: any) => (
                                      <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                      </option>
                                    ))}
                                </select>
                              </td>

                              {/* PRODUCT — text input for General, select for others */}
                              <td className="px-2 py-2">
                                {isGeneralCategory(item.category_id) ? (
                                  <input
                                    type="text"
                                    placeholder="Enter product name"
                                    value={item.item_name || ""}
                                    onChange={(e) => {
                                      updateEditItem(
                                        index,
                                        "item_name",
                                        e.target.value,
                                      );
                                      updateEditItem(index, "product_id", "");
                                    }}
                                    className="w-full border rounded-lg px-2 py-1 text-sm"
                                  />
                                ) : (
                                  <select
                                    value={item.product_id || ""}
                                    onChange={(e) => {
                                      const productId = e.target.value;
                                      const selected = rowProducts.find(
                                        (p: any) => p._id === productId,
                                      );
                                      updateEditItem(
                                        index,
                                        "product_id",
                                        productId,
                                      );
                                      updateEditItem(
                                        index,
                                        "item_name",
                                        selected?.name || "",
                                      );
                                      updateEditItem(
                                        index,
                                        "unit_price",
                                        selected?.mrp || 0,
                                      );
                                      updateEditItem(
                                        index,
                                        "discount_percent",
                                        0,
                                      );
                                    }}
                                    className="w-full border rounded-lg px-2 py-1 text-sm"
                                  >
                                    <option value="">Product</option>
                                    {rowProducts.map((p: any) => (
                                      <option key={p._id} value={p._id}>
                                        {p.name}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </td>

                              {/* QTY */}
                              <td className="px-2 py-2">
                                <input
                                  type="number"
                                  value={item.quantity || 1}
                                  onChange={(e) =>
                                    updateEditItem(
                                      index,
                                      "quantity",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full text-center border rounded-lg px-2 py-1 text-sm"
                                />
                              </td>

                              {/* PRICE — editable for General, read-only for others */}
                              <td className="px-2 py-2">
                                <input
                                  type="number"
                                  value={item.unit_price || 0}
                                  onChange={(e) =>
                                    updateEditItem(
                                      index,
                                      "unit_price",
                                      e.target.value,
                                    )
                                  }
                                  readOnly={
                                    !isGeneralCategory(item.category_id)
                                  }
                                  className="w-full text-center border rounded-lg px-2 py-1 text-sm disabled:bg-gray-50"
                                />
                              </td>

                              {/* DISCOUNT % */}
                              <td className="px-2 py-2">
                                <input
                                  type="number"
                                  value={item.discount_percent || 0}
                                  onChange={(e) =>
                                    updateEditItem(
                                      index,
                                      "discount_percent",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full text-center border rounded-lg px-2 py-1 text-sm"
                                />
                              </td>

                              {/* TOTAL */}
                              <td className="px-2 py-2 text-right font-medium">
                                {(item.total ?? 0).toFixed(2)}
                              </td>

                              {/* DELETE */}
                              <td className="px-2 py-2 text-center">
                                <button
                                  onClick={() => removeEditItem(index)}
                                  className="p-1 bg-red-100 text-red-600 rounded-md"
                                >
                                  <X size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals — matches orders */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Items Subtotal</span>
                    <span>{computedTotals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-20 shrink-0">
                      Discount
                    </span>
                    <select
                      value={editForm.discount_type || "fixed"}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          discount_type: e.target.value,
                        })
                      }
                      className="border rounded-lg px-2 py-1 text-xs w-20 bg-white focus:outline-none"
                    >
                      <option value="fixed">Amt</option>
                      <option value="percentage">%</option>
                    </select>
                    <input
                      type="number"
                      value={editForm.discount || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, discount: e.target.value })
                      }
                      className="flex-1 border rounded-lg px-2 py-1 text-xs bg-white min-w-0 focus:outline-none"
                    />
                    <span className="text-red-500 w-20 text-right shrink-0">
                      - {computedTotals.discountAmt.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-20 shrink-0">Tax</span>
                    <select
                      value={editForm.tax_type || "fixed"}
                      onChange={(e) =>
                        setEditForm({ ...editForm, tax_type: e.target.value })
                      }
                      className="border rounded-lg px-2 py-1 text-xs w-20 bg-white focus:outline-none"
                    >
                      <option value="fixed">Amt</option>
                      <option value="percentage">%</option>
                    </select>
                    <input
                      type="number"
                      value={editForm.tax || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, tax: e.target.value })
                      }
                      className="flex-1 border rounded-lg px-2 py-1 text-xs bg-white min-w-0 focus:outline-none"
                    />
                    <span className="text-green-600 w-20 text-right shrink-0">
                      + {computedTotals.taxAmt.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>{computedTotals.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Footer */}
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
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-60"
                  >
                    {editLoading ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Save size={15} />
                    )}
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
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
              <th>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-gray-500 font-semibold bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="">All Status</option>
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
              <tr
                key={quotation._id}
                className="border-b last:border-none hover:bg-gray-50"
              >
                <td className="py-4 font-medium">
                  {quotation.quotation_number}
                </td>
                <td>{quotation.dealer_id?.name}</td>
                <td>
                  {quotation.created_by?.name} (
                  {quotation.created_by?.user_type === "admin"
                    ? "Director"
                    : "Salesman"}
                  )
                </td>
                <td>{formatAmount(quotation.total)}</td>
                <td>{formatAmount(quotation.discount)}</td>
                <td>
                  <span
                    className={`px-3 py-1 text-xs rounded-md font-medium ${statusStyle[formatStatus(quotation.status)] || ""}`}
                  >
                    {formatStatus(quotation.status)}
                  </span>
                </td>
                <td>
                  {quotation.valid_until
                    ? new Date(quotation.valid_until).toLocaleDateString(
                        "en-GB",
                      )
                    : "-"}
                </td>
                <td className="py-4 text-center">
                  <div className="relative inline-block">
                    {/* ✅ Portal-based dropdown — same as orders */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (openMenu === quotation._id) {
                          setOpenMenu(null);
                          return;
                        }
                        const rect = (
                          e.currentTarget as HTMLElement
                        ).getBoundingClientRect();
                        setMenuPosition({
                          top: rect.bottom + window.scrollY + 4,
                          right: window.innerWidth - rect.right,
                        });
                        setOpenMenu(quotation._id);
                      }}
                      className="p-2 bg-gray-100 rounded-md"
                    >
                      <MoreVertical size={16} />
                    </button>
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

      {/* ✅ Portal dropdown — same pattern as orders, rendered outside table */}
      {openMenu && (
        <div
          style={{
            position: "fixed",
            top: menuPosition.top,
            right: menuPosition.right,
            zIndex: 9999,
          }}
          className="w-44 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {(() => {
            const q = filtered?.find((q: any) => q._id === openMenu);
            if (!q) return null;
            return (
              <>
                <button
                  onClick={() => {
                    handleView(q._id);
                    setOpenMenu(null);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  View
                </button>

                {canDownloadPDF(q) && (
                  <button
                    onClick={() => {
                      handleDownloadPDF(q._id);
                      setOpenMenu(null);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Download PDF
                  </button>
                )}
                {canEdit(q) && (
                  <button
                    onClick={() => {
                      openEdit(q);
                      setOpenMenu(null);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Edit
                  </button>
                )}

                {user?.user_type === "admin" &&
                  (q.status === "pending" || q.status === "rejected") && (
                    <button
                      onClick={() => {
                        setConfirmId(q._id);
                        setConfirmAction("approve");
                        setOpenMenu(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-green-600 hover:bg-gray-100 text-sm"
                    >
                      Approve
                    </button>
                  )}

                {user?.user_type === "admin" &&
                  (q.status === "pending" || q.status === "approved") && (
                    <button
                      onClick={() => {
                        setConfirmId(q._id);
                        setConfirmAction("reject");
                        setOpenMenu(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 text-sm"
                    >
                      Reject
                    </button>
                  )}
                {canDelete(q) && (
                  <button
                    onClick={() => {
                      setConfirmId(q._id);
                      setConfirmAction("delete");
                      setOpenMenu(null);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
                  >
                    Delete
                  </button>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
