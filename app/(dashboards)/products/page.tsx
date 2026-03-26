"use client";

import { useState, useMemo } from "react";
import ProductsTable from "@/pages/product/allProducts";
import { Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useProducts } from "@/hooks/useProducts";

export default function Page() {
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();
  const { data,refetch } = useProducts(user?.industry);

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return data?.products;

    const q = search.toLowerCase();

    return data?.products?.filter((product: any) =>
      product?.name?.toLowerCase().includes(q) ||
      product?.category_id?.name?.toLowerCase().includes(q)
    );
  }, [search, data?.products]);

  return (
    <div className="space-y-6">

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        <h1 className="text-3xl md:text-4xl font-semibold">Products</h1>

        <div className="flex items-center gap-2 flex-wrap">

          <div className="flex items-center bg-white/60 rounded-xl px-3 py-2">
            <Search size={16} className="text-gray-500 mr-2" />
            <input
              placeholder="Search by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-32 md:w-48"
            />
          </div>

          <button
            onClick={() => router.push("/products/add")}
            className="bg-black text-white flex items-center cursor-pointer gap-2 px-3 py-2 rounded-xl text-sm"
          >
            Add Product
            <Plus size={16} />
          </button>

        </div>
      </div>

      <div className="bg-white/60 backdrop-blur rounded-3xl p-4 md:p-6">
        <ProductsTable products={filtered} refetch={refetch} />
      </div>

    </div>
  );
}