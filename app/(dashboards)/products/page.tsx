
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ProductsTable from "@/app/components/product/allProducts";
import ProductService from "@/app/components/services/productService";
import { Search, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();

  const PRODUCTS_PER_PAGE = 10;

  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [listLoading, setListLoading] = useState(false);

  const requestIdRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const loadProducts = async (page = currentPage) => {
    if (!user?.industry) return;

    const requestId = ++requestIdRef.current;
    setListLoading(true);

    try {
      const res = await ProductService.getProductsPaginated(user.industry, {
        page,
        limit: PRODUCTS_PER_PAGE,
        search: debouncedSearch,
        status: statusFilter,
      });

      if (requestId !== requestIdRef.current) return;

      if (res?.success) {
        setProducts(res.products || []);
        setPagination(
          res.pagination || {
            page,
            limit: PRODUCTS_PER_PAGE,
            total: 0,
            totalPages: 1,
          }
        );
      } else {
        setProducts([]);
        setPagination({
          page: 1,
          limit: PRODUCTS_PER_PAGE,
          total: 0,
          totalPages: 1,
        });
      }
    } catch {
      if (requestId !== requestIdRef.current) return;

      setProducts([]);
      setPagination({
        page: 1,
        limit: PRODUCTS_PER_PAGE,
        total: 0,
        totalPages: 1,
      });

      toast.error("Failed to load products");
    } finally {
      if (requestId === requestIdRef.current) {
        setListLoading(false);
      }
    }
  };

  useEffect(() => {
    loadProducts(currentPage);
  }, [user?.industry, currentPage, debouncedSearch, statusFilter]);

  const totalRecords = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

  const showingFrom =
    totalRecords === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;

  const showingTo = Math.min(currentPage * PRODUCTS_PER_PAGE, totalRecords);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

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

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          Products
        </h1>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 flex-1 sm:flex-none">
            <Search size={14} className="text-gray-400 mr-2" />
            <input
              placeholder="Search product/category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-full sm:w-48"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {user?.user_type === "admin" && (
            <button
              onClick={() => router.push("/products/add")}
              className="bg-black text-white flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm"
            >
              <Plus size={14} />
              Add
            </button>
          )}
        </div>
      </div>

      {listLoading && products.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl py-16 flex items-center justify-center gap-2 text-sm text-gray-400">
          <Loader2 size={16} className="animate-spin" />
          Loading products...
        </div>
      ) : (
        <ProductsTable
          products={products}
          refetch={() => loadProducts(currentPage)}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 text-sm">
        <p className="text-gray-500">
          Showing {showingFrom}-{showingTo} of {totalRecords} products
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
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
                    ? "bg-black text-white border-black"
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
  );
}