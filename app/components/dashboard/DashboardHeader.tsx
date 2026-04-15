"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function DashboardHeader() {
  const router = useRouter();
  const user = useSelector((state: any) => state.user.user);

  useEffect(() => {
    if (user?.user_type === "super_admin") {
      router.push("/super-admin");
    }
  }, [user, router]);

  const formatName = (name: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const formatRole = (role: string) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="mb-6 font-sans">

      {/* Welcome text */}
      <p className="text-gray-600 text-xs sm:text-sm">
        Welcome Back!
      </p>

      {/* Name */}
      <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold leading-tight break-words">
        {formatName(user?.name)}
      </h1>

      {/* Role */}
      <h3 className="text-sm sm:text-base text-gray-700 capitalize">
        {formatRole(user?.user_type)}
      </h3>

    </div>
  );
}