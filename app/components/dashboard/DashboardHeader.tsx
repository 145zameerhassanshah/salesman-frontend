

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

  return (
    <div className="mb-6">
      <p className="text-gray-600 text-sm">Welcome Back!</p>
      <h1 className="text-4xl font-semibold">{user?.name}</h1>
      <h3>{user?.user_type[0].toUpperCase()+user?.user_type.slice(1)}</h3>
    </div>
  );
}
