"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductService from "@/app/components/services/productService";
import toast from "react-hot-toast";

export default function ProductsTable({ products, refresh,onEdit }: any) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    try {
      const res = await ProductService.deleteProduct(id);
      toast.success(res.message);
      refresh();
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleStatus = async (item: any) => {
    try {
      await ProductService.updateProduct(
        { is_active: !item.is_active },
        item._id
      );
      toast.success("Status updated");
      refresh();
    } catch {
      toast.error("Failed to update");
    }
  };

  const statusColor = (status: boolean) => {
    return status
      ? "bg-green-100 text-green-600"
      : "bg-red-100 text-red-600";
  };

  return (
    <>
      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left py-3">Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>MRP</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {products.map((p: any) => (

              <tr key={p._id} className="border-b hover:bg-gray-50">

                {/* PRODUCT */}
                <td className="flex items-center gap-3 py-4">

                  <img
                    src={
                      p.image
                        ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${p.image}`
                        : "/placeholder.png"
                    }
                    className="w-10 h-10 rounded-lg object-cover"
                  />

                  <p className="font-medium">{p.name}</p>

                </td>

                <td>{p.sku}</td>

                <td>
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md text-xs">
                    {p.category_id?.name}
                  </span>
                </td>

                <td>{p.mrp}</td>

                <td>
                  <span className={`px-2 py-1 rounded-md text-xs ${statusColor(p.is_active)}`}>
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="flex gap-2">

                <button
                  onClick={() => onEdit(p)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Pencil size={16} />
                </button>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-100 text-red-600 p-2 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>


                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-sm gap-3">

        {/* <p className="text-gray-500">
          Total Products: {products.length}
        </p> */}

        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded">1</button>
          <button className="px-3 py-1">2</button>
          <button className="px-3 py-1">3</button>
        </div>

      </div>
    </>
  );
}