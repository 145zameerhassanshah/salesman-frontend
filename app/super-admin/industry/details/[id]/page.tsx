"use client";

import UserService from "@/app/components/services/userService";
import { useUsers } from "@/hooks/useUsers";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function BusinessDetail() {

  const [showDirectorForm, setShowDirectorForm] = useState(false);
  const params = useParams();
  const { data } = useUsers(params?.id as string);

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

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  /* ================= HANDLE IMAGE ================= */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      const fd = new FormData();

      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("phone_number", formData.phone_number);
      fd.append("whatsapp_number", formData.whatsapp_number);
      fd.append("city", formData.city);
      fd.append("address", formData.address);
      fd.append("password", formData.password);

      fd.append("industry", params?.id as string);
      fd.append("user_type", "admin");

      if (profileImage) {
        fd.append("profile_image", profileImage);
      }

      console.log(fd)

      const res = await UserService.createAdmin(fd);

      if (!res?.success) {
        return toast.error(res?.message || "Failed to add director");
      }

      toast.success("Director added successfully");

      setShowDirectorForm(false);

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

    } catch (error) {
      toast.error("Failed to add director");
    }
  };

  return (

    <div className="p-8 bg-white min-h-screen text-black">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-2xl font-bold">
          Industry Management
        </h1>

        <button
          onClick={() => setShowDirectorForm(true)}
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          Add Director
        </button>

      </div>

      {/* USERS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {data?.userByIndustry?.map((info: any) => (
          <RoleCard
            key={info?._id}
            name={info?.name}
            role={info?.user_type}
            image={info?.profile_image}
          />
        ))}

      </div>

      {/* ================= MODAL ================= */}

      {showDirectorForm && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-8 rounded-xl w-[500px] max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl font-bold mb-6">
              Add Director
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>

              <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />

              <input
                name="phone_number"
                placeholder="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
                className="border p-2 w-full"
              />

              <input
                name="whatsapp_number"
                placeholder="WhatsApp Number"
                value={formData.whatsapp_number}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />

              <input
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />

              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />

              {/* IMAGE UPLOAD */}
              <input
                type="file"
                onChange={handleFileChange}
                className="border p-2 w-full"
              />

              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-lg w-full"
              >
                Add Director
              </button>

            </form>

          </div>

        </div>

      )}

    </div>

  );
}

/* ================= ROLE CARD ================= */

function RoleCard({ name, role, image }: any) {
  return (
    <div className="border border-black p-4 rounded-xl flex items-center gap-3">

      <img
        src={
          image
            ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${image}`
            : "/profile.png"
        }
        className="w-10 h-10 rounded-full object-cover border"
      />

      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">{role}</p>
      </div>

    </div>
  );
}