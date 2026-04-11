


"use client";

import { MoreVertical } from "lucide-react";
import toast from "react-hot-toast";
import DealerService from "@/app/components/services/dealerService";
import UserService from "@/app/components/services/userService";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

export default function DealersTable({ dealers, refresh, onEdit }: any) {

  const user = useSelector((state:any)=>state.user.user);

  const [currentDealer, setCurrentDealer] = useState<any>(null);
  const [viewDealer, setViewDealer] = useState<any>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [confirmDealerId, setConfirmDealerId] = useState<any>(null);
  const [confirmAction, setConfirmAction] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [salesmen, setSalesmen] = useState<any[]>([]);
  const [newSalesmanId, setNewSalesmanId] = useState("");

  /* ================= ACTION ================= */
  const handleAction = (dealer:any, action:any) => {
    setConfirmDealerId(dealer._id);
    setConfirmAction(action);
    setCurrentDealer(dealer);

    if (action === "reassign") {
      setNewSalesmanId(dealer?.assigned_to?._id || "");
    }
  };

  /* ================= VIEW ================= */
  const handleViewDealer = async (id:any) => {
    setViewLoading(true);
    try {
      const res = await DealerService.getDealerById(id);

      if (!res.success) {
        return toast.error(res.message || "Failed to load dealer");
      }

      setViewDealer(res.dealer);

    } catch {
      toast.error("Error loading dealer");
    } finally {
      setViewLoading(false);
    }
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

    if (confirmAction === "approve") {
      res = await DealerService.updateDealerStatus(confirmDealerId,{status:"approved"});
    }

    if (confirmAction === "reject") {
      if (!rejectReason.trim()) {
        return toast.error("Reason required");
      }
      res = await DealerService.updateDealerStatus(confirmDealerId,{
        status:"rejected",
        rejectReason
      });
    }

    if (confirmAction === "unapprove") {
      res = await DealerService.updateDealerStatus(confirmDealerId,{
        status:"unapproved"
      });
    }

    if (confirmAction === "reassign") {
      if (!newSalesmanId) return toast.error("Select salesman");

      if (String(newSalesmanId) === String(currentDealer?.assigned_to?._id)) {
        return toast.error("Already assigned");
      }

      res = await DealerService.reassignDealer(
        confirmDealerId,
        newSalesmanId,
        rejectReason
      );
    }

    if (confirmAction === "delete") {
      res = await DealerService.deleteDealer(confirmDealerId);
    }

    if (res?.success) {
      toast.success("Success");
      refresh();
    } else {
      toast.error(res?.message || "Failed");
    }

    setConfirmDealerId(null);
    setConfirmAction(null);
    setRejectReason("");
  };
  console.log(viewDealer)

  return (
    <div className="overflow-x-auto">

      <table className="w-full text-sm">

        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-3">Dealer</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Salesman</th>
            <th>Status</th>
            {/* <th>Active</th> */}
            {(user?.user_type === "admin" || user?.user_type === "salesman") && (
              <th className="text-right">Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {dealers.map((d:any)=>(
            <tr key={d._id} className="border-b hover:bg-gray-50">

              <td className="py-3 flex items-center gap-2">
                {d.business_logo && (
                  <img
                    src={d.business_logo}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                )}
                {d.name}
              </td>

              <td>{d.email}</td>
              <td>{d.phone_number}</td>
              <td>{d?.assigned_to?.name}</td>

              {/* STATUS */}
              <td>
                <div className="flex flex-col gap-1">
                  <span className={`text-xs ${
                    d.status === "approved" ? "text-green-600"
                    : d.status === "pending" ? "text-yellow-600"
                    : d.status === "unapproved" ? "text-gray-600"
                    : "text-red-600"
                  }`}>
                    {d.status}
                  </span>

                  {d.status === "rejected" && d.rejectReason && (
                    <span className="text-[11px] text-red-500">
                      Reason: {d.rejectReason}
                    </span>
                  )}
                </div>
              </td>

              {/* <td>
                <span className={`text-xs ${
                  d.is_active ? "text-green-600" : "text-gray-500"
                }`}>
                  {d.is_active ? "Active" : "Inactive"}
                </span>
              </td> */}

              {/* ACTIONS */}
              {/* {(user?.user_type === "admin" || user?.user_type === "salesman") && (
                <td className="text-right">

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-gray-200 rounded">
                        <MoreVertical size={18} />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">

                      <DropdownMenuItem onClick={()=>handleViewDealer(d._id)}>
                        View Details
                      </DropdownMenuItem>

                      {(user?.user_type === "admin" ||
                        (user?.user_type === "salesman" &&
                        String(d?.assigned_to?._id) === String(user?._id))) && (
                        <DropdownMenuItem onClick={()=>onEdit(d)}>
                          Edit
                        </DropdownMenuItem>
                      )}

                      {user?.user_type === "admin" && (
                        <>
                          <DropdownMenuItem onClick={()=>handleAction(d,"approve")} className="text-green-500">
                            Approve
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={()=>handleAction(d,"reject")} className="text-red-500">
                            Reject
                          </DropdownMenuItem>

                          {d.status === "approved" && (
                            <DropdownMenuItem onClick={()=>handleAction(d,"unapprove")} className="text-yellow-500">
                              Unapprove
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem onClick={()=>handleAction(d,"reassign")}>
                            Reassign
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={()=>handleAction(d,"delete")} className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}

                    </DropdownMenuContent>
                  </DropdownMenu>

                </td>
              )} */}
              {/* ACTIONS */}
{(user?.user_type === "admin" || user?.user_type === "salesman") && (
  <td className="text-right">

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 hover:bg-gray-200 rounded">
          <MoreVertical size={18} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">

        {/* ALWAYS */}
        <DropdownMenuItem onClick={()=>handleViewDealer(d._id)}>
          View Details
        </DropdownMenuItem>

        {/* ================= SALESMAN ================= */}
        {user?.user_type === "salesman" && (
          <>
            {/* ALWAYS EDIT */}
            <DropdownMenuItem onClick={()=>onEdit(d)}>
              Edit
            </DropdownMenuItem>

            {/* DELETE ONLY BEFORE APPROVAL */}
            {d.status !== "approved" && (
              <DropdownMenuItem
                onClick={()=>handleAction(d,"delete")}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            )}
          </>
        )}

        {/* ================= ADMIN ================= */}
        {user?.user_type === "admin" && (
          <>
            {/* APPROVE / REJECT ONLY BEFORE APPROVAL */}
            {(d.status === "pending" || d.status === "unapproved") && (
              <>
                <DropdownMenuItem
                  onClick={()=>handleAction(d,"approve")}
                  className="text-green-500"
                >
                  Approve
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={()=>handleAction(d,"reject")}
                  className="text-red-500"
                >
                  Reject
                </DropdownMenuItem>
              </>
            )}

            {/* UNAPPROVE ONLY WHEN APPROVED */}
            {d.status === "approved" && (
              <DropdownMenuItem
                onClick={()=>handleAction(d,"unapprove")}
                className="text-yellow-500"
              >
                Unapprove
              </DropdownMenuItem>
            )}

            {/* DELETE ONLY BEFORE APPROVAL */}
            {d.status !== "approved" && (
              <DropdownMenuItem
                onClick={()=>handleAction(d,"delete")}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            )}

            {/* ALWAYS AVAILABLE */}
            <DropdownMenuItem onClick={()=>handleAction(d,"reassign")}>
              Reassign
            </DropdownMenuItem>
          </>
        )}

      </DropdownMenuContent>
    </DropdownMenu>

  </td>
)}

            </tr>
          ))}
        </tbody>

      </table>

      {/* ================= VIEW MODAL ================= */}
      {(viewDealer || viewLoading) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-[500px] max-h-[90vh] overflow-y-auto p-6">

            {viewLoading ? (
              <p className="text-center py-10 text-gray-400">Loading...</p>
            ) : (
              <>
                <div className="flex justify-between mb-4">
                  <h2 className="text-lg font-semibold">{viewDealer?.name}</h2>
                  <button onClick={()=>setViewDealer(null)}>✕</button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div><p className="text-gray-400">Email</p><p>{viewDealer?.email}</p></div>
                  <div><p className="text-gray-400">Phone</p><p>{viewDealer?.phone_number}</p></div>
                  <div><p className="text-gray-400">Company</p><p>{viewDealer?.company_name}</p></div>
                  <div><p className="text-gray-400">City</p><p>{viewDealer?.city}</p></div>
                </div>

<div className="bg-gray-50 p-3 rounded-xl mb-4">
  <p className="text-xs text-gray-400">Assigned To</p>
  <p>
    {viewDealer?.assigned_to?.name} 
    ({viewDealer?.assigned_to?.user_type})
  </p>
</div>

<div className="bg-gray-50 p-3 rounded-xl mb-4">
  <p className="text-xs text-gray-400">Created By</p>
  <p>
    {viewDealer?.created_by?.name} 
    ({user?.user_type})
  </p>
</div>

                {/* HISTORY */}
<div>
  <p className="font-semibold mb-2">Assignment History</p>

  {viewDealer?.assignment_history?.map((h:any,i:number)=>(
    <div key={i} className="text-xs bg-gray-50 p-3 rounded mb-2 space-y-1">

      <p>
        <b>{h.changed_by?.name}</b> ({user?.user_type})
      </p>

      <p>
        {h.from?.name || "None"} → {h.to?.name}
      </p>

      <p className="text-gray-700">
        {h.note}
      </p>

      <p className="text-gray-400">
        {new Date(h.date).toLocaleString()}
      </p>

    </div>
  ))}

</div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= CONFIRM ================= */}
      {confirmDealerId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-5 rounded-2xl w-[320px] space-y-4">

            <h3 className="font-semibold text-lg">Confirm Action</h3>

            {confirmAction === "reject" && (
              <textarea
                value={rejectReason}
                onChange={(e)=>setRejectReason(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Reason..."
              />
            )}

{/* REASSIGN DROPDOWN */}
{confirmAction === "reassign" && (
  <>
    <div className="text-sm text-gray-600">
      Current: <b>{currentDealer?.assigned_to?.name || "None"}</b>
    </div>

    <select
      value={newSalesmanId}
      onChange={(e) => setNewSalesmanId(e.target.value)}
      className="w-full border p-2 rounded"
    >
      <option value="">Select Salesman</option>

      {salesmen.map((s: any) => (
        <option key={s._id} value={s._id}>
          {s.name}
          {s._id === currentDealer?.assigned_to?._id ? " (Current)" : ""}
        </option>
      ))}
    </select>

    {/* OPTIONAL REASON */}
    <textarea
      placeholder="Optional reason..."
      value={rejectReason}
      onChange={(e)=>setRejectReason(e.target.value)}
      className="w-full border p-2 rounded"
    />
  </>
)}
            <div className="flex justify-end gap-2">
              <button onClick={()=>setConfirmDealerId(null)} className="px-3 py-1 border rounded">
                Cancel
              </button>

              <button onClick={handleConfirm} className="px-3 py-1 bg-black text-white rounded">
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}