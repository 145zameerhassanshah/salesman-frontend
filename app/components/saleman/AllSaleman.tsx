"use client";

import Link from "next/link";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  History,
  Loader2,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import UserService from "@/app/components/services/authService";
import toast from "react-hot-toast";

const statusStyle: any = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-red-100 text-red-600",
};

export default function AllSaleman() {
  const user = useSelector((state: any) => state.user.user);

  const SALESMEN_PER_PAGE = 5;

  const [salesmen, setSalesmen] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [listLoading, setListLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState<any>({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    city: "",
    address: "",
    territory: "",
    designation: "",
    status: "Active",
    profile_image: null,
  });

  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [detailUser, setDetailUser] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [activityUser, setActivityUser] = useState<any>(null);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const requestIdRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const loadSalesmen = async (page = currentPage) => {
    if (!user?.industry) return;

    const requestId = ++requestIdRef.current;
    setListLoading(true);

    try {
      const res = await UserService.getUsersByIndustryPaginated(user.industry, {
        page,
        limit: SALESMEN_PER_PAGE,
        search: debouncedSearch,
        user_type: "salesman",
        status: statusFilter,
      });

      if (requestId !== requestIdRef.current) return;

      if (res?.success) {
        setSalesmen(res.userByIndustry || []);
        setPagination(
          res.pagination || {
            page,
            limit: SALESMEN_PER_PAGE,
            total: 0,
            totalPages: 1,
          }
        );
      } else {
        setSalesmen([]);
        setPagination({
          page: 1,
          limit: SALESMEN_PER_PAGE,
          total: 0,
          totalPages: 1,
        });
      }
    } catch {
      if (requestId !== requestIdRef.current) return;

      setSalesmen([]);
      setPagination({
        page: 1,
        limit: SALESMEN_PER_PAGE,
        total: 0,
        totalPages: 1,
      });

      toast.error("Failed to load salesmen");
    } finally {
      if (requestId === requestIdRef.current) {
        setListLoading(false);
      }
    }
  };

  useEffect(() => {
    loadSalesmen(currentPage);
  }, [user?.industry, currentPage, debouncedSearch, statusFilter]);

  const totalRecords = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

  const showingFrom =
    totalRecords === 0 ? 0 : (currentPage - 1) * SALESMEN_PER_PAGE + 1;

  const showingTo = Math.min(currentPage * SALESMEN_PER_PAGE, totalRecords);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) pages.push(i);

    return pages;
  }, [currentPage, totalPages]);

  const goToPage = (page: number) => {
    if (listLoading) return;
    if (page < 1 || page > totalPages) return;
    if (page === currentPage) return;
    setCurrentPage(page);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setForm({
      name: item.name || "",
      email: item.email || "",
      password: "",
      phone_number: item.phone_number || "",
      city: item.city || "",
      address: item.address || "",
      territory: item.territory || "",
      designation: item.designation || "",
      status: item.status || "Active",
      profile_image: null,
    });
  };

  const closeEdit = () => {
    setEditItem(null);
    setForm({
      name: "",
      email: "",
      password: "",
      phone_number: "",
      city: "",
      address: "",
      territory: "",
      designation: "",
      status: "Active",
      profile_image: null,
    });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev: any) => ({ ...prev, profile_image: file }));
  };

  const handleUpdate = async () => {
    if (!editItem?._id) return;

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== undefined && form[key] !== "") {
          formData.append(key, form[key]);
        }
      });

      const res = await UserService.updateUser(editItem._id, formData);

      if (!res?.success) {
        return toast.error(res?.message || "Update failed");
      }

      toast.success(res?.message || "Salesman updated");
      closeEdit();
      await loadSalesmen(currentPage);
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    }
  };

  const handleDelete = async () => {
    if (!confirmId || deleteLoading) return;

    try {
      setDeleteLoading(true);

      const res = await UserService.deleteUser(confirmId);

      if (!res?.success) {
        return toast.error(res?.message || "Delete failed");
      }

      toast.success(res?.message || "Salesman deleted");
      setConfirmId(null);
      await loadSalesmen(currentPage);
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDetails = async (item: any) => {
    if (!item?._id) return;

    setDetailUser(item);
    setDetailLoading(true);

    try {
      const res = await UserService.getUserById(item._id);

      if (!res?.success) {
        toast.error(res?.message || "Failed to load salesman details");
        return;
      }

      setDetailUser(res?.user || item);
    } catch {
      toast.error("Failed to load salesman details");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetails = () => {
    setDetailUser(null);
  };

  const openActivity = async (item: any) => {
    if (!item?._id) return;

    setActivityUser(item);
    setActivityLogs([]);
    setActivityLoading(true);

    try {
      const res = await UserService.getUserAuditLogs(item._id, 1, 20);

      if (res?.success) {
        setActivityLogs(res?.data || res?.logs || []);
      } else {
        setActivityLogs([]);
      }
    } catch {
      toast.error("Failed to load activity");
      setActivityLogs([]);
    } finally {
      setActivityLoading(false);
    }
  };

  const closeActivity = () => {
    setActivityUser(null);
    setActivityLogs([]);
  };

  const getRoleLabel = (role: string) => {
    const value = String(role || "").toLowerCase();

    if (value === "admin") return "Admin";
    if (value === "salesman") return "Salesman";
    if (value === "dispatcher") return "Dispatcher";
    if (value === "manager") return "Manager";
    if (value === "accountant") return "Accountant";
    if (value === "super_admin") return "Super Admin";

    return "User";
  };

  const getPerformedByText = (log: any) => {
    const name =
      log?.performedByName ||
      log?.performedBy?.name ||
      log?.createdBy?.name ||
      log?.updatedBy?.name ||
      "System";

    const role =
      log?.performedByRole ||
      log?.performedBy?.user_type ||
      log?.performedBy?.role ||
      log?.createdBy?.user_type ||
      log?.updatedBy?.user_type ||
      "";

    return role ? `${name} (${getRoleLabel(role)})` : name;
  };

  const formatAction = (action: string) => {
    return String(action || "ACTION")
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatField = (field: string) => {
    const labels: any = {
      name: "Name",
      email: "Email",
      phone_number: "Phone",
      city: "City",
      address: "Address",
      territory: "Territory",
      designation: "Designation",
      status: "Status",
      user_type: "Role",
      profile_image: "Profile Image",
      industry: "Business",
    };

    return labels[field] || String(field).replaceAll("_", " ");
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "-";

    if (typeof value === "boolean") return value ? "Yes" : "No";

    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
      return new Date(value).toLocaleDateString("en-GB");
    }

    if (typeof value === "object") {
      if (value?.businessName) return value.businessName;
      if (value?.name) return value.name;
      if (value?.email) return value.email;
      return "-";
    }

    return String(value);
  };

  const formatDate = (value: any) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("en-GB");
  };

  const hiddenAuditFields = [
    "_id",
    "__v",
    "password",
    "industry",
    "businessId",
    "resetPasswordToken",
    "resetPasswordExpiry",
    "otp",
    "otpExpiry",
    "email_verification_token",
    "email_verified_at",
    "blocked_until",
    "block_reason",
    "reject_reason",
    "createdAt",
    "updatedAt",
  ];

  const DetailBox = ({ label, value }: { label: string; value: any }) => (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-800 break-words">
        {value || "-"}
      </p>
    </div>
  );

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder-gray-400";

  const labelClass = "text-xs font-medium text-gray-500 mb-1 block";

  return (
    <div className="w-full max-w-7xl mx-auto px-2 py-3 md:px-6 md:py-6 overflow-hidden">
      {/* DELETE CONFIRM MODAL */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-sm">
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-50 mx-auto mb-3">
              <Trash2 size={20} className="text-red-500" />
            </div>

            <h2 className="text-base font-semibold text-gray-900 text-center mb-1">
              Delete Salesman
            </h2>

            <p className="text-sm text-gray-500 text-center mb-5">
              Are you sure you want to delete this salesman? This action cannot
              be undone.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                disabled={deleteLoading}
                className="flex-1 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Salesman Details
                </h2>
                <p className="text-xs text-gray-400">
                  Complete salesman profile information
                </p>
              </div>

              <button
                type="button"
                onClick={closeDetails}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {detailLoading ? (
              <div className="py-14 flex items-center justify-center gap-2 text-sm text-gray-400">
                <Loader2 size={16} className="animate-spin" />
                Loading details...
              </div>
            ) : (
              <div className="overflow-y-auto flex-1 p-4 space-y-4">
                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
                  <img
                    src={detailUser?.profile_image || "/profile.png"}
                    alt={detailUser?.name || "Salesman"}
                    className="w-16 h-16 rounded-2xl object-cover border border-gray-200"
                  />

                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 truncate">
                      {detailUser?.name || "-"}
                    </h3>

                    <p className="text-sm text-gray-500 truncate">
                      {detailUser?.email || "-"}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${
                          statusStyle[detailUser?.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {detailUser?.status || "-"}
                      </span>

                      <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-600">
                        {getRoleLabel(detailUser?.user_type)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DetailBox label="Name" value={detailUser?.name} />
                  <DetailBox label="Email" value={detailUser?.email} />
                  <DetailBox label="Phone Number" value={detailUser?.phone_number} />
                  <DetailBox label="Role" value={getRoleLabel(detailUser?.user_type)} />
                  <DetailBox label="Status" value={detailUser?.status} />
                  <DetailBox label="City" value={detailUser?.city} />
                  <DetailBox label="Territory" value={detailUser?.territory} />
                  <DetailBox label="Designation" value={detailUser?.designation} />
                  <DetailBox label="Joined Date" value={formatDate(detailUser?.createdAt)} />
                  <DetailBox label="Last Updated" value={formatDate(detailUser?.updatedAt)} />
                  <DetailBox
                    label="Business / Industry"
                    value={formatValue(detailUser?.industry)}
                  />

                  <div className="sm:col-span-2">
                    <DetailBox label="Address" value={detailUser?.address} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ACTIVITY MODAL */}
      {activityUser && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Salesman Activity
                </h2>
                <p className="text-xs text-gray-400">
                  {activityUser?.name || "-"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeActivity}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4 space-y-2">
              {activityLoading ? (
                <div className="py-10 flex items-center justify-center gap-2 text-sm text-gray-400">
                  <Loader2 size={16} className="animate-spin" />
                  Loading activity...
                </div>
              ) : activityLogs.length === 0 ? (
                <div className="py-10 text-center text-gray-400 text-sm">
                  No activity found
                </div>
              ) : (
                activityLogs.map((log: any, i: number) => (
                  <div
                    key={log?._id || i}
                    className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-gray-700">
                        {formatAction(log?.action)}
                      </p>

                      <p className="text-gray-400 whitespace-nowrap">
                        {log?.createdAt
                          ? new Date(log.createdAt).toLocaleString()
                          : "-"}
                      </p>
                    </div>

                    <p className="text-gray-500 mt-1">
                      {log?.description || "Action performed"}
                    </p>

                    <p className="text-gray-400 mt-1">
                      by {getPerformedByText(log)}
                    </p>

                    {log?.changes && Object.keys(log.changes).length > 0 && (
                      <div className="mt-2 space-y-1">
                        {Object.entries(log.changes)
                          .filter(
                            ([field]) => !hiddenAuditFields.includes(field)
                          )
                          .slice(0, 8)
                          .map(([field, value]: any) => (
                            <p key={field} className="text-gray-500">
                              <span className="font-medium">
                                {formatField(field)}
                              </span>
                              : {formatValue(value?.from)} →{" "}
                              {formatValue(value?.to)}
                            </p>
                          ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">
          Salesmen
        </h1>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative hidden md:block w-52">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search salesmen..."
              className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="hidden md:block bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
          >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Left">Inactive</option>
          </select>

          <Link href="/saleman/add-saleman">
            <button
              type="button"
              className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-2 rounded-xl text-xs md:text-sm font-medium hover:bg-gray-700 transition cursor-pointer whitespace-nowrap"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Add Salesman</span>
              <span className="sm:hidden">Add</span>
            </button>
          </Link>
        </div>
      </div>

      {/* MOBILE FILTERS */}
      <div className="md:hidden mb-3 space-y-2">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search salesmen..."
            className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
        >
          <option value="">All Salesmen</option>
          <option value="Active">Active Only</option>
          <option value="Left">Inactive Only</option>
        </select>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
        {listLoading && salesmen.length > 0 && (
          <div className="absolute right-4 top-3 z-10 flex items-center gap-1 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-lg">
            <Loader2 size={12} className="animate-spin" />
            Updating...
          </div>
        )}

        <div className="overflow-x-auto">
          <table
            className={`w-full min-w-[850px] text-sm ${
              listLoading && salesmen.length > 0 ? "opacity-60" : ""
            }`}
          >
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4 text-left font-medium">Salesman</th>
                <th className="py-3 px-4 text-left font-medium">Phone</th>
                <th className="py-3 px-4 text-left font-medium">Email</th>
                <th className="py-3 px-4 text-left font-medium">Designation</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
                <th className="py-3 px-4 text-left font-medium">Joined</th>
                <th className="py-3 px-4 text-center font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {!listLoading &&
                salesmen.map((s: any) => (
                  <tr
                    key={s._id}
                    className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={s?.profile_image || "/profile.png"}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
                          alt={s?.name || "Salesman"}
                        />
                        <span className="font-medium text-gray-800 truncate max-w-[140px]">
                          {s?.name || "-"}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      {s?.phone_number || "—"}
                    </td>

                    <td className="py-3 px-4 text-gray-600 truncate max-w-[170px]">
                      {s?.email || "-"}
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      {s?.designation || "N/A"}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 text-xs rounded-lg font-medium ${
                          statusStyle[s?.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {s?.status || "-"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {formatDate(s?.createdAt)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openDetails(s)}
                          className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                          title="Details"
                        >
                          <Eye size={14} className="text-gray-600" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openActivity(s)}
                          className="p-1.5 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
                          title="Activity"
                        >
                          <History size={14} className="text-purple-600" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openEdit(s)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                          title="Edit"
                        >
                          <Pencil size={14} className="text-blue-600" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setConfirmId(s._id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {listLoading && salesmen.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-gray-400 text-sm"
                  >
                    Loading salesmen...
                  </td>
                </tr>
              )}

              {!listLoading && salesmen.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-gray-400 text-sm"
                  >
                    No salesmen found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* DESKTOP PAGINATION */}
        <div className="flex justify-between items-center gap-3 px-4 py-3 border-t border-gray-100 text-sm">
          <p className="text-gray-500">
            Showing {showingFrom}-{showingTo} of {totalRecords} salesmen
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1 || listLoading}
                className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40"
              >
                Prev
              </button>

              {pageNumbers.map((page) => (
                <button
                  type="button"
                  key={page}
                  onClick={() => goToPage(page)}
                  disabled={listLoading}
                  className={`px-3 py-1.5 border rounded-lg ${
                    currentPage === page
                      ? "bg-gray-900 text-white border-gray-900"
                      : "border-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || listLoading}
                className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-2">
        {!listLoading &&
          salesmen.map((s: any) => (
            <div
              key={s._id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={s?.profile_image || "/profile.png"}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                    alt={s?.name || "Salesman"}
                  />

                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {s?.name || "-"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {s?.email || "-"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {s?.phone_number || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-lg font-medium ${
                      statusStyle[s?.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {s?.status || "-"}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openDetails(s)}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                      <Eye size={13} className="text-gray-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => openActivity(s)}
                      className="p-1.5 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
                    >
                      <History size={13} className="text-purple-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => openEdit(s)}
                      className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                    >
                      <Pencil size={13} className="text-blue-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfirmId(s._id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition"
                    >
                      <Trash2 size={13} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {s?.designation || "No designation"}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate(s?.createdAt)}
                </span>
              </div>
            </div>
          ))}

        {listLoading && (
          <div className="py-12 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">
            Loading salesmen...
          </div>
        )}

        {!listLoading && salesmen.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">
            No salesmen found
          </div>
        )}
      </div>

      {/* MOBILE PAGINATION */}
      <div className="md:hidden flex items-center justify-between pt-2 text-xs text-gray-500">
        <span>
          {showingFrom}-{showingTo} of {totalRecords}
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || listLoading}
              className="px-2.5 py-1 border border-gray-200 rounded-lg disabled:opacity-40"
            >
              Prev
            </button>

            <span className="px-2.5 py-1 bg-gray-900 text-white rounded-lg">
              {currentPage}/{totalPages}
            </span>

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || listLoading}
              className="px-2.5 py-1 border border-gray-200 rounded-lg disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full sm:w-[420px] sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">
                Edit Salesman
              </h2>

              <button
                type="button"
                onClick={closeEdit}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-3 flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Password</label>
                  <input
                    name="password"
                    type="password"
                    value={form.password || ""}
                    onChange={handleChange}
                    placeholder="Optional"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    name="phone_number"
                    value={form.phone_number || ""}
                    onChange={handleChange}
                    placeholder="Phone"
                    className={inputClass}
                  />
                </div>


                <div>
                  <label className={labelClass}>City</label>
                  <input
                    name="city"
                    value={form.city || ""}
                    onChange={handleChange}
                    placeholder="City"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Territory</label>
                  <input
                    name="territory"
                    value={form.territory || ""}
                    onChange={handleChange}
                    placeholder="Territory"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Designation</label>
                  <input
                    name="designation"
                    value={form.designation || ""}
                    onChange={handleChange}
                    placeholder="Designation"
                    className={inputClass}
                  />
                </div>

                <div className="col-span-2">
                  <label className={labelClass}>Address</label>
                  <input
                    name="address"
                    value={form.address || ""}
                    onChange={handleChange}
                    placeholder="Address"
                    className={inputClass}
                  />
                </div>

                <div className="col-span-2">
                  <label className={labelClass}>Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Active">Active</option>
                    <option value="Left">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Profile Image</label>
                <label className="flex items-center gap-3 cursor-pointer bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 hover:bg-gray-100 transition">
                  <span className="text-xs px-3 py-1 bg-gray-900 text-white rounded-lg whitespace-nowrap">
                    Browse
                  </span>

                  <span className="text-xs text-gray-400 truncate">
                    {form.profile_image?.name || "No file chosen"}
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
              <button
                type="button"
                onClick={closeEdit}
                className="flex-1 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdate}
                className="flex-1 py-2 text-sm bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition font-medium"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}