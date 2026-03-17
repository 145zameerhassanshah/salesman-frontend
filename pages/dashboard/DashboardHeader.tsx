"use client";

import { useSelector } from "react-redux";

export default function DashboardHeader() {
  const user = useSelector((state: any) => state.user.user);

  return (
    <div className="mb-6">
      <p className="text-gray-600 text-sm">Welcome Back!</p>
      <h1 className="text-4xl font-semibold">{user?.name}</h1>
    </div>
  );
}