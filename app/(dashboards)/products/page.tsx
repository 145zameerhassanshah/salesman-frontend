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

  const filtered = useMemo(() => {
    if (!search.trim()) return data?.products;
    const q = search.toLowerCase();
    return data?.products?.filter(
      (product: any) =>
        product?.name?.toLowerCase().includes(q) ||
        product?.category_id?.name?.toLowerCase().includes(q)
    );
  }, [search, data?.products]);

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          Products
        </h1>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 flex-1 sm:flex-none">
            <Search size={14} className="text-gray-400 mr-2 flex-shrink-0" />
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-full sm:w-40"
            />
          </div>

          <button
            onClick={() => router.push("/products/add")}
            className="bg-black text-white flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm cursor-pointer whitespace-nowrap"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>

      {/* ── Table (handles both mobile cards + desktop table) ── */}
      <ProductsTable products={filtered} refetch={refetch} />

    </div>
  );
}
