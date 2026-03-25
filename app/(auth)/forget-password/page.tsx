"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import AuthService from "@/app/components/services/authService";

export default function ForgotPasswordPage() {

  const [email,setEmail] = useState("");
  const [loading,setLoading] = useState(false);

  const handleSubmit = async (e :any) => {
    e.preventDefault();

    if(!email){
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try{

      const res = await AuthService.forgotPassword({ email });

      if(!res.success){
        toast.error(res.message || "Failed to send reset link");
        setLoading(false);
        return;
      }

      toast.success("Password reset link sent to your email");
      setEmail("");

    }catch(err){
      console.error(err);
      toast.error("Server error. Try again.");
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
              width={120}
              height={60}
            />
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Forgot Password
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your registered email and we will send a reset link.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>

            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-lg bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400 text-black"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition cursor-pointer"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                href="/"
                className="text-orange-500 font-medium hover:text-orange-600"
              >
                Back to Login
              </Link>
            </div>

          </form>

        </div>
      </div>

      {/* LEFT SECTION */}
      <div className="order-2 lg:order-1 w-full lg:w-1/2">

        <div className="relative w-full h-[380px] lg:h-full rounded-2xl overflow-hidden">

          <Image
            src="/images/login2.jpeg"
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

              <h2 className="text-lg font-medium">
                Welcome Appliances
              </h2>

              <h1 className="text-xl font-semibold">
                Order Management Software
              </h1>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}