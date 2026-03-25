"use client";

import API_URL from "@/app/components/lib/apiConfig";
import { order } from "@/app/components/services/orderService";
import { useOrders } from "@/hooks/useOrders";
import {
  Check, X, Eye, Plus, Search, SlidersHorizontal, Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const statusStyle: any = {
  Pending: "bg-yellow-100 text-yellow-600",
  Unapproved: "bg-gray-100 text-blue-600",
  Rejected: "bg-red-100 text-red-600",
  Delivered: "bg-green-100 text-green-600",
  Approved: "bg-green-100 text-green-600",
  Cancelled: "bg-orange-100 text-orange-600",
};

export default function OrdersPage() {
  const user = useSelector((state: any) => state.user.user);
  const { data, refetch } = useOrders(user?.industry);
  const router = useRouter();

  const [confirmOrderId, setConfirmOrderId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);

  const [viewOrder, setViewOrder] = useState<any>(null);
  const [viewItems, setViewItems] = useState<any[]>([]);
  const [viewLoading, setViewLoading] = useState(false);

  const formatStatus = (status: string) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : "-";
  };

  const handleAction = (orderId: string, action: "approve" | "reject") => {
    setConfirmOrderId(orderId);
    setConfirmAction(action);
  };

  const handleConfirm = async () => {
    if (confirmAction === "approve") {
      const res = await order.updateStatus(confirmOrderId, "approved");
      if (!res.success) return toast.error(res?.message || "Problem approving order");
      toast.success(res?.message);
      await refetch();
    } else if (confirmAction === "reject") {
      const res = await order.updateStatus(confirmOrderId, "rejected");
      if (!res.success) return toast.error(res?.message || "Problem rejecting order");
      toast.success(res?.message);
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
      if (!res.success) return toast.error(res?.message || "Failed to load order");
      setViewOrder(res.order);
      setViewItems(res.items);
    } catch {
      toast.error("Failed to load order details");
    } finally {
      setViewLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">

      {/* CONFIRMATION MODAL */}
      {confirmOrderId && confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {confirmAction === "approve" ? "Approve Order?" : "Reject Order?"}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {confirmAction === "approve"
                ? "Are you sure you want to approve this order?"
                : "Are you sure you want to reject this order? This action cannot be undone."}
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={handleCancel} className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-lg text-white ${
                  confirmAction === "approve" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {confirmAction === "approve" ? "Approve" : "Reject"}
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
                {/* MODAL HEADER */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{viewOrder?.order_number}</h2>
                    <span className={`text-xs px-2 py-1 rounded-md font-medium ${statusStyle[formatStatus(viewOrder?.status)]}`}>
                      {formatStatus(viewOrder?.status)}
                    </span>
                  </div>
                  <button onClick={() => { setViewOrder(null); setViewItems([]); }}>
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>

                {/* DEALER + DATES */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Dealer</p>
                    <p className="text-sm font-medium">{viewOrder?.dealer_id?.name}</p>
                    <p className="text-xs text-gray-400 mt-2 mb-1">Created By</p>
                    <p className="text-sm">
                      {viewOrder?.createdBy?.name} (
                      {viewOrder?.createdBy?.user_type === "admin" ? "Director" : "Salesman"})
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Order Date</p>
                    <p className="text-sm font-medium">
                      {viewOrder?.order_date
                        ? new Date(viewOrder.order_date).toLocaleDateString("en-GB")
                        : "-"}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 mb-1">Due Date</p>
                    <p className="text-sm font-medium">
                      {viewOrder?.due_date
                        ? new Date(viewOrder.due_date).toLocaleDateString("en-GB")
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* DELIVERY NOTES */}
                {viewOrder?.deliveryNotes && (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-5">
                    <p className="text-xs text-yellow-600 font-medium mb-1">Delivery Notes</p>
                    <p className="text-sm text-gray-700">{viewOrder.deliveryNotes}</p>
                  </div>
                )}

                {/* ORDER ITEMS */}
                <div className="mb-5">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Order Items</p>
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
                            <td className="px-4 py-3">{item?.item_name || item?.product_id?.name}</td>
                            <td className="px-4 py-3 text-center">{item?.quantity}</td>
                            <td className="px-4 py-3 text-center">{item?.unit_price}</td>
                            <td className="px-4 py-3 text-center">{item?.discount_percent}%</td>
                            <td className="px-4 py-3 text-right">{item?.total?.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* TOTALS */}
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

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-semibold">Orders</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border focus:outline-none"
            />
          </div>
          <button className="p-2 bg-white border rounded-lg">
            <SlidersHorizontal size={18} />
          </button>
          <button
            onClick={() => router.push("/orders/add")}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
          >
            Add Order <Plus size={16} />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="text-gray-500 border-b">
            <tr className="text-left">
              <th className="py-3">Invoice #</th>
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
            {data?.map((order: any, i: number) => {
              const formattedStatus = formatStatus(order?.status);
              return (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-4 font-medium">{order?.order_number}</td>
                  <td>{order?.dealer_id?.name}</td>
                  <td>
                    {order?.createdBy?.name} (
                    {order?.createdBy?.user_type === "admin" ? "Director" : "Salesman"})
                  </td>
                  <td>{order?.total}</td>
                  <td>{order?.discount}</td>
                  <td>
                    <span className={`px-3 py-1 text-xs rounded-md font-medium ${statusStyle[formattedStatus]}`}>
                      {formattedStatus}
                    </span>
                  </td>
                  <td>
                    {order?.due_date
                      ? new Date(order.due_date).toLocaleDateString("en-GB")
                      : "-"}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="flex justify-center gap-2">

                      {/* Salesman: X only when unapproved */}
                      {user?.user_type === "salesman" && order.status === "unapproved" && (
                        <button
                          onClick={() => handleAction(order?._id, "reject")}
                          className="p-2 bg-red-100 text-red-600 rounded-md"
                        >
                          <X size={16} />
                        </button>
                      )}

                      {/* Admin: Check + X only when unapproved */}
                      {user?.user_type === "admin" && order.status === "unapproved" && (
                        <>
                          <button
                            onClick={() => handleAction(order?._id, "approve")}
                            className="p-2 bg-green-100 text-green-600 rounded-md"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleAction(order._id, "reject")}
                            className="p-2 bg-red-100 text-red-600 rounded-md"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}

                      {/* VIEW (ALL USERS) */}
                      <button
                        onClick={() => handleView(order._id)}
                        className="p-2 bg-gray-100 text-gray-600 rounded-md"
                      >
                        <Eye size={16} />
                      </button>

                      {/* EDIT: SALESMAN + UNAPPROVED ONLY */}
                      {user?.user_type === "salesman" && order?.status === "unapproved" && (
                        <button className="p-2 bg-blue-100 text-blue-600 rounded-md">
                          <Pencil size={16} />
                        </button>
                      )}

                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* FOOTER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6 text-sm text-gray-500">
          <p>Total Orders: {data?.length || 0}</p>
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