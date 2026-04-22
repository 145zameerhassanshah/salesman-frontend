import { Pencil, Trash2 } from "lucide-react";
import UserService from "@/app/components/services/userService";
import toast from "react-hot-toast";
import { useUsers } from "@/hooks/useUsers";
import { useSelector } from "react-redux";

export default function StaffTable({
  data,
  onEdit,
  refetch, // ✅ add this if needed
}: {
  data: any[];
  onEdit: (item: any) => void;
  refetch: () => void;
}) {
  const user = useSelector((state: any) => state.user.user);
  // ✅ FUNCTION YAHAN LIKHNA HAI
const handleDelete = async (id) => {
  try {
    if (!confirm("Are you sure?")) return;

    const res = await UserService.deleteUser(id);

    if (!res?.success) return toast.error(res?.message);

    toast.success(res?.message);


  } catch (err: any) {
    toast.error(err.message || "Delete failed");
  }
};
  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-left">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="p-3">Profile</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Status</th>
            <th className="p-3">Joined</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item._id} className="border-t">
              <td className="p-3">
                <img
                  src={item?.image} // ✅ fix
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>

              <td className="p-3">{item.name}</td>
              <td className="p-3">{item.email}</td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    item.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {item.status}
                </span>
              </td>

<td className="p-3">
  {item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-GB")
    : "-"}
</td>
              <td className="p-3 flex items-center gap-2">

                {/* EDIT */}
                <button
                  onClick={() => onEdit(item)}
                  className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  <Pencil size={16} />
                </button>

                {/* DELETE ICON */}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                >
                  <Trash2 size={16} /> {/* ✅ ICON */}
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}