"use client";

import { useState } from "react";
import { User, KeyRound } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import UserService from "@/app/components/services/userService";
import { useRouter } from "next/navigation";

export default function AddSalesman() {
  const router=useRouter();
  const user = useSelector((state: any) => state.user.user);

  const [form, setForm] = useState({
  name: "",
  email: "",
  phone_number: "",
  whatsapp_number: "",
  city: "",
  address: "",
  territory: "",        // ✅ NEW
  designation: "",      // ✅ NEW
  password: "",
  profile_image: null,
});

  const cancel=()=>{
    setForm({
        name: "",
        email: "",
        phone_number: "",
        whatsapp_number: "",
        city: "",
        address: "",
        password: "",
        territory:"",
        designation:"",
        profile_image:null
      });
  }

  const handleImageChange = (e: any) => {
  const file = e.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toast.error("Only image allowed");
    return;
  }
  if(file.size > 2 * 1024 * 1024){
  toast.error("Image must be < 2MB");
  return;
}
if (form.territory.length < 3) {
  return toast.error("Territory must be at least 3 characters");
}

if (form.designation.length < 2) {
  return toast.error("Designation is too short");
}


  setForm({
    ...form,
    profile_image: file,
  });
};

  /* ==============================
     HANDLE CHANGE
  ============================== */
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  /* ==============================
     SUBMIT
  ============================== */
  const handleSubmit = async () => {
    if (
  !form.name ||
  !form.email ||
  !form.phone_number ||
  !form.whatsapp_number ||
  !form.city ||
  !form.address ||
  !form.password ||
  !form.territory ||       // ✅ NEW
  !form.designation        // ✅ NEW
) {
  return toast.error("Please fill all required fields");
}
    if (!user?.industry) {
      return toast.error("Industry not found");
    }

    try {
     const formData = new FormData();

    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone_number", form.phone_number);
    formData.append("whatsapp_number", form.whatsapp_number);
    formData.append("city", form.city);
    formData.append("address", form.address);
    formData.append("password", form.password);
    formData.append("user_type", "salesman");
    formData.append("industry", user.industry);
    formData.append("territory", form.territory);
    formData.append("designation", form.designation);

    if (form.profile_image) {
      formData.append("profile_image", form.profile_image);
    }
     const res = await UserService.createTeamMember(formData);

    if (!res.success) return toast.error(res.message);
      toast.success("Salesman created successfully");
      router.push("/saleman")
      setForm({
        name: "",
        email: "",
        phone_number: "",
        whatsapp_number: "",
        city: "",
        address: "",
        password: "",
        territory:"",
        designation:"",
        profile_image:null,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to create salesman");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6 justify-between ">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Add New Salesman
        </h1>

        <div className="flex flex-wrap gap-3 ">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
          <button onClick={cancel} className="flex items-center gap-2 border px-4 py-2 rounded-lg bg-white">
            Cancel
          </button>
        </div>
      </div>

      <div className="space-y-6">

        {/* Personal Information */}
        <div className=" bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-5">
            <User size={18} />
            <h2 className="font-medium">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

            <div>
              <label className="text-sm text-gray-500">Full Name</label><span className="text-red-500">*</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                required
                placeholder="e.g John Doe"
                className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Email Address</label><span className="text-red-500">*</span>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                type="email"
                placeholder="contact@client.com"
                className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Phone Number</label><span className="text-red-500">*</span>
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                required
                type="text"
                placeholder="+1 (555) 000-0000"
                className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 outline-none"
              />
            </div>
            <div>
  <label className="text-sm text-gray-500">Profile Image</label><span className="text-red-500">*</span>
  <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    required
    className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 outline-none"
  />
</div>

            <div>
              <label className="text-sm text-gray-500">WhatsApp Number</label><span className="text-red-500">*</span>
              <input
                name="whatsapp_number"
                value={form.whatsapp_number}
                onChange={handleChange}
                type="text"
                required
                placeholder="+92 (555) 000-0000"
                className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 outline-none"
              />
            </div>
            <div>
  <label className="text-sm text-gray-500">Territory</label><span className="text-red-500">*</span>
  <input
    name="territory"
    value={form.territory}
    onChange={handleChange}
    type="text"
    required
    placeholder="e.g Lahore Region"
    className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 outline-none"
  />
</div>

<div>
  <label className="text-sm text-gray-500">Designation</label><span className="text-red-500">*</span>
  <input
    name="designation"
    value={form.designation}
    onChange={handleChange}
    type="text"
    required
    placeholder="e.g Sales Executive"
    className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 outline-none"
  />
</div>

            <div>
              <label className="text-sm text-gray-500">City</label><span className="text-red-500">*</span>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                type="text"
                placeholder="City"
                className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Address</label><span className="text-red-500">*</span>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                type="text"
                placeholder="Street, House etc"
                className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 outline-none"
              />
            </div>
             <div>
              <label className="text-sm text-gray-500">Password</label><span className="text-red-500">*</span>
              <input
                name="password"
                value={form.password}
                required
                onChange={handleChange}
                type="password"
                className="w-full mt-1 bg-gray-100 rounded-lg px-3 py-2 outline-none"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}