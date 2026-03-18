"use client";

import { useEffect, useState } from "react";
import ProductsTable from "@/pages/product/allProducts";
import ProductService from "@/app/components/services/productService";
import { category } from "@/app/components/services/categoryService";
import { Search, Filter, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function Page() {
  const user=useSelector((state:any)=>state.user.user);
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);


  /* FETCH */

  const fetchProducts = async () => {
    try {
      const res = await ProductService.getProducts(user?.industry);
      if (res.success) {
        setProducts(res.products);
        setFiltered(res.products);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const res = await category.getAllCategories();
    if (res) setCategories(res);
  };

 useEffect(() => {
  if (!user?.industry) return;

  fetchProducts();
  fetchCategories();

}, [user?.industry]);
  /* FILTER */

  useEffect(() => {
    let data = [...products];

    if (search) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter) {
      data = data.filter((p) => p.category_id?._id === categoryFilter);
    }

    if (statusFilter) {
      data = data.filter((p) =>
        statusFilter === "active" ? p.is_active : !p.is_active
      );
    }

    setFiltered(data);
  }, [search, categoryFilter, statusFilter, products]);

  return (
    <div className="space-y-6">

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        <h1 className="text-3xl md:text-4xl font-semibold">
          Products
        </h1>

        <div className="flex items-center gap-2 flex-wrap">

          <div className="flex items-center bg-white/60 rounded-xl px-3 py-2">
            <Search size={16} className="text-gray-500 mr-2" />
            <input
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-32 md:w-48"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white/60 px-3 py-2 rounded-xl text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((c: any) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/60 px-3 py-2 rounded-xl text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

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

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ProductsTable
            products={filtered}
            refresh={fetchProducts}
          />
        )}

      </div>

    </div>
  );
}