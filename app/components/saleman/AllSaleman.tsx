"use client";
import Link from "next/link";
import { Search, Plus, SlidersHorizontal, Pencil, Trash2 } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { useSelector } from "react-redux";
import { useMemo, useState } from "react";
import UserService from "@/app/components/services/userService";
import toast from "react-hot-toast";

const statusStyle: any = {
  Active: "bg-green-100 text-green-700",
  Left: "bg-red-100 text-red-600",
};

export default function AllSaleman() {
  const user = useSelector((state: any) => state.user.user);
  const { data, refetch } = useUsers(user?.industry);
  const users = data?.userByIndustry || [];
  const [editItem, setEditItem] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<any>({
    name: "", email: "", password: "", status: "Active", profile_image: null,
  });

  const salesman = useMemo(() => {
    return users.filter((u: any) => u.user_type === "salesman");
  }, [users]);

  const filtered = useMemo(() => {
    if (!search.trim()) return salesman;
    return salesman.filter((s: any) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.phone_number?.includes(search)
    );
  }, [salesman, search]);

  const openEdit = (item: any) => {
    setEditItem(item);
    setForm({
      name: item.name || "", email: item.email || "",
      phone_number: item.phone_number || "", whatsapp_number: item.whatsapp_number || "",
      city: item.city || "", address: item.address || "",
      territory: item.territory || "", designation: item.designation || "",
      status: item.status || "Active", profile_image: null,
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

const handleDelete = async (id: any) => {
  try {
    if (!confirm("Are you sure?")) return;

    const res = await UserService.deleteUser(id);

    if (!res?.success) {
      return toast.error(res?.message || "Delete failed");
    }

    toast.success(res?.message || "Deleted successfully");
    await refetch();
  } catch (err: any) {
    toast.error(err.message || "Delete failed");
  }
};
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, profile_image: file });
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== undefined && form[key] !== "") {
          formData.append(key, form[key]);
        }
      });
      const updateUser = await UserService.updateUser(editItem._id, formData);
      if (!updateUser?.success) return toast.error(updateUser?.message);
      toast.success(updateUser?.message);
      await refetch();
      setEditItem(null);
    } catch (err) {
      console.log(err);
    }
  };

  const inputClass = "w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder-gray-400";
  const labelClass = "text-xs font-medium text-gray-500 mb-1 block";

  return (
    <div className="w-full max-w-7xl mx-auto px-2 py-3 md:px-6 md:py-6 overflow-hidden">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">Salesmen</h1>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Search — hidden on mobile, visible md+ */}
          <div className="relative hidden md:block w-52">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search salesmen..."
              className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            <SlidersHorizontal size={16} className="text-gray-600" />
          </button>

          <Link href="/saleman/add-saleman">
            <button className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-2 rounded-xl text-xs md:text-sm font-medium hover:bg-gray-700 transition cursor-pointer whitespace-nowrap">
              <Plus size={14} />
              <span className="hidden sm:inline">Add Salesman</span>
              <span className="sm:hidden">Add</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Search — mobile only */}
      <div className="relative md:hidden mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search salesmen..."
          className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      {/* ── DESKTOP TABLE ── */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4 text-left font-medium">Salesman</th>
                <th className="py-3 px-4 text-left font-medium">Phone</th>
                <th className="py-3 px-4 text-left font-medium">Email</th>
                <th className="py-3 px-4 text-left font-medium">Designation</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
                <th className="py-3 px-4 text-left font-medium">Joined</th>
                <th className="py-3 px-4 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s: any, i: number) => (
                <tr key={i} className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img src={s?.profile_image || "/profile.png"} className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0" alt={s.name} />
                      <span className="font-medium text-gray-800 truncate max-w-[120px]">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{s.phone_number || "—"}</td>
                  <td className="py-3 px-4 text-gray-600 truncate max-w-[160px]">{s.email}</td>
                  <td className="py-3 px-4 text-gray-600">{s.designation || "N/A"}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 text-xs rounded-lg font-medium ${statusStyle[s?.status]}`}>
                      {s?.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {new Date(s.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  {/* ✅ FIXED: both buttons inline, vertically centered */}
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(s)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                        <Pencil size={14} className="text-gray-600" />
                      </button>
                      <button onClick={() => handleDelete(s._id)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition">
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                    No salesmen found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          Total: <span className="font-medium text-gray-600">{salesman.length}</span> salesmen
        </div>
      </div>

      {/* ── MOBILE CARDS ── */}
      <div className="md:hidden space-y-2">
        {filtered.map((s: any, i: number) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3">
            <div className="flex items-center justify-between gap-2">

              {/* LEFT: avatar + info */}
              <div className="flex items-center gap-2.5 min-w-0">
                <img src={s?.profile_image || "/profile.png"} className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0" alt={s.name} />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{s.name}</p>
                  <p className="text-xs text-gray-500 truncate">{s.email}</p>
                  <p className="text-xs text-gray-400">{s.phone_number || "—"}</p>
                </div>
              </div>

              {/* RIGHT: status + actions */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`px-2 py-0.5 text-xs rounded-lg font-medium ${statusStyle[s?.status]}`}>
                  {s?.status}
                </span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openEdit(s)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                    <Pencil size={13} className="text-gray-600" />
                  </button>
                  <button onClick={() => handleDelete(s._id)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition">
                    <Trash2 size={13} className="text-red-500" />
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom row: designation + date */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">{s.designation || "No designation"}</span>
              <span className="text-xs text-gray-400">{new Date(s.createdAt).toLocaleDateString("en-GB")}</span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">
            No salesmen found
          </div>
        )}

        <p className="text-xs text-gray-400 text-center pt-1">
          Total: <span className="font-medium text-gray-600">{salesman.length}</span> salesmen
        </p>
      </div>

      {/* ── EDIT MODAL ── */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full sm:w-[420px] sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Edit Salesman</h2>
              <button onClick={() => setEditItem(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-4 space-y-3 flex-1">

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <input name="password" type="password" value={form.password || ""} onChange={handleChange} placeholder="Optional" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input name="phone_number" value={form.phone_number || ""} onChange={handleChange} placeholder="Phone" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>WhatsApp</label>
                  <input name="whatsapp_number" value={form.whatsapp_number || ""} onChange={handleChange} placeholder="WhatsApp" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input name="city" value={form.city || ""} onChange={handleChange} placeholder="City" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Territory</label>
                  <input name="territory" value={form.territory || ""} onChange={handleChange} placeholder="Territory" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Designation</label>
                  <input name="designation" value={form.designation || ""} onChange={handleChange} placeholder="Designation" className={inputClass} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Address</label>
                  <input name="address" value={form.address || ""} onChange={handleChange} placeholder="Address" className={inputClass} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                    <option value="Active">Active</option>
                    <option value="Left">Left</option>
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className={labelClass}>Profile Image</label>
                <label className="flex items-center gap-3 cursor-pointer bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 hover:bg-gray-100 transition">
                  <span className="text-xs px-3 py-1 bg-gray-900 text-white rounded-lg whitespace-nowrap">Browse</span>
                  <span className="text-xs text-gray-400 truncate">
                    {form.profile_image ? form.profile_image.name : "No file chosen"}
                  </span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
              <button onClick={() => setEditItem(null)}
                className="flex-1 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleUpdate}
                className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition font-medium">
                Update
              </button>7
            </div>

          </div>
        </div>
      )}

    </div>
  );
}