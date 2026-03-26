"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function DashboardHeader() {
  const router = useRouter();
  const user = useSelector((state: any) => state.user.user);

  // ✅ FIX: redirect inside useEffect
  useEffect(() => {
    if (user?.user_type === "super_admin") {
      router.push("/super-admin");
    }
  }, [user, router]);

  return (
    <div className="mb-4 md:mb-6">

      {/* Welcome Text */}
      <p className="text-gray-500 text-xs sm:text-sm">
        Welcome Back!
      </p>

      {/* Username */}
      <h1 className="
        font-semibold text-gray-800
        text-2xl sm:text-3xl md:text-4xl
        leading-tight
        break-words
      ">
        {user?.name || "Admin"}
      </h1>

    </div>
  );
}