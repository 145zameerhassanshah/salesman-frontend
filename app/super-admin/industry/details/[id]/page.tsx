// "use client";

// import UserService from "@/app/components/services/userService";
// import AuthService from "@/app/components/services/authService";
// import { useUsers } from "@/hooks/useUsers";
// import { useParams, useRouter } from "next/navigation";
// import { useState } from "react";
// import toast from "react-hot-toast";

// export default function BusinessDetail() {
//   const router = useRouter();
//   const params = useParams();
//   const { data, refetch } = useUsers(params?.id as string);
// const [showPassword, setShowPassword] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [editId, setEditId] = useState<string | null>(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone_number: "",
//     whatsapp_number: "",
//     city: "",
//     address: "",
//     password: "",
//   });

//   const [profileImage, setProfileImage] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);

//   /* ================= HANDLE CHANGE ================= */

//   const handleChange = (e: any) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   /* ================= IMAGE ================= */

//   const handleFileChange = (e: any) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setProfileImage(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   /* ================= OPEN ADD ================= */

//   const openAdd = () => {
//     resetForm();
//     setIsEdit(false);
//     setShowModal(true);
//   };

//   /* ================= OPEN EDIT ================= */

//   const openEdit = (user: any) => {
//     setEditId(user._id);
//     setIsEdit(true);

//     setFormData({
//       name: user.name || "",
//       email: user.email || "",
//       phone_number: user.phone_number || "",
//       whatsapp_number: user.whatsapp_number || "",
//       city: user.city || "",
//       address: user.address || "",
//       password: "",
//     });

//     setPreview(user?.profile_image);

//     setShowModal(true);
//   };

//   /* ================= SUBMIT ================= */

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     try {
//       const fd = new FormData();

//       Object.entries(formData).forEach(([k, v]) => {
//         if (v) fd.append(k, v as string);
//       });

//       if (!isEdit) {
//         fd.append("industry", params?.id as string);
//         fd.append("user_type", "admin");
//       }

//       if (profileImage) fd.append("profile_image", profileImage);

//       const res = isEdit
//         ? await UserService.updateUser(editId, fd)
//         : await UserService.createAdmin(fd);

//       if (!res?.success) return toast.error(res?.message);

//       toast.success(isEdit ? "Updated" : "Created");
//       setShowModal(false);
//       resetForm();
//       refetch();

//     } catch {
//       toast.error("Something went wrong");
//     }
//   };

//   /* ================= DELETE ================= */

//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this user?")) return;

//     try {
//       await AuthService.deleteUser(id);
//       toast.success("Deleted");
//       refetch();
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   /* ================= RESET ================= */

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       email: "",
//       phone_number: "",
//       whatsapp_number: "",
//       city: "",
//       address: "",
//       password: "",
//     });
//     setProfileImage(null);
//     setPreview(null);
//   };

//   return (
//     <div className="p-8 bg-white min-h-screen text-black">

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">

//         <button
//           onClick={() => router.push("/super-admin")}
//           className="text-sm text-black-600 hover:underline cursor-pointer"
//         >
//           ← Back
//         </button>

//         <h1 className="text-2xl font-bold">Industry Management</h1>

//         <button
//           onClick={openAdd}
//           className="bg-black text-white px-5 py-2 rounded-lg"
//         >
//           + Add Admin
//         </button>
//       </div>

//       {/* USERS */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
//         {data?.userByIndustry?.map((u: any) => (
//           <RoleCard
//             key={u._id}
//             {...u}
//             onEdit={() => openEdit(u)}
//             onDelete={() => handleDelete(u._id)}
//           />
//         ))}
//       </div>

//       {/* MODAL */}
//       {showModal && (
//         <Modal
//           title={isEdit ? "Edit Admin" : "Add Admin"}
//           onClose={() => setShowModal(false)}
//         >
//           <Form
//             formData={formData}
//             handleChange={handleChange}
//             handleFileChange={handleFileChange}
//             preview={preview}
//             onSubmit={handleSubmit}
//             isEdit={isEdit}
//             showPassword={showPassword}
//             setShowPassword={setShowPassword}
//           />
//         </Modal>
//       )}
//     </div>
//   );
// }


// /* ================= CARD ================= */

// function RoleCard({ name, user_type, profile_image, onEdit, onDelete }: any) {

//   const imageUrl = profile_image
//   return (
//     <div className="border p-4 rounded-lg flex flex-col gap-3 items-center text-center">
      
//       <img
//         src={imageUrl}
//         alt="profile"
//         className="w-14 h-14 rounded-full object-cover border"
//       />

//       <div>
//         <h3 className="font-semibold">{name}</h3>
//         <p className="text-xs text-gray-500">{user_type}</p>
//       </div>

//       <div className="flex gap-3 text-sm">
//         <button onClick={onEdit} className="text-blue-500">Edit</button>
//         <button onClick={onDelete} className="text-red-500">Delete</button>
//       </div>

//     </div>
//   );
// }/* ================= MODAL ================= */

// function Modal({ children, title, onClose }: any) {
//   return (
//     <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-xl w-[450px]">
//         <h2 className="text-lg font-bold mb-4">{title}</h2>
//         {children}
//         <button onClick={onClose} className="mt-4 text-sm text-gray-500">
//           Close
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ================= FORM ================= */

// function Form({ formData, handleChange, handleFileChange, preview, onSubmit, isEdit, showPassword, setShowPassword}: any) {
//   return (
//     <form className="space-y-3" onSubmit={onSubmit}>

//       {/* IMAGE */}
//       <div className="flex flex-col items-center gap-2">
//         <img
//           src={preview || "/profile.png"}
//           className="w-16 h-16 rounded-full object-cover border"
//         />
//         <input type="file" onChange={handleFileChange} />
//       </div>

//       {/* FIELDS */}
// {Object.entries(formData).map(([key, val]) => (
//   <div key={key}>
//     <label className="text-xs text-gray-600 capitalize">
//       {key.replace("_", " ")}
//     </label>

//     {key === "password" ? (
//       <div className="relative">
//         <input
//           type={showPassword ? "text" : "password"}
//           name={key}
//           value={val as string}
//           onChange={handleChange}
//           className="border p-2 w-full rounded pr-12"
//         />

//         <button
//           type="button"
//           onClick={() => setShowPassword(!showPassword)}
//           className="absolute right-2 top-2 text-xs text-gray-500"
//         >
//           {showPassword ? "Hide" : "Show"}
//         </button>
//       </div>
//     ) : (
//       <input
//         type="text"
//         name={key}
//         value={val as string}
//         onChange={handleChange}
//         className="border p-2 w-full rounded"
//       />
//     )}
//   </div>
// ))}
//       <button className="bg-black text-white w-full py-2 rounded mt-2">
//         {isEdit ? "Update" : "Create"}
//       </button>

//     </form>
//   );
// }


"use client";

import AuthService from "@/app/components/services/authService";
import { Eye, Pencil, Trash2, X, Loader2, Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function BusinessDetailPage() {
  const router = useRouter();
  const params = useParams();

  const industryId = params?.id as string;

  const USERS_PER_PAGE = 8;

  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [detailUser, setDetailUser] = useState<any>(null);

  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    phone_number: "",
    whatsapp_number: "",
    city: "",
    address: "",
    password: "",
    status: "Active",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const loadUsers = async (page = currentPage) => {
    if (!industryId) return;

    const requestId = ++requestIdRef.current;
    setLoading(true);

    try {
      const res = await AuthService.getUsersByIndustryPaginated(industryId, {
        page,
        limit: USERS_PER_PAGE,
        search: debouncedSearch,
        user_type: "admin",
      });

      if (requestId !== requestIdRef.current) return;

      if (res?.success) {
        setUsers(res.userByIndustry || []);
        setPagination(
          res.pagination || {
            page,
            limit: USERS_PER_PAGE,
            total: 0,
            totalPages: 1,
          }
        );
      } else {
        setUsers([]);
        setPagination({
          page: 1,
          limit: USERS_PER_PAGE,
          total: 0,
          totalPages: 1,
        });

        toast.error(res?.message || "Failed to load users");
      }
    } catch {
      if (requestId !== requestIdRef.current) return;
      toast.error("Failed to load users");
      setUsers([]);
      setPagination({
        page: 1,
        limit: USERS_PER_PAGE,
        total: 0,
        totalPages: 1,
      });
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadUsers(currentPage);
  }, [industryId, currentPage, debouncedSearch]);

  const totalRecords = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

  const showingFrom =
    totalRecords === 0 ? 0 : (currentPage - 1) * USERS_PER_PAGE + 1;

  const showingTo = Math.min(currentPage * USERS_PER_PAGE, totalRecords);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) pages.push(i);

    return pages;
  }, [currentPage, totalPages]);

  const goToPage = (page: number) => {
    if (loading) return;
    if (page < 1 || page > totalPages) return;
    if (page === currentPage) return;

    setCurrentPage(page);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone_number: "",
      whatsapp_number: "",
      city: "",
      address: "",
      password: "",
      status: "Active",
    });

    setProfileImage(null);
    setPreview(null);
    setEditId(null);
    setIsEdit(false);
    setShowPassword(false);
  };

  const openAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (user: any) => {
    setEditId(user._id);
    setIsEdit(true);

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone_number: user.phone_number || "",
      whatsapp_number: user.whatsapp_number || "",
      city: user.city || "",
      address: user.address || "",
      password: "",
      status: user.status || "Active",
    });

    setPreview(user?.profile_image || null);
    setProfileImage(null);
    setShowModal(true);
  };

  const openDetails = async (user: any) => {
    setDetailUser(user);

    try {
      const res = await AuthService.getUserById(user._id);

      if (res?.success && res?.user) {
        setDetailUser(res.user);
      }
    } catch {
      toast.error("Failed to load user details");
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Invalid email";
    if (!formData.phone_number.trim()) return "Phone number is required";
    if (!formData.whatsapp_number.trim()) return "WhatsApp number is required";
    if (!formData.city.trim()) return "City is required";
    if (!formData.address.trim()) return "Address is required";

    if (!isEdit && !formData.password.trim()) return "Password is required";
    if (formData.password && formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return null;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const error = validateForm();
    if (error) return toast.error(error);

    try {
      const fd = new FormData();

      Object.entries(formData).forEach(([key, value]: any) => {
        if (value !== null && value !== undefined && value !== "") {
          fd.append(key, String(value));
        }
      });

      if (!isEdit) {
        fd.append("industry", industryId);
        fd.append("user_type", "admin");
      }

      if (profileImage) {
        fd.append("profile_image", profileImage);
      }

      const res =
        isEdit && editId
          ? await AuthService.updateUser(editId, fd)
          : await AuthService.createTeamMember(fd);

      if (!res?.success) {
        return toast.error(res?.message || "Save failed");
      }

      toast.success(res?.message || (isEdit ? "User updated" : "User created"));

      setShowModal(false);
      resetForm();
      await loadUsers(currentPage);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!deleteId || deleteLoading) return;

    try {
      setDeleteLoading(true);

      const res = await AuthService.deleteUser(deleteId);

      if (!res?.success) {
        return toast.error(res?.message || "Delete failed");
      }

      toast.success(res?.message || "User deleted");
      setDeleteId(null);
      await loadUsers(currentPage);
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  const statusCls = (status: string) =>
    status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-600";

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={() => router.push("/super-admin")}
          className="text-sm text-gray-600 hover:underline w-fit"
        >
          ← Back
        </button>

        <h1 className="text-xl md:text-2xl font-bold">Industry Admins</h1>

        <button
          type="button"
          onClick={openAdd}
          className="bg-black text-white px-5 py-2 rounded-lg text-sm"
        >
          + Add Admin
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative mb-4 max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search admin..."
          className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* USERS GRID */}
      {loading && users.length === 0 ? (
        <div className="py-16 flex items-center justify-center gap-2 text-gray-400 text-sm">
          <Loader2 size={16} className="animate-spin" />
          Loading admins...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {users.map((u: any) => (
            <div
              key={u._id}
              className="border border-gray-200 p-4 rounded-2xl flex flex-col gap-3 items-center text-center shadow-sm bg-white"
            >
              <img
                src={u?.profile_image || "/profile.png"}
                alt={u?.name || "profile"}
                className="w-16 h-16 rounded-full object-cover border"
              />

              <div>
                <h3 className="font-semibold text-gray-900">{u?.name}</h3>
                <p className="text-xs text-gray-500">{u?.email}</p>

                <span
                  className={`inline-block mt-2 px-2.5 py-1 rounded-lg text-xs font-medium ${statusCls(
                    u?.status
                  )}`}
                >
                  {u?.status || "-"}
                </span>
              </div>

              <div className="flex gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => openDetails(u)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                  title="Details"
                >
                  <Eye size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => openEdit(u)}
                  className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteId(u._id)}
                  className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {!loading && users.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-400 text-sm border border-gray-200 rounded-2xl">
              No admins found.
            </div>
          )}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-5 text-sm">
        <p className="text-gray-500">
          Showing {showingFrom}-{showingTo} of {totalRecords} admins
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40"
            >
              Prev
            </button>

            {pageNumbers.map((page) => (
              <button
                type="button"
                key={page}
                onClick={() => goToPage(page)}
                disabled={loading}
                className={`px-3 py-1.5 border rounded-lg ${
                  currentPage === page
                    ? "bg-black text-white border-black"
                    : "border-gray-200"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm">
            <h2 className="font-semibold text-lg text-center mb-2">
              Delete Admin?
            </h2>

            <p className="text-sm text-gray-500 text-center mb-5">
              Are you sure you want to delete this admin? This action cannot be
              undone.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={deleteLoading}
                className="flex-1 border py-2 rounded-xl text-sm disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteLoading && <Loader2 size={14} className="animate-spin" />}
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {detailUser && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Admin Details</h2>

              <button
                type="button"
                onClick={() => setDetailUser(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4 bg-gray-50 rounded-2xl p-4">
              <img
                src={detailUser?.profile_image || "/profile.png"}
                className="w-16 h-16 rounded-2xl object-cover border"
                alt={detailUser?.name || "User"}
              />

              <div>
                <h3 className="font-semibold">{detailUser?.name || "-"}</h3>
                <p className="text-sm text-gray-500">
                  {detailUser?.email || "-"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <Info label="Name" value={detailUser?.name} />
              <Info label="Email" value={detailUser?.email} />
              <Info label="Phone" value={detailUser?.phone_number} />
              <Info label="WhatsApp" value={detailUser?.whatsapp_number} />
              <Info label="City" value={detailUser?.city} />
              <Info label="Status" value={detailUser?.status} />
              <Info label="Role" value={detailUser?.user_type} />
              <Info
                label="Joined"
                value={
                  detailUser?.createdAt
                    ? new Date(detailUser.createdAt).toLocaleDateString("en-GB")
                    : "-"
                }
              />

              <div className="sm:col-span-2">
                <Info label="Address" value={detailUser?.address} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {isEdit ? "Edit Admin" : "Add Admin"}
            </h2>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="flex flex-col items-center gap-2">
                <img
                  src={preview || "/profile.png"}
                  className="w-16 h-16 rounded-full object-cover border"
                  alt="profile"
                />

                <input type="file" accept="image/*" onChange={handleFileChange} />
              </div>

              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

              <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

              <Input
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />

              <Input
                label="WhatsApp Number"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleChange}
              />

              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />

              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />

              <div>
                <label className="text-xs text-gray-600">
                  {isEdit ? "New Password Optional" : "Password"}
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border p-2 w-full rounded pr-12"
                    placeholder={isEdit ? "Leave empty to keep old password" : ""}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-2 text-xs text-gray-500"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-600">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                >
                  <option value="Active">Active</option>
                  <option value="Left">Left</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="w-full border py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-black text-white w-full py-2 rounded-lg"
                >
                  {isEdit ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, name, value, onChange }: any) {
  return (
    <div>
      <label className="text-xs text-gray-600">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="border p-2 w-full rounded"
      />
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="font-medium text-gray-800 break-words">
        {value || "-"}
      </p>
    </div>
  );
}