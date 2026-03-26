"use client";

import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import DealerService from "@/app/components/services/dealerService";
import DealersTable from "@/app/components/dealers/allDealers";
import toast from "react-hot-toast";

export default function Page() {
  const user = useSelector((state:any)=>state.user.user);
  const router = useRouter();

  const [dealers, setDealers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [editDealer, setEditDealer] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  /* FETCH */
  const fetchDealers = async () => {
    try {
      const res = await DealerService.getAllDealers(user?.industry);

      if (res.success) {
        setDealers(res.dealers);
        setFiltered(res.dealers);
      }
    } catch {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.industry) return;
    fetchDealers();
  }, [user?.industry]);

  /* FILTER */
  useEffect(() => {
    let data = [...dealers];

    if (search) {
      data = data.filter((d) =>
        d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.company_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      data = data.filter((d) =>
        statusFilter === "active" ? d.is_active : !d.is_active
      );
    }

    setFiltered(data);
  }, [search, statusFilter, dealers]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        <h1 className="text-3xl md:text-4xl font-semibold">
          Dealers
        </h1>

        <div className="flex items-center gap-2 flex-wrap">

          {/* SEARCH */}
          <div className="flex items-center bg-white/60 rounded-xl px-3 py-2">
            <Search size={16} className="text-gray-500 mr-2" />
            <input
              placeholder="Search dealer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-32 md:w-48"
            />
          </div>

          {/* STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/60 px-3 py-2 rounded-xl text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* ADD BUTTON */}
          <button
            onClick={() => router.push("/dealers/add")}
            className="bg-black text-white flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
          >
            Add Dealer
            <Plus size={16} />
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/60 backdrop-blur rounded-3xl p-4 md:p-6">

        {loading ? (
          <p>Loading...</p>
        ) : (
          <DealersTable
            dealers={filtered}
            refresh={fetchDealers}
            onEdit={(dealer:any)=> setEditDealer(dealer)}
          />
        )}

      </div>

      {/* MODAL */}
      {editDealer && (
        <DealerEditModal
          dealer={editDealer}
          onClose={() => setEditDealer(null)}
          refresh={fetchDealers}
        />
      )}

    </div>
  );
}


/* ================= EDIT MODAL ================= */

function DealerEditModal({ dealer, onClose, refresh }: any) {

  const [form, setForm] = useState({
    name: dealer?.name || "",
    email: dealer?.email || "",
    phone_number: dealer?.phone_number || "",
    company_name: dealer?.company_name || "",
    is_active: dealer?.is_active ?? true,
    business_logo: null as File | null,
  });

  const [preview, setPreview] = useState(
    dealer?.business_logo || null
  );

  useEffect(() => {
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = "auto";
  };
}, []);

  const handleChange = (e:any)=>{
    const {name,value,type,checked} = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleImageChange = (e:any)=>{
    const file = e.target.files[0];

    if(!file) return;

    if(!file.type.startsWith("image/")){
      toast.error("Only image allowed");
      return;
    }

    if(file.size > 2 * 1024 * 1024){
      toast.error("Image must be < 2MB");
      return;
    }

    setForm({...form, business_logo:file});
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async ()=>{
    try {

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone_number", form.phone_number);
      formData.append("company_name", form.company_name);
      formData.append("is_active", String(form.is_active));

      if(form.business_logo){
        formData.append("business_logo", form.business_logo);
      }

      const res = await DealerService.updateDealer(formData, dealer._id);

      if(!res.success){
        toast.error(res.message);
        return;
      }

      toast.success("Dealer updated");
      refresh();
      onClose();

    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-2xl w-[380px] space-y-4">

        <h2 className="text-lg font-semibold">Edit Dealer</h2>

        {/* IMAGE */}
        <div className="flex flex-col items-center gap-2">

          {preview ? (
            <img src={preview} className="w-20 h-20 rounded-full object-cover border" />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-xs">
              No Image
            </div>
          )}

          <input type="file" accept="image/*" onChange={handleImageChange} />

        </div>

        <input name="name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Name" />
        <input name="email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Email" />
        <input name="phone_number" value={form.phone_number} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Phone" />
        <input name="company_name" value={form.company_name} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Company" />

        <select
          value={form.is_active ? "true" : "false"}
          onChange={(e)=>setForm({...form,is_active:e.target.value==="true"})}
          className="w-full border p-2 rounded"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
          <button onClick={handleUpdate} className="px-3 py-1 bg-black text-white rounded">Update</button>
        </div>

      </div>

    </div>
  );
}
