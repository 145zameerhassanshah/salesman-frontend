
// "use client";

// import { MoreVertical } from "lucide-react";
// import toast from "react-hot-toast";
// import DealerService from "@/app/components/services/dealerService";
// import UserService from "@/app/components/services/userService";
// import { useSelector } from "react-redux";
// import { useState,useEffect } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem
// } from "@/components/ui/dropdown-menu";

// export default function DealersTable({ dealers, refresh, onEdit }: any) {

//   const user = useSelector((state:any)=>state.user.user);
// const [currentDealer, setCurrentDealer] = useState(null);
// const [viewDealer, setViewDealer] = useState<any>(null);
// const [viewLoading, setViewLoading] = useState(false);
//   const [confirmDealerId, setConfirmDealerId] = useState(null);
//   const [confirmAction, setConfirmAction] = useState(null);
//   const [rejectReason, setRejectReason] = useState("");
//   const [salesmen, setSalesmen] = useState([]);
// const [newSalesmanId, setNewSalesmanId] = useState("");

//   /* ================= ACTION TRIGGER ================= */
// const handleAction = (dealer:any, action:any) => {
//   setConfirmDealerId(dealer._id);
//   setConfirmAction(action);
//   setCurrentDealer(dealer);

//   if (action === "reassign") {
//     setNewSalesmanId(dealer?.assigned_to?._id || "");
//   }
// };
// const handleViewDealer = async (id:any) => {
//   setViewLoading(true);
//   try {
//     const res = await DealerService.getDealerById(id);

//     if (!res.success) {
//       return toast.error(res.message || "Failed to load dealer");
//     }

//     setViewDealer(res.dealer);

//   } catch {
//     toast.error("Error loading dealer");
//   } finally {
//     setViewLoading(false);
//   }
// };
// useEffect(() => {
//   const fetchSalesmen = async () => {
//     if (user?.industry) {
//       const res = await UserService.getSalesmen(user.industry);
//       if (res.success) setSalesmen(res.salesmen);
//     }
//   };

//   if (confirmAction === "reassign") fetchSalesmen();
// }, [confirmAction]);
//   /* ================= CONFIRM ================= */
//   const handleConfirm = async () => {
//     let res;

//     if (confirmAction === "approve") {
//       res = await DealerService.updateDealerStatus(confirmDealerId,{status:"approved"});
//     }
// if (confirmAction === "reassign") {
//   if (!newSalesmanId) {
//     return toast.error("Select salesman");
//   }

//   // ✅ ADD HERE (IMPORTANT)
//   if (String(newSalesmanId) === String(currentDealer?.assigned_to?._id)) {
//     return toast.error("Already assigned to this salesman");
//   }

//   res = await DealerService.reassignDealer(
//     confirmDealerId,
//     newSalesmanId,
//     rejectReason
//   );
// }
//  if (confirmAction === "reject") {
//       if (!rejectReason.trim()) {
//         return toast.error("Reason required");
//       }
//       res = await DealerService.updateDealerStatus(confirmDealerId,{
//         status:"rejected",
//         rejectReason
//       });
//     }

//     if (confirmAction === "unapprove") {
//       res = await DealerService.updateDealerStatus(confirmDealerId,{
//         status:"unapproved"
//       });
//     }

//     if (confirmAction === "delete") {
//       res = await DealerService.deleteDealer(confirmDealerId);
//     }

//     if (res?.success) {
//       toast.success(" Success");
//       refresh();
//     } else {
//       toast.error(res?.message || "Failed");
//     }

//     setConfirmDealerId(null);
//     setConfirmAction(null);
//     setRejectReason("");
//   };

//   return (
//     <div className="overflow-x-auto">

//       <table className="w-full text-sm">

//         {/* ================= HEADER ================= */}
//         <thead>
//           <tr className="text-left text-gray-500 border-b">
//             <th className="py-3">Dealer</th>
//             <th>Email</th>
//             <th>Phone</th>
//             <th>Salesman</th>
//             <th>Status</th>
//             <th>Active</th>

// {(user?.user_type === "admin" || user?.user_type === "salesman") && (
//   <th className="text-right">Actions</th>
// )}          </tr>
//         </thead>

//         {/* ================= BODY ================= */}
//         <tbody>
//           {dealers.map((d:any)=>(
//             <tr key={d._id} className="border-b hover:bg-gray-50">

//               {/* NAME */}
//               <td className="py-3 flex items-center gap-2">
//                 {d.business_logo && (
//                   <img
//                     src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${d.business_logo}`}
//                     className="w-10 h-10 rounded-lg object-cover"
//                   />
//                 )}
//                 {d.name}
//               </td>

//               <td>{d.email}</td>
//               <td>{d.phone_number}</td>
//               <td>{d?.assigned_to?.name}</td>

//               {/* STATUS */}
// <td>
//   <div className="flex flex-col gap-1">
//     <span className={`px-2 py-1 rounded text-xs ${
//       d.status === "approved"
//         ? " text-green-600"
//         : d.status === "pending"
//         ? " text-yellow-600"
//         : d.status === "unapproved"
//         ? " text-gray-600"
//         : " text-red-600"
//     }`}>
//       {d.status}
//     </span>

//     {/* ✅ SHOW REJECT REASON */}
//     {d.status === "rejected" && d.rejectReason && (
//       <span className="text-[11px] text-red-500">
//         Reason: {d.rejectReason}
//       </span>
//     )}
//   </div>
// </td>
//               {/* ACTIVE */}
//               <td>
//                 <span className={`px-2 py-1 rounded text-xs ${
//                   d.is_active
//                     ? "text-green-600"
//                     : "bg-gray-70 text-gray-500"
//                 }`}>
//                   {d.is_active ? "Active" : "Inactive"}
//                 </span>
//               </td>

//               {/* ================= ACTIONS ================= */}
// {(user?.user_type === "admin" || user?.user_type === "salesman") && (
//                   <td className="text-right">

//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <button className="p-2 hover:bg-gray-200 rounded">
//                         <MoreVertical size={18} />
//                       </button>
//                     </DropdownMenuTrigger>

// <DropdownMenuContent align="end">

//   {/* ================= EDIT ================= */}
//   {(user?.user_type === "admin" ||
//    (user?.user_type === "salesman" &&
//     String(d?.assigned_to?._id) === String(user?._id))) && (

//     <DropdownMenuItem onClick={()=>onEdit(d)}>
//       Edit
//     </DropdownMenuItem>
//   )}
// <DropdownMenuItem onClick={()=>handleViewDealer(d._id)}>
//   View Details
// </DropdownMenuItem>
//   {/* ================= SALESMAN DELETE ================= */}
//   {user?.user_type === "salesman" &&
//    String(d?.assigned_to?._id) === String(user?._id) &&
//    d.status !== "approved" && (

//     <DropdownMenuItem
// onClick={()=>handleAction(d,"delete")}
//       className="text-red-500"
//     >
//       Delete
//     </DropdownMenuItem>
//   )}

//   {/* ================= ADMIN CONTROLS ================= */}
//   {user?.user_type === "admin" && (
//     <>
//       {(d.status === "pending" || d.status === "rejected" || d.status === "unapproved") && (
//         <DropdownMenuItem onClick={()=>handleAction(d,"approve")}
//         className="text-green-500"
// >
//           Approve
//         </DropdownMenuItem>
//       )}

//       {(d.status === "pending" || d.status === "approved") && (
//         <DropdownMenuItem onClick={()=>handleAction(d,"reject")}
//                 className="text-red-400"
// >
//           Reject
//         </DropdownMenuItem>
//       )}

//       {d.status === "approved" && (
//         <DropdownMenuItem onClick={()=>handleAction(d,"unapprove")}
//                 className="text-yellow-500"
// >
//           Unapprove
//         </DropdownMenuItem>
//       )}
// <DropdownMenuItem onClick={()=>handleAction(d,"reassign")}>
//   Reassign
// </DropdownMenuItem>
//       <DropdownMenuItem
//         onClick={()=>handleAction(d._id,"delete")}
//         className="text-red-500"
//       >
//         Delete
//       </DropdownMenuItem>
//     </>
//   )}

// </DropdownMenuContent>
//                   </DropdownMenu>

//                 </td>
//               )}

//             </tr>
//           ))}
//         </tbody>

//       </table>
// {(viewDealer || viewLoading) && (
//   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

//     <div className="bg-white rounded-2xl w-[500px] max-h-[90vh] overflow-y-auto p-6">

//       {viewLoading ? (
//         <p className="text-center py-10 text-gray-400">Loading...</p>
//       ) : (
//         <>
//           {/* HEADER */}
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">
//               {viewDealer?.name}
//             </h2>
//             <button onClick={()=>setViewDealer(null)}>✕</button>
//           </div>

//           {/* IMAGE */}
//           {viewDealer?.business_logo && (
//             <img
//               src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${viewDealer.business_logo}`}
//               className="w-20 h-20 rounded-lg object-cover mb-4"
//             />
//           )}

//           {/* BASIC INFO */}
//           <div className="grid grid-cols-2 gap-4 text-sm mb-4">

//             <div>
//               <p className="text-gray-400">Email</p>
//               <p>{viewDealer?.email}</p>
//             </div>

//             <div>
//               <p className="text-gray-400">Phone</p>
//               <p>{viewDealer?.phone_number}</p>
//             </div>

//             <div>
//               <p className="text-gray-400">Company</p>
//               <p>{viewDealer?.company_name}</p>
//             </div>

//             <div>
//               <p className="text-gray-400">City</p>
//               <p>{viewDealer?.city}</p>
//             </div>

//           </div>

//           {/* ASSIGNMENT */}
//           <div className="bg-gray-50 p-3 rounded-xl mb-4">
//             <p className="text-xs text-gray-400 mb-1">Assigned To</p>
//             <p className="text-sm font-medium">
//               {viewDealer?.assigned_to?.name}
//             </p>
//           </div>

//           {/* STATUS */}
//           <div className="mb-4">
//             <span className="text-sm font-medium">
//               Status: {viewDealer?.status}
//             </span>
//           </div>

//           {/* REJECT REASON */}
//           {viewDealer?.rejectReason && (
//             <div className="bg-red-50 border border-red-200 p-3 rounded-xl mb-4">
//               <p className="text-xs text-red-600 mb-1">Reject Reason</p>
//               <p className="text-sm">{viewDealer.rejectReason}</p>
//             </div>
//           )}

//           {/* ASSIGNMENT HISTORY 🔥 */}
//           <div>
//             <p className="text-sm font-semibold mb-2">Assignment History</p>

//             <div className="space-y-2 max-h-[200px] overflow-y-auto">
//               {viewDealer?.assignment_history?.map((h:any, i:number)=>(
//                 <div key={i} className="text-xs bg-gray-50 p-2 rounded">
//                   <p>
//                     From: {h.from?.name || "None"} → To: {h.to?.name}
//                   </p>
//                   <p className="text-gray-400">
//                     {new Date(h.date).toLocaleString()}
//                   </p>
//                   <p className="text-blue-500">{h.note}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//         </>
//       )}
//     </div>
//   </div>
// )}
//       {/* ================= CONFIRM MODAL ================= */}
//       {confirmDealerId && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

//           <div className="bg-white p-5 rounded-2xl w-[320px] space-y-4">

//             <h3 className="font-semibold text-lg">Confirm Action</h3>

//             <p className="text-sm text-gray-500">
//               {confirmAction === "approve" && "Approve this dealer?"}
//               {confirmAction === "reject" && "Reject this dealer?"}
//               {confirmAction === "unapprove" && "Unapprove this dealer?"}
//               {confirmAction === "delete" && "Delete permanently?"}
//   {confirmAction === "reassign" && "Select a new salesman"}
//             </p>

//             {/* REJECT INPUT */}
//             {confirmAction === "reject" && (
//               <textarea
//                 placeholder="Enter reason..."
//                 value={rejectReason}
//                 onChange={(e)=>setRejectReason(e.target.value)}
//                 className="w-full border p-2 rounded"
//               />
//             )}
// {/* REASSIGN DROPDOWN */}
// {confirmAction === "reassign" && (
//   <>
//     <div className="text-sm text-gray-600">
//       Current: <b>{currentDealer?.assigned_to?.name || "None"}</b>
//     </div>

//     <select
//       value={newSalesmanId}
//       onChange={(e) => setNewSalesmanId(e.target.value)}
//       className="w-full border p-2 rounded"
//     >
//       <option value="">Select Salesman</option>

//       {salesmen.map((s: any) => (
//         <option key={s._id} value={s._id}>
//           {s.name}
//           {s._id === currentDealer?.assigned_to?._id ? " (Current)" : ""}
//         </option>
//       ))}
//     </select>

//     {/* OPTIONAL REASON */}
//     <textarea
//       placeholder="Optional reason..."
//       value={rejectReason}
//       onChange={(e)=>setRejectReason(e.target.value)}
//       className="w-full border p-2 rounded"
//     />
//   </>
// )}


//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={()=>{
//                   setConfirmDealerId(null);
//                   setConfirmAction(null);
//                 }}
//                 className="px-3 py-1 border rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleConfirm}
// className={`px-3 py-1 text-white rounded ${
//   confirmAction === "approve"
//     ? "bg-green-500"
//     : confirmAction === "reject"
//     ? "bg-red-500"
//     : confirmAction === "unapprove"
//     ? "bg-yellow-500"
//     : confirmAction === "reassign"
//     ? "bg-blue-500"
//     : "bg-red-600"
// }`}              >
//                 Confirm
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// }



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
            <th>Active</th>
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

              <td>
                <span className={`text-xs ${
                  d.is_active ? "text-green-600" : "text-gray-500"
                }`}>
                  {d.is_active ? "Active" : "Inactive"}
                </span>
              </td>

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
                  <p>{viewDealer?.assigned_to?.name}</p>
                </div>

                {/* HISTORY */}
                <div>
                  <p className="font-semibold mb-2">Assignment History</p>
                  {viewDealer?.assignment_history?.map((h:any,i:number)=>(
                    <div key={i} className="text-xs bg-gray-50 p-2 rounded mb-2">
                      <p>
                        {h.changed_by?.name} ({h.changed_by?.role || "user"}) 
                      </p>
                      <p>{h.note}</p>
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