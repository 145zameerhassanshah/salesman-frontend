

"use client";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { industry } from "../components/services/industryService";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/store/userSlice";
import AuthService from "../components/services/authService";
import { useRouter } from "next/navigation";
import API_URL from "../components/lib/apiConfig";
import { Pencil, Trash2 } from "lucide-react";
type Industry = {
  _id: string;
  businessName: string;
  city: string;
  registrationNo: string;
  business_logo?: string;
  addressLogo?: string;
};

export default function SuperAdminPage() {
  const user = useSelector((state: any) => state.user.user);
  const [business, setBusiness] = useState<Industry[]>([]);
  
  const [showForm, setShowForm] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState<any>({
    industry: "",
    businessName: "",
    registrationNo: "",
    address: "",
    city: "",
    taxId: "",
    bussinesEmail: "",
    business_logo: null,
    addressLogo: null,
  });

  const dispatch = useDispatch();
  const router = useRouter();

  /* ================= FETCH ================= */
const BUSINESSES_PER_PAGE = 8;

const [pagination, setPagination] = useState<any>(null);
const [loading, setLoading] = useState(false);
const [search, setSearch] = useState("");
const [debouncedSearch, setDebouncedSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("");
const [currentPage, setCurrentPage] = useState(1);

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search.trim());
    setCurrentPage(1);
  }, 400);

  return () => clearTimeout(timer);
}, [search]);

const loadBusinesses = async (page = currentPage) => {
  try {
    setLoading(true);

    const res = await industry.getAllIndustries({
      page,
      limit: BUSINESSES_PER_PAGE,
      search: debouncedSearch,
      status: statusFilter,
    });

    if (!res?.success) {
      toast.error(res?.message || "Error fetching businesses");
      setBusiness([]);
      setPagination(null);
      return;
    }

    const list = Array.isArray(res?.industries)
      ? res.industries
      : Array.isArray(res?.industry)
        ? res.industry
        : [];

    setBusiness(list);
    setPagination(res?.pagination || null);
  } catch (error) {
    toast.error("Error fetching businesses");
    setBusiness([]);
    setPagination(null);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadBusinesses(currentPage);
}, [currentPage, debouncedSearch, statusFilter]);
  /* ================= INPUT ================= */
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev: any) => ({
      ...prev,
      business_logo: file,
    }));
  };

  const handleAddressLogoChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev: any) => ({
      ...prev,
      addressLogo: file,
    }));
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      const signOut = await AuthService.logoutUser();

      if (signOut?.success === false) {
        toast.error(signOut?.message);
        return;
      }

      toast.success(signOut?.message || "Logout successful");

      dispatch(clearUser());
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.businessName || !formData.registrationNo || !formData.city) {
      return toast.error("Please fill required fields (*)");
    }

    try {
      const fd = new FormData();

      fd.append("industry", formData.industry);
      fd.append("businessName", formData.businessName);
      fd.append("registrationNo", formData.registrationNo);
      fd.append("address", formData.address);
      fd.append("bussinesEmail", formData.bussinesEmail);
      fd.append("city", formData.city);
      fd.append("taxId", formData.taxId);

      if (formData.business_logo) {
        fd.append("business_logo", formData.business_logo);
      }

      if (formData.addressLogo) {
        fd.append("addressLogo", formData.addressLogo);
      }

      let data;

      if (editMode && editId) {
        data = await industry.updateIndustry(editId, fd);
      } else {
        data = await industry.createIndustry(fd);
      }

      if (data?.success === false) return toast.error(data?.message);

      toast.success(data?.message);

      if (editMode) {
        setBusiness((prev) =>
          prev.map((b) => (b._id === editId ? data.industry : b))
        );
      } else {
        setBusiness((prev) => [...prev, data.industry]);
      }

      setShowForm(false);
      setEditMode(false);
      setEditId(null);

      setFormData({
        industry: "",
        businessName: "",
        registrationNo: "",
        address: "",
        city: "",
        taxId: "",
        bussinesEmail: "",
        business_logo: null,
        addressLogo: null,
      });

    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };
const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: " Are you sure to delete business?",
    html: `
      <div style="text-align:left; font-size:14px;">
        This will permanently remove this business and all related data permanently:
        <ul style="margin-top:8px; padding-left:18px;">
          <li>All Users</li>
          <li>All Dealers</li>
          <li>All Orders & Quotations</li>
        </ul>
        <br/>
        <b>This action cannot be undone.</b>
      </div>
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e11d48",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    const res = await industry.deleteIndustry(id);

    if (res?.success === false) {
      return toast.error(res.message);
    }

    toast.success(res.message);

    setBusiness((prev) => prev.filter((b) => b._id !== id));

  } catch (err) {
    toast.error("Delete failed");
  }
};
  return (
    <div className="min-h-screen bg-white text-black p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1>Super Admin : {user?.name}</h1>

        <h1 className="text-3xl font-bold">Businesses</h1>

        <div className="flex gap-3">
<button
  onClick={() => {
    setShowForm(true);
    setEditMode(false);
    setEditId(null);

    setFormData({
      industry: "",
      businessName: "",
      registrationNo: "",
      address: "",
      city: "",
      taxId: "",
      bussinesEmail: "",
      business_logo: null,
      addressLogo: null,
    });
  }}
  className="bg-black text-white px-6 py-2 rounded-lg"
>
  Add Business
</button>
          <button
            onClick={logout}
            className="bg-black text-white px-6 py-2 rounded-lg"
          >
            Log out
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {business?.map((b) => (
          <a
            key={b._id}
            href={`/super-admin/industry/details/${b?._id}`}
            className="border border-black p-6 rounded-xl hover:bg-black hover:text-white transition flex items-center gap-4"
          >
            <img
              src={b?.business_logo}
              className="w-12 h-12 rounded-full object-cover border"
            />

            {/* <img
              src={
                b?.addressLogo
                  ? `${API_URL}/uploads/${b.addressLogo}`
                  : "/profile.png"
              }
              className="w-12 h-12 rounded-full object-cover border"
            /> */}

            <div>
              <h2 className="text-xl font-semibold mb-1">
                {b?.businessName}
              </h2>

              <p className="text-sm">City: {b?.city}</p>
              <p className="text-sm">Reg No: {b?.registrationNo}</p>
              <p className="text-sm">Email : {b?.bussinesEmail}</p>
              <p className="text-sm">Address : {b?.address}</p>
            </div>
<button
  onClick={(e) => {
    e.preventDefault();
    handleDelete(b._id);
  }}
  className="p-2 rounded hover:bg-red-100 text-red-600"
>
  <Trash2 size={16} />
</button>
            {/* EDIT BUTTON */}
<button
  onClick={(e) => {
    e.preventDefault();

    setEditMode(true);
    setEditId(b._id);
    setShowForm(true);

    setFormData({
      ...b,
      business_logo: null,
      addressLogo: null,
    });
  }}
  className="p-2 rounded hover:bg-gray-100 text-gray-700"
>
  <Pencil size={16} />
</button>
          </a>
        ))}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[500px] max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl font-bold mb-6">
              {editMode ? "Edit Business" : "Add Business"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>

              {/* all your inputs SAME */}
              {/* INDUSTRY */}
<div>
  <label className="block text-sm font-medium mb-1">
    Industry <span className="text-red-500">*</span>
  </label>
  <input
    name="industry"
    value={formData.industry}
    onChange={handleChange}
    className="w-full border p-2 rounded"
    required
  />
</div>

{/* BUSINESS NAME */}
<div>
  <label className="block text-sm font-medium mb-1">
    Business Name <span className="text-red-500">*</span>
  </label>
  <input
    name="businessName"
    value={formData.businessName}
    onChange={handleChange}
    className="w-full border p-2 rounded"
    required
  />
</div>

{/* REGISTRATION */}
<div>
  <label className="block text-sm font-medium mb-1">
    Registration No <span className="text-red-500">*</span>
  </label>
  <input
    name="registrationNo"
    value={formData.registrationNo}
    onChange={handleChange}
    className="w-full border p-2 rounded"
    required
  />
</div>

{/* EMAIL */}
<div>
  <label className="block text-sm font-medium mb-1">
    Email <span className="text-red-500">*</span>
  </label>
  <input
    name="bussinesEmail"
    type="email"
    value={formData.bussinesEmail}
    onChange={handleChange}
    className="w-full border p-2 rounded"
    required
  />
</div>

{/* ADDRESS */}
<div>
  <label className="block text-sm font-medium mb-1">
    Address
  </label>
  <input
    name="address"
    value={formData.address}
    onChange={handleChange}
    className="w-full border p-2 rounded"
  />
</div>

{/* CITY */}
<div>
  <label className="block text-sm font-medium mb-1">
    City <span className="text-red-500">*</span>
  </label>
  <input
    name="city"
    value={formData.city}
    onChange={handleChange}
    className="w-full border p-2 rounded"
    required
  />
</div>

{/* TAX */}
<div>
  <label className="block text-sm font-medium mb-1">
    Tax ID <span className="text-red-500">*</span>
  </label>
  <input
    name="taxId"
    value={formData.taxId}
    onChange={handleChange}
    className="w-full border p-2 rounded"
    required
  />
</div>

              {/* BUSINESS LOGO */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Business Logo <span className="text-red-500">*</span>
                </label>

                <label className="flex items-center justify-center w-full border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                  <span className="text-gray-600 text-sm">
                    {formData.business_logo ? formData.business_logo.name : "Click to upload logo"}
                  </span>

                  <input type="file" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              {/* ADDRESS LOGO */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Address Logo <span className="text-red-500">*</span>
                </label>

                <label className="flex items-center justify-center w-full border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                  <span className="text-gray-600 text-sm">
                    {formData.addressLogo ? formData.addressLogo.name : "Click to upload address logo"}
                  </span>

                  <input type="file" onChange={handleAddressLogoChange} className="hidden" />
                </label>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditMode(false);
                  }}
                  className="w-full border py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-lg"
                >
                  {editMode ? "Update Business" : "Click to Add"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}