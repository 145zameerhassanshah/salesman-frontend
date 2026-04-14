"use client";
import Link from "next/link";
import {
  Search,
  Plus,
  SlidersHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { useSelector } from "react-redux";
import { useMemo, useState } from "react";
import UserService from "@/app/components/services/userService";
import toast from "react-hot-toast";

const statusStyle: any = {
  Active: "bg-green-100 text-green-600",
  Left: "bg-red-100 text-red-600",
};

export default function AllSaleman() {
  const user = useSelector((state: any) => state.user.user);
  const { data,refetch } = useUsers(user?.industry);
  const users = data?.userByIndustry || [];
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState<any>({
    name: "",
    email: "",
    password: "",
    status: "Active",
    profile_image: null,
  });

  /* ==============================
     FILTER SALESMAN
  ============================== */
  const salesman = useMemo(() => {
    return users.filter((u: any) => u.user_type === "salesman");
  }, [users]);

  console.log(salesman)
  /* ==============================
     OPEN EDIT
  ============================== */
  const openEdit = (item: any) => {
  setEditItem(item);

  setForm({
    name: item.name || "",
    email: item.email || "",
    phone_number: item.phone_number || "",
    whatsapp_number: item.whatsapp_number || "",
    city: item.city || "",
    address: item.address || "",
    territory: item.territory || "",
    designation: item.designation || "",
    status: item.status || "Active",
    profile_image: null,
  });
};

  /* ==============================
     HANDLE CHANGE
  ============================== */
  const handleChange = (e: any) => {
    const { name, value, type } = e.target;

    setForm({
      ...form,
     [name]: value,
    });
  };
  const handleDelete = async (id) => {
  try {
    
    if (!confirm("Are you sure?")) return;

    const res = await UserService.deleteUser(id);

    if (!res?.success) return toast.error(res?.message);

    toast.success(res?.message);
    await refetch();

  } catch (err) {
    console.log(err);
  }
};

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({
      ...form,
      profile_image: file,
    });
  };

  /* ==============================
     UPDATE API
  ============================== */
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

  return (
    <div className="p-4 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <h1 className="text-3xl font-semibold">Salesmen</h1>

        <div className="flex items-center gap-3 w-full md:w-auto">

          <div className="relative w-full md:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-3 py-2 bg-white border rounded-lg focus:outline-none"
            />
          </div>

          <button className="p-2 bg-white border rounded-lg">
            <SlidersHorizontal size={18} />
          </button>

          <Link href="/saleman/add-saleman">
            <button className="cursor-pointer flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg">
              Add Salesman
              <Plus size={16} />
            </button>
          </Link>

        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">

        <table className="w-full min-w-[850px] text-sm">

         <thead className="text-gray-500 border-b">
  <tr className="text-left">
    <th className="py-3">Saleman Name</th>
    <th>Phone No.</th>
    <th>Email</th>
    <th>Designation</th> 
    <th>Status</th>
    <th>Joined</th>
    <th className="text-center">Action</th>
  </tr>
</thead>

          <tbody>

            {salesman.map((salesman: any, index: any) => {

              return (
               <tr key={index} className="border-b last:border-none">

  <td className="py-4">
    <div className="flex items-center gap-2">
      <img
        src={
          salesman?.profile_image
            // ? `${API_URL}/uploads/${salesman.profile_image}`
            // : "/profile.png"
        }
        className="w-9 h-8 rounded-full"
      />
      {salesman.name}
    </div>
  </td>

  <td>{salesman.phone_number}</td>

  <td>{salesman.email}</td>

  {/* ✅ NEW DESIGNATION */}
  <td>{salesman.designation || "N/A"}</td>

  <td>
    <span
      className={`px-3 py-1 text-xs rounded-md font-medium ${statusStyle[salesman?.status]}`}
    >
      {salesman?.status}
    </span>
  </td>

  <td>
    {new Date(salesman.createdAt).toLocaleDateString("en-GB")}
  </td>

  <td>
    <div className="flex justify-center gap-2">
      <button
        onClick={() => openEdit(salesman)}
        className="p-2 bg-gray-100 rounded-md"
      >
        <Pencil size={16} />
      </button>
    </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                >
                  <Trash2 size={16} /> {/* ✅ ICON */}
                </button>
  </td>

</tr>
              );
            })}

          </tbody>
        </table>

        <div className="mt-6 text-sm text-gray-500">
          Total Salesmen: {salesman.length}
        </div>

      </div>

      {/* ================= EDIT MODAL ================= */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-[400px] max-h-[90vh] flex flex-col">

   <div className="p-4 border-b font-semibold">
      Edit Salesman
    </div>
 <div className="p-4 space-y-4 overflow-y-auto">
  {/* NAME */}
  <input
    name="name"
    value={form.name}
    onChange={handleChange}
    placeholder="Name"
    className="w-full border p-2 rounded"
  />

  {/* EMAIL */}
  <input
    name="email"
    value={form.email}
    onChange={handleChange}
    placeholder="Email"
    className="w-full border p-2 rounded"
  />
  <input
  name="password"
  type="password"
  value={form.password || ""}
  onChange={handleChange}
  placeholder="New Password (optional)"
  className="w-full border p-2 rounded"
/>

  {/* PHONE */}
  <input
    name="phone_number"
    value={form.phone_number || ""}
    onChange={handleChange}
    placeholder="Phone Number"
    className="w-full border p-2 rounded"
  />

  {/* WHATSAPP */}
  <input
    name="whatsapp_number"
    value={form.whatsapp_number || ""}
    onChange={handleChange}
    placeholder="WhatsApp Number"
    className="w-full border p-2 rounded"
  />

  {/* CITY */}
  <input
    name="city"
    value={form.city || ""}
    onChange={handleChange}
    placeholder="City"
    className="w-full border p-2 rounded"
  />

  {/* ADDRESS */}
  <input
    name="address"
    value={form.address || ""}
    onChange={handleChange}
    placeholder="Address"
    className="w-full border p-2 rounded"
  />

  {/* TERRITORY */}
  <input
    name="territory"
    value={form.territory || ""}
    onChange={handleChange}
    placeholder="Territory"
    className="w-full border p-2 rounded"
  />

  {/* DESIGNATION */}
  <input
    name="designation"
    value={form.designation || ""}
    onChange={handleChange}
    placeholder="Designation"
    className="w-full border p-2 rounded"
  />

  {/* IMAGE UPLOAD */}
 <div className="border rounded-lg p-3">

  <label className="block text-sm font-medium mb-2">
    Profile Image
  </label>

  <div className="flex items-center gap-3">

    {/* HIDDEN INPUT */}
    <input
      type="file"
      accept="image/*"
      id="profileUpload"
      onChange={handleImageChange}
      className="hidden"
    />

    {/* BUTTON */}
    <label
      htmlFor="profileUpload"
      className="px-4 py-2 bg-gray-100 border rounded-lg cursor-pointer hover:bg-gray-200 text-sm"
    >
      Browse Image
    </label>

    {/* FILE NAME */}
    <span className="text-sm text-gray-500">
      {form.profile_image ? form.profile_image.name : "No file chosen"}
    </span>

  </div>

  <p className="text-xs text-gray-400 mt-2">
    Supported formats: JPG, PNG
  </p>

</div>

  {/* STATUS */}
  <select
    name="status"
    value={form.status}
    onChange={handleChange}
    className="w-full border p-2 rounded"
  >
    <option value="Active">Active</option>
    <option value="Left">Left</option>
  </select>
  </div>

  {/* ACTIONS */}
  <div className="flex justify-end gap-2 m-2">
    <button
      onClick={() => setEditItem(null)}
      className="px-3 py-1 border rounded"
    >
      Cancel
    </button>

    <button
      onClick={handleUpdate}
      className="px-3 py-1 bg-black text-white rounded"
    >
      Update
    </button>
  </div>

</div>

        </div>
      )}

    </div>
  );
}