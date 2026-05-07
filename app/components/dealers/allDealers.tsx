"use client";

import { MoreVertical, X } from "lucide-react";
import toast from "react-hot-toast";
import DealerService from "@/app/components/services/dealerService";
import UserService from "@/app/components/services/userService";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function DealersTable({ dealers, refresh, onEdit }: any) {
  const user = useSelector((state: any) => state.user.user);

  const [currentDealer, setCurrentDealer] = useState<any>(null);
  const [viewDealer, setViewDealer] = useState<any>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [confirmDealerId, setConfirmDealerId] = useState<any>(null);
  const [confirmAction, setConfirmAction] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [salesmen, setSalesmen] = useState<any[]>([]);
  const [newSalesmanId, setNewSalesmanId] = useState("");

  /* ================= ACTION ================= */
  const handleAction = (dealer: any, action: any) => {
    setConfirmDealerId(dealer._id);
    setConfirmAction(action);
    setCurrentDealer(dealer);
    if (action === "reassign") setNewSalesmanId(dealer?.assigned_to?._id || "");
  };

  /* ================= VIEW ================= */
  const handleViewDealer = async (id: any) => {
    setViewLoading(true);
    try {
      const res = await DealerService.getDealerById(id);
      if (!res.success) return toast.error(res.message || "Failed to load dealer");
      setViewDealer(res.dealer);
    } catch { toast.error("Error loading dealer"); }
    finally { setViewLoading(false); }
  };

  /* ================= FETCH SALESMEN ================= */
  useEffect(() => {
    const fetchSalesmen = async () => {
      if (user?.industry) {
        const res = await UserService.getSalesmen(user.industry);
        if (res.success) setSalesmen(res.salesmen);
      }
    };
    if (confirmAction === "reassign") fetchSalesmen();
  }, [confirmAction]);

  /* ================= CONFIRM ================= */
  const handleConfirm = async () => {
    let res;
    if (confirmAction === "approve") res = await DealerService.updateDealerStatus(confirmDealerId, { status: "approved" });
    if (confirmAction === "reject") {
      if (!rejectReason.trim()) return toast.error("Reason required");
      res = await DealerService.updateDealerStatus(confirmDealerId, { status: "rejected", rejectReason });
    }
    if (confirmAction === "unapprove") res = await DealerService.updateDealerStatus(confirmDealerId, { status: "unapproved" });
    if (confirmAction === "reassign") {
      if (!newSalesmanId) return toast.error("Select salesman");
      if (String(newSalesmanId) === String(currentDealer?.assigned_to?._id)) return toast.error("Already assigned");
      res = await DealerService.reassignDealer(confirmDealerId, newSalesmanId, rejectReason);
    }
    if (confirmAction === "delete") res = await DealerService.deleteDealer(confirmDealerId);
if (res?.success) {
  toast.success(res.message || "Action completed successfully");
  refresh();
}
else {
  toast.error(res?.message || "Something went wrong");
}
    setConfirmDealerId(null);
    setConfirmAction(null);
    setRejectReason("");
  };

  const statusCls = (status: string) => {
    if (status === "approved") return "bg-green-100 text-green-700";
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "unapproved") return "bg-gray-100 text-gray-600";
    return "bg-red-100 text-red-600";
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 bg-white";
  const labelCls = "text-xs font-medium text-gray-500 mb-1 block";

  return (
    <div className="w-full overflow-hidden">

      {/* ── DESKTOP TABLE ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4 text-left font-medium">Dealer</th>
              <th className="py-3 px-4 text-left font-medium">Email</th>
              <th className="py-3 px-4 text-left font-medium">Phone</th>
              <th className="py-3 px-4 text-left font-medium">Salesman</th>
              <th className="py-3 px-4 text-left font-medium">Status</th>
              {(user?.user_type === "admin" || user?.user_type === "salesman") && (
                <th className="py-3 px-4 text-center font-medium">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {dealers.map((d: any) => (
              <tr key={d._id} className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    {d.business_logo && (
                      <img src={d.business_logo} className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-gray-200" alt={d.name} />
                    )}
                    <span className="font-medium text-gray-800 truncate max-w-[120px]">{d.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-500 truncate max-w-[160px]">{d.email}</td>
                <td className="py-3 px-4 text-gray-500">{d.phone_number}</td>
                <td className="py-3 px-4 text-gray-500">{d?.assigned_to?.name || "—"}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 text-xs rounded-lg font-medium capitalize ${statusCls(d.status)}`}>{d.status}</span>
                </td>
                {(user?.user_type === "admin" || user?.user_type === "salesman") && (
                  <td className="py-3 px-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition"><MoreVertical size={16} /></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDealer(d._id)}>View Details</DropdownMenuItem>
                        {user?.user_type === "salesman" && (
                          <>
                            {String(d?.assigned_to?._id) === String(user?._id) && <DropdownMenuItem onClick={() => onEdit(d)}>Edit</DropdownMenuItem>}
                            {String(d?.assigned_to?._id) === String(user?._id) && d.status !== "approved" && <DropdownMenuItem onClick={() => handleAction(d, "delete")} className="text-red-600">Delete</DropdownMenuItem>}
                          </>
                        )}
                        {user?.user_type === "admin" && (
                          <>
                            {(d.status === "pending" || d.status === "unapproved") && (<><DropdownMenuItem onClick={() => handleAction(d, "approve")} className="text-green-500">Approve</DropdownMenuItem><DropdownMenuItem onClick={() => handleAction(d, "reject")} className="text-red-500">Reject</DropdownMenuItem></>)}
                            {d.status === "approved" && <DropdownMenuItem onClick={() => handleAction(d, "unapprove")} className="text-yellow-500">Unapprove</DropdownMenuItem>}
                            <DropdownMenuItem onClick={() => handleAction(d, "delete")} className="text-red-600">Delete</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction(d, "reassign")}>Reassign</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(d)}>Edit</DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
              </tr>
            ))}
            {dealers.length === 0 && (
              <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">No dealers found</td></tr>
            )}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          Total: <span className="font-medium text-gray-600">{dealers.length}</span>
        </div>
      </div>

      {/* ── MOBILE CARDS ── */}
      <div className="md:hidden space-y-2 p-2">
        {dealers.map((d: any) => (
          <div key={d._id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-3">
            <div className="flex items-start justify-between gap-2">

              {/* Left */}
              <div className="flex items-center gap-2.5 min-w-0">
                {d.business_logo ? (
                  <img src={d.business_logo} className="w-10 h-10 rounded-xl object-cover border border-gray-200 flex-shrink-0" alt={d.name} />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center text-xs text-gray-400 font-semibold">
                    {d.name?.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{d.name}</p>
                  <p className="text-xs text-gray-500 truncate">{d.email}</p>
                  <p className="text-xs text-gray-400">{d.phone_number}</p>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`px-2 py-0.5 text-xs rounded-lg font-medium capitalize ${statusCls(d.status)}`}>{d.status}</span>
                {(user?.user_type === "admin" || user?.user_type === "salesman") && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition"><MoreVertical size={14} /></button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDealer(d._id)}>View Details</DropdownMenuItem>
                      {user?.user_type === "salesman" && (
                        <>
                          {String(d?.assigned_to?._id) === String(user?._id) && <DropdownMenuItem onClick={() => onEdit(d)}>Edit</DropdownMenuItem>}
                          {String(d?.assigned_to?._id) === String(user?._id) && d.status !== "approved" && <DropdownMenuItem onClick={() => handleAction(d, "delete")} className="text-red-600">Delete</DropdownMenuItem>}
                        </>
                      )}
                      {user?.user_type === "admin" && (
                        <>
                          {(d.status === "pending" || d.status === "unapproved") && (<><DropdownMenuItem onClick={() => handleAction(d, "approve")} className="text-green-500">Approve</DropdownMenuItem><DropdownMenuItem onClick={() => handleAction(d, "reject")} className="text-red-500">Reject</DropdownMenuItem></>)}
                          {d.status === "approved" && <DropdownMenuItem onClick={() => handleAction(d, "unapprove")} className="text-yellow-500">Unapprove</DropdownMenuItem>}
                          <DropdownMenuItem onClick={() => handleAction(d, "delete")} className="text-red-600">Delete</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction(d, "reassign")}>Reassign</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(d)}>Edit</DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-400">Salesman: <span className="text-gray-600 font-medium">{d?.assigned_to?.name || "—"}</span></span>
            </div>
          </div>
        ))}

        {dealers.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">No dealers found</div>
        )}
        <p className="text-xs text-gray-400 text-center pt-1">
          Total: <span className="font-medium text-gray-600">{dealers.length}</span>
        </p>
      </div>

      {/* ── VIEW MODAL ── */}
      {(viewDealer || viewLoading) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full sm:w-[500px] rounded-t-2xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-xl">

            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-sm font-semibold text-gray-900">{viewDealer?.name || "Dealer Details"}</h2>
              <button onClick={() => setViewDealer(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4 space-y-3">
              {viewLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-0.5">Email</p><p className="font-medium truncate">{viewDealer?.email}</p></div>
                    <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-0.5">Phone</p><p className="font-medium">{viewDealer?.phone_number}</p></div>
                    <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-0.5">Company</p><p className="font-medium">{viewDealer?.company_name}</p></div>
                    <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-0.5">City</p><p className="font-medium">{viewDealer?.city}</p></div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 text-sm">
                    <p className="text-xs text-gray-400 mb-0.5">Assigned To</p>
                    <p className="font-medium">{viewDealer?.assigned_to?.name} <span className="text-gray-400 font-normal">({viewDealer?.assigned_to?.user_type})</span></p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 text-sm">
                    <p className="text-xs text-gray-400 mb-0.5">Created By</p>
                    <p className="font-medium">{viewDealer?.created_by?.name} <span className="text-gray-400 font-normal">({user?.user_type})</span></p>
                  </div>

                  {viewDealer?.status === "rejected" && viewDealer?.rejectReason && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-xs text-red-500 font-medium mb-1">Reject Reason</p>
                      <p className="text-sm text-red-700">{viewDealer.rejectReason}</p>
                    </div>
                  )}

                  {/* History */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Assignment History</p>
                    {viewDealer?.assignment_history?.length ? (
                      viewDealer.assignment_history.map((h: any, i: number) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-3 mb-2 space-y-1.5 text-xs">
                          <div><span className="text-gray-400">Changed By: </span><span className="font-medium">{h.changed_by?.name || "-"}</span></div>
                          <div><span className="text-gray-400">Reassigned: </span><span className="font-medium">{h.from?.name || "None"} → {h.to?.name || "-"}</span></div>
                          {h.note && <div><span className="text-gray-400">Note: </span><span className="font-medium">{h.note}</span></div>}
                          <div><span className="text-gray-400">Date: </span><span className="font-medium">{new Date(h.date).toLocaleString()}</span></div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No assignment history found.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRM MODAL ── */}
      {confirmDealerId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full sm:w-[360px] rounded-t-2xl sm:rounded-2xl shadow-xl">

            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 capitalize">
                {confirmAction === "reassign" ? "Reassign Dealer" : confirmAction === "reject" ? "Reject Dealer" : `Confirm ${confirmAction}`}
              </h3>
              <button onClick={() => { setConfirmDealerId(null); setConfirmAction(null); setRejectReason(""); }} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {confirmAction === "reject" && (
                <div>
                  <label className={labelCls}>Reject Reason <span className="text-red-500">*</span></label>
                  <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Write reason..." rows={3}
                    className={`${inputCls} resize-none`} />
                </div>
              )}

              {confirmAction === "reassign" && (
                <>
                  <div className="bg-gray-50 rounded-xl p-3 text-sm">
                    <p className="text-xs text-gray-400 mb-0.5">Current Salesman</p>
                    <p className="font-medium">{currentDealer?.assigned_to?.name || "None"}</p>
                  </div>
                  <div>
                    <label className={labelCls}>New Salesman <span className="text-red-500">*</span></label>
                    <select value={newSalesmanId} onChange={(e) => setNewSalesmanId(e.target.value)} className={inputCls}>
                      <option value="">Select Salesman</option>
                      {salesmen.map((s: any) => (
                        <option key={s._id} value={s._id}>
                          {s.name}{s._id === currentDealer?.assigned_to?._id ? " (Current)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Reason (Optional)</label>
                    <textarea placeholder="Optional reason..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                      rows={2} className={`${inputCls} resize-none`} />
                  </div>
                </>
              )}

              {confirmAction !== "reject" && confirmAction !== "reassign" && (
                <p className="text-sm text-gray-500">
                  Are you sure you want to <span className="font-medium text-gray-800">{confirmAction}</span> this dealer?
                </p>
              )}
            </div>

            <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
              <button onClick={() => { setConfirmDealerId(null); setConfirmAction(null); setRejectReason(""); }}
                className="flex-1 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleConfirm}
                className={`flex-1 py-2 text-sm rounded-xl text-white font-medium transition
                  ${confirmAction === "approve" ? "bg-green-600 hover:bg-green-700" : confirmAction === "delete" || confirmAction === "reject" ? "bg-red-500 hover:bg-red-600" : "bg-gray-900 hover:bg-gray-700"}`}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}