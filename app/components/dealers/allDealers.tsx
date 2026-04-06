"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DealerService from "@/app/components/services/dealerService";
import { useSelector } from "react-redux";

export default function DealersTable({ dealers, refresh, onEdit }: any) {

  const router = useRouter();
const user = useSelector((state:any)=>state.user.user);

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

  return (
    <div className="overflow-x-auto">

      <table className="w-full text-sm">

        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-3">Dealer</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Saleman</th>
            <th>Status</th>
              {user?.user_type !== "salesman" && (

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
src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${d.business_logo}`}                    className="w-10 h-10 rounded-lg object-cover"
                  />

                )}
                {d.name}
              </td>

              <td>{d.email}</td>
              <td>{d.phone_number}</td>
              <td>{d.userId.name}</td>

              <td>
                <span className={`px-2 py-1 rounded text-xs ${
                  d.is_active
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {d.is_active ? "Active" : "Inactive"}
                </span>
              </td>


                {/* <button
                  onClick={()=>router.push(`/dealers/view/${d._id}`)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Eye size={16} />
                </button> */}

                {/* <button
                  onClick={() => onEdit(d)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={()=>handleDelete(d._id)}
                  className="p-1 hover:bg-red-100 rounded text-red-500"
                >
                  <Trash2 size={16} />
                </button> */}
<td className="text-right flex gap-2 justify-end">

  {user?.user_type !== "salesman" && (
    <>
      <button
        onClick={() => onEdit(d)}
        className="p-1 hover:bg-gray-200 rounded"
      >
        <Pencil size={16} />
      </button>

      <button
        onClick={()=>handleDelete(d._id)}
        className="p-1 hover:bg-red-100 rounded text-red-500"
      >
        <Trash2 size={16} />
      </button>
    </>
  )}

</td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}