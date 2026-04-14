"use client";

import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import AuthService from "@/app/components/services/authService";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (event: any) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await AuthService.changePassword({
        currentPassword: oldPassword,
        newPassword,
      });

      if (!res.success) {
        toast.error(res.message || "Password change failed");
        setLoading(false);
        return;
      }

      toast.success("Password updated successfully");

      setTimeout(() => {
        router.push("/dashboard"); // 🔥 better UX
      }, 1000);

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/Welcome-Official-Logo.webp"
            alt="Welcome Appliances"
            width={120}
            height={60}
          />
        </div>

        <h2 className="text-xl font-semibold text-center mb-5">
          Change Password
        </h2>

        {/* FORM */}
        <form className="space-y-5" onSubmit={handleChangePassword}>

          {/* Old Password */}
          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              placeholder="Old Password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full h-12 px-4 pr-10 rounded-lg border outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-3.5 text-gray-400"
            >
              {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-12 px-4 pr-10 rounded-lg border outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-3.5 text-gray-400"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 px-4 pr-10 rounded-lg border outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-3.5 text-gray-400"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {/* Buttons */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-full h-12 border rounded-lg"
          >
            Cancel
          </button>

        </form>
      </div>
    </div>
  );
}