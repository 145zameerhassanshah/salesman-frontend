"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {industry} from "../components/services/industryService";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/store/userSlice";
import AuthService from "../components/services/authService";
import { useRouter } from "next/navigation";

type Industry = {
  _id: string;
  businessName: string;
  city: string;
  registrationNo: string;
};

export default function SuperAdminPage() {
    const user = useSelector((state: any) => state.user.user);
    const [business,setBusiness]=useState<Industry[]>([]);

    useEffect(()=>{
        async function getIndustry(){
            const data=await industry.getAllIndustries();
            if(data?.message) return toast.error(data?.message);
            setBusiness(data);
        }

        getIndustry();
    },[user?._id]);


  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    industry: "",
    businessName: "",
    registrationNo: "",
    address: "",
    city: "",
    taxId: ""
  });

  const businesses = [
    {
      id: "1",
      name: "ABC Industries",
      city: "Lahore",
      registrationNo: "REG-001"
    },
    {
      id: "2",
      name: "Tech Manufacturing",
      city: "Karachi",
      registrationNo: "REG-002"
    }
  ];

  /* HANDLE INPUT CHANGE */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

  };
  const dispatch=useDispatch();
  const router=useRouter();

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
  /* HANDLE FORM SUBMIT */

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    try {

      const data=await industry.createIndustry(formData);
      if(data?.success==false) return toast.error(data?.message);

      toast.success(data?.message)
      setBusiness((prev) => [...prev, data?.industry]);

      setShowForm(false);

      setFormData({
        industry: "",
        businessName: "",
        registrationNo: "",
        address: "",
        city: "",
        taxId: ""
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

        <button
          onClick={() => setShowForm(true)}
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          Add Business
        </button>

         <button
          onClick={()=>logout()}
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          Log out
        </button>

      </div>

      {/* BUSINESS GRID */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {business?.map((b) => (

          <a
            key={b._id}
            href={`/super-admin/industry/details/${b?._id}`}
            className="border border-black p-6 rounded-xl hover:bg-black hover:text-white transition"
          >

            <h2 className="text-xl font-semibold mb-2">
              {b?.businessName}
            </h2>

            <p>City: {b?.city}</p>
            <p>Reg No: {b?.registrationNo}</p>

          </a>

        ))}

      </div>


      {/* ADD BUSINESS MODAL */}

      {showForm && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-8 rounded-xl w-[500px]">

            <h2 className="text-xl font-bold mb-6">
              Add Business
            </h2>

            <form
              className="space-y-4"
              onSubmit={handleSubmit}
            >

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

              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-lg"
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