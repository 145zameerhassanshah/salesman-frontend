

// "use client";

// import Image from "next/image";
// import { Eye, EyeOff } from "lucide-react";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import AuthService from "@/app/components/services/authService";
// import { USER_ROLES } from "@/app/components/lib/roles";
// import { setUser } from "@/store/userSlice";
// import { useDispatch, useSelector } from "react-redux";

// export default function LoginPage() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const user = useSelector((state: any) => state?.user?.user);

//   const [showPassword, setShowPassword] = useState(false);
//   const [showVerifyModal, setShowVerifyModal] = useState(false);
//   const [verificationCode, setVerificationCode] = useState("");
//   const [verifyLoading, setVerifyLoading] = useState(false);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [loading, setLoading] = useState(false);

//   const redirectByRole = (role: string) => {
//     if (role === USER_ROLES.SUPER_ADMIN) {
//       router.push("/super-admin");
//     } else if (role === USER_ROLES.ADMIN) {
//       router.push("/dashboard");
//     } else if (role === USER_ROLES.SALESMAN) {
//       router.push("/saleman/salemanDashboard");
//     } else if (role === USER_ROLES.DISPATCHER) {
//       router.push("/dashboard/dispatch");
//     } else if (role === USER_ROLES.ACCOUNTANT) {
//       router.push("/dashboard/accounts");
//     } else if (role === USER_ROLES.MANAGER) {
//       router.push("/dashboard/manager");
//     } else {
//       router.push("/dashboard");
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       redirectByRole(user?.user_type);
//     }
//   }, [user]);

//   const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     try {
//       setLoading(true);

//       const res = await AuthService.loginUser({
//         email: email.trim(),
//         password,
//       });

//       if (!res.success) {
//         toast.error(res.message || "Login failed");
//         return;
//       }

//       toast.success(res.message || "Verification code sent");
//       setShowVerifyModal(true);
//     } catch (err: any) {
//       toast.error(err?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerify = async () => {
//     if (!verificationCode.trim()) {
//       toast.error("Please enter verification code");
//       return;
//     }

//     try {
//       setVerifyLoading(true);

//       const res = await AuthService.verifyUser({
//         otp: verificationCode.trim(),
//         email: email.trim(),
//       });

//       if (!res.success) {
//         toast.error(res.message || "Invalid code");
//         return;
//       }

//       toast.success("Verified successfully");

//       dispatch(setUser(res.user));
//       setShowVerifyModal(false);

//       redirectByRole(res.user?.user_type);
//     } catch (err: any) {
//       toast.error(err?.message || "Verification failed");
//     } finally {
//       setVerifyLoading(false);
//     }
//   };

//   return (
//     <>
//       {showVerifyModal && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleVerify();
//             }}
//             className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl"
//           >
//             <h2 className="text-lg font-semibold mb-2 text-gray-800">
//               Verify Your Account
//             </h2>

//             <p className="text-sm text-gray-500 mb-4">
//               Enter the verification code sent to your email. Please also check
//               Spam/Junk if you do not see it in your inbox.
//             </p>

//             <input
//               type="text"
//               value={verificationCode}
//               onChange={(e) => setVerificationCode(e.target.value)}
//               placeholder="Enter code"
//               className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-gray-300 text-black"
//               autoFocus
//             />

//             <button
//               type="submit"
//               disabled={!verificationCode.trim() || verifyLoading}
//               className={`w-full py-2 rounded-lg text-white transition ${
//                 !verificationCode.trim() || verifyLoading
//                   ? "bg-gray-300 cursor-not-allowed"
//                   : "bg-black hover:bg-gray-800 cursor-pointer"
//               }`}
//             >
//               {verifyLoading ? "Verifying..." : "Verify"}
//             </button>
//           </form>
//         </div>
//       )}

//       <div className="min-h-screen flex flex-col lg:flex-row bg-[#d7dbd9]">
//         {/* RIGHT SECTION */}
//         <div className="order-1 lg:order-2 flex w-full lg:w-1/2 items-center justify-center px-6 py-10">
//           <div className="w-full max-w-[420px]">
//             {/* Logo */}
//             <div className="flex flex-col items-center mb-8">
//               <Image
//                 src="/images/Welcome-Official-Logo.webp"
//                 alt="Welcome Appliances"
//                 width={140}
//                 height={70}
//               />
//             </div>

//             {/* Login Form */}
//             <form className="space-y-5" onSubmit={handleLogin}>
//               {/* Email */}
//               <input
//                 type="email"
//                 placeholder="Email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full h-12 px-4 rounded-lg bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400 text-black"
//               />

//               {/* Password */}
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full h-12 px-4 pr-10 rounded-lg bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400 text-black"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-3.5 text-gray-400"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>

//               {/* Login Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full h-12 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition cursor-pointer disabled:opacity-60"
//               >
//                 {loading ? "Logging in..." : "Login"}
//               </button>

//               {/* Remember & Forgot */}
//               <div className="flex items-center justify-between text-sm text-gray-600">
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input type="checkbox" className="accent-gray-800" />
//                   Remember me
//                 </label>

//                 <Link
//                   href="/forget-password"
//                   className="text-orange-500 hover:text-orange-600 font-medium cursor-pointer"
//                 >
//                   Forgot Password?
//                 </Link>
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* LEFT SECTION */}
//         <div className="order-2 lg:order-1 w-full lg:w-1/2">
//           <div className="relative w-full h-[380px] lg:h-full overflow-hidden rounded-2xl">
//             <Image
//                             src="/images/login4.jpeg"

//               alt="background"
//               fill
//               sizes="(max-width: 768px) 100vw, 50vw"
//               priority
//               className="object-cover"
//             />

//             <div className="absolute top-6 left-0 right-0 flex flex-col items-center text-white z-10">
//               <Image
//                 src="/images/Welcome-Official-Logo.webp"
                
//                 alt="logo"
//                 width={90}
//                 height={40}
//                 className="object-contain"
//               />

//               <div className="hidden lg:block text-center mt-3">
//                 <h2 className="text-lg font-medium">Welcome Appliances</h2>
//                 <h1 className="text-xl font-semibold px-6">
//                   Order Management Software
//                 </h1>
//               </div>
//             </div>

//             <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
//               <Image
//                 src="/images/login3.jpeg"
//                 alt="products"
//                 width={260}
//                 height={260}
//                 className="object-contain"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }



// // "use client";

// // import Image from "next/image";
// // import { Eye, EyeOff } from "lucide-react";
// // import { useState, useEffect } from "react";
// // import Link from "next/link";
// // import { useRouter } from "next/navigation";
// // import toast from "react-hot-toast";
// // import AuthService from "@/app/components/services/authService";
// // import { USER_ROLES } from "@/app/components/lib/roles";
// // import { setUser } from "@/store/userSlice";
// // import { useDispatch, useSelector } from "react-redux";

// // export default function LoginPage() {
// //   const router = useRouter();
// //   const dispatch = useDispatch();

// //   const user = useSelector((state: any) => state?.user?.user);

// //   const [showPassword, setShowPassword] = useState(false);
// //   const [showVerifyModal, setShowVerifyModal] = useState(false);
// //   const [verificationCode, setVerificationCode] = useState("");
// //   const [verifyLoading, setVerifyLoading] = useState(false);

// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const redirectByRole = (role: string) => {
// //     if (role === USER_ROLES.SUPER_ADMIN) router.push("/super-admin");
// //     else if (role === USER_ROLES.ADMIN) router.push("/dashboard");
// //     else if (role === USER_ROLES.SALESMAN) router.push("/saleman/salemanDashboard");
// //     else if (role === USER_ROLES.DISPATCHER) router.push("/dashboard/dispatch");
// //     else if (role === USER_ROLES.ACCOUNTANT) router.push("/dashboard/accounts");
// //     else if (role === USER_ROLES.MANAGER) router.push("/dashboard/manager");
// //     else router.push("/dashboard");
// //   };

// //   useEffect(() => {
// //     if (user) redirectByRole(user?.user_type);
// //   }, [user]);

// //   const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
// //     event.preventDefault();
// //     try {
// //       setLoading(true);
// //       const res = await AuthService.loginUser({ email: email.trim(), password });
// //       if (!res.success) { toast.error(res.message || "Login failed"); return; }
// //       toast.success(res.message || "Verification code sent");
// //       setShowVerifyModal(true);
// //     } catch (err: any) {
// //       toast.error(err?.message || "Login failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleVerify = async () => {
// //     if (!verificationCode.trim()) { toast.error("Please enter verification code"); return; }
// //     try {
// //       setVerifyLoading(true);
// //       const res = await AuthService.verifyUser({ otp: verificationCode.trim(), email: email.trim() });
// //       if (!res.success) { toast.error(res.message || "Invalid code"); return; }
// //       toast.success("Verified successfully");
// //       dispatch(setUser(res.user));
// //       setShowVerifyModal(false);
// //       redirectByRole(res.user?.user_type);
// //     } catch (err: any) {
// //       toast.error(err?.message || "Verification failed");
// //     } finally {
// //       setVerifyLoading(false);
// //     }
// //   };

// //   return (
// //     <>
// //       {/* Verify Modal */}
// //       {showVerifyModal && (
// //         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
// //           <form
// //             onSubmit={(e) => { e.preventDefault(); handleVerify(); }}
// //             className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl"
// //           >
// //             <h2 className="text-lg font-semibold mb-2 text-gray-800">Verify Your Account</h2>
// //             <p className="text-sm text-gray-500 mb-4">
// //               Enter the verification code sent to your email. Please also check Spam/Junk if you do not see it in your inbox.
// //             </p>
// //             <input
// //               type="text"
// //               value={verificationCode}
// //               onChange={(e) => setVerificationCode(e.target.value)}
// //               placeholder="Enter code"
// //               className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-gray-300 text-black"
// //               autoFocus
// //             />
// //             <button
// //               type="submit"
// //               disabled={!verificationCode.trim() || verifyLoading}
// //               className={`w-full py-2 rounded-lg text-white transition ${
// //                 !verificationCode.trim() || verifyLoading
// //                   ? "bg-gray-300 cursor-not-allowed"
// //                   : "bg-black hover:bg-gray-800 cursor-pointer"
// //               }`}
// //             >
// //               {verifyLoading ? "Verifying..." : "Verify"}
// //             </button>
// //           </form>
// //         </div>
// //       )}

// //       {/* 
// //         KEY FIX: Use h-screen on the outer wrapper so both panels 
// //         have a real height to reference. This makes lg:h-full work correctly
// //         on the image container.
// //       */}
// // <div className="min-h-screen flex flex-col lg:flex-row bg-[#d7dbd9]">
// //         {/* ── LEFT: Full-bleed product image ── */}
// //         {/*
// //           KEY FIX: 
// //           1. h-[45vw] on mobile (proportional), full height on desktop
// //           2. No logo/text overlay on the product image — keeps it clean
// //           3. Removed rounded-2xl so it goes edge-to-edge (more premium look)
// //         */}
// // {/* LEFT IMAGE SECTION */}
// // <div className="order-2 lg:order-1 w-full lg:w-1/2 relative h-64 sm:h-80 md:h-[420px] lg:h-screen">
// //   <Image
// //     src="/images/login4.jpeg"
// //     alt="Welcome Appliances Products"
// //     fill
// //     priority
// //     sizes="(max-width: 1024px) 100vw, 50vw"
// //     className="object-cover"
// //   />
// // </div>        {/* ── RIGHT: Login form ── */}
// //         <div className="order-1 lg:order-2 flex w-full lg:w-1/2 items-center justify-center px-6 py-8 lg:py-0 overflow-y-auto">
// //           <div className="w-full max-w-[400px]">

// //             {/* Logo + Brand */}
// //             <div className="flex flex-col items-center mb-8">
// //               <Image
// //                 src="/images/Welcome-Official-Logo.webp"
// //                 alt="Welcome Appliances"
// //                 width={140}
// //                 height={70}
// //                 className="object-contain"
// //               />
// //               {/* Subtle tagline under logo */}
// //               <p className="text-xs text-gray-400 mt-2 tracking-widest uppercase">
// //                 Order Management Software
// //               </p>
// //             </div>

// //             {/* Login Form */}
// //             <form className="space-y-4" onSubmit={handleLogin}>
// //               <input
// //                 type="email"
// //                 placeholder="Email"
// //                 required
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 className="w-full h-12 px-4 rounded-lg bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400 text-black"
// //               />

// //               <div className="relative">
// //                 <input
// //                   type={showPassword ? "text" : "password"}
// //                   placeholder="Password"
// //                   required
// //                   value={password}
// //                   onChange={(e) => setPassword(e.target.value)}
// //                   className="w-full h-12 px-4 pr-10 rounded-lg bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400 text-black"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowPassword(!showPassword)}
// //                   className="absolute right-3 top-3.5 text-gray-400"
// //                 >
// //                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
// //                 </button>
// //               </div>

// //               <button
// //                 type="submit"
// //                 disabled={loading}
// //                 className="w-full h-12 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition cursor-pointer disabled:opacity-60"
// //               >
// //                 {loading ? "Logging in..." : "Login"}
// //               </button>

// //               <div className="flex items-center justify-between text-sm text-gray-600">
// //                 <label className="flex items-center gap-2 cursor-pointer">
// //                   <input type="checkbox" className="accent-gray-800" />
// //                   Remember me
// //                 </label>
// //                 <Link
// //                   href="/forget-password"
// //                   className="text-orange-500 hover:text-orange-600 font-medium cursor-pointer"
// //                 >
// //                   Forgot Password?
// //                 </Link>
// //               </div>
// //             </form>
// //           </div>
// //         </div>

// //       </div>
// //     </>
// //   );
// // }



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
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state?.user?.user);

  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectByRole = (role: string) => {
    if (role === USER_ROLES.SUPER_ADMIN) router.push("/super-admin");
    else if (role === USER_ROLES.ADMIN) router.push("/dashboard");
    else if (role === USER_ROLES.SALESMAN) router.push("/saleman/salemanDashboard");
    else if (role === USER_ROLES.DISPATCHER) router.push("/dashboard/dispatch");
    else if (role === USER_ROLES.ACCOUNTANT) router.push("/dashboard/accounts");
    else if (role === USER_ROLES.MANAGER) router.push("/dashboard/manager");
    else router.push("/dashboard");
  };

  useEffect(() => {
    if (user) redirectByRole(user?.user_type);
  }, [user]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      const res = await AuthService.loginUser({ email: email.trim(), password });
      if (!res.success) { toast.error(res.message || "Login failed"); return; }
      toast.success(res.message || "Verification code sent");
      setShowVerifyModal(true);
    } catch (err: any) {
      toast.error(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode.trim()) { toast.error("Please enter verification code"); return; }
    try {
      setVerifyLoading(true);
      const res = await AuthService.verifyUser({ otp: verificationCode.trim(), email: email.trim() });
      if (!res.success) { toast.error(res.message || "Invalid code"); return; }
      toast.success("Verified successfully");
      dispatch(setUser(res.user));
      setShowVerifyModal(false);
      redirectByRole(res.user?.user_type);
    } catch (err: any) {
      toast.error(err?.message || "Verification failed");
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <>
      {/* Verify Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <form
            onSubmit={(e) => { e.preventDefault(); handleVerify(); }}
            className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl"
          >
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Verify Your Account</h2>
            <p className="text-sm text-gray-500 mb-4">
              Enter the verification code sent to your email. Please also check Spam/Junk if not found.
            </p>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter code"
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-gray-300 text-black"
              autoFocus
            />
            <button
              type="submit"
              disabled={!verificationCode.trim() || verifyLoading}
              className={`w-full py-2 rounded-lg text-white transition ${
                !verificationCode.trim() || verifyLoading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 cursor-pointer"
              }`}
            >
              {verifyLoading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      )}

      {/*
        ✅ KEY FIX:
        - h-screen + overflow-hidden → both panels always fill exactly the viewport
        - flex-col on mobile, flex-row on lg+
        - Left image: order-2 on mobile (shows below form), order-1 on desktop
        - Right form: order-1 on mobile (shows first), order-2 on desktop
      */}
      <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-[#d7dbd9]">

        {/* ── LEFT: Image Panel ── */}
        <div className="
          order-2 lg:order-1
          relative
          w-full lg:w-1/2
          h-[220px] sm:h-[280px] md:h-[340px] lg:h-full
          flex-shrink-0
        ">
          <Image
            src="/images/login4.jpeg"
            alt="Welcome Appliances Products"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />

          {/* Dark overlay + branding */}
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center lg:justify-start lg:pt-8 text-white text-center px-4">
            <Image
              src="/images/Welcome-Official-Logo.webp"
              alt="Welcome Appliances Logo"
              width={90}
              height={40}
              className="object-contain"
            />
            <div className="mt-3 hidden lg:block">
              <h2 className="text-lg font-semibold">Welcome Appliances</h2>
              <p className="text-sm opacity-80 mt-1">Order Management Software</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form Panel ── */}
        <div className="
          order-1 lg:order-2
          w-full lg:w-1/2
          flex items-center justify-center
          px-5 sm:px-8 lg:px-12
          py-6 lg:py-0
          overflow-y-auto
          flex-shrink-0
        ">
          <div className="w-full max-w-[400px]">

            {/* Logo (mobile only — desktop logo is on left panel) */}
            <div className="flex flex-col items-center mb-6 lg:mb-8">
              <Image
                src="/images/Welcome-Official-Logo.webp"
                alt="Welcome Appliances"
                width={130}
                height={60}
                className="object-contain"
              />
              <p className="text-xs text-gray-500 mt-2 tracking-widest uppercase">
                Order Management Software
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 rounded-lg bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400 text-black text-sm"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 pr-11 rounded-lg bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400 text-black text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition cursor-pointer disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-gray-800" />
                  Remember me
                </label>
                <Link
                  href="/forget-password"
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
            </form>
          </div>
        </div>

      </div>
    </>
  );
}