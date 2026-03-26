"use client";

import { useState } from "react";
import StaffTable from "./StaffTable";
import StaffModal from "./StaffModal";
import { useSelector } from "react-redux";
import { useUsers } from "@/hooks/useUsers";

export default function StaffPage({ role }: { role: string }) {
  const user = useSelector((state: any) => state?.user.user);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  /* ================= FETCH USERS ================= */
  const { data, refetch, isLoading } = useUsers(user?.industry);
  /* ================= FILTER BY ROLE ================= */
  const staff =
    data?.userByIndustry?.filter((u: any) => u.user_type === role) || [];

    
  /* ================= EDIT ================= */
  const handleEdit = (data: any) => {
    setEditData(data);
    setOpen(true);
  };

  /* ================= SAVE ================= */
  const handleSave = () => {
    setOpen(false);
    // 👉 refetch automatically handled if you invalidate query (optional)
  };

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold capitalize">
          {role} Management
        </h1>

        <button
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add {role}
        </button>
      </div>

      {/* LOADING */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <StaffTable
          data={staff.map((u: any) => ({
  id: u._id,
  _id: u._id, // ✅ ADD THIS (VERY IMPORTANT)
  name: u.name,
  email: u.email,
   phone_number: u.phone_number,        // ✅ ADD
  whatsapp_number: u.whatsapp_number,  // ✅ ADD
  city: u.city,                        // ✅ ADD
  address: u.address, 
  status: u.status || "Active",
  joined: new Date(u.createdAt).toLocaleDateString(),
  image: u.profile_image
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${u.profile_image}`
    : "/profile.png",
}))}
          onEdit={handleEdit}
        />
      )}

      {/* MODAL */}
      {open && (
        <StaffModal
          role={role}
          refetch={refetch}
          data={editData}
          onClose={() => setOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}