"use client";

import { order } from "@/app/components/services/orderService";
import { useCategory } from "@/hooks/useCategory";
import { useDealers } from "@/hooks/useDealers";
import { useProductsByCategory } from "@/hooks/useProductByCategory";
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

export default function AddOrder() {
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();
  const { data } = useDealers(user?.industry);
  const dealers = data?.dealers || [];
const { data: categories = [] } = useCategory(user?.industry);
const activeCategories = categories.filter((c: any) => c.is_active);
  const [activeCategory, setActiveCategory] = useState("");
  const { data: products = [] } = useProductsByCategory(activeCategory);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [items, setItems] = useState<any[]>([]);

  const [form, setForm] = useState({
    creation_date: new Date().toISOString().split("T")[0],
    due_date: "",
    dealer_id: "",
    notes: "",
    deliveryNotes: "",
    discount: 0,
    tax: 0,
    
    discount_type: "amount",
    tax_type: "amount",
    payment_term: "cash",
  });
useEffect(() => {
  if (items.length === 0) {
    setItems([blankItem()]);
    setEditingIndex(0);
  }
}, []);
  const blankItem = () => ({
  category_id: "",
  product_id: "",
  item_name: "",
  price: 0,
  discount: 0,
  discount_type: "percent", // ✅ new
  qty: 1,
  total: 0,
});

  const addRow = () => {
    const newIndex = items.length;
    setItems([...items, blankItem()]);
    setEditingIndex(newIndex);
  };

  const removeRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const updateItem = (index: number, key: any, value: any) => {
  const updated = [...items];

  if (key === "discount" || key === "qty" || key === "price") {
    updated[index][key] = value === "" ? 0 : Number(value);
  } else {
    updated[index][key] = value;
  }

  const price = Number(updated[index].price || 0);
  const qty = Number(updated[index].qty || 0);
  const discount = Number(updated[index].discount || 0);
  const discountType = updated[index].discount_type || "percent";

  const discountAmount =
    discountType === "percent"
      ? (price * qty * discount) / 100
      : discount;

  updated[index].total = price * qty - discountAmount;

  setItems(updated);
};

const handleCategoryChange = (index: number, value: string) => {
  updateItem(index, "category_id", value);
  updateItem(index, "product_id", "");
  setActiveCategory(value); 
};
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

  const handleSubmit = async () => {
     if (!form.dealer_id) return toast.error("Please select a dealer");
  if (items.length === 0) return toast.error("Please add at least one item");
  if (items.some((i) => !i.product_id)) return toast.error("Please select a product for all items");
    const payload = {
      dealer_id: form.dealer_id,
      order_date: form.creation_date,
      due_date: form.due_date,
      createdBy: user?._id,
      businessId: user?.industry,
      notes: form.notes,
      payment_term: form.payment_term,
      delivery_notes: form.deliveryNotes,
      discount: form.discount,
      tax: form.tax,
      discount_type: form.discount_type,
      tax_type: form.tax_type,
      items: items.map((i) => ({
  product_id: i.product_id,
  category_id: i.category_id,
  unit_price: i.price,
  item_name: i.item_name,
  discount_percent: i.discount,
  discount_type: i.discount_type, // ✅ send type
  quantity: i.qty,
})),
    };
    const res = await order.createOrder(payload);
    if (!res.success) return toast.error(res?.message);
    toast.success(res?.message);
    router.push("/orders");
  };

  const field = "border p-2 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-black";

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen space-y-6">

      <h1 className="text-2xl md:text-3xl font-semibold">Create Order</h1>

      {/* DETAILS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Creation Date</label>
          <input type="date" value={form.creation_date} readOnly className={field} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Due Date</label>
          <input
            type="date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            className={field}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Dealer</label>
          <select
            value={form.dealer_id}
            onChange={(e) => setForm({ ...form, dealer_id: e.target.value })}
            className={field}
          >
            <option value="">Select Dealer</option>
            {dealers?.map((d: any) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>
<div className="flex flex-col gap-1">
  <label className="text-sm text-gray-600">Payment Term</label>
  <select
    value={form.payment_term}
    onChange={(e) => setForm({ ...form, payment_term: e.target.value })}
    className={field}
  >
    <option value="cash">Cash</option>
    <option value="advance">Advance</option>
    <option value="periodical">Periodical</option>
  </select>
</div>
        <div className="flex flex-col gap-1 md:col-span-3">
          <label className="text-sm text-gray-600">Notes</label>
          <textarea
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Enter notes..."
            className={`${field} resize-none`}
          />
        </div>

        <div className="flex flex-col gap-1 md:col-span-3">
          <label className="text-sm text-gray-600">Delivery Notes</label>
          <textarea
            rows={2}
            value={form.deliveryNotes}
            onChange={(e) => setForm({ ...form, deliveryNotes: e.target.value })}
            placeholder="Enter delivery instructions..."
            className={`${field} resize-none`}
          />
        </div>

      </div>

      {/* ITEMS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">Order Items</h2>
          <button
            onClick={addRow}
            className="bg-black text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
          >
            <Plus size={14} /> Add Item
          </button>
        </div>

        {/* COLUMN LABELS */}
{items.length > 0 && (
  <div className="grid grid-cols-[1fr_1fr_80px_140px_60px_80px_80px] gap-2 text-sm text-gray-600 font-bold px-1 mb-1">
    <span>Category</span>
    <span>Product</span>
    <span>MRP</span>
    <span>Discount</span>
    <span>Qty</span>
    <span>Total</span>
    <span></span>
  </div>
)}

{/* ROWS */}
{items.map((item, index) => {
  const rowProducts = products;
  // const rowProducts = item.category_id === activeCategory ? products : [];
  const isEditing = editingIndex === index;

  return (
    <div key={index} className="grid grid-cols-[1fr_1fr_80px_140px_60px_80px_80px] gap-2 items-center mb-2">

      {/* CATEGORY */}
      {isEditing ? (
        <select
          value={item.category_id}
          onChange={(e) => handleCategoryChange(index, e.target.value)}
          className={field}
        >
          <option value="">Select</option>
{/* {categories
  .filter((c: any) => c.is_active === true)
  .map((c: any) => (
    <option key={c._id} value={c._id}>{c.name}</option>
))} */}
{activeCategories.map((c: any) => (
  <option key={c._id} value={c._id}>{c.name}</option>
))}
        </select>
      ) : (
        <span className="text-sm truncate px-1">
          {categories.find((c: any) => c._id === item.category_id)?.name || "-"}
        </span>
      )}

      {/* PRODUCT */}
      {isEditing ? (
        <select
          value={item.product_id}
          onChange={(e) => {
            const product = rowProducts?.find((p: any) => p._id === e.target.value);
            updateItem(index, "product_id", e.target.value);
            updateItem(index, "item_name", product?.name || "");
            updateItem(index, "price", product?.mrp || 0);
            updateItem(index, "discount", 0);
          }}
          className={field}
        >
          <option value="">Select</option>
          {rowProducts.map((p: any) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
      ) : (
        <span className="text-sm truncate px-1">
          {rowProducts.find((p: any) => p._id === item.product_id)?.name || item.item_name || "-"}
        </span>
      )}

      {/* MRP */}
      {isEditing ? (
        <input
          type="number"
          value={item.price}
          readOnly
          className={field}
        />
      ) : (
        <span className="text-sm px-1">{item.price}</span>
      )}

      {/* DISCOUNT — type selector + value input */}
      {isEditing ? (
        <div className="flex gap-1">
          <select
            value={item.discount_type}
            onChange={(e) => updateItem(index, "discount_type", e.target.value)}
            className="border rounded-lg px-1 py-2 text-xs focus:outline-none w-14 shrink-0"
          >
            <option value="percent">%</option>
            <option value="amount">Amt</option>
          </select>
          <input
            type="number"
            value={item.discount}
            onChange={(e) => updateItem(index, "discount", e.target.value)}
            className="border p-2 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-black min-w-0"
          />
        </div>
      ) : (
        <span className="text-sm px-1">
          {item.discount}
        </span>
      )}

      {/* QTY */}
      {isEditing ? (
        <input
          type="number"
          value={item.qty}
          onChange={(e) => updateItem(index, "qty", e.target.value)}
          className={field}
        />
      ) : (
        <span className="text-sm px-1">{item.qty}</span>
      )}

      {/* TOTAL */}
      <span className="text-sm font-medium px-1">{item.total.toFixed(2)}</span>

      {/* ACTIONS */}
      <div className="flex gap-1 items-center">
        {isEditing ? (
          <button
            onClick={() => setEditingIndex(null)}
            className="p-1.5 bg-green-100 text-green-600 rounded-md"
          >
            <Check size={13} />
          </button>
        ) : (
          <button
            onClick={() => {
              setActiveCategory(item.category_id);
              setEditingIndex(index);
            }}
            className="p-1.5 bg-blue-100 text-blue-600 rounded-md"
          >
            <Pencil size={13} />
          </button>
        )}
        <button
          onClick={() => removeRow(index)}
          className="p-1.5 bg-red-100 text-red-600 rounded-md"
        >
          <Trash2 size={13} />
        </button>
      </div>

    </div>
  );
})}

        {items.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">
            No items added. Click "+ Add Item" to start.
          </p>
        )}

      </div>

      {/* TOTALS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm ml-auto w-full max-w-xs space-y-2">

        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal</span>
          <span>Rs {subtotal.toFixed(2)}</span>
        </div>

        {/* DISCOUNT */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 w-16 shrink-0">Discount</span>
          <select
            value={form.discount_type}
            onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
            className="border rounded-lg px-2 py-1 text-xs focus:outline-none w-20"
          >
            <option value="amount">Amt</option>
            <option value="percent">%</option>
          </select>
          <input
            type="number"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
            className="border rounded-lg px-2 py-1 text-xs focus:outline-none flex-1 min-w-0"
          />
        </div>

        {/* TAX */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 w-16 shrink-0">Tax</span>
          <select
            value={form.tax_type}
            onChange={(e) => setForm({ ...form, tax_type: e.target.value })}
            className="border rounded-lg px-2 py-1 text-xs focus:outline-none w-20"
          >
            <option value="fixed">Amt</option>
            <option value="percent">%</option>
          </select>
          <input
            type="number"
            value={form.tax}
            onChange={(e) => setForm({ ...form, tax: e.target.value })}
            className="border rounded-lg px-2 py-1 text-xs focus:outline-none flex-1 min-w-0"
          />
        </div>

        <div className="flex justify-between font-semibold text-base border-t pt-2">
          <span>Total</span>
          <span>Rs {getFinalTotal().toFixed(2)}</span>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-black text-white w-full py-2 rounded-lg text-sm mt-1"
        >
          Save Order
        </button>

      </div>

    </div>
  );
}