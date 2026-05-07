// import { Pencil, Trash2, X } from "lucide-react";
// import UserService from "@/app/components/services/userService";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import { useState } from "react";

// export default function StaffTable({
//   data,
//   onEdit,
//   refetch,
// }: {
//   data: any[];
//   onEdit: (item: any) => void;
//   refetch: () => void;
// }) {
//   const user = useSelector((state: any) => state.user.user);
//   const [confirmId, setConfirmId] = useState<string | null>(null);

//   const handleDelete = async () => {
//     if (!confirmId) return;
//     try {
//       const res = await UserService.deleteUser(confirmId);
//       if (!res?.success) return toast.error(res?.message);
//       toast.success(res?.message);
//       refetch();
//     } catch (err: any) {
//       toast.error(err.message || "Delete failed");
//     } finally {
//       setConfirmId(null);
//     }
//   };

//   const statusCls = (status: string) =>
//     status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600";

//   return (
//     <div className="w-full overflow-hidden">

//       {/* ── CONFIRM MODAL ── */}
//       {confirmId && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
//           <div className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-sm">
//             {/* Icon */}
//             <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-50 mx-auto mb-3">
//               <Trash2 size={20} className="text-red-500" />
//             </div>
//             <h2 className="text-base font-semibold text-gray-900 text-center mb-1">Delete Record</h2>
//             <p className="text-sm text-gray-500 text-center mb-5">
//               Are you sure you want to delete this record? This action cannot be undone.
//             </p>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setConfirmId(null)}
//                 className="flex-1 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="flex-1 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium">
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── DESKTOP TABLE ── */}
//       <div className="hidden md:block bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
//               <th className="py-3 px-4 text-left font-medium">Profile</th>
//               <th className="py-3 px-4 text-left font-medium">Name</th>
//               <th className="py-3 px-4 text-left font-medium">Email</th>
//               <th className="py-3 px-4 text-left font-medium">Status</th>
//               <th className="py-3 px-4 text-left font-medium">Joined</th>
//               <th className="py-3 px-4 text-center font-medium">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item) => (
//               <tr key={item._id} className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition">
//                 <td className="py-3 px-4">
//                   <img src={item?.image || "/profile.png"} className="w-8 h-8 rounded-full object-cover border border-gray-200" alt={item.name} />
//                 </td>
//                 <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
//                 <td className="py-3 px-4 text-gray-500 truncate max-w-[180px]">{item.email}</td>
//                 <td className="py-3 px-4">
//                   <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusCls(item.status)}`}>{item.status}</span>
//                 </td>
//                 <td className="py-3 px-4 text-gray-400 text-xs">
//                   {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB") : item.joined || "-"}
//                 </td>
//                 <td className="py-3 px-4">
//                   <div className="flex items-center justify-center gap-2">
//                     <button onClick={() => onEdit(item)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
//                       <Pencil size={14} className="text-gray-600" />
//                     </button>
//                     <button onClick={() => setConfirmId(item._id)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition">
//                       <Trash2 size={14} className="text-red-500" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//             {data.length === 0 && (
//               <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">No records found</td></tr>
//             )}
//           </tbody>
//         </table>
//         <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
//           Total: <span className="font-medium text-gray-600">{data.length}</span>
//         </div>
//       </div>

//       {/* ── MOBILE CARDS ── */}
//       <div className="md:hidden space-y-2">
//         {data.map((item) => (
//           <div key={item._id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-3">
//             <div className="flex items-center justify-between gap-2">
//               <div className="flex items-center gap-2.5 min-w-0">
//                 <img src={item?.image || "/profile.png"} className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0" alt={item.name} />
//                 <div className="min-w-0">
//                   <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
//                   <p className="text-xs text-gray-500 truncate">{item.email}</p>
//                 </div>
//               </div>
//               <div className="flex flex-col items-end gap-2 flex-shrink-0">
//                 <span className={`px-2 py-0.5 text-xs rounded-lg font-medium ${statusCls(item.status)}`}>{item.status}</span>
//                 <div className="flex items-center gap-1.5">
//                   <button onClick={() => onEdit(item)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
//                     <Pencil size={13} className="text-gray-600" />
//                   </button>
//                   <button onClick={() => setConfirmId(item._id)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition">
//                     <Trash2 size={13} className="text-red-500" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-end mt-2 pt-2 border-t border-gray-100">
//               <span className="text-xs text-gray-400">
//                 Joined: {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB") : item.joined || "-"}
//               </span>
//             </div>
//           </div>
//         ))}
//         {data.length === 0 && (
//           <div className="py-12 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">No records found</div>
//         )}
//         <p className="text-xs text-gray-400 text-center pt-1">
//           Total: <span className="font-medium text-gray-600">{data.length}</span>
//         </p>
//       </div>

//     </div>
//   );
// }


import { Eye, Pencil, Trash2, X, Loader2 } from "lucide-react";
import UserService from "@/app/components/services/authService";
import toast from "react-hot-toast";
import { useState } from "react";

export default function StaffTable({
  data,
  onEdit,
  refetch,
  listLoading = false,
}: {
  data: any[];
  onEdit: (item: any) => void;
  refetch: () => void;
  listLoading?: boolean;
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const [activityUser, setActivityUser] = useState<any>(null);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirmId) return;

    try {
      const res = await UserService.deleteUser(confirmId);

      if (!res?.success) {
        toast.error(res?.message || "Delete failed");
        return;
      }

      toast.success(res?.message || "User deleted");
      setConfirmId(null);
      await refetch();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const openActivity = async (item: any) => {
    setActivityUser(item);
    setActivityLogs([]);
    setActivityLoading(true);

    try {
      const res = await UserService.getUserAuditLogs(item._id, 1, 20);

      if (res?.success) {
        setActivityLogs(res?.data || []);
      } else {
        setActivityLogs([]);
      }
    } catch {
      toast.error("Failed to load activity");
      setActivityLogs([]);
    } finally {
      setActivityLoading(false);
    }
  };

  const statusCls = (status: string) =>
    status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-600";

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "-";

    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
      return new Date(value).toLocaleDateString("en-GB");
    }

    if (typeof value === "object") {
      if (value?.name) return value.name;
      if (value?.businessName) return value.businessName;
      return "-";
    }

    return String(value);
  };

  const hiddenAuditFields = [
    "_id",
    "__v",
    "password",
    "industry",
    "resetPasswordToken",
    "resetPasswordExpiry",
    "otp",
    "otpExpiry",
    "createdAt",
    "updatedAt",
  ];

  return (
    <div className="w-full overflow-hidden">
      {activityUser && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  User Activity
                </h2>
                <p className="text-xs text-gray-400">
                  {activityUser?.name || "-"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActivityUser(null);
                  setActivityLogs([]);
                }}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4 space-y-2">
              {activityLoading ? (
                <div className="py-10 flex items-center justify-center gap-2 text-sm text-gray-400">
                  <Loader2 size={16} className="animate-spin" />
                  Loading activity...
                </div>
              ) : activityLogs.length === 0 ? (
                <div className="py-10 text-center text-gray-400 text-sm">
                  No activity found
                </div>
              ) : (
                activityLogs.map((log: any, i: number) => (
                  <div
                    key={log?._id || i}
                    className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-gray-700">
                        {String(log.action || "").replaceAll("_", " ")}
                      </p>

                      <p className="text-gray-400">
                        {log.createdAt
                          ? new Date(log.createdAt).toLocaleString()
                          : "-"}
                      </p>
                    </div>

                    <p className="text-gray-500 mt-1">
                      {log.description || "Action performed"}
                    </p>

                    {log.changes && Object.keys(log.changes).length > 0 && (
                      <div className="mt-2 space-y-1">
                        {Object.entries(log.changes)
                          .filter(([field]) => !hiddenAuditFields.includes(field))
                          .slice(0, 8)
                          .map(([field, value]: any) => (
                            <p key={field} className="text-gray-500">
                              <span className="font-medium">
                                {String(field).replaceAll("_", " ")}
                              </span>
                              : {formatValue(value?.from)} →{" "}
                              {formatValue(value?.to)}
                            </p>
                          ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-sm">
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-50 mx-auto mb-3">
              <Trash2 size={20} className="text-red-500" />
            </div>

            <h2 className="text-base font-semibold text-gray-900 text-center mb-1">
              Delete Record
            </h2>

            <p className="text-sm text-gray-500 text-center mb-5">
              Are you sure you want to delete this record?
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="flex-1 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:block bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden relative">
        {listLoading && data.length > 0 && (
          <div className="absolute right-4 top-3 z-10 flex items-center gap-1 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-lg">
            <Loader2 size={12} className="animate-spin" />
            Updating...
          </div>
        )}

        <table className={`w-full text-sm ${listLoading && data.length > 0 ? "opacity-60" : ""}`}>
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4 text-left font-medium">Profile</th>
              <th className="py-3 px-4 text-left font-medium">Name</th>
              <th className="py-3 px-4 text-left font-medium">Email</th>
              <th className="py-3 px-4 text-left font-medium">Phone</th>
              <th className="py-3 px-4 text-left font-medium">Designation</th>
              <th className="py-3 px-4 text-left font-medium">Status</th>
              <th className="py-3 px-4 text-left font-medium">Joined</th>
              <th className="py-3 px-4 text-center font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={item._id}
                className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4">
                  <img
                    src={item?.profile_image || item?.image || "/profile.png"}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    alt={item.name}
                  />
                </td>

                <td className="py-3 px-4 font-medium text-gray-800">
                  {item.name}
                </td>

                <td className="py-3 px-4 text-gray-500 truncate max-w-[180px]">
                  {item.email}
                </td>

                <td className="py-3 px-4 text-gray-500">
                  {item.phone_number || "-"}
                </td>

                <td className="py-3 px-4 text-gray-500">
                  {item.designation || "-"}
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusCls(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="py-3 px-4 text-gray-400 text-xs">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-GB")
                    : item.joined || "-"}
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => openActivity(item)}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                      <Eye size={14} className="text-gray-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                    >
                      <Pencil size={14} className="text-blue-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfirmId(item._id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-gray-400 text-sm"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-2">
        {data.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={item?.profile_image || item?.image || "/profile.png"}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                  alt={item.name}
                />

                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {item.email}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.phone_number || "-"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span
                  className={`px-2 py-0.5 text-xs rounded-lg font-medium ${statusCls(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openActivity(item)}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                  >
                    <Eye size={13} className="text-gray-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                  >
                    <Pencil size={13} className="text-blue-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmId(item._id)}
                    className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition"
                  >
                    <Trash2 size={13} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-2 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                {item.designation || "No designation"}
              </span>

              <span className="text-xs text-gray-400">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-GB")
                  : item.joined || "-"}
              </span>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">
            No records found
          </div>
        )}
      </div>
    </div>
  );
}