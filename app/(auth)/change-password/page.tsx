"use client";

import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import AuthService from "@/app/components/services/authService";

export default function ChangePasswordPage() {
const router = useRouter();

  const [showOldPassword,setShowOldPassword] = useState(false);
  const [showNewPassword,setShowNewPassword] = useState(false);
  const [showConfirmPassword,setShowConfirmPassword] = useState(false);

  const [oldPassword,setOldPassword] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");

  const [loading,setLoading] = useState(false);

  const handleChangePassword = async (event:any) => {

    event.preventDefault();

    if(newPassword !== confirmPassword){
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try{

const res = await AuthService.changePassword({
  currentPassword: oldPassword,
  newPassword
});
      if(!res.success){
        toast.error(res.message || "Password change failed");
        setLoading(false);
        return;
      }

toast.success("Password updated successfully");

setTimeout(() => {
  router.push("/");
}, 1000);

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

    }catch(err){
      console.error(err);
      toast.error("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#d7dbd9]">

      {/* RIGHT SECTION */}

      <div className="order-1 lg:order-2 flex w-full lg:w-1/2 items-center justify-center px-6 py-10">

        <div className="w-full max-w-[420px]">

          {/* Logo */}

          <div className="flex flex-col items-center mb-8">
            <Image
              src="/images/Welcome-Official-Logo.webp"
              alt="Welcome Appliances"
              width={140}
              height={70}
            />
          </div>

          {/* FORM */}

          <form className="space-y-5" onSubmit={handleChangePassword}>

            {/* Old Password */}

            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Old Password"
                required
                value={oldPassword}
                onChange={(e)=>setOldPassword(e.target.value)}
                className="w-full h-12 px-4 pr-10 rounded-lg bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400 text-black"
              />

              <button
                type="button"
                onClick={()=>setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-3.5 text-gray-400"
              >
                {showOldPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>


            {/* New Password */}

            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                required
                value={newPassword}
                onChange={(e)=>setNewPassword(e.target.value)}
                className="w-full h-12 px-4 pr-10 rounded-lg bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400 text-black"
              />

              <button
                type="button"
                onClick={()=>setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3.5 text-gray-400"
              >
                {showNewPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>


            {/* Confirm Password */}

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                className="w-full h-12 px-4 pr-10 rounded-lg bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400 text-black"
              />

              <button
                type="button"
                onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>


            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition cursor-pointer"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

          </form>

        </div>

      </div>


      {/* LEFT SECTION (same as login) */}

      <div className="order-2 lg:order-1 w-full lg:w-1/2">

        <div className="relative w-full h-[380px] lg:h-full overflow-hidden rounded-2xl">

          <Image
            src="/images/login1.jpeg"
            alt="background"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute top-6 left-0 right-0 flex flex-col items-center text-white z-10">

            <Image
              src="/images/Welcome-Official-Logo.webp"
              alt="logo"
              width={90}
              height={40}
              className="object-contain"
            />

            <div className="hidden lg:block text-center mt-3">
              <h2 className="text-lg font-medium">Welcome Appliances</h2>
              <h1 className="text-xl font-semibold px-6">
                Order Management Software
              </h1>
            </div>

          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">

            <Image
              src="/images/login3.jpeg"
              alt="products"
              width={260}
              height={260}
              className="object-contain"
            />

          </div>

        </div>

      </div>

    </div>
  );
}