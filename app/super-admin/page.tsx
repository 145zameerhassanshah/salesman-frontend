"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { industry } from "../components/services/industryService";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/store/userSlice";
import AuthService from "../components/services/authService";
import { useRouter } from "next/navigation";
import API_URL from "../components/lib/apiConfig";

type Industry = {
  _id: string;
  businessName: string;
  city: string;
  registrationNo: string;
  business_logo?: string;
};

export default function SuperAdminPage() {
  const user = useSelector((state: any) => state.user.user);
  const [business, setBusiness] = useState<Industry[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<any>({
    industry: "",
    businessName: "",
    registrationNo: "",
    address: "",
    city: "",
    taxId: "",
    business_logo: null,
  });

  const dispatch = useDispatch();
  const router = useRouter();

  /* ================= FETCH INDUSTRIES ================= */

  useEffect(() => {
    async function getIndustry() {
      const data = await industry.getAllIndustries();
      if (data?.message) return toast.error(data?.message);
      setBusiness(data);
    }

    getIndustry();
  }, [user?._id]);

  /* ================= HANDLE INPUT ================= */

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
      router.push("/login");

    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const fd = new FormData();

      fd.append("industry", formData.industry);
      fd.append("businessName", formData.businessName);
      fd.append("registrationNo", formData.registrationNo);
      fd.append("address", formData.address);
      fd.append("city", formData.city);
      fd.append("taxId", formData.taxId);

      if (formData.business_logo) {
        fd.append("business_logo", formData.business_logo);
      }

      const data = await industry.createIndustry(fd);

      if (data?.success === false) return toast.error(data?.message);

      toast.success(data?.message);

      setBusiness((prev) => [...prev, data?.industry]);

      setShowForm(false);

      setFormData({
        industry: "",
        businessName: "",
        registrationNo: "",
        address: "",
        city: "",
        taxId: "",
        business_logo: null,
      });

    } catch (error) {
      toast.error("Failed to add business");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <h1>Super Admin : {user?.name}</h1>

        <h1 className="text-3xl font-bold">
          Businesses
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(true)}
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

      {/* BUSINESS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {business?.map((b) => (

          <a
            key={b._id}
            href={`/super-admin/industry/details/${b?._id}`}
            className="border border-black p-6 rounded-xl hover:bg-black hover:text-white transition flex items-center gap-4"
          >

            {/* LOGO */}
            <img
              src={
                b?.business_logo
                  ? `${API_URL}/uploads/${b.business_logo}`
                  : "/profile.png"
              }
              className="w-12 h-12 rounded-full object-cover border"
            />

            {/* CONTENT */}
            <div>
              <h2 className="text-xl font-semibold mb-1">
                {b?.businessName}
              </h2>

              <p className="text-sm">City: {b?.city}</p>
              <p className="text-sm">Reg No: {b?.registrationNo}</p>
            </div>

          </a>

        ))}

      </div>

      {/* ================= MODAL ================= */}
      {showForm && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-xl w-[500px]">

            <h2 className="text-xl font-bold mb-6">
              Add Business
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>

              <input
                name="industry"
                placeholder="Industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full border p-2"
              />

              <input
                name="businessName"
                placeholder="Business Name"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full border p-2"
              />

              <input
                name="registrationNo"
                placeholder="Business Registration Number"
                value={formData.registrationNo}
                onChange={handleChange}
                className="w-full border p-2"
              />

              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border p-2"
              />

              <input
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="w-full border p-2"
              />

              <input
                name="taxId"
                placeholder="Tax ID"
                value={formData.taxId}
                onChange={handleChange}
                className="w-full border p-2"
              />

              {/* LOGO */}
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full border p-2"
              />

              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-lg w-full"
              >
                Click to Add
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}