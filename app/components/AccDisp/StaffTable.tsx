import { Pencil, Trash2, X } from "lucide-react";
import UserService from "@/app/components/services/userService";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function StaffTable({
  data,
  onEdit,
  refetch,
}: {
  data: any[];
  onEdit: (item: any) => void;
  refetch: () => void;
}) {
  const user = useSelector((state: any) => state.user.user);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      const res = await UserService.deleteUser(confirmId);
      if (!res?.success) return toast.error(res?.message);
      toast.success(res?.message);
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setConfirmId(null);
    }
  };

  const statusCls = (status: string) =>
    status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600";

  return (
    <div className="w-full overflow-hidden">

      {/* ── CONFIRM MODAL ── */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-sm">
            {/* Icon */}
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-50 mx-auto mb-3">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 text-center mb-1">Delete Record</h2>
            <p className="text-sm text-gray-500 text-center mb-5">
              Are you sure you want to delete this record? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DESKTOP TABLE ── */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4 text-left font-medium">Profile</th>
              <th className="py-3 px-4 text-left font-medium">Name</th>
              <th className="py-3 px-4 text-left font-medium">Email</th>
              <th className="py-3 px-4 text-left font-medium">Status</th>
              <th className="py-3 px-4 text-left font-medium">Joined</th>
              <th className="py-3 px-4 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id} className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition">
                <td className="py-3 px-4">
                  <img src={item?.image || "/profile.png"} className="w-8 h-8 rounded-full object-cover border border-gray-200" alt={item.name} />
                </td>
                <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
                <td className="py-3 px-4 text-gray-500 truncate max-w-[180px]">{item.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusCls(item.status)}`}>{item.status}</span>
                </td>
                <td className="py-3 px-4 text-gray-400 text-xs">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB") : item.joined || "-"}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => onEdit(item)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                      <Pencil size={14} className="text-gray-600" />
                    </button>
                    <button onClick={() => setConfirmId(item._id)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition">
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">No records found</td></tr>
            )}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          Total: <span className="font-medium text-gray-600">{data.length}</span>
        </div>
      </div>

      {/* ── MOBILE CARDS ── */}
      <div className="md:hidden space-y-2">
        {data.map((item) => (
          <div key={item._id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img src={item?.image || "/profile.png"} className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0" alt={item.name} />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 truncate">{item.email}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`px-2 py-0.5 text-xs rounded-lg font-medium ${statusCls(item.status)}`}>{item.status}</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => onEdit(item)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                    <Pencil size={13} className="text-gray-600" />
                  </button>
                  <button onClick={() => setConfirmId(item._id)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition">
                    <Trash2 size={13} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-2 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                Joined: {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB") : item.joined || "-"}
              </span>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">No records found</div>
        )}
        <p className="text-xs text-gray-400 text-center pt-1">
          Total: <span className="font-medium text-gray-600">{data.length}</span>
        </p>
      </div>

    </div>
  );
}