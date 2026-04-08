// "use client";

// import { Eye, Pencil, Trash2 } from "lucide-react";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import DealerService from "@/app/components/services/dealerService";
// import { useSelector } from "react-redux";

// export default function DealersTable({ dealers, refresh, onEdit }: any) {

//   const router = useRouter();
// const user = useSelector((state:any)=>state.user.user);

//   const handleDelete = async (id:string)=>{
//     if(!confirm("Delete this dealer?")) return;

//     const res = await DealerService.deleteDealer(id);

//     if(!res.success){
//       toast.error(res.message);
//       return;
//     }

//     toast.success("Dealer deleted");
//     refresh();
//   };

//   return (
//     <div className="overflow-x-auto">

//       <table className="w-full text-sm">

//         <thead>
//           <tr className="text-left text-gray-500 border-b">
//             <th className="py-3">Dealer</th>
//             <th>Email</th>
//             <th>Phone</th>
//             <th>Saleman</th>
//             <th>Status</th>
//               {user?.user_type !== "salesman" && (

//             <th className="text-right">Actions</th>
                
//   )}

//           </tr>
//         </thead>

//         <tbody>
//           {dealers.map((d:any)=>(
//             <tr key={d._id} className="border-b hover:bg-gray-50">

//               {/* NAME + IMAGE */}
//               <td className="py-3 flex items-center gap-2">
//                 {d.business_logo && (
//                   <img
// src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${d.business_logo}`}                    className="w-10 h-10 rounded-lg object-cover"
//                   />

//                 )}
//                 {d.name}
//               </td>

//               <td>{d.email}</td>
//               <td>{d.phone_number}</td>
//               <td>{d.userId.name}</td>

// <td>{d?.created_by?.name}</td>
// <td>{d?.assigned_to?.name}</td>
// <td>{d?.status}</td>
//               <td>
//                 <span className={`px-2 py-1 rounded text-xs ${
//                   d.is_active
//                     ? "bg-green-100 text-green-600"
//                     : "bg-gray-200 text-gray-500"
//                 }`}>
//                   {d.is_active ? "Active" : "Inactive"}
//                 </span>
//               </td>


//                 {/* <button
//                   onClick={()=>router.push(`/dealers/view/${d._id}`)}
//                   className="p-1 hover:bg-gray-200 rounded"
//                 >
//                   <Eye size={16} />
//                 </button> */}

//                 {/* <button
//                   onClick={() => onEdit(d)}
//                   className="p-1 hover:bg-gray-200 rounded"
//                 >
//                   <Pencil size={16} />
//                 </button>

//                 <button
//                   onClick={()=>handleDelete(d._id)}
//                   className="p-1 hover:bg-red-100 rounded text-red-500"
//                 >
//                   <Trash2 size={16} />
//                 </button> */}
// <td className="text-right flex gap-2 justify-end">

//   {user?.user_type !== "salesman" && (
//     <>
//       <button
//         onClick={() => onEdit(d)}
//         className="p-1 hover:bg-gray-200 rounded"
//       >
//         <Pencil size={16} />
//       </button>

//       <button
//         onClick={()=>handleDelete(d._id)}
//         className="p-1 hover:bg-red-100 rounded text-red-500"
//       >
//         <Trash2 size={16} />
//       </button>
//     </>
//   )}

// </td>

//             </tr>
//           ))}
//         </tbody>

//       </table>

//     </div>
//   );
// }




"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DealerService from "@/app/components/services/dealerService";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function DealersTable({ dealers, refresh, onEdit }: any) {

  const router = useRouter();
  const user = useSelector((state:any)=>state.user.user);

  const [rejectDealer, setRejectDealer] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleDelete = async (id:string)=>{
    if(!confirm("Delete this dealer?")) return;

    const res = await DealerService.deleteDealer(id);

    if(!res.success){
      toast.error(res.message);
      return;
    }

    toast.success("Dealer deleted");
    refresh();
  };

  const handleApprove = async (id:string)=>{
    const res = await DealerService.updateDealerStatus(id,{
      status:"approved"
    });

    if(res.success){
      toast.success("Approved");
      refresh();
    }
  };

  const handleReject = async ()=>{
    if(!rejectReason){
      toast.error("Reason required");
      return;
    }

    const res = await DealerService.updateDealerStatus(
      rejectDealer._id,
      {
        status:"rejected",
        rejectReason
      }
    );

    if(res.success){
      toast.success("Rejected");
      setRejectDealer(null);
      setRejectReason("");
      refresh();
    }
  };

  const handleUnapprove = async (id:string)=>{
    const res = await DealerService.unapproveDealer(id);

    if(res.success){
      toast.success("Unapproved");
      refresh();
    }
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

            {user?.user_type  === "admin" && (
              <th className="text-right">Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {dealers.map((d:any)=>(
            <tr key={d._id} className="border-b hover:bg-gray-50">

              {/* NAME + IMAGE */}
              <td className="py-3 flex items-center gap-2">
                {d.business_logo && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${d.business_logo}`}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                )}
                {d.name}
              </td>

              <td>{d.email}</td>
              <td>{d.phone_number}</td>

              {/* ✅ CORRECT */}
              <td>{d?.assigned_to?.name}</td>

              {/* ✅ STATUS BADGE */}
              <td>
                <span className={`px-2 py-1 rounded text-xs ${
                  d.status === "approved"
                    ? "bg-green-100 text-green-600"
                    : d.status === "pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
                }`}>
                  {d.status}
                </span>
              </td>

              {/* ACTIVE */}
              <td>
                <span className={`px-2 py-1 rounded text-xs ${
                  d.is_active
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {d.is_active ? "Active" : "Inactive"}
                </span>
              </td>

              {/* ACTIONS */}
              {user?.user_type  === "admin" && (
                <td className="text-right flex gap-2 justify-end flex-wrap">

                  {/* EDIT */}
                  <button
                    onClick={() => onEdit(d)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Pencil size={16} />
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={()=>handleDelete(d._id)}
                    className="p-1 hover:bg-red-100 rounded text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* APPROVE */}
                  {d.status === "pending" && (
                    <button
                      onClick={()=>handleApprove(d._id)}
                      className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                    >
                      Approve
                    </button>
                  )}

                  {/* REJECT */}
                  {d.status === "pending" && (
                    <button
                      onClick={()=>setRejectDealer(d)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                    >
                      Reject
                    </button>
                  )}

                  {/* UNAPPROVE */}
                  {d.status === "approved" && (
                    <button
                      onClick={()=>handleUnapprove(d._id)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded text-xs"
                    >
                      Unapprove
                    </button>
                  )}

                </td>
              )}

            </tr>
          ))}
        </tbody>

      </table>

      {/* ❌ REJECT MODAL */}
      {rejectDealer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded-xl w-[300px] space-y-3">

            <h3 className="font-semibold">Reject Dealer</h3>

            <textarea
              placeholder="Enter reason..."
              value={rejectReason}
              onChange={(e)=>setRejectReason(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-end gap-2">
              <button onClick={()=>setRejectDealer(null)}>Cancel</button>
              <button
                onClick={handleReject}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}