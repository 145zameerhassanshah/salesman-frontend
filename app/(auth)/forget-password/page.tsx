"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import AuthService from "@/app/components/services/authService";

export default function ForgotPasswordPage() {

  const [email,setEmail] = useState("");
  const [loading,setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Enter valid email");
      return;
    }

    setLoading(true);

    try {

      await AuthService.forgotPassword({ email });

      toast.success("If this email exists, a reset link has been sent");

      setEmail("");

    } catch (err) {
      toast.error(err.message || "Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#d7dbd9]">

      {/* RIGHT */}
      <div className="order-1 lg:order-2 flex w-full lg:w-1/2 items-center justify-center px-6 py-10">

        <div className="w-full max-w-[420px]">

          <div className="flex justify-center mb-8">
            <Image
              src="/images/Welcome-Official-Logo.webp"
              alt="logo"
              width={120}
              height={60}
            />
          </div>

          <h2 className="text-2xl font-semibold text-center">
            Forgot Password
          </h2>

          <p className="text-sm text-gray-500 text-center mt-1">
            Enter your email to receive a reset link
          </p>

          <form className="space-y-5 mt-6" onSubmit={handleSubmit}>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value.trim())}
              className="w-full h-12 px-4 rounded-lg border outline-none focus:ring-2 focus:ring-orange-400"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-12 rounded-lg text-white ${
                loading
                  ? "bg-gray-400"
                  : "bg-gray-800 hover:bg-gray-900"
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="text-center text-sm">
              <Link href="/" className="text-orange-500">
                Back to Login
              </Link>
            </p>

          </form>

        </div>
      </div>

      {/* LEFT */}
      <div className="order-2 lg:order-1 w-full lg:w-1/2">
        <div className="relative w-full h-[380px] lg:h-full">

          <Image
            src="/images/login2.jpeg"
            alt="bg"
            fill
            className="object-cover"
          />

        </div>
      </div>

    </div>
  );
}