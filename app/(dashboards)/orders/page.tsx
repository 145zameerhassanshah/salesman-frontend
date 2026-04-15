"use client";

import API_URL from "@/app/components/lib/apiConfig";
import DealerService from "@/app/components/services/dealerService";
import { order } from "@/app/components/services/orderService";
import { useCategory } from "@/hooks/useCategory";
import { useDealers } from "@/hooks/useDealers";
import { useOrders } from "@/hooks/useOrders";
import {
  Check,
  X,
  Eye,
  Plus,
  Download,
  Search,
  SlidersHorizontal,
  Pencil,
  MoreVertical,
  Save,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect, use } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const statusStyle: any = {
  Pending: "bg-yellow-100 text-yellow-600",
  Unapproved: "bg-gray-100 text-blue-600",
  Rejected: "bg-red-100 text-red-600",
  Posted: "bg-green-100 text-green-600",
  Approved: "bg-yellow-100 text-yellow-600",
  Dispatched: "bg-blue-100 text-blue-600",
  Partial: "bg-orange-100 text-orange-600",
};

export default function OrdersPage() {
  const [openMenu, setOpenMenu] = useState(null);
  const user = useSelector((state: any) => state.user.user);
  // const [downloadOrderId, setDownloadOrderId] = useState(null);
  const isDispatcher = user?.user_type === "dispatcher";
  const isManager = user?.user_type === "manager";
  const canEditFull =
    user?.user_type === "admin" || user?.user_type === "salesman";
  const { data: categories = [] } = useCategory(user?.industry);
  const { data, refetch } = useOrders(user?.industry);
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [confirmOrderId, setConfirmOrderId] = useState<string | null>(null);
  // Update type
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | "unapprove" | "delete" | null
  >(null);
  const [viewOrder, setViewOrder] = useState<any>(null);
  const [viewItems, setViewItems] = useState<any[]>([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [editOrder, setEditOrder] = useState<any>(null);
  const [editItems, setEditItems] = useState<any[]>([]);
  const [productMap, setProductMap] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editFields, setEditFields] = useState<any>({});
  const { data: dealer } = useDealers(user?.industry);
  const dealers = dealer?.dealers;

  useEffect(() => {
    const handleClickOutside = (e) => {
      // ignore clicks inside dropdown
      if ((e.target as HTMLElement).closest(".dropdown-menu")) return;
      setOpenMenu(null);
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      const newMap: any = { ...productMap };

      for (const item of editItems) {
        if (item.category_id && !newMap[item.category_id]) {
          const res = await order.getProductsByCategory(item.category_id);
          newMap[item.category_id] = res;
        }
      }

      setProductMap(newMap);
    };

    if (editItems.length > 0) {
      loadProducts();
    }
  }, [editItems]);
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    let result = data;
    if (search.trim()) {
      result = result?.filter((o: any) =>
        o?.order_number?.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (statusFilter) {
      result = result?.filter(
        (o: any) => o?.status?.toLowerCase() === statusFilter.toLowerCase(),
      );
    }
    return result;
  }, [search, statusFilter, data]);

  const formatStatus = (status: string) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";

  const handleAction = (
    orderId: string,
    action: "approve" | "reject" | "unapprove" | "delete",
  ) => {
    setConfirmOrderId(orderId);
    setConfirmAction(action);

    if (action === "reject") {
      setRejectReason(""); // reset every time
    }
  };
  const handleDownload = async (id: any) => {
    try {
      const res = await fetch(`${API_URL}/orders/pdf/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `order-${id}.pdf`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };
  const handleConfirm = async () => {
    if (confirmAction === "approve") {
      const res = await order.updateStatus(confirmOrderId, {
        status: "approved",
      });

      if (!res.success)
        return toast.error(res?.message || "Problem approving order");

      toast.success(res?.message);
      await refetch();
    } else if (confirmAction === "delete") {
      const res = await order.deleteOrder(confirmOrderId);
      if (!res.success)
        return toast.error(res?.message || "Problem deleting order");
      toast.success(res?.message || "Order deleted");
      await refetch();
    } else if (confirmAction === "unapprove") {
      const res = await order.updateStatus(confirmOrderId, {
        status: "unapproved",
      });

      if (!res.success)
        return toast.error(res?.message || "Problem unapproving order");

      toast.success(res?.message || "Order unapproved successfully");
      await refetch();
    } else if (confirmAction === "reject") {
      if (user?.user_type === "salesman") {
        const res = await order.deleteOrder(confirmOrderId);

        if (!res.success)
          return toast.error(res?.message || "Problem deleting order");

        toast.success(res?.message);
      } else {
        const res = await order.updateStatus(confirmOrderId, {
          status: "rejected",
          rejectReason,
        });

        if (!res.success)
          return toast.error(res?.message || "Problem rejecting order");

        toast.success(res?.message);
      }

      await refetch();
    }

    setConfirmOrderId(null);
    setConfirmAction(null);
  };

  const handleCancel = () => {
    setConfirmOrderId(null);
    setConfirmAction(null);
  };

  const handleView = async (orderId: string) => {
    setViewLoading(true);
    try {
      const res = await order.getOrderById(orderId);
      if (!res.success)
        return toast.error(res?.message || "Failed to load order");
      setViewOrder(res.order);
      setViewItems(res.items);
    } catch {
      toast.error("Failed to load order details");
    } finally {
      setViewLoading(false);
    }
  };

  const handleEdit = async (orderId: string) => {
    setEditLoading(true);
    setEditOrder({ _placeholder: true }); // show modal with loader immediately
    try {
      const res = await order.getOrderById(orderId);
      if (!res.success) {
        setEditOrder(null);
        return toast.error(res?.message || "Failed to load order");
      }
      setEditOrder(res.order);
      // setEditItems(res.items.map((item: any) => ({ ...item })));
      setEditItems(
        res.items.map((item: any) => ({
          ...item,
          product_id: item.product_id || "",
          category_id: item.category_id || "",
              discount_type: item.discount_type || "percent", 

        })),
      );
      // Add these to editFields state when opening edit modal
      setEditFields({
        due_date: res.order?.due_date
          ? new Date(res.order.due_date).toISOString().split("T")[0]
          : "",
        deliveryNotes: res.order?.deliveryNotes || "",
        payment_term: res.order?.payment_term || "cash",
        discount_type: res.order?.discount_type || "amount",
        
        tax_type: res.order?.tax_type || "amount",
dealer_id: res.order?.dealer_id?._id || "",      
        discount:
          res.order?.discount_type === "percent"
            ? res.order?.subtotal > 0
              ? ((res.order.discount / res.order.subtotal) * 100).toFixed(2)
              : 0
            : res.order?.discount || 0,
        tax:
          res.order?.tax_type === "percent"
            ? res.order?.subtotal - res.order?.discount > 0
              ? (
                  (res.order.tax / (res.order.subtotal - res.order.discount)) *
                  100
                ).toFixed(2)
              : 0
            : res.order?.tax || 0,
      });
    } catch {
      setEditOrder(null);
      toast.error("Failed to load order details");
    } finally {
      setEditLoading(false);
    }
  };

const handleEditItemChange = (index: number, field: string, value: any) => {
  setEditItems((prev) => {
    const updated = [...prev];
    updated[index] = { ...updated[index], [field]: value };

    const qty = parseFloat(updated[index].quantity) || 0;
    const price = parseFloat(updated[index].unit_price) || 0;
    const discount = parseFloat(updated[index].discount_percent) || 0;

    let total = 0;

    if (updated[index].discount_type === "amount") {
      total = qty * price - discount;
    } else {
      total = qty * price * (1 - discount / 100);
    }

    updated[index].total = total;

    return updated;
  });
};
  const handleAddItem = () => {
    setEditItems((prev) => [
      ...prev,
      {
        category_id: "",
        product_id: "",
        item_name: "",
        quantity: 1,
        unit_price: 0,
        discount_percent: 0,
        discount_type: "percent",
        total: 0,
      },
    ]);
  };
  const handleRemoveItem = (index: number) => {
    setEditItems((prev) => prev.filter((_, i) => i !== index));
  };

  const computedTotals = useMemo(() => {
    // item.total already has item-level discount applied
    const itemsSubtotal = editItems.reduce(
      (sum, item) => sum + (parseFloat(item.total) || 0),
      0,
    );

    const discount = Number(editFields.discount) || 0;
    const tax = Number(editFields.tax) || 0;

    const discountAmt =
      editFields.discount_type === "percent"
        ? (itemsSubtotal * discount) / 100
        : discount;

    const taxAmt =
      editFields.tax_type === "percent"
        ? ((itemsSubtotal - discountAmt) * tax) / 100
        : tax;

    const total = itemsSubtotal - discountAmt + taxAmt;

    return { subtotal: itemsSubtotal, discountAmt, taxAmt, total };
  }, [editItems, editFields]);
  const handleEditSave = async () => {
    setEditSaving(true);

    let payload;

    // ✅ DISPATCHER → ONLY STATUS + DELIVERY NOTES
    if (user?.user_type === "dispatcher"||user?.user_type === "manager") {
      if (!editOrder?.status) {
        setEditSaving(false);
        return toast.error("Status is required");
      }
      payload = {
        status: editOrder?.status,
        deliveryNotes: editFields.deliveryNotes,
        payment_term: editFields.payment_term,
      };
    }

    // ✅ ACCOUNTANT → ONLY STATUS
    else if (user?.user_type === "accountant") {
      if (!editOrder?.status) {
        setEditSaving(false);
        return toast.error("Status is required");
      }
      payload = {
        status: editOrder?.status,
      };
    }

    // ✅ ADMIN + SALESMAN → FULL EDIT
    else if (canEditFull) {
      payload = {
        due_date: editFields.due_date,
        deliveryNotes: editFields.deliveryNotes,
        payment_term: editFields.payment_term,
        discount: editFields.discount, // ✅ raw input (e.g. "10" for 10%)
        discount_type: editFields.discount_type,
        tax: editFields.tax,
        dealer_id: editFields.dealer_id, // ✅ raw input
        tax_type: editFields.tax_type,
        items: editItems.map((item) => ({
          _id: item._id,
          product_id: item.product_id?._id || item.product_id,
          quantity: parseFloat(item.quantity),
          item_name: item?.item_name,
          unit_price: parseFloat(item.unit_price),
          discount_percent: parseFloat(item.discount_percent) || 0,
          total: item.total,
        })),
        subtotal: computedTotals.subtotal,
        total: computedTotals.total,
        status: editOrder?.status,
      };
    }

    const res = await order.updateOrder(payload, editOrder?._id);

    if (!res.success) {
      setEditSaving(false);
      return toast.error(res?.message || "Failed to update order");
    }

    toast.success(res?.message || "Order updated successfully");

    closeEditModal();
    setEditSaving(false);
    await refetch();
  };
  const closeEditModal = () => {
    setEditOrder(null);
    setEditItems([]);
    setEditFields({});
  };

  const isGeneralCategory = (categoryId) => {
    const cat = categories.find((c) => c._id === categoryId);
    return cat?.name === "General Appliances";
  };

  const isFinancialLocked =
    isDispatcher ||isManager ||
    user?.user_type === "accountant" ||
    editOrder?.status === "dispatched" ||
    editOrder?.status === "posted";

  // Add these state variables
  // State
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  console.log(editOrder)
  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      {/* CONFIRMATION MODAL */}
      {confirmOrderId && confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {confirmAction === "delete"
                ? "Delete Order?"
                : confirmAction === "approve"
                  ? "Approve Order?"
                  : confirmAction === "unapprove"
                    ? "Unapprove Order?"
                    : user?.user_type === "salesman"
                      ? "Delete Order?"
                      : "Reject Order?"}
            </h2>
            {confirmAction === "reject" && user?.user_type !== "salesman" && (
              <div className="mb-4">
                <label className="text-xs text-gray-500 font-medium mb-1 block">
                  Reject Reason <span className="text-red-500">*</span>
                </label>

                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Write reason for rejection..."
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                  rows={3}
                />
              </div>
            )}
            <p className="text-sm text-gray-500 mb-6">
              {confirmAction === "delete"
                ? "Are you sure you want to permanently delete this order?"
                : confirmAction === "approve"
                  ? "Are you sure you want to approve this order?"
                  : confirmAction === "unapprove"
                    ? "Are you sure you want to move this order back to unapproved?"
                    : `Are you sure you want to ${user?.user_type === "admin" ? "reject" : "delete"} this order? This action cannot be undone.`}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={
                  confirmAction === "reject" &&
                  user?.user_type !== "salesman" &&
                  !rejectReason.trim()
                }
                className={`px-4 py-2 rounded-lg text-white ${
                  confirmAction === "approve"
                    ? "bg-green-500 hover:bg-green-600"
                    : confirmAction === "unapprove"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-red-500 hover:bg-red-600"
                } ${
                  confirmAction === "delete"
                    ? "Delete"
                    : confirmAction === "reject" &&
                        user?.user_type !== "salesman" &&
                        !rejectReason.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                }`}
              >
                {confirmAction === "delete"
                  ? "Delete"
                  : confirmAction === "approve"
                    ? "Approve"
                    : confirmAction === "unapprove"
                      ? "Unapprove"
                      : user?.user_type === "salesman" && "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW ORDER MODAL */}
      {(viewOrder || viewLoading) && (
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
                      {viewOrder?.order_number}
                    </h2>
                    <span
                      className={`text-xs px-2 py-1 rounded-md font-medium ${statusStyle[formatStatus(viewOrder?.status)]}`}
                    >
                      {formatStatus(viewOrder?.status)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setViewOrder(null);
                      setViewItems([]);
                    }}
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Dealer</p>
                    <p className="text-sm font-medium">
                      {viewOrder?.dealer_id?.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 mb-1">
                      Created By
                    </p>
                    <p className="text-sm">
                      {viewOrder?.createdBy?.name} (
                      {viewOrder?.createdBy?.user_type === "admin"
                        ? "Director"
                        : "Salesman"}
                      )
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Order Date</p>
                    <p className="text-sm font-medium">
                      {viewOrder?.order_date
                        ? new Date(viewOrder.order_date).toLocaleDateString(
                            "en-GB",
                          )
                        : "-"}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 mb-1">Due Date</p>
                    <p className="text-sm font-medium">
                      {viewOrder?.due_date
                        ? new Date(viewOrder.due_date).toLocaleDateString(
                            "en-GB",
                          )
                        : "-"}
                    </p>
                  </div>
                </div>
                {viewOrder?.deliveryNotes && (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-5">
                    <p className="text-xs text-yellow-600 font-medium mb-1">
                      Delivery Notes
                    </p>
                    <p className="text-sm text-gray-700">
                      {viewOrder.deliveryNotes}
                    </p>
                  </div>
                )}
                <div className="mb-5">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Order Items
                  </p>
                  <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-500 text-xs">
                        <tr>
                          <th className="text-left px-4 py-3">Product</th>
                          <th className="px-4 py-3">Qty</th>
                          <th className="px-4 py-3">Unit Price</th>
                          <th className="px-4 py-3">Discount %/Amt</th>
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
                  {viewOrder?.rejectReason && (
                    <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-xs text-red-600 font-semibold mb-1">
                        Rejection Reason
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {viewOrder?.rejectReason}
                      </p>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{viewOrder?.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount</span>
                    <span>- {viewOrder?.discount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax</span>
                    <span>+ {viewOrder?.tax}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>{viewOrder?.total}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─── EDIT ORDER MODAL ─── */}
      {editOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {editLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-400 text-sm gap-2">
                <Loader2 size={18} className="animate-spin" /> Loading order...
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Edit Order — {editOrder?.order_number}
                    </h2>
                    <span
                      className={`text-xs px-2 py-1 rounded-md font-medium ${statusStyle[formatStatus(editOrder?.status)]}`}
                    >
                      {formatStatus(editOrder?.status)}
                    </span>
                  </div>
                  <button
                    onClick={closeEditModal}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>

                {/* Info row */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
  <p className="text-xs text-gray-400 mb-1">Dealer</p>
  {/* ✅ Editable for admin/salesman, static for dispatcher/accountant */}
  {isDispatcher || isManager || user?.user_type === "accountant" ? (
    <p className="text-sm font-medium">{editOrder?.dealer_id?.name}</p>
  ) : (
    <select
      value={editFields.dealer_id || ""}
      onChange={(e) => setEditFields((prev: any) => ({ ...prev, dealer_id: e.target.value }))}
      className="w-full text-sm border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white"
    >
      <option value="">Select Dealer</option>
      {dealers.map((d: any) => (
        <option key={d._id} value={d._id}>{d.name}</option>
      ))}
    </select>
  )}
  <p className="text-xs text-gray-400 mt-2 mb-1">Created By</p>
  <p className="text-sm">{editOrder?.createdBy?.name} ({editOrder?.createdBy?.user_type==="admin"?"Director":"Salesman"})</p>
</div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Order Date</p>
                    <p className="text-sm font-medium">
                      {editOrder?.order_date
                        ? new Date(editOrder.order_date).toLocaleDateString(
                            "en-GB",
                          )
                        : "-"}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 mb-1">Due Date</p>
                    {/* Due Date — admin/salesman only */}
                    <input
                      type="date"
                      value={editFields.due_date}
                      disabled={
                        isDispatcher ||isManager || user?.user_type === "accountant"
                      }
                      onChange={(e) =>
                        setEditFields((prev: any) => ({
                          ...prev,
                          due_date: e.target.value,
                        }))
                      }
                      className="w-full text-sm border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-xs text-gray-500 font-medium">
                    Payment Term
                  </label>

                  {/* Payment Term — accountant CAN edit, dispatcher cannot */}
                  <select
                    value={editFields.payment_term || "cash"}
                    onChange={(e) =>
                      setEditFields((prev: any) => ({
                        ...prev,
                        payment_term: e.target.value,
                      }))
                    }
                    disabled={isDispatcher}
                    className="w-full border rounded-lg px-3 py-2 mt-1 disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="cash">Cash</option>
                    <option value="advance">Advance</option>
                    <option value="periodical">Periodical</option>
                  </select>
                </div>
                {/* Delivery notes */}
                {/* Delivery notes — dispatcher can edit, accountant cannot */}
                <div className="mb-6">
                  <label className="text-xs text-gray-500 font-medium mb-1 block">
                    Delivery Notes
                  </label>
                  {/* Delivery Notes — dispatcher CAN edit, accountant cannot */}
                  <textarea
                    rows={2}
                    value={editFields.deliveryNotes}
                    onChange={(e) =>
                      setEditFields((prev: any) => ({
                        ...prev,
                        deliveryNotes: e.target.value,
                      }))
                    }
                    disabled={user?.user_type === "accountant"}
                    placeholder="Add delivery notes..."
                    className="w-full text-sm border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>

                {isDispatcher || isManager|| user?.user_type === "accountant" ? (
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Order Items
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
                          {editItems.map((item: any, i: number) => (
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
                                {item?.discount_percent}%
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
                ) : (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-gray-700">
                        Order Items
                      </p>
                      <button
                        onClick={handleAddItem}
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
                            <th className="px-4 py-3">Discount</th>
                            <th className="px-4 py-3 text-right">Total</th>
                            <th className="px-4 py-3 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {editItems?.map((item: any, i: number) => {
                            const rowProducts =
                              productMap[item.category_id] || [];
                            return (
                              <tr key={i} className="border-t">
                                {/* CATEGORY */}
                                <td className="px-2 py-2">
                                  <select
                                    value={item.category_id}
                                    onChange={async (e) => {
                                      const categoryId = e.target.value;

                                      handleEditItemChange(
                                        i,
                                        "category_id",
                                        categoryId,
                                      );
                                      handleEditItemChange(i, "product_id", "");
                                      handleEditItemChange(i, "item_name", "");

                                      if (!productMap[categoryId]) {
                                        const res =
                                          await order.getProductsByCategory(
                                            categoryId,
                                          );

                                        setProductMap((prev: any) => ({
                                          ...prev,
                                          [categoryId]: res,
                                        }));
                                      }
                                    }}
                                    className="w-full border rounded-lg px-2 py-1 text-sm"
                                  >
                                    <option value="">Category</option>
                                    {categories.map((c: any) => (
                                      <option key={c._id} value={c._id}>
                                        {c.name}
                                      </option>
                                    ))}
                                  </select>
                                </td>

                                {/* PRODUCT */}
                                <td className="px-2 py-2">
                                  <select
                                    value={
                                      item.product_id?._id || item.product_id
                                    }
                                    onChange={(e) => {
                                      const product = rowProducts.find(
                                        (p: any) =>
                                          String(p._id) ===
                                          String(e.target.value),
                                      );
                                      handleEditItemChange(
                                        i,
                                        "product_id",
                                        e.target.value,
                                      );
                                      handleEditItemChange(
                                        i,
                                        "item_name",
                                        product?.name || "",
                                      );
                                      handleEditItemChange(
                                        i,
                                        "unit_price",
                                        product?.mrp || 0,
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
                                </td>

                                {/* QTY */}
                                <td className="px-2 py-2">
                                  <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      handleEditItemChange(
                                        i,
                                        "quantity",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full text-center border rounded-lg px-2 py-1 text-sm"
                                  />
                                </td>

                                {/* PRICE */}
                                <td className="px-2 py-2">
                                  <input
                                    type="number"
                                    value={item.unit_price}
                                    onChange={(e) =>
                                      handleEditItemChange(
                                        i,
                                        "unit_price",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full text-center border rounded-lg px-2 py-1 text-sm"
                                  />
                                </td>

                                {/* DISCOUNT */}
<td className="px-2 py-2 flex gap-1">
  <select
    value={item.discount_type}
    onChange={(e) =>
      handleEditItemChange(i, "discount_type", e.target.value)
    }
    className="border rounded px-1 text-xs"
  >
    <option value="percent">%</option>
    <option value="amount">Amt</option>
  </select>

  <input
    type="number"
    value={item.discount_percent}
    onChange={(e) =>
      handleEditItemChange(i, "discount_percent", e.target.value)
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
                                    onClick={() => handleRemoveItem(i)}
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
                )}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Items Subtotal</span>
                    <span>{computedTotals.subtotal.toFixed(2)}</span>
                  </div>

                  {/* OVERALL DISCOUNT */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-20 shrink-0">
                      Discount
                    </span>
                    <select
                      value={editFields.discount_type}
                      disabled={isFinancialLocked}
                      onChange={(e) =>
                        setEditFields((prev: any) => ({
                          ...prev,
                          discount_type: e.target.value,
                        }))
                      }
                      className="border rounded-lg px-2 py-1 text-xs focus:outline-none w-20 bg-white"
                    >
                      <option value="amount">Amt</option>
                      <option value="percent">%</option>
                    </select>
                    <input
                      type="number"
                      value={editFields.discount}
                      onChange={(e) =>
                        setEditFields((prev: any) => ({
                          ...prev,
                          discount: e.target.value,
                        }))
                      }
                      disabled={isFinancialLocked}
                      className="flex-1 border rounded-lg px-2 py-1 text-xs focus:outline-none bg-white min-w-0 disabled:bg-gray-50 disabled:text-gray-400"
                    />
                    <span className="text-red-500 w-20 text-right shrink-0">
                      - {computedTotals.discountAmt.toFixed(2)}
                    </span>
                  </div>

                  {/* OVERALL TAX */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-20 shrink-0">Tax</span>
                    <select
                      value={editFields.tax_type}
                      disabled={isFinancialLocked}
                      onChange={(e) =>
                        setEditFields((prev: any) => ({
                          ...prev,
                          tax_type: e.target.value,
                        }))
                      }
                      className="border rounded-lg px-2 py-1 text-xs focus:outline-none w-20 bg-white"
                    >
                      <option value="amount">Amt</option>
                      <option value="percent">%</option>
                    </select>
                    <input
                      type="number"
                      value={editFields.tax}
                      disabled={isFinancialLocked}
                      onChange={(e) =>
                        setEditFields((prev: any) => ({
                          ...prev,
                          tax: e.target.value,
                        }))
                      }
                      className="flex-1 border rounded-lg px-2 py-1 text-xs focus:outline-none bg-white min-w-0"
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
                {/* Status — dispatcher, accountant, AND admin when order needs status change */}
                {(isDispatcher || isManager ||
                  user?.user_type === "accountant" ||
                  user?.user_type === "admin") && (
                  <div className="mb-6">
                    <label className="text-xs text-gray-500 font-medium">
                      Order Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={editOrder?.status || ""}
                      onChange={(e) =>
                        setEditOrder((prev: any) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    >
                      <option value={editOrder?.status}>
                        {formatStatus(editOrder?.status)}
                      </option>

                      {isDispatcher && editOrder?.status !== "dispatched" || isManager&& (
                        <>
                          <option value="partial">Partial</option>
                          <option value="dispatched">Dispatched</option>
                        </>
                      )}

                      {user?.user_type === "accountant" && (
                        <option value="posted">Posted</option>
                      )}

                      {user?.user_type === "admin" &&
                        editOrder?.status === "dispatched" && (
                          <option value="posted">Posted</option>
                        )}

                      {user?.user_type === "admin" &&
                        editOrder?.status === "approved" && (
                          <>
                            <option value="partial">Partial</option>
                            <option value="dispatched">Dispatched</option>
                          </>
                        )}
                    </select>
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeEditModal}
                    className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSave}
                    disabled={editSaving}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-60"
                  >
                    {editSaving ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Save size={15} />
                    )}
                    {editSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-semibold">Orders</h1>
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
              placeholder="Search by order #"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border focus:outline-none"
            />
          </div>
          <button className="p-2 bg-white border rounded-lg">
            <SlidersHorizontal size={18} />
          </button>
          {!(isDispatcher ||isManager|| user?.user_type === "accountant") && (
            <button
              onClick={() => router.push("/orders/add")}
              className="cursor-pointer flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
            >
              Add Order <Plus size={16} />
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="text-gray-500 border-b">
              <tr className="text-left">
                <th className="py-3">Order #</th>
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
                    <option value="unapproved">Unapproved</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="pending">Pending</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="partial">Partial</option>
                    <option value="posted">Posted</option>
                  </select>
                </th>
                <th>Due Date</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((o: any, i: number) => {
                const formattedStatus = formatStatus(o?.status);
                return (
                  <tr key={i} className="border-b last:border-none">
                    <td className="py-4 font-medium">{o?.order_number}</td>
                    <td>{o?.dealer_id?.name}</td>
                    <td>
                      {o?.createdBy?.name} (
                      {o?.createdBy?.user_type === "admin"
                        ? "Director"
                        : "Salesman"}
                      )
                    </td>
                    <td>{o?.total}</td>
                    <td>{o?.discount}</td>
                    <td>
                      <span
                        className={`px-3 py-1 text-xs rounded-md font-medium ${statusStyle[formattedStatus]}`}
                      >
                        {formattedStatus}
                      </span>
                    </td>
                    <td>
                      {o?.due_date
                        ? new Date(o.due_date).toLocaleDateString("en-GB")
                        : "-"}
                    </td>
                    <td className="py-4 text-center">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            const rect =
                              e.currentTarget.getBoundingClientRect();

                            const dropdownHeight = 260;
                            const dropdownWidth = 180;

                            let top = rect.bottom;
                            let left = rect.left;

                            // ✅ FIX 1: vertical overflow
                            if (top + dropdownHeight > window.innerHeight) {
                              top = rect.top - dropdownHeight;
                            }

                            // ✅ FIX 2: horizontal overflow
                            if (left + dropdownWidth > window.innerWidth) {
                              left = window.innerWidth - dropdownWidth - 10;
                            }

                            setMenuPosition({
                              top,
                              left,
                            });

                            setOpenMenu(o._id);
                          }}
                          className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {/* DROPDOWN PORTAL — place just before closing </div> of page */}
                        {openMenu === o._id &&
                          (() => {
                            const o = filtered?.find(
                              (o: any) => o._id === openMenu,
                            );
                            if (!o) return null;

                            return (
                              <div
                                style={{
                                  position: "fixed",
                                  top: menuPosition.top,
                                  left: menuPosition.left,
                                  zIndex: 9999,
                                }}
                                className="dropdown-menu w-44 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {/* VIEW */}
                                <button
                                  onClick={() => {
                                    handleView(o._id);
                                    setOpenMenu(null);
                                  }}
                                  className="block w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm"
                                >
                                  View
                                </button>

                                {/* EDIT — Admin: all except posted */}
                                {user?.user_type === "admin" &&
                                  o.status !== "posted" && (
                                    <button
                                      onClick={() => {
                                        handleEdit(o._id);
                                        setOpenMenu(null);
                                      }}
                                      className="block w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm"
                                    >
                                      Edit
                                    </button>
                                  )}

                                {/* EDIT — Salesman: own unapproved/approved/rejected */}
                                {user?.user_type === "salesman" &&
                                  (o.status === "unapproved" ||
                                    o.status === "approved" ||
                                    o.status === "rejected") &&
                                  o?.createdBy?._id === user?._id && (
                                    <button
                                      onClick={() => {
                                        handleEdit(o._id);
                                        setOpenMenu(null);
                                      }}
                                      className="block w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm"
                                    >
                                      Edit
                                    </button>
                                  )}

                                  {user?.user_type === "dispatcher"|| user?.user_type === "manager" &&
                                    (o.status === "approved" ||
                                      o.status === "partial" ||
                                      o.status === "dispatched") && (
                                      <button
                                        onClick={() => {
                                          handleEdit(o._id);
                                          setOpenMenu(null);
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                      >
                                        Edit
                                      </button>
                                    )}

                                {/* EDIT — Accountant: dispatched only */}
                                {user?.user_type === "accountant" &&
                                  o.status === "dispatched" && (
                                    <button
                                      onClick={() => {
                                        handleEdit(o._id);
                                        setOpenMenu(null);
                                      }}
                                      className="block w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm"
                                    >
                                      Edit
                                    </button>
                                  )}

                                {/* APPROVE */}
                                {user?.user_type === "admin" &&
                                  (o.status === "unapproved" ||
                                    o.status === "rejected") && (
                                    <button
                                      onClick={() => {
                                        handleAction(o._id, "approve");
                                        setOpenMenu(null);
                                      }}
                                      className="block w-full text-left px-4 py-2.5 text-green-600 hover:bg-gray-50 text-sm"
                                    >
                                      Approve
                                    </button>
                                  )}

                                {/* UNAPPROVE */}
                                {user?.user_type === "admin" &&
                                  o.status === "approved" && (
                                    <button
                                      onClick={() => {
                                        handleAction(o._id, "unapprove");
                                        setOpenMenu(null);
                                      }}
                                      className="block w-full text-left px-4 py-2.5 text-yellow-600 hover:bg-gray-50 text-sm"
                                    >
                                      Unapprove
                                    </button>
                                  )}

                                {/* REJECT — admin, non-rejected/dispatched/posted */}
                                {user?.user_type === "admin" &&
                                  o.status !== "rejected" &&
                                  o.status !== "dispatched" &&
                                  o.status !== "posted" && (
                                    <button
                                      onClick={() => {
                                        handleAction(o._id, "reject");
                                        setOpenMenu(null);
                                      }}
                                      className="block w-full text-left px-4 py-2.5 text-red-600 hover:bg-gray-50 text-sm"
                                    >
                                      Reject
                                    </button>
                                  )}

                                {/* DELETE — admin when approved/unapproved/rejected */}
                                {user?.user_type === "admin" &&
                                  (o.status === "approved" ||
                                    o.status === "unapproved" ||
                                    o.status === "rejected") && (
                                    <button
                                      onClick={() => {
                                        handleAction(o._id, "delete");
                                        setOpenMenu(null);
                                      }}
                                      className="block w-full text-left px-4 py-2.5 text-red-600 hover:bg-gray-50 text-sm"
                                    >
                                      Delete
                                    </button>
                                  )}

                                {/* DELETE — Salesman: own unapproved only */}
                                {user?.user_type === "salesman" &&
                                  o.status === "unapproved" &&
                                  o?.createdBy?._id === user?._id && (
                                    <button
                                      onClick={() => {
                                        handleAction(o._id, "reject");
                                        setOpenMenu(null);
                                      }}
                                      className="block w-full text-left px-4 py-2.5 text-red-600 hover:bg-gray-50 text-sm"
                                    >
                                      Delete
                                    </button>
                                  )}

                                {/* PDF */}
                                {o.status !== "unapproved" &&
                                  o.status !== "rejected" && (
                                    <button
                                      onClick={async () => {
                                        const blob = await order.downloadPDF(
                                          o._id,
                                        );
                                        const url =
                                          window.URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = url;
                                        a.download = `order-${o.order_number}.pdf`;
                                        a.click();
                                        window.URL.revokeObjectURL(url);
                                        setOpenMenu(null);
                                      }}
                                      className="block w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm"
                                    >
                                      Download PDF
                                    </button>
                                  )}
                              </div>
                            );
                          })()}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered?.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-10 text-gray-400 text-sm"
                  >
                    No orders found for "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 text-sm text-gray-500">
          <p>Total Orders: {filtered?.length || 0}</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded">1</button>
            <button className="px-3 py-1 border rounded bg-gray-100">2</button>
            <button className="px-3 py-1 border rounded">3</button>
            <span>...</span>
            <button className="px-3 py-1 border rounded">14</button>
            <button className="px-3 py-1 border rounded">15</button>
          </div>
        </div>
      </div>
      {/* {downloadOrderId && (
  <OrderPdfGenerator
    orderId={downloadOrderId}
    onDone={() => setDownloadOrderId(null)}
  />
)} */}
    </div>
  );
}
