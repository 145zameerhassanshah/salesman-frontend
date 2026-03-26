"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import AuthService from "@/app/components/services/authService";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await AuthService.resetPassword({ token, password });

      if (!res.success) {
        toast.error(res.message || "Password reset failed");
        setLoading(false);
        return;
      }

      toast.success("Password updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div>
      {/* YOUR EXISTING UI SAME RAKHO */}
    </div>
  );
}
