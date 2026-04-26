"use client";

import { useState } from "react";
import StaffTable from "./StaffTable";
import StaffModal from "./StaffModal";
import { useSelector } from "react-redux";
import { useUsers } from "@/hooks/useUsers";
import { Search } from "lucide-react";

export default function StaffPage({ role }: { role: string }) {
  const user = useSelector((state: any) => state?.user.user);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [search, setSearch] = useState("");

  const { data, refetch, isLoading } = useUsers(user?.industry);

  const staff =
    data?.userByIndustry?.filter((u: any) => u.user_type === role) || [];

  const filteredStaff = search.trim()
    ? staff.filter((u: any) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone_number?.includes(search)
      )
    : staff;

  const handleEdit = (data: any) => {
    setEditData(data);
    setOpen(true);
  };

  const handleSave = () => {
    setOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 py-3 md:px-6 md:py-6 overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 capitalize truncate">
            {role} Management
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Search — desktop only */}
          <div className="relative hidden md:block w-52">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${role}...`}
              className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <button
            onClick={() => { setEditData(null); setOpen(true); }}
            className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-2 rounded-xl text-xs md:text-sm font-medium hover:bg-gray-700 transition whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add {role}</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Search — mobile only */}
      <div className="relative md:hidden mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${role}...`}
          className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      {/* LOADING */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <StaffTable
          data={filteredStaff.map((u: any) => ({
            _id: u._id,
            name: u.name,
            email: u.email,
            password: u.password,
            phone_number: u.phone_number,
            whatsapp_number: u.whatsapp_number,
            city: u.city,
            address: u.address,
            status: u.status || "Active",
            joined: new Date(u.createdAt).toLocaleDateString(),
            image: u.profile_image,
          }))}
          onEdit={handleEdit}
          refetch={refetch}
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