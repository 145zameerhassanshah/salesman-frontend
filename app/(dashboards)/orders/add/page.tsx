"use client";

import { order } from "@/app/components/services/orderService";
import { useCategory } from "@/hooks/useCategory";
import { useDealers } from "@/hooks/useDealers";
import { useProductsByCategory } from "@/hooks/useProductByCategory";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function AddOrder() {

  const user = useSelector((state:any)=>state.user.user);
  const router=useRouter();
  const { data: categories = [] } = useCategory(user?.industry);
  const { data } = useDealers(user?.industry);
  const dealers = data?.dealers || [];

  /* ACTIVE CATEGORY */
  const [activeCategory, setActiveCategory] = useState("");

  /* HOOK (TOP LEVEL) */
  const { data: products = [] } = useProductsByCategory(activeCategory);

  const [items, setItems] = useState([
    {
      category_id: "",
      product_id: "",
      item_name: "",
      price: 0,
      discount: 0,
      qty: 1,
      total: 0,
      open: true
    }
  ]);

  const [form, setForm] = useState({
    creation_date: new Date().toISOString().split("T")[0],
    due_date: "",
    dealer_id: "",
    notes: "",
    deliveryNotes: "",
    discount: 0,
    tax: 0,
    discount_type: "amount",
    tax_type: "amount"
  });

  /* ================= ROW ================= */

  const addRow = () => {
    setItems([
      ...items,
      {
        category_id: "",
        product_id: "",
        price: 0,
        item_name:"",
        discount: 0,
        qty: 1,
        total: 0,
        open: true
      }
    ]);
  };

  const removeRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, key: string, value: any) => {
    const updated = [...items];
    updated[index][key] = value;

    const price = Number(updated[index].price);
    const qty = Number(updated[index].qty);
    const discount = Number(updated[index].discount);

    updated[index].total =
      price * qty - (price * qty * discount) / 100;

    setItems(updated);
  };

  // const handleCategoryChange = (index: number, value: string) => {
  //   updateItem(index, "category_id", value);
  //   updateItem(index, "product_id", "");
  //   setActiveCategory(value);
  // };
const handleCategoryChange = (index: number, value: string) => {
  updateItem(index, "category_id", value);
  updateItem(index, "product_id", "");
  setActiveCategory(value); // ye trigger karega products fetch
};
  /* ================= TOTAL ================= */

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  const getFinalTotal = () => {
    let total = subtotal;

    if (form.discount_type === "percent") {
      total -= (total * Number(form.discount)) / 100;
    } else {
      total -= Number(form.discount);
    }

    if (form.tax_type === "percent") {
      total += (total * Number(form.tax)) / 100;
    } else {
      total += Number(form.tax);
    }

    return total;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    const payload = {
      dealer_id: form.dealer_id,
      order_date: form.creation_date,
      due_date: form.due_date,
      createdBy:user?._id,
      businessId:user?.industry,
      notes: form.notes,
      delivery_notes: form.deliveryNotes,
      discount: form.discount,
      tax: form.tax,
      discount_type: form.discount_type,
      tax_type: form.tax_type,
      items: items.map(i => ({
        product_id: i.product_id,
        category_id: i.category_id,
        unit_price: i.price,
        item_name:i.item_name,
        discount_percent: i.discount,
        quantity: i.qty
      }))
    };
    const res=await order.createOrder(payload);

    if(!res.success) return toast.error(res?.message);
    toast.success(res?.message);
    router.push("/orders")
  };

  /* ================= UI ================= */

  const field =
    "border p-2 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-black";

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen space-y-6">

      <h1 className="text-2xl md:text-3xl font-semibold">Create Order</h1>

      {/* DETAILS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Creation Date */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Creation Date</label>
          <input type="date" value={form.creation_date} readOnly className={field}/>
        </div>

        {/* Due Date */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Due Date</label>
          <input
            type="date"
            value={form.due_date}
            onChange={(e)=>setForm({...form,due_date:e.target.value})}
            className={field}
          />
        </div>

        {/* Dealer */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Dealer</label>
          <select
            value={form.dealer_id}
            onChange={(e)=>setForm({...form,dealer_id:e.target.value})}
            className={field}
          >
            <option value="">Select Dealer</option>
            {dealers?.map((d:any)=>(
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1 md:col-span-3">
          <label className="text-sm text-gray-600">Notes</label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e)=>setForm({...form,notes:e.target.value})}
            placeholder="Enter notes..."
            className={`${field} resize-none`}
          />
        </div>

        {/* Delivery Notes */}
        <div className="flex flex-col gap-1 md:col-span-3">
          <label className="text-sm text-gray-600">Delivery Notes</label>
          <textarea
            rows={3}
            value={form.deliveryNotes}
            onChange={(e)=>setForm({...form,deliveryNotes:e.target.value})}
            placeholder="Enter delivery instructions..."
            className={`${field} resize-none`}
          />
        </div>

      </div>

      {/* ITEMS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm">

        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-lg">Order Items</h2>
          <button onClick={addRow} className="bg-black text-white px-3 py-1 rounded-lg text-sm">
            + Add Item
          </button>
        </div>

        {items.map((item, index) => {

          // const rowProducts =
          //   item.category_id === activeCategory ? products : [];
          const rowProducts = products;

          const categoryName =
            categories.find((c:any)=>c._id===item.category_id)?.name || "-";

          const productName =
            rowProducts.find((p:any)=>p._id===item.product_id)?.name || "-";

          return (
            <div key={index} className="border rounded-xl p-3 mb-3 bg-gray-50">

              <div className="flex justify-between flex-wrap gap-2 text-sm">
                <div>
                  <strong>{categoryName}</strong> | {productName} | Rs {item.total.toFixed(2)}
                </div>

                <div className="flex gap-3">
                  <button onClick={()=>updateItem(index,"open",!item.open)} className="text-blue-600">
                    {item.open ? "Hide" : "Edit"}
                  </button>
                  <button onClick={()=>removeRow(index)} className="text-red-500">
                    Delete
                  </button>
                </div>
              </div>

              {item.open && (
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-3">

                  {/* Category */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Category</label>
                    <select
                      value={item.category_id}
                      onChange={(e)=>handleCategoryChange(index,e.target.value)}
                      className={field}
                    >
                      <option value="">Select</option>
                      {categories.map((c:any)=>(
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Product */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Product</label>
                    <select
                      value={item.product_id}
                      onChange={(e)=>{
const product = rowProducts?.find(
  (p:any)=>p._id === e.target.value
);
                        updateItem(index,"product_id",e.target.value);
                        updateItem(index,"price",product?.mrp || 0);
                         updateItem(index,"item_name",product?.name || "");
                        updateItem(index,"discount",product?.discount_percent || 0);
                      }}
                      className={field}
                    >
                      <option value="">Select</option>
                      {rowProducts.map((p:any)=>(
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* MRP */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">MRP</label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e)=>updateItem(index,"price",e.target.value)}
                      className={field}
                    />
                  </div>

                  {/* Discount */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Discount %</label>
                    <input
                      type="number"
                      value={item.discount}
                      onChange={(e)=>updateItem(index,"discount",e.target.value)}
                      className={field}
                    />
                  </div>

                  {/* Qty */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Qty</label>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e)=>updateItem(index,"qty",e.target.value)}
                      className={field}
                    />
                  </div>

                  {/* Total */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Total</label>
                    <input
                      value={item.total.toFixed(2)}
                      readOnly
                      className="border p-2 rounded-lg bg-gray-100 text-sm"
                    />
                  </div>

                </div>
              )}

            </div>
          );
        })}

      </div>

      {/* TOTAL */}
      <div className="bg-white p-4 rounded-2xl shadow-sm max-w-md ml-auto space-y-4">

        <div className="text-sm">Subtotal: Rs {subtotal.toFixed(2)}</div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Discount</label>
          <div className="flex gap-2">
            <select value={form.discount_type} onChange={(e)=>setForm({...form,discount_type:e.target.value})} className={field}>
              <option value="amount">Amount</option>
              <option value="percent">Percent</option>
            </select>
            <input type="number" value={form.discount} onChange={(e)=>setForm({...form,discount:e.target.value})} className={field}/>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Tax</label>
          <div className="flex gap-2">
            <select value={form.tax_type} onChange={(e)=>setForm({...form,tax_type:e.target.value})} className={field}>
              <option value="fixed">Amount</option>
              <option value="percent">Percent</option>
            </select>
            <input type="number" value={form.tax} onChange={(e)=>setForm({...form,tax:e.target.value})} className={field}/>
          </div>
        </div>

        <div className="font-semibold text-lg">
          Total: Rs {getFinalTotal().toFixed(2)}
        </div>

        <button onClick={handleSubmit} className="bg-black text-white w-full py-2 rounded-lg">
          Save Order
        </button>

      </div>

    </div>
  );
}