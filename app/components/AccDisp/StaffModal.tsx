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
  refetch:()=>Promise<any>;
}) {

    const user=useSelector((state:any)=>state?.user.user)
    console.log(user.industry)
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
  if (!data && !form.password.trim()) return "Password is required";
  if (!data && form.password.length < 6) return "Password must be at least 6 characters";

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
    formData.append("industry",user?.industry)
    formData.append("status", form.status);

    // 👉 only send password if creating
    if (!data && form.password) {
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
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px] space-y-3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold capitalize">
          {data ? "Edit" : "Add"} {role}
        </h2>

        {/* NAME */}
        <input
          className="w-full border p-2 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* EMAIL */}
        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* PHONE */}
        <input
          className="w-full border p-2 rounded"
          placeholder="Phone Number"
          value={form.phone_number}
          onChange={(e) =>
            setForm({ ...form, phone_number: e.target.value })
          }
        />

        {/* WHATSAPP */}
        <input
          className="w-full border p-2 rounded"
          placeholder="Whatsapp Number"
          value={form.whatsapp_number}
          onChange={(e) =>
            setForm({ ...form, whatsapp_number: e.target.value })
          }
        />

        {/* CITY */}
        <input
          className="w-full border p-2 rounded"
          placeholder="City"
          value={form.city}
          onChange={(e) =>
            setForm({ ...form, city: e.target.value })
          }
        />

        {/* ADDRESS */}
        <input
          className="w-full border p-2 rounded"
          placeholder="Address"
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        {/* PASSWORD */}
        {!data && (
          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        )}

        {/* STATUS */}
        <select
          className="w-full border p-2 rounded"
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option value="Active">Active</option>
          <option value="Left">Left</option>
        </select>

        {/* IMAGE */}
        <input
          type="file"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

        <button
  onClick={handleSubmit}   // ✅ HERE
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