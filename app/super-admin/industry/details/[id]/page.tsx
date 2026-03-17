"use client";

import UserService from "@/app/components/services/userService";
import { useUsers } from "@/hooks/useUsers";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function BusinessDetail() {

  const [showDirectorForm, setShowDirectorForm] = useState(false);
  const params=useParams();
  const {data}=useUsers(params?.id as string);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    whatsapp_number: "",
    city: "",
    address: "",
    password: ""
  });

  // const [profileImage, setProfileImage] = useState<File | null>(null);

  /* HANDLE CHANGE */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

  };

  /* HANDLE FILE */

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setProfileImage(e.target.files[0]);
  //   }
  // };

  /* SUBMIT */

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {

    const payload = {
      ...formData,
      industry: params?.id,
      user_type: "admin"
    };

    console.log("Payload:", payload);

    const data = await UserService.createAdmin(payload);

    if (!data?.success) {
      return toast.error(data?.message || "Failed to add director");
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
      password: ""
    });

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

      {/* ROLES */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        
        {data?.userByIndustry?.map((info:any)=>(
          <RoleCard key={info?._id} name={info?.name} data={info?.user_type} />
        ))}

      </div>


      {/* DIRECTOR FORM */}

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

              {/* IMAGE */}

              {/* <input
                type="file"
                onChange={handleFileChange}
                className="border p-2 w-full"
              /> */}

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


/* ROLE CARD */

function RoleCard({ name, data }: any) {

  return (
    <div className="border border-black p-6 rounded-xl">

      <h3 className="font-bold mb-4">
        {name}
      </h3>

      
        <p >{data}</p>

    </div>
  );
}