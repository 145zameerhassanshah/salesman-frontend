"use client";

import API_URL from "@/app/components/lib/apiConfig";
import { order } from "@/app/components/services/orderService";
import { useCategory } from "@/hooks/useCategory";
import { useOrders } from "@/hooks/useOrders";
import { useProductsByCategory } from "@/hooks/useProductByCategory";
import {
  Check,
  X,
  Eye,
  Plus,
  Search,
  SlidersHorizontal,
  Pencil,
  Save,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
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
  const user = useSelector((state: any) => state.user.user);
  const isDispatcher = user?.user_type === "dispatcher";
  const canEditFull =
  user?.user_type === "admin" || user?.user_type === "salesman";
  const { data: categories = [] } = useCategory(user?.industry);
  const [activeCategory, setActiveCategory] = useState("");
  const { data: categoryProducts = [] } = useProductsByCategory(activeCategory);
  const { data, refetch } = useOrders(user?.industry);
  console.log(data);
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [confirmOrderId, setConfirmOrderId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<
    "approve" | "reject" | null
  >(null);

  const [viewOrder, setViewOrder] = useState<any>(null);
  const [viewItems, setViewItems] = useState<any[]>([]);
  const [viewLoading, setViewLoading] = useState(false);

  const [editOrder, setEditOrder] = useState<any>(null);
  const [editItems, setEditItems] = useState<any[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editFields, setEditFields] = useState<any>({});

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    return data?.filter((o: any) =>
      o?.order_number?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, data]);

  const formatStatus = (status: string) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";

  const handleAction = (orderId: string, action: "approve" | "reject") => {
    setConfirmOrderId(orderId);
    setConfirmAction(action);
  };

  const handleConfirm = async () => {
    if (confirmAction === "approve") {
      const res = await order.updateStatus(confirmOrderId, "approved");
      if (!res.success)
        return toast.error(res?.message || "Problem approving order");
      toast.success(res?.message);
      await refetch();
    } else if (confirmAction === "reject") {
      if (user?.user_type === "salesman") {
        const res = await order.deleteOrder(confirmOrderId);
        if (!res.success)
          return toast.error(res?.message || "Problem deleting order");
        toast.success(res?.message);
        await refetch();
      } else {
        const res = await order.updateStatus(confirmOrderId, "rejected");
        if (!res.success)
          return toast.error(res?.message || "Problem rejecting order");
        toast.success(res?.message);
        await refetch();
      }
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
      setEditItems(res.items.map((item: any) => ({ ...item })));
      setEditFields({
        due_date: res.order?.due_date
          ? new Date(res.order.due_date).toISOString().split("T")[0]
          : "",
        deliveryNotes: res.order?.deliveryNotes || "",
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
      updated[index].total = qty * price * (1 - discount / 100);
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
        total: 0,
      },
    ]);
  };
  const handleRemoveItem = (index: number) => {
    setEditItems((prev) => prev.filter((_, i) => i !== index));
  };

  const computedTotals = useMemo(() => {
    const subtotal = editItems.reduce(
      (sum, item) =>
        sum +
        (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0),
      0,
    );
    const discountAmt = editItems.reduce(
      (sum, item) =>
        sum +
        (parseFloat(item.quantity) || 0) *
          (parseFloat(item.unit_price) || 0) *
          ((parseFloat(item.discount_percent) || 0) / 100),
      0,
    );
    const tax = parseFloat(editOrder?.tax) || 0;
    return { subtotal, discountAmt, total: subtotal - discountAmt + tax };
  }, [editItems, editOrder]);
  
  const handleEditSave = async () => {
  setEditSaving(true);

  let payload;

  // ✅ DISPATCHER → ONLY STATUS + DELIVERY NOTES
  if (user?.user_type === "dispatcher") {
    if (editOrder?.status==="approved") {
      setEditSaving(false);
    return toast.error("Status is required");
  }
    payload = {
      status: editOrder?.status,
      deliveryNotes: editFields.deliveryNotes,
    };
  }

  // ✅ ACCOUNTANT → ONLY STATUS
  else if (user?.user_type === "accountant") {
    if (editOrder?.status==="partial" || editOrder?.status==="dispatched") {
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
      discount: computedTotals.discountAmt,
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

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      {/* CONFIRMATION MODAL */}
      {confirmOrderId && confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {confirmAction === "approve"
                ? "Approve Order?"
                : user?.user_type === "salesman"
                  ? "Delete Order?"
                  : "Reject Order?"}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {confirmAction === "approve"
                ? "Are you sure you want to approve this order?"
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
                className={`px-4 py-2 rounded-lg text-white ${confirmAction === "approve" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
              >
                {confirmAction === "approve"
                  ? "Approve"
                  : user?.user_type === "salesman"
                    ? "Delete"
                    : "Reject"}
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
                    <p className="text-sm font-medium">
                      {editOrder?.dealer_id?.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 mb-1">
                      Created By
                    </p>
                    <p className="text-sm">
                      {editOrder?.createdBy?.name} (
                      {editOrder?.createdBy?.user_type === "admin"
                        ? "Director"
                        : "Salesman"}
                      )
                    </p>
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
                    <input
                      type="date"
                      value={editFields.due_date}
                      disabled={isDispatcher}
                      onChange={(e) =>
                        setEditFields((prev: any) => ({
                          ...prev,
                          due_date: e.target.value,
                        }))
                      }
                      className="w-full text-sm border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white"
                    />
                  </div>
                </div>

                {/* Delivery notes */}
                <div className="mb-6">
                  <label className="text-xs text-gray-500 font-medium mb-1 block">
                    Delivery Notes
                  </label>
                  <textarea
                    rows={2}
                    value={editFields.deliveryNotes}
                    onChange={(e) =>
                      setEditFields((prev: any) => ({
                        ...prev,
                        deliveryNotes: e.target.value,
                      }))
                    }
                    disabled={user?.user_type==="accountant"}
                    placeholder="Add delivery notes..."
                    className="w-full text-sm border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none"
                  />
                </div>

                {/* Items table */}
                {(isDispatcher || user?.user_type==="accountant") ? <div className="mb-5">
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
</div>:<div className="mb-6">
                 <div className="flex items-center justify-between mb-3">
  <p className="text-sm font-semibold text-gray-700">Order Items</p>
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
  <th className="px-4 py-3">Discount %</th>
  <th className="px-4 py-3 text-right">Total</th>
  <th className="px-4 py-3 text-center">Action</th>
</tr>
                      </thead>
                      <tbody>
                       {editItems?.map((item: any, i: number) => {
  const rowProducts =
    item.category_id === activeCategory ? categoryProducts : [];

  return (
    <tr key={i} className="border-t">

      {/* CATEGORY */}
      <td className="px-2 py-2">
        <select
          value={item.category_id}
          onChange={(e) => {
            handleEditItemChange(i, "category_id", e.target.value);
            setActiveCategory(e.target.value);
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
          value={item.product_id}
          onChange={(e) => {
            const product = rowProducts.find(
              (p: any) => p._id === e.target.value
            );

            handleEditItemChange(i, "product_id", e.target.value);
            handleEditItemChange(i, "item_name", product?.name || "");
            handleEditItemChange(i, "unit_price", product?.mrp || 0);
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
            handleEditItemChange(i, "quantity", e.target.value)
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
            handleEditItemChange(i, "unit_price", e.target.value)
          }
          className="w-full text-center border rounded-lg px-2 py-1 text-sm"
        />
      </td>

      {/* DISCOUNT */}
      <td className="px-2 py-2">
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
                </div>}

                {/* Live totals */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{computedTotals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount</span>
                    <span>- {computedTotals.discountAmt.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax</span>
                    <span>+ {editOrder?.tax ?? 0}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>{computedTotals.total.toFixed(2)}</span>
                  </div>
                </div>
                {(isDispatcher || user?.user_type==="accountant") && <div className="mb-6">
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
    required
    className="w-full border rounded-lg px-3 py-2 mt-1"
  >
    <option value="">Select Status</option>

    {isDispatcher && (
      <>
        <option value="partial">Partial</option>
        <option value="dispatched">Dispatched</option>
      </>
    )}

    {user?.user_type === "accountant" && (
      <option value="posted">Posted</option>
    )}

    {user?.user_type === "admin" && (
      <>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </>
    )}
  </select>
</div>}

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
          {!(isDispatcher || user?.user_type==="accountant") && <button
            onClick={() => router.push("/orders/add")}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
          >
            Add Order <Plus size={16} />
          </button>}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="text-gray-500 border-b">
            <tr className="text-left">
              <th className="py-3">Order #</th>
              <th>Dealer</th>
              <th>Salesman/Director</th>
              <th>Total</th>
              <th>Discount</th>
              <th>Status</th>
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
                  <td>
                    <div className="flex justify-center gap-2">
                      {user?.user_type === "salesman" &&
                        o.status === "unapproved" &&
                        o?.createdBy?._id === user?._id && (
                          <button
                            onClick={() => handleAction(o?._id, "reject")}
                            className="p-2 bg-red-100 text-red-600 rounded-md"
                          >
                            <X size={16} />
                          </button>
                        )}
                      {user?.user_type === "admin" &&
                        o.status === "unapproved" && (
                          <>
                            <button
                              onClick={() => handleAction(o?._id, "approve")}
                              className="p-2 bg-green-100 text-green-600 rounded-md"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleAction(o._id, "reject")}
                              className="p-2 bg-red-100 text-red-600 rounded-md"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      <button
                        onClick={() => handleView(o._id)}
                        className="p-2 bg-gray-100 text-gray-600 rounded-md"
                      >
                        <Eye size={16} />
                      </button>
                      {/* EDIT: SALESMAN + UNAPPROVED + OWN ORDER */}
                      {user?.user_type === "salesman" &&
                        o?.status === "unapproved" &&
                        o?.createdBy?._id === user?._id && (
                          <button
                            onClick={() => handleEdit(o._id)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-md"
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                      {/* EDIT: ADMIN + ANY STATUS EXCEPT DELIVERED */}
                      {user?.user_type === "admin" &&
                        o?.status !== "dispatched" && o?.status!=="partial" && o?.status!=="rejected" && o?.status!=="posted" && (
                          <button
                            onClick={() => handleEdit(o?._id)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-md"
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        {/* DISPATCHER EDIT */}
{user?.user_type === "dispatcher" && o?.status !== "dispatched" && (
  <button
    onClick={() => handleEdit(o._id)}
    className="p-2 bg-purple-100 text-purple-600 rounded-md"
  >
    <Pencil size={16} />
  </button>
)}

{/* ACCOUNTANT EDIT */}
{user?.user_type === "accountant" && (
  <button
    onClick={() => handleEdit(o._id)}
    className="p-2 bg-yellow-100 text-yellow-600 rounded-md"
  >
    <Pencil size={16} />
  </button>
)}
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
    </div>
  );
}
