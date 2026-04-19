"use client";

import UserService from "@/app/components/services/userService";
import AuthService from "@/app/components/services/authService";
import { useUsers } from "@/hooks/useUsers";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function BusinessDetail() {
  const router = useRouter();
  const params = useParams();
  const { data, refetch } = useUsers(params?.id as string);
const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    whatsapp_number: "",
    city: "",
    address: "",
    password: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e: any) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ================= IMAGE ================= */

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  /* ================= OPEN ADD ================= */

  const openAdd = () => {
    resetForm();
    setIsEdit(false);
    setShowModal(true);
  };

  /* ================= OPEN EDIT ================= */

  const openEdit = (user: any) => {
    setEditId(user._id);
    setIsEdit(true);

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone_number: user.phone_number || "",
      whatsapp_number: user.whatsapp_number || "",
      city: user.city || "",
      address: user.address || "",
      password: "",
    });

    setPreview(
      user.profile_image
        ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.profile_image}`
        : null
    );

    setShowModal(true);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const fd = new FormData();

      Object.entries(formData).forEach(([k, v]) => {
        if (v) fd.append(k, v as string);
      });

      if (!isEdit) {
        fd.append("industry", params?.id as string);
        fd.append("user_type", "admin");
      }

      if (profileImage) fd.append("profile_image", profileImage);

      const res = isEdit
        ? await UserService.updateUser(editId, fd)
        : await UserService.createAdmin(fd);

      if (!res?.success) return toast.error(res?.message);

      toast.success(isEdit ? "Updated" : "Created");
      setShowModal(false);
      resetForm();
      refetch();

    } catch {
      toast.error("Something went wrong");
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;

    try {
      await AuthService.deleteUser(id);
      toast.success("Deleted");
      refetch();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= RESET ================= */

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone_number: "",
      whatsapp_number: "",
      city: "",
      address: "",
      password: "",
    });
    setProfileImage(null);
    setPreview(null);
  };

  return (
    <div className="p-8 bg-white min-h-screen text-black">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <button
          onClick={() => router.push("/super-admin")}
          className="text-sm text-black-600 hover:underline"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold">Industry Management</h1>

        <button
          onClick={openAdd}
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          + Add Admin
        </button>
      </div>

      {/* USERS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {data?.userByIndustry?.map((u: any) => (
          <RoleCard
            key={u._id}
            {...u}
            onEdit={() => openEdit(u)}
            onDelete={() => handleDelete(u._id)}
          />
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <Modal
          title={isEdit ? "Edit Admin" : "Add Admin"}
          onClose={() => setShowModal(false)}
        >
          <Form
            formData={formData}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            preview={preview}
            onSubmit={handleSubmit}
            isEdit={isEdit}
          />
        </Modal>
      )}
    </div>
  );
}

/* ================= CARD ================= */

function RoleCard({ name, user_type, profile_image, onEdit, onDelete }: any) {

  const imageUrl = profile_image
    ? profile_image.startsWith("http") 
      ? profile_image
      : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${profile_image}` // local case
    : "/profile.png";

  return (
    <div className="border p-4 rounded-lg flex flex-col gap-3 items-center text-center">
      
      <img
        src={imageUrl}
        alt="profile"
        className="w-14 h-14 rounded-full object-cover border"
      />

      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-xs text-gray-500">{user_type}</p>
      </div>

      <div className="flex gap-3 text-sm">
        <button onClick={onEdit} className="text-blue-500">Edit</button>
        <button onClick={onDelete} className="text-red-500">Delete</button>
      </div>

    </div>
  );
}/* ================= MODAL ================= */

function Modal({ children, title, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[450px]">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        {children}
        <button onClick={onClose} className="mt-4 text-sm text-gray-500">
          Close
        </button>
      </div>
    </div>
  );
}

/* ================= FORM ================= */

function Form({ formData, handleChange, handleFileChange, preview, onSubmit, isEdit }: any) {
  return (
    <form className="space-y-3" onSubmit={onSubmit}>

      {/* IMAGE */}
      <div className="flex flex-col items-center gap-2">
        <img
          src={preview || "/profile.png"}
          className="w-16 h-16 rounded-full object-cover border"
        />
        <input type="file" onChange={handleFileChange} />
      </div>

      {/* FIELDS */}
      {Object.entries(formData).map(([key, val]) => (
        <div key={key}>
          <label className="text-xs text-gray-600 capitalize">
            {key.replace("_", " ")}
          </label>
          <input
            type={key === "password" ? "password" : "text"}
            name={key}
            value={val as string}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
      ))}

      <button className="bg-black text-white w-full py-2 rounded mt-2">
        {isEdit ? "Update" : "Create"}
      </button>

    </form>
  );
}