"use client";

import { useEffect, useState } from "react";
import AuthService from "@/app/components/services/authService";
import toast from "react-hot-toast";
import UserService from "@/app/components/services/userService";
import { useSelector } from "react-redux";

export default function StaffModal({
  data,
  role,
  onClose,
  onSave,
  refetch,
}: {
  data: any;
  role: string;
  onClose: () => void;
  onSave: (data: any) => void;
  refetch: () => Promise<any>;
}) {
  const user = useSelector((state: any) => state?.user.user);
  console.log(user.industry);
  const [form, setForm] = useState({
    name: "",
    email: "",

    phone_number: "",
    whatsapp_number: "",
    city: "",
    address: "",
    password: "",
    status: "Active",
    profile_image: null,
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.name.trim()) return "Name is required";

    if (!form.email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email";

    if (!form.phone_number.trim()) return "Phone number is required";
    if (!form.whatsapp_number.trim()) return "WhatsApp number is required";

    if (!form.city.trim()) return "City is required";
    if (!form.address.trim()) return "Address is required";

    // 👉 Only for CREATE (not edit)
// CREATE
if (!data && !form.password.trim())
  return "Password is required";

// EDIT (optional but validate if entered)
if (data && form.password && form.password.length < 6)
  return "Password must be at least 6 characters";      
    if (!data && form.password.length < 6)
      return "Password must be at least 6 characters";

    return null;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    const error = validate();

    if (error) {
      toast.error(error);
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone_number", form.phone_number);
      formData.append("whatsapp_number", form.whatsapp_number);
      formData.append("city", form.city);
      formData.append("address", form.address);
      formData.append("industry", user?.industry);
      formData.append("status", form.status);

      // 👉 only send password if creating
// 👉 CREATE case
if (!data) {
  formData.append("password", form.password);
}

// 👉 EDIT case (only if user entered)
if (data && form.password) {
  formData.append("password", form.password);
}
      if (file) {
        formData.append("profile_image", file);
      }

      let res;

      if (data?._id || data?.id) {
        const userId = data._id || data.id;
        res = await UserService.updateUser(userId, formData);
      } else {
        formData.append("user_type", role);
        res = await UserService.createTeamMember(formData);
      }

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      await refetch();
      onSave(res.updatedUser || form);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        profile_image: data.profile_image || null,
        password: "", // never prefill password
      });
    }
  }, [data]);
  const isEdit = !!data;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px] space-y-3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold capitalize">
          {data ? "Edit" : "Add"} {role}
        </h2>

        <label className="text-sm text-gray-500">
          Full Name{!isEdit && <span className="text-red-500">*</span>}
        </label>
        <input
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label className="text-sm text-gray-500">
          Email{!isEdit && <span className="text-red-500">*</span>}
        </label>
        <input
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label className="text-sm text-gray-500">
          Phone No{!isEdit && <span className="text-red-500">*</span>}
        </label>
        <input
          className="w-full border p-2 rounded"
          value={form.phone_number}
          onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
        />

        <label className="text-sm text-gray-500">
          Whatsapp No{!isEdit && <span className="text-red-500">*</span>}
        </label>
        <input
          className="w-full border p-2 rounded"
          value={form.whatsapp_number}
          onChange={(e) =>
            setForm({ ...form, whatsapp_number: e.target.value })
          }
        />

        <label className="text-sm text-gray-500">
          City{!isEdit && <span className="text-red-500">*</span>}
        </label>
        <input
          className="w-full border p-2 rounded"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />

        <label className="text-sm text-gray-500">
          Address{!isEdit && <span className="text-red-500">*</span>}
        </label>
        <input
          className="w-full border p-2 rounded"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        {/* PASSWORD */}
<label className="text-sm text-gray-500">
  {isEdit ? "New Password (optional)" : "Password"}
  {!isEdit && <span className="text-red-500">*</span>}
</label>

<input
  type="password"
  className="w-full border p-2 rounded"
  value={form.password}
  onChange={(e) => setForm({ ...form, password: e.target.value })}
  placeholder={isEdit ? "Leave empty to keep current password" : ""}
/>
        <label className="text-sm text-gray-500">Status</label>
        <select
          className="w-full border p-2 rounded"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Active">Active</option>
          <option value="Left">Left</option>
        </select>

        {/* IMAGE */}
        <label className="text-sm text-gray-500">Profile Image</label>
       {!isEdit && <span className="text-red-500">*</span>}
        <div className="border rounded-lg p-3">
          <div className="flex items-center gap-3">
            {/* HIDDEN INPUT */}
            <input
              type="file"
              accept="image/*"
              id="profileUpload"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
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
              {file ? file.name : "No file chosen"}
            </span>
          </div>

          <p className="text-xs text-gray-400 mt-2">JPG, PNG (Max 2MB)</p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit} // ✅ HERE
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
