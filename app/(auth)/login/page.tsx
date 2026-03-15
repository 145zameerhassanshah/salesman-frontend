"use client";

import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#d7dbd9]">

      {/* RIGHT SECTION (FORM) */}
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

          {/* Login Form */}
          <form className="space-y-5">

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              className="w-full h-12 px-4 rounded-lg bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400 text-black"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full h-12 px-4 pr-10 rounded-lg bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400 text-black"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Login Button */}
            <button className="w-full h-12 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition cursor-pointer">
              Login
            </button>

            {/* Remember & Forgot */}
<div className="flex items-center justify-between text-sm text-gray-600">
  <label className="flex items-center gap-2 cursor-pointer">
    <input type="checkbox" className="accent-gray-800" />
    Remember me
  </label>

  <Link
    href="/forget-password"
    className="text-orange-500 hover:text-orange-600 font-medium cursor-pointer"
  >
    Forgot Password?
  </Link>
</div>
          </form>
        </div>
      </div>

      {/* LEFT SECTION (IMAGE AREA) */}
      <div className="order-2 lg:order-1 w-full lg:w-1/2 ">
        <div className="relative w-full h-[380px] lg:h-full overflow-hidden rounded-2xl">

          {/* Background Image */}
          <Image
            src="/images/login1.jpeg"
            alt="background"
            fill
            priority
            className="object-cover"
          />

          {/* TOP CONTENT (logo always visible, text hidden on mobile) */}
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

          {/* Product Image */}
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