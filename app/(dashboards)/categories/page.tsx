"use client";

import { category } from "@/app/components/services/categoryService";
import {
  Search,
  Plus,
  Pencil,
  X,
  Trash2,
  Eye,
  History,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function CategoriesPage() {
  const user = useSelector((state: any) => state.user.user);

  const router = useRouter();
const userType = String(user?.user_type || user?.role || "").toLowerCase();
const isAdmin = userType === "admin";
  const CATEGORIES_PER_PAGE = 5;

  const [categories, setCategories] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [listLoading, setListLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [editItem, setEditItem] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    order_no: 0,
    is_active: true,
  });

  const [confirmId, setConfirmId] = useState<string | null>(null);

  const [activityItem, setActivityItem] = useState<any>(null);
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

  const loadCategories = async (page = currentPage) => {
    if (!user?.industry) return;

    const requestId = ++requestIdRef.current;
    setListLoading(true);

    try {
      const res = await category.getIndustryCategoriesPaginated(user.industry, {
        page,
        limit: CATEGORIES_PER_PAGE,
        search: debouncedSearch,
        status: statusFilter,
      });

      if (requestId !== requestIdRef.current) return;

      if (res?.success) {
        setCategories(res.category || []);
        setPagination(
          res.pagination || {
            page,
            limit: CATEGORIES_PER_PAGE,
            total: 0,
            totalPages: 1,
          }
        );
      } else {
        setCategories([]);
        setPagination({
          page: 1,
          limit: CATEGORIES_PER_PAGE,
          total: 0,
          totalPages: 1,
        });
      }
    } catch {
      if (requestId !== requestIdRef.current) return;

      setCategories([]);
      setPagination({
        page: 1,
        limit: CATEGORIES_PER_PAGE,
        total: 0,
        totalPages: 1,
      });

      toast.error("Failed to load categories");
    } finally {
      if (requestId === requestIdRef.current) {
        setListLoading(false);
      }
    }
  };

  useEffect(() => {
    loadCategories(currentPage);
  }, [user?.industry, currentPage, debouncedSearch, statusFilter]);

  const totalRecords = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

  const showingFrom =
    totalRecords === 0 ? 0 : (currentPage - 1) * CATEGORIES_PER_PAGE + 1;

  const showingTo = Math.min(currentPage * CATEGORIES_PER_PAGE, totalRecords);

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

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setEditForm({
      name: item?.name || "",
      order_no: item?.order_no || 0,
      is_active: Boolean(item?.is_active),
    });
  };

  const handleUpdate = async () => {
    if (!editItem?._id) return;

    const payload = {
      ...editForm,
      industry: user?.industry,
    };

    const res = await category.updateCategory(payload, editItem._id);

    if (!res?.success) {
      return toast.error(res?.message || "Category update failed");
    }

    toast.success(res?.message || "Category updated");
    setEditItem(null);
    await loadCategories(currentPage);
  };

const deleteCategory = async () => {
  if (!confirmId) return;

  const res = await category.removeCategory(confirmId, user?.industry);

  if (!res?.success) {
    return toast.error(res?.message || "Category delete failed");
  }

  toast.success(res?.message || "Category deleted");
  setConfirmId(null);
  await loadCategories(currentPage);
};
  const openActivity = async (item: any) => {
    setActivityItem(item);
    setActivityLogs([]);
    setActivityLoading(true);

    try {
      const res = await category.getCategoryAuditLogs(item._id, 1, 20);

      if (res?.success) {
        setActivityLogs(res?.data || []);
      } else {
        setActivityLogs([]);
      }
    } catch {
      toast.error("Failed to load category activity");
      setActivityLogs([]);
    } finally {
      setActivityLoading(false);
    }
  };

  const closeActivity = () => {
    setActivityItem(null);
    setActivityLogs([]);
  };

  const statusCls = (status: boolean) =>
    status ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500";

  const formatAuditField = (field: string) => {
    const labels: any = {
      name: "Category Name",
      order_no: "Order No",
      is_active: "Status",
      businessId: "Business",
      createdAt: "Created At",
      updatedAt: "Updated At",
    };

    return labels[field] || field.replaceAll("_", " ");
  };

  const formatAuditValue = (field: string, value: any) => {
    if (value === null || value === undefined || value === "") return "-";

    if (field === "is_active") {
      return value ? "Active" : "Inactive";
    }

    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
      return new Date(value).toLocaleDateString("en-GB");
    }

    if (typeof value === "object") {
      if (value?.name) return value.name;
      if (value?.businessName) return value.businessName;
      return "-";
    }

    return String(value);
  };

const getRoleLabel = (role: any) => {
  const value = String(role || "").toLowerCase();

  if (value === "admin") return "Director";
  if (value === "salesman") return "Salesman";
  if (value === "dispatcher") return "Dispatcher";
  if (value === "manager") return "Manager";
  if (value === "accountant") return "Accountant";
  if (value === "super_admin") return "Super Admin";

  return "User";
};

const getPerformedByText = (log: any) => {
  const name = log?.performedBy?.name || log?.performedByName || "System";

  const role =
    log?.performedBy?.user_type ||
    log?.performedBy?.role ||
    log?.performedByRole ||
    "";

  return role ? `${name} (${getRoleLabel(role)})` : name;
};
  const hiddenAuditFields = [
    "_id",
    "__v",
    "businessId",
    "createdAt",
    "updatedAt",
  ];

  const inputCls =
    "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900 bg-white";

  const labelCls = "text-xs font-medium text-gray-500 mb-1 block";

  return (
    <div className="w-full md:px-6 md:py-6 overflow-hidden">
      {/* DELETE MODAL */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-sm">
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-50 mx-auto mb-3">
              <Trash2 size={20} className="text-red-500" />
            </div>

            <h2 className="text-base font-semibold text-gray-900 text-center mb-1">
              Delete Category
            </h2>

            <p className="text-sm text-gray-500 text-center mb-5">
              Are you sure? This action cannot be undone.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={deleteCategory}
                className="flex-1 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVITY MODAL */}
      {activityItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">

  Category History

                </h2>
                <p className="text-xs text-gray-400">{activityItem?.name}</p>
              </div>

              <button
                onClick={closeActivity}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4 space-y-2">
              {activityLoading ? (
                <div className="py-10 flex justify-center items-center gap-2 text-sm text-gray-400">
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
                        {String(log.action || "").replaceAll("_", " ")}
                      </p>

                      <p className="text-gray-400">
                        {log.createdAt
                          ? new Date(log.createdAt).toLocaleString()
                          : "-"}
                      </p>
                    </div>

                    <p className="text-gray-500 mt-1">
                      {log.description || "Action performed"}
                    </p>

                    <p className="text-gray-400 mt-1">
                      by {getPerformedByText(log)}
                    </p>

                    {log.changes && Object.keys(log.changes).length > 0 && (
                      <div className="mt-2 space-y-1">
                        {Object.entries(log.changes)
                          .filter(
                            ([field]) => !hiddenAuditFields.includes(field)
                          )
                          .slice(0, 6)
                          .map(([field, value]: any) => (
                            <p key={field} className="text-gray-500">
                              <span className="font-medium">
                                {formatAuditField(field)}
                              </span>
                              : {formatAuditValue(field, value?.from)} →{" "}
                              {formatAuditValue(field, value?.to)}
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
      <div className="flex items-center justify-between gap-2 mb-3">
        <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">
          Categories
        </h1>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative hidden md:block w-52">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              placeholder="Search category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="hidden md:block bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

{isAdmin && (
  <button
              onClick={() => router.push("/categories/add")}
              className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-2 rounded-xl text-xs md:text-sm font-medium hover:bg-gray-700 transition whitespace-nowrap"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Add Category</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}
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
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
        >
          <option value="">All Categories</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

{/* DESKTOP TABLE */}
<div className="hidden md:block bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
  <table className="w-full text-sm">
    <thead>
      <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
        <th className="py-3 px-4 text-left font-medium">Category Name</th>
        <th className="py-3 px-4 text-left font-medium">Order No</th>
        <th className="py-3 px-4 text-left font-medium">Status</th>
        <th className="py-3 px-4 text-center font-medium">Actions</th>
      </tr>
    </thead>

    <tbody>
{categories.map((item) => (          <tr
            key={item._id}
            className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition"
          >
            <td className="py-3 px-4 font-medium text-gray-800">
              {item?.name}
            </td>

            <td className="py-3 px-4 text-gray-500">
              {item?.order_no ?? 0}
            </td>

            <td className="py-3 px-4">
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusCls(
                  item?.is_active
                )}`}
              >
                {item?.is_active ? "Active" : "Inactive"}
              </span>
            </td>

            <td className="py-3 px-4">
              <div className="flex items-center justify-center gap-2">
<button
  type="button"
  onClick={() => openActivity(item)}
  className="p-1.5 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
  title="History"
>
  <History size={14} className="text-purple-600" />
</button>

{isAdmin && (
        <>
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                    >
                      <Pencil size={14} className="text-blue-600" />
                    </button>

                    <button
                      onClick={() => setConfirmId(item._id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}

      {listLoading && (
        <tr>
          <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">
            Loading categories...
          </td>
        </tr>
      )}

{listLoading && categories.length === 0 && (
  <tr>
    <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">
      Loading categories...
    </td>
  </tr>
)}

{!listLoading && categories.length === 0 && (
  <tr>
    <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">
      No categories found
    </td>
  </tr>
)}
    </tbody>
  </table>

  {/* DESKTOP PAGINATION */}
  <div className="flex justify-between items-center gap-3 px-4 py-3 border-t border-gray-100 text-sm">
    <p className="text-gray-500">
      Showing {showingFrom}-{showingTo} of {totalRecords} categories
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
{categories.map((item) => (
              <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {item?.name}
                  </p>

                  <p className="text-xs text-gray-400 mt-0.5">
                    Order No: {item?.order_no ?? 0}
                  </p>

                  <span
                    className={`mt-1 inline-block px-2 py-0.5 text-xs rounded-lg font-medium ${statusCls(
                      item?.is_active
                    )}`}
                  >
                    {item?.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
<button
  type="button"
  onClick={() => openActivity(item)}
  className="p-1.5 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
  title="History"
>
  <History size={14} className="text-purple-600" />
</button>
{isAdmin && (
                    <>
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                      >
                        <Pencil size={13} className="text-blue-600" />
                      </button>

                      <button
                        onClick={() => setConfirmId(item._id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition"
                      >
                        <Trash2 size={13} className="text-red-500" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

        {listLoading && (
          <div className="py-12 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">
            Loading categories...
          </div>
        )}

        {!listLoading && categories.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">
            No categories found
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
  className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40"
>
  Prev
</button>
      <span className="px-2.5 py-1 bg-gray-900 text-white rounded-lg">
        {currentPage}/{totalPages}
      </span>

      <button
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
          <div className="bg-white w-full sm:w-[380px] rounded-t-2xl sm:rounded-2xl shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">
                Edit Category
              </h2>

              <button
                onClick={() => setEditItem(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className={labelCls}>Category Name</label>
                <input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder="Category name"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Order No</label>
                <input
                  type="number"
                  value={editForm.order_no}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      order_no: Number(e.target.value) || 0,
                    })
                  }
                  placeholder="Order no"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Status</label>
                <select
                  value={editForm?.is_active ? "true" : "false"}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      is_active: e.target.value === "true",
                    })
                  }
                  className={inputCls}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
              <button
                onClick={() => setEditItem(null)}
                className="flex-1 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
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