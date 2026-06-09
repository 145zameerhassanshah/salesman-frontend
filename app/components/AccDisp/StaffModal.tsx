// "use client";

// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import UserService from "@/app/components/services/userService";
// import { useSelector } from "react-redux";
// import { Eye, EyeOff } from "lucide-react";
// export default function StaffModal({
//   data,
//   role,
//   onClose,
//   onSave,
//   refetch,
// }: {
//   data: any;
//   role: string;
//   onClose: () => void;
//   onSave: (data: any) => void;
//   refetch: () => Promise<any>;
// }) {
//   const user = useSelector((state: any) => state?.user.user);
//   console.log(user.industry);
// const [form, setForm] = useState({
//   name: "",
//   email: "",
//   phone_number: "",
//   city: "",
//   address: "",
//   territory: "",
//   designation: "",
//   password: "",
//   status: "Active",
//   profile_image: null,
// });
// const [showPassword, setShowPassword] = useState(false);
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);

//   const validate = () => {
//     if (!form.name.trim()) return "Name is required";

//     if (!form.email.trim()) return "Email is required";
//     if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email";

//     if (!form.phone_number.trim()) return "Phone number is required";

//     if (!form.city.trim()) return "City is required";
//     if (!form.address.trim()) return "Address is required";

//     // 👉 Only for CREATE (not edit)
// // CREATE
// if (!data && !form.password.trim())
//   return "Password is required";

// // EDIT (optional but validate if entered)
// if (data && form.password && form.password.length < 6)
//   return "Password must be at least 6 characters";      
//     if (!data && form.password.length < 6)
//       return "Password must be at least 6 characters";

//     return null;
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async () => {
//     const error = validate();

//     if (error) {
//       toast.error(error);
//       return;
//     }

//     try {
//       setLoading(true);

//       const formData = new FormData();

//       formData.append("name", form.name);
//       formData.append("email", form.email);
//       formData.append("phone_number", form.phone_number);
//       formData.append("city", form.city);
//       formData.append("address", form.address);
//       formData.append("industry", user?.industry);
//       formData.append("status", form.status);
// formData.append("territory", form.territory || "");
// formData.append("designation", form.designation || "");
// if (!data) {
//   formData.append("password", form.password);
// }

// if (data && form.password) {
//   formData.append("password", form.password);
// }
//       if (file) {
//         formData.append("profile_image", file);
//       }

//       let res;

//       if (data?._id || data?.id) {
//         const userId = data._id || data.id;
//         res = await UserService.updateUser(userId, formData);
//       } else {
//         formData.append("user_type", role);
//         res = await UserService.createTeamMember(formData);
//       }

//       if (!res.success) {
//         toast.error(res.message);
//         return;
//       }

//       toast.success(res.message);
//       await refetch();
//       onSave(res.updatedUser || form);
//     } catch (err) {
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (data) {
//       setForm({
//         ...data,
//         profile_image: data.profile_image || null,
//         password: "", // never prefill password
//       });
//     }
//   }, [data]);
//   const isEdit = !!data;
//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg w-[400px] space-y-3 max-h-[90vh] overflow-y-auto">
//         <h2 className="text-lg font-semibold capitalize">
//           {data ? "Edit" : "Add"} {role}
//         </h2>

//         <label className="text-sm text-gray-500">
//           Full Name{!isEdit && <span className="text-red-500">*</span>}
//         </label>
//         <input
//           className="w-full border p-2 rounded"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//         />


//         <label className="text-sm text-gray-500">
//           Phone No{!isEdit && <span className="text-red-500">*</span>}
//         </label>
//         <input
//           className="w-full border p-2 rounded"
//           value={form.phone_number}
//           onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
//         />


//         <label className="text-sm text-gray-500">
//           City{!isEdit && <span className="text-red-500">*</span>}
//         </label>
//         <input
//           className="w-full border p-2 rounded"
//           value={form.city}
//           onChange={(e) => setForm({ ...form, city: e.target.value })}
//         />

//         <label className="text-sm text-gray-500">
//           Address{!isEdit && <span className="text-red-500">*</span>}
//         </label>
//         <input
//           className="w-full border p-2 rounded"
//           value={form.address}
//           onChange={(e) => setForm({ ...form, address: e.target.value })}
//         />
//         <label className="text-sm text-gray-500">
//           Email{!isEdit && <span className="text-red-500">*</span>}
//         </label>
//         <input
//           className="w-full border p-2 rounded"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />

//         {/* PASSWORD */}
// <label className="text-sm text-gray-500">
//   {isEdit ? "New Password (optional)" : "Password"}
//   {!isEdit && <span className="text-red-500">*</span>}
// </label>

// <div className="relative">
//   <input
//     type={showPassword ? "text" : "password"}
//     className="w-full border p-2 rounded pr-10"
//     value={form.password}
//     onChange={(e) => setForm({ ...form, password: e.target.value })}
//     placeholder={isEdit ? "Leave empty to keep current password" : ""}
//   />

//   <button
//     type="button"
//     onClick={() => setShowPassword(!showPassword)}
//     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//   >
//     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//   </button>
// </div>        <label className="text-sm text-gray-500">Status</label>
//         <select
//           className="w-full border p-2 rounded"
//           value={form.status}
//           onChange={(e) => setForm({ ...form, status: e.target.value })}
//         >
//           <option value="Active">Active</option>
//           <option value="Left">Left</option>
//         </select>

//         {/* IMAGE */}
//         <label className="text-sm text-gray-500">Profile Image</label>
//        {!isEdit && <p className="text-xs text-gray-400">Optional - JPG, PNG (Max 2MB)</p>}
//         <div className="border rounded-lg p-3">
//           <div className="flex items-center gap-3">
//             {/* HIDDEN INPUT */}
//             <input
//               type="file"
//               accept="image/*"
//               id="profileUpload"
//               onChange={(e) => setFile(e.target.files?.[0] || null)}
//               className="hidden"
//             />

//             {/* BUTTON */}
//             <label
//               htmlFor="profileUpload"
//               className="px-4 py-2 bg-gray-100 border rounded-lg cursor-pointer hover:bg-gray-200 text-sm"
//             >
//               Browse Image
//             </label>

//             {/* FILE NAME */}
//             <span className="text-sm text-gray-500">
//               {file ? file.name : "No file chosen"}
//             </span>
//           </div>

//           <p className="text-xs text-gray-400 mt-2">JPG, PNG (Max 2MB)</p>
//         </div>

//         {/* ACTIONS */}
//         <div className="flex justify-end gap-2 pt-2">
//           <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
//             Cancel
//           </button>

//           <button type="button"
//             onClick={handleSubmit} // ✅ HERE
//             disabled={loading}
//             className="px-4 py-2 bg-black text-white rounded"
//           >
//             {loading ? "Saving..." : "Save"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserService from "@/app/components/services/userService";
import { useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";

type StaffForm = {
  name: string;
  email: string;
  phone_number: string;
  city: string;
  address: string;
  territory: string;
  designation: string;
  password: string;
  status: "Active" | "Left";
  profile_image: string | null;
};

const emptyForm: StaffForm = {
  name: "",
  email: "",
  phone_number: "",
  city: "",
  address: "",
  territory: "",
  designation: "",
  password: "",
  status: "Active",
  profile_image: null,
};

export default function StaffModal({
  data,
  role,
  onClose,
  onSave,
  refetch,
}: {
  data: any;
  role: string;
  onClose: () => void;
  onSave: (data: any) => void;
  refetch: () => Promise<any>;
}) {
  const user = useSelector((state: any) => state?.user?.user);

  const [form, setForm] = useState<StaffForm>(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const isEdit = !!data;

  const industryId =
    typeof user?.industry === "object"
      ? user?.industry?._id
      : user?.industry;

  const validate = () => {
    if (!form.name.trim()) return "Name is required";

    if (!form.email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return "Invalid email";

    if (!form.phone_number.trim()) return "Phone number is required";

    if (!form.city.trim()) return "City is required";
    if (!form.address.trim()) return "Address is required";

    if (!isEdit && !form.password.trim()) return "Password is required";

    if (!isEdit && form.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (isEdit && form.password && form.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (!industryId) return "Industry not found";

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      e.target.value = "";
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (loading) return;

    const error = validate();

    if (error) {
      toast.error(error);
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("email", form.email.trim().toLowerCase());
      formData.append("phone_number", form.phone_number.trim());
      formData.append("city", form.city.trim());
      formData.append("address", form.address.trim());
      formData.append("industry", String(industryId));
      formData.append("status", form.status);
      formData.append("territory", form.territory.trim());
      formData.append("designation", form.designation.trim());

      if (!isEdit) {
        formData.append("user_type", role);
        formData.append("password", form.password);
      }

      if (isEdit && form.password.trim()) {
        formData.append("password", form.password);
      }

      if (file) {
        formData.append("profile_image", file);
      }

      let res;

      if (isEdit) {
        const userId = data?._id || data?.id;
        res = await UserService.updateUser(userId, formData);
      } else {
        res = await UserService.createTeamMember(formData);
      }

      if (!res?.success) {
        toast.error(res?.message || "Operation failed");
        return;
      }

      toast.success(res?.message || "Saved successfully");

      await refetch();

const savedUser =
  "updatedUser" in res && res.updatedUser
    ? res.updatedUser
    : "user" in res && res.user
    ? res.user
    : form;

onSave(savedUser);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setForm({
        name: data?.name || "",
        email: data?.email || "",
        phone_number: data?.phone_number || "",
        city: data?.city || "",
        address: data?.address || "",
        territory: data?.territory || "",
        designation: data?.designation || "",
        password: "",
        status: data?.status || "Active",
        profile_image: data?.profile_image || null,
      });
    } else {
      setForm(emptyForm);
    }

    setFile(null);
    setShowPassword(false);
  }, [data]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3">
      <div className="bg-white p-6 rounded-lg w-full max-w-[420px] space-y-3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold capitalize">
          {isEdit ? "Edit" : "Add"} {role}
        </h2>

        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-3"
        >
          {/* Browser autofill trap */}
          <input
            type="text"
            name="fake_username"
            autoComplete="username"
            className="hidden"
            tabIndex={-1}
          />

          <input
            type="password"
            name="fake_password"
            autoComplete="new-password"
            className="hidden"
            tabIndex={-1}
          />

          <div>
            <label className="text-sm text-gray-500">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id={`${role}-name`}
              name={`${role}_name`}
              type="text"
              autoComplete="name"
              className="w-full border p-2 rounded"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Phone No <span className="text-red-500">*</span>
            </label>
            <input
              id={`${role}-phone`}
              name={`${role}_phone_number`}
              type="tel"
              autoComplete="tel"
              className="w-full border p-2 rounded"
              value={form.phone_number}
              onChange={(e) =>
                setForm({ ...form, phone_number: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              City <span className="text-red-500">*</span>
            </label>
            <input
              id={`${role}-city`}
              name={`${role}_city`}
              type="text"
              autoComplete="address-level2"
              className="w-full border p-2 rounded"
              value={form.city}
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              id={`${role}-address`}
              name={`${role}_address`}
              type="text"
              autoComplete="street-address"
              className="w-full border p-2 rounded"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id={`${role}-email`}
              name={`${role}_email`}
              type="email"
              autoComplete="off"
              className="w-full border p-2 rounded"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              {isEdit ? "New Password (optional)" : "Password"}
              {!isEdit && <span className="text-red-500"> *</span>}
            </label>

            <div className="relative">
              <input
                id={`${role}-password`}
                name={`${role}_new_password`}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="w-full border p-2 rounded pr-10"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder={
                  isEdit ? "Leave empty to keep current password" : ""
                }
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Territory</label>
            <input
              id={`${role}-territory`}
              name={`${role}_territory`}
              type="text"
              autoComplete="off"
              className="w-full border p-2 rounded"
              value={form.territory}
              onChange={(e) =>
                setForm({ ...form, territory: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Designation</label>
            <input
              id={`${role}-designation`}
              name={`${role}_designation`}
              type="text"
              autoComplete="organization-title"
              className="w-full border p-2 rounded"
              value={form.designation}
              onChange={(e) =>
                setForm({ ...form, designation: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Status</label>
            <select
              id={`${role}-status`}
              name={`${role}_status`}
              className="w-full border p-2 rounded"
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as "Active" | "Left",
                })
              }
            >
              <option value="Active">Active</option>
              <option value="Left">Left</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">Profile Image</label>

            <p className="text-xs text-gray-400">
              Optional - JPG, PNG, WEBP up to 2MB
            </p>

            <div className="border rounded-lg p-3 mt-1">
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  id={`${role}-profileUpload`}
                  name={`${role}_profile_image`}
                  onChange={handleFileChange}
                  className="hidden"
                />

                <label
                  htmlFor={`${role}-profileUpload`}
                  className="px-4 py-2 bg-gray-100 border rounded-lg cursor-pointer hover:bg-gray-200 text-sm"
                >
                  Browse Image
                </label>

                <span className="text-sm text-gray-500 truncate">
                  {file
                    ? file.name
                    : form.profile_image
                    ? "Current image saved"
                    : "No file chosen"}
                </span>
              </div>

              {form.profile_image && !file && (
                <div className="mt-3">
                  <img
                    src={form.profile_image}
                    alt="Current profile"
                    className="w-14 h-14 rounded-lg object-cover border"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}