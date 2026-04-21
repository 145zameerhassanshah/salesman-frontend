"use client";

import { useMemo, useState } from "react";
import ProductsTable from "@/app/components/product/allProducts";
import { Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useProducts } from "@/hooks/useProducts";

export default function Page() {
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();
  const { data, refetch } = useProducts(user?.industry);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  // 🔍 Filter logic
  const filtered = useMemo(() => {
    if (!search.trim()) return data?.products || [];

    const q = search.toLowerCase();
    return data?.products?.filter(
      (product: any) =>
        product?.name?.toLowerCase().includes(q) ||
        product?.category_id?.name?.toLowerCase().includes(q)
    );
  }, [search, data?.products]);

  // 📄 Pagination logic
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filtered.slice(start, end);
  }, [filtered, currentPage]);

  // ⬅️➡️ Page handlers
  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const goPrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          Products
        </h1>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 flex-1 sm:flex-none">
            <Search size={14} className="text-gray-400 mr-2" />
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // reset page on search
              }}
              className="bg-transparent outline-none text-sm w-full sm:w-40"
            />
          </div>

          <button
            onClick={() => router.push("/products/add")}
            className="bg-black text-white flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>

      {/* Table */}
      <ProductsTable products={paginatedData} refetch={refetch}  count={data?.count} />

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-3 pt-2">
        <button
          onClick={goPrev}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={goNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}