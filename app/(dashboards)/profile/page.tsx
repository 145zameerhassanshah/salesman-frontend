"use client";

import { useState, useEffect } from "react";
import UserService from "@/app/components/services/userService";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";

export default function ProfilePage() {
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  // ✅ role check
  const isAdmin =
    user?.user_type === "admin" ||
    user?.user_type === "super_admin";

  /* ================= STATE ================= */
  const [form, setForm] = useState<any>({
    name: "",
    email: "",
    password: "",
    profile_image: null,
    address: "",
    city: "",
    phone_number: "",
    whatsapp_number: "",
  });

  /* ================= SYNC ================= */
  useEffect(() => {
    if (user && typeof user === "object") {
      setForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
        profile_image: null,
        address: user.address || "",
        city: user.city || "",
        phone_number: user.phone_number || "",
        whatsapp_number: user.whatsapp_number || "",
      });
    }
  }, [user]);

  /* ================= CHANGE ================= */
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= IMAGE ================= */
  const handleImage = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm({
      ...form,
      profile_image: file,
    });
  };

  /* ================= PREVIEW ================= */
  const preview = form.profile_image
    ? URL.createObjectURL(form.profile_image)
    : user?.profile_image || "/default-avatar.png";

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      if (isAdmin) {
        // ✅ FULL ACCESS

        if (form.name) formData.append("name", form.name);
        if (form.email) formData.append("email", form.email);

        // 🔐 only if password entered
        if (form.password?.trim() !== "") {
          formData.append("password", form.password);
        }

        if (form.address) formData.append("address", form.address);
        if (form.city) formData.append("city", form.city);
        if (form.phone_number)
          formData.append("phone_number", form.phone_number);
        if (form.whatsapp_number)
          formData.append("whatsapp_number", form.whatsapp_number);

        if (form.profile_image) {
          formData.append("profile_image", form.profile_image);
        }
      } else {
        // ✅ SALESMAN → ONLY IMAGE
        if (!form.profile_image) {
          return toast.error("Only profile image allowed");
        }
        formData.append("profile_image", form.profile_image);
      }

      const res = await UserService.updateUser(user._id, formData);

      if (!res?.success) return toast.error(res?.message);

      toast.success(res.message);

      dispatch(setUser(res.updatedUser));

    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow">

      <h1 className="text-xl font-semibold mb-4">My Profile</h1>

      {/* IMAGE */}
      <div className="flex flex-col items-center gap-3 mb-4">
        <img
          src={preview}
          className="w-24 h-24 rounded-full object-cover border"
        />
        <input type="file" onChange={handleImage} />
      </div>

      {/* ADMIN ONLY */}
      {isAdmin && (
        <>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border p-2 rounded mb-2"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2 rounded mb-2"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New Password"
            className="w-full border p-2 rounded mb-2"
          />

          <input
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border p-2 rounded mb-2"
          />

          <input
            name="whatsapp_number"
            value={form.whatsapp_number}
            onChange={handleChange}
            placeholder="WhatsApp Number"
            className="w-full border p-2 rounded mb-2"
          />

          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full border p-2 rounded mb-2"
          />

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full border p-2 rounded mb-2"
          />
        </>
      )}

      {/* BUTTONS */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => window.history.back()}
          className="w-1/2 border py-2 rounded"
        >
          Back
        </button>

        <button
          onClick={handleUpdate}
          className="w-1/2 bg-black text-white py-2 rounded"
        >
          Update
        </button>
      </div>

    </div>
  );
}