

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import StaffTable from "./StaffTable";
import StaffModal from "./StaffModal";
import { useSelector } from "react-redux";
import { Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import UserService from "@/app/components/services/authService";

export default function StaffPage({ role }: { role: string }) {
  const user = useSelector((state: any) => state?.user.user);

  const STAFF_PER_PAGE = 5;

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const [staff, setStaff] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [listLoading, setListLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const requestIdRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const loadStaff = async (page = currentPage) => {
    if (!user?.industry) return;

    const requestId = ++requestIdRef.current;
    setListLoading(true);

    try {
      const res = await UserService.getUsersByIndustryPaginated(user.industry, {
        page,
        limit: STAFF_PER_PAGE,
        search: debouncedSearch,
        user_type: role,
        status: statusFilter,
      });

      if (requestId !== requestIdRef.current) return;

      if (res?.success) {
        setStaff(res.userByIndustry || []);
        setPagination(
          res.pagination || {
            page,
            limit: STAFF_PER_PAGE,
            total: 0,
            totalPages: 1,
          }
        );
      } else {
        setStaff([]);
        setPagination({
          page: 1,
          limit: STAFF_PER_PAGE,
          total: 0,
          totalPages: 1,
        });
      }
    } catch {
      if (requestId !== requestIdRef.current) return;
      toast.error("Failed to load staff");
      setStaff([]);
      setPagination({
        page: 1,
        limit: STAFF_PER_PAGE,
        total: 0,
        totalPages: 1,
      });
    } finally {
      if (requestId === requestIdRef.current) {
        setListLoading(false);
      }
    }
  };

  useEffect(() => {
    loadStaff(currentPage);
  }, [user?.industry, role, currentPage, debouncedSearch, statusFilter]);

  const totalRecords = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

  const showingFrom =
    totalRecords === 0 ? 0 : (currentPage - 1) * STAFF_PER_PAGE + 1;

  const showingTo = Math.min(currentPage * STAFF_PER_PAGE, totalRecords);

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

  const handleEdit = (item: any) => {
    setEditData(item);
    setOpen(true);
  };

  const handleSave = async () => {
    setOpen(false);
    setEditData(null);
    await loadStaff(currentPage);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 py-3 md:px-6 md:py-6 overflow-hidden">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 capitalize truncate">
            {role} Management
          </h1>
        </div>

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
              placeholder={`Search ${role}...`}
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
            <option value="Left">Left</option>
          </select>

          {user?.user_type === "admin" && (
            <button
              type="button"
              onClick={() => {
                setEditData(null);
                setOpen(true);
              }}
              className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-2 rounded-xl text-xs md:text-sm font-medium hover:bg-gray-700 transition whitespace-nowrap"
            >
              <span className="hidden sm:inline">Add {role}</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}
        </div>
      </div>

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
            placeholder={`Search ${role}...`}
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
          <option value="">All Staff</option>
          <option value="Active">Active Only</option>
          <option value="Left">Left Only</option>
        </select>
      </div>

      {listLoading && staff.length === 0 ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-400 text-sm">
          <Loader2 size={16} className="animate-spin" />
          Loading {role}...
        </div>
      ) : (
        <StaffTable
          data={staff}
          onEdit={handleEdit}
          refetch={() => loadStaff(currentPage)}
          listLoading={listLoading}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 text-sm">
        <p className="text-gray-500">
          Showing {showingFrom}-{showingTo} of {totalRecords} records
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

      {open && (
        <StaffModal
          role={role}
          refetch={() => loadStaff(currentPage)}
          data={editData}
          onClose={() => {
            setOpen(false);
            setEditData(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}