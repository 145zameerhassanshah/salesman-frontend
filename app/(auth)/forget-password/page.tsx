"use client";

import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
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
          <div className="space-y-5">

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full h-12 px-4 rounded-lg bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400 text-black"
            />

            <button className="w-full h-12 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition">
              Send Reset Link
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

          </div>

        </div>
      </div>

      {/* LEFT SECTION (IMAGE AREA) */}
      <div className="order-2 lg:order-1 w-full lg:w-1/2 ">

        <div className="relative w-full h-[380px] lg:h-full rounded-2xl overflow-hidden">

          {/* Background */}
          <Image
            src="/images/login2.jpeg"
            alt="background"
            fill
            priority
            className="object-cover"
          />

      

          {/* Top Content */}
          <div className="absolute top-6 left-0 right-0 flex flex-col items-center text-white z-10">

  {/* Logo always visible */}
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
          {/* Product Image */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">

            {/* <Image
              src="/appliances.png"
              alt="products"
              width={260}
              height={260}
              className="object-contain"
            /> */}

          </div>

        </div>

      </div>

    </div>
  );
}