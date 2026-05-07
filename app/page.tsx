"use client";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthService from "@/app/components/services/authService";
import { USER_ROLES } from "@/app/components/lib/roles";
import { setUser } from "@/store/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
const [verificationCode, setVerificationCode] = useState("");
const [verifyLoading, setVerifyLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state?.user.user);

  useEffect(() => {
    if (user) {
      const role = user?.role;

      if (role === USER_ROLES.SUPER_ADMIN) {
        router.push("/super-admin");
      } 
      else if (role === USER_ROLES.ADMIN) {
        router.push("/dashboard");
      } 
      else if (role === USER_ROLES.SALESMAN) {
        router.push("/saleman/salemanDashboard");
      } 
      else if (role === USER_ROLES.DISPATCHER) {
        router.push("/dashboard/dispatch");
      } 
      else if (role === USER_ROLES.ACCOUNTANT) {
        router.push("/dashboard/accounts");
      } 
      else if (role === USER_ROLES.MANAGER) {
        router.push("/dashboard/manager");
      } 
      else {
        router.push("/dashboard");
      }
    }
  }, [user, router]);

  // const handleLogin = async (event: any) => {
  //   event.preventDefault();

  //   setLoading(true);

  //   const res = await AuthService.loginUser({
  //     email,
  //     password,
  //   });

  //   if (!res.success) {
  //     toast.error(res.message);
  //     setLoading(false);
  //     return;
  //   }
  //   toast.success(res?.message);

  //   setShowVerifyModal(true);
  //   localStorage.setItem("tempUser", JSON.stringify(res.isUser));

  //   setLoading(false);
  // };


  const handleLogin = async (event) => {
  event.preventDefault();

  try {
    setLoading(true);

    const res = await AuthService.loginUser({
      email,
      password,
    });

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    setShowVerifyModal(true);

  } catch (err) {
    toast.error(err.message || "Login failed");
  } finally {
    setLoading(false);
  }
};
//   const handleVerify = async () => {
//     const tempUser = JSON.parse(localStorage.getItem("tempUser") || "{}");
//   setVerifyLoading(true);

//   const res = await AuthService.verifyUser({
//     otp: verificationCode,
//     email:tempUser?.email
//   });

//   if (!res.success) {
//     toast.error(res.message || "Invalid code");
//     setVerifyLoading(false);
//     return;
//   }

//   toast.success("Verified successfully");

//   dispatch(setUser(res?.user));

//   setShowVerifyModal(false);

//   // 🔥 NOW redirect
//   const role = res?.user.user_type;

//   if (role === USER_ROLES.SUPER_ADMIN) {
//     router.push("/super-admin");
//   } else if (role === USER_ROLES.ADMIN) {
//     router.push("/dashboard");
//   } else if (role === USER_ROLES.SALESMAN) {
//     router.push("/saleman/salemanDashboard");
//   } else if (role === USER_ROLES.DISPATCHER) {
//     router.push("/dashboard/dispatch");
//   } else if (role === USER_ROLES.ACCOUNTANT) {
//     router.push("/dashboard/accounts");
//   } else {
//     router.push("/dashboard");
//   }

//   localStorage.removeItem("tempUser");
//   setVerifyLoading(false);
// };


const handleVerify = async () => {
  try {
    setVerifyLoading(true);

    const res = await AuthService.verifyUser({
      otp: verificationCode.trim(),
      email: email.trim(),
    });

    if (!res.success) {
      toast.error(res.message || "Invalid code");
      return;
    }

    toast.success("Verified successfully");

    dispatch(setUser(res.user));
    setShowVerifyModal(false);

    const role = res.user.user_type;

    if (role === USER_ROLES.SUPER_ADMIN) {
      router.push("/super-admin");
    } else if (role === USER_ROLES.ADMIN) {
      router.push("/dashboard");
    } else if (role === USER_ROLES.SALESMAN) {
      router.push("/saleman/salemanDashboard");
    } else if (role === USER_ROLES.DISPATCHER) {
      router.push("/dashboard/dispatch");
    } else if (role === USER_ROLES.ACCOUNTANT) {
      router.push("/dashboard/accounts");
    } else if (role === USER_ROLES.MANAGER) {
      router.push("/dashboard/manager");
    } else {
      router.push("/dashboard");
    }

  } catch (err) {
    toast.error(err.message || "Verification failed");
  } finally {
    setVerifyLoading(false);
  }
};

  return (
    <>
    {showVerifyModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
      
      <h2 className="text-lg font-semibold mb-2 text-gray-800">
        Verify Your Account
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        Enter the verification code sent to your email.
      </p>

      <input
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        placeholder="Enter code"
        className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-gray-300"
      />

      <button
        onClick={handleVerify}
        disabled={!verificationCode || verifyLoading}
        className={`w-full py-2 rounded-lg text-white ${
          !verificationCode
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-black hover:bg-gray-800"
        }`}
      >
        {verifyLoading ? "Verifying..." : "Verify"}
      </button>

    </div>
  </div>
)}  
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#d7dbd9]">
      {/* RIGHT SECTION */}
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
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-lg bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400 text-black"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition cursor-pointer"
            >
              {loading ? "Logging in..." : "Login"}
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

      {/* LEFT SECTION */}
      <div className="order-2 lg:order-1 w-full lg:w-1/2 ">
        <div className="relative w-full h-[380px] lg:h-full overflow-hidden rounded-2xl">
          <Image
            src="/images/login1.jpeg"
            alt="background"
            fill
                sizes="(max-width: 768px) 100vw, 50vw"

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
              <h2 className="text-lg font-medium">Welcome Appliances</h2>
              <h1 className="text-xl font-semibold px-6">
                Order Management Software
              </h1>
            </div>
          </div>

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
    </>  
  );
  
}