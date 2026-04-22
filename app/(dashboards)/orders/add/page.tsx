"use client";

import { order } from "@/app/components/services/orderService";
import { useCategory } from "@/hooks/useCategory";
import { useDealers } from "@/hooks/useDealers";
import { useProductsByCategory } from "@/hooks/useProductByCategory";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
    category_id: "", product_id: "", item_name: "",
    price: 0, discount: 0, discount_type: "percent", qty: 1, total: 0,
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
    const discountAmount = discountType === "percent" ? (price * qty * discount) / 100 : discount;
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
    if (form.discount_type === "percent") total -= (total * Number(form.discount)) / 100;
    else total -= Number(form.discount);
    if (form.tax_type === "percent") total += (total * Number(form.tax)) / 100;
    else total += Number(form.tax);
    return total;
  };

  const handleSubmit = async () => {
    if (!form.dealer_id) return toast.error("Please select a dealer");
    if (items.length === 0) return toast.error("Please add at least one item");
    if (items.some((i) => !i.product_id && !i.item_name)) return toast.error("Please enter product or item name");
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
        product_id: i.product_id || null,
        category_id: i.category_id,
        unit_price: i.price,
        item_name: i.item_name,
        discount_percent: i.discount,
        discount_type: i.discount_type,
        quantity: i.qty,
      })),
    };
    const res = await order.createOrder(payload);
    if (!res.success) return toast.error(res?.message);
    toast.success(res?.message);
    router.push("/orders");
  };

  const isGeneralCategory = (categoryId: any) => {
    const cat = categories.find((c: any) => c._id === categoryId);
    return cat?.name === "General Appliances";
  };

  const inputCls = "border border-gray-200 rounded-lg px-2.5 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white";
  const labelCls = "text-xs font-medium text-gray-500 mb-1 block";

  return (
    <div className="w-full max-w-5xl mx-auto px-2 py-3 md:px-6 md:py-6 overflow-hidden">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="min-w-0">
          <p className="text-xs text-gray-400 mb-0.5">Orders › Add</p>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">Create Order</h1>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => router.push("/orders")}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition cursor-pointer whitespace-nowrap">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition cursor-pointer flex items-center gap-1 whitespace-nowrap">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Order
          </button>
        </div>
      </div>

      {/* ── DETAILS CARD ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-3 md:p-5 mb-3 shadow-sm">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Order Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          <div>
            <label className={labelCls}>Creation Date</label>
            <input type="date" value={form.creation_date} readOnly className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Due Date</label>
            <input type="date" value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Dealer <span className="text-red-500">*</span></label>
            <select value={form.dealer_id} onChange={(e) => setForm({ ...form, dealer_id: e.target.value })} className={inputCls}>
              <option value="">Select Dealer</option>
              {dealers?.map((d: any) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </div>

          <div>
            <label className={labelCls}>Payment Term</label>
            <select value={form.payment_term} onChange={(e) => setForm({ ...form, payment_term: e.target.value })} className={inputCls}>
              <option value="cash">Cash</option>
              <option value="advance">Advance</option>
              <option value="periodical">Periodical</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className={labelCls}>Notes</label>
            <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Enter notes..." className={`${inputCls} resize-none`} />
          </div>

          <div className="sm:col-span-3">
            <label className={labelCls}>Delivery Notes</label>
            <textarea rows={2} value={form.deliveryNotes} onChange={(e) => setForm({ ...form, deliveryNotes: e.target.value })}
              placeholder="Enter delivery instructions..." className={`${inputCls} resize-none`} />
          </div>

        </div>
      </div>

      {/* ── ITEMS CARD ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-3 md:p-5 mb-3 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Items</h3>
          <button onClick={addRow}
            className="flex items-center gap-1 text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition">
            <Plus size={13} /> Add Item
          </button>
        </div>

        {/* ── DESKTOP TABLE ── */}
        <div className="hidden md:block overflow-x-auto">
          {items.length > 0 && (
            <div className="grid grid-cols-[1fr_1fr_80px_150px_60px_80px_72px] gap-2 text-xs text-gray-400 font-semibold px-1 mb-1 uppercase tracking-wider">
              <span>Category</span><span>Product</span><span>MRP</span>
              <span>Discount</span><span>Qty</span><span>Total</span><span></span>
            </div>
          )}
          {items.map((item, index) => {
            const rowProducts = products;
            const isEditing = editingIndex === index;
            return (
              <div key={index} className="grid grid-cols-[1fr_1fr_80px_150px_60px_80px_72px] gap-2 items-center mb-2">

                {isEditing ? (
                  <select value={item.category_id} onChange={(e) => handleCategoryChange(index, e.target.value)} className={inputCls}>
                    <option value="">Select</option>
                    {activeCategories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                ) : (
                  <span className="text-sm truncate px-1">{categories.find((c: any) => c._id === item.category_id)?.name || "-"}</span>
                )}

                {isEditing ? (
                  isGeneralCategory(item.category_id) ? (
                    <input type="text" placeholder="Product name" value={item.item_name}
                      onChange={(e) => { updateItem(index, "item_name", e.target.value); updateItem(index, "product_id", null); }}
                      className={inputCls} />
                  ) : (
                    <select value={item.product_id} onChange={(e) => {
                      const product = rowProducts?.find((p: any) => p._id === e.target.value);
                      updateItem(index, "product_id", e.target.value);
                      updateItem(index, "item_name", product?.name || "");
                      updateItem(index, "price", product?.mrp || 0);
                      updateItem(index, "discount", 0);
                    }} className={inputCls}>
                      <option value="">Select</option>
                      {rowProducts.map((p: any) => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                  )
                ) : (
                  <span className="text-sm truncate px-1">{item.item_name || "-"}</span>
                )}

                {isEditing ? (
                  <input type="number" value={item.price} onChange={(e) => updateItem(index, "price", e.target.value)}
                    readOnly={!isGeneralCategory(item.category_id)} className={inputCls} />
                ) : (
                  <span className="text-sm px-1">{item.price}</span>
                )}

                {isEditing ? (
                  <div className="flex gap-1">
                    <select value={item.discount_type} onChange={(e) => updateItem(index, "discount_type", e.target.value)}
                      className="border border-gray-200 rounded-lg px-1 py-2 text-xs focus:outline-none w-14 shrink-0 bg-white">
                      <option value="percent">%</option>
                      <option value="amount">Amt</option>
                    </select>
                    <input type="number" value={item.discount} onChange={(e) => updateItem(index, "discount", e.target.value)}
                      className={`${inputCls} min-w-0`} />
                  </div>
                ) : (
                  <span className="text-sm px-1">{item.discount}</span>
                )}

                {isEditing ? (
                  <input type="number" value={item.qty} onChange={(e) => updateItem(index, "qty", e.target.value)} className={inputCls} />
                ) : (
                  <span className="text-sm px-1">{item.qty}</span>
                )}

                <span className="text-sm font-medium px-1">{item.total.toFixed(2)}</span>

                <div className="flex gap-1 items-center">
                  {isEditing ? (
                    <button onClick={() => setEditingIndex(null)} className="p-1.5 bg-green-100 text-green-600 rounded-lg"><Check size={13} /></button>
                  ) : (
                    <button onClick={() => { setActiveCategory(item.category_id); setEditingIndex(index); }}
                      className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><Pencil size={13} /></button>
                  )}
                  <button onClick={() => removeRow(index)} className="p-1.5 bg-red-100 text-red-600 rounded-lg"><Trash2 size={13} /></button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── MOBILE CARDS ── */}
        <div className="md:hidden space-y-3">
          {items.map((item, index) => {
            const rowProducts = products;
            const isEditing = editingIndex === index;
            return (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden bg-white">

                {/* Card Header */}
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Item {index + 1}</span>
                  <div className="flex gap-1.5">
                    {isEditing ? (
                      <button onClick={() => setEditingIndex(null)}
                        className="flex items-center gap-1 px-2 py-1.5 bg-green-100 text-green-600 rounded-lg text-xs font-medium">
                        <Check size={12} /> Done
                      </button>
                    ) : (
                      <button onClick={() => { setActiveCategory(item.category_id); setEditingIndex(index); }}
                        className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><Pencil size={13} /></button>
                    )}
                    <button onClick={() => removeRow(index)} className="p-1.5 bg-red-100 text-red-600 rounded-lg"><Trash2 size={13} /></button>
                  </div>
                </div>

                {isEditing ? (
                  /* Edit mode */
                  <div className="p-3 space-y-2.5">
                    <div>
                      <label className={labelCls}>Category</label>
                      <select value={item.category_id} onChange={(e) => handleCategoryChange(index, e.target.value)} className={inputCls}>
                        <option value="">Select Category</option>
                        {activeCategories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Product</label>
                      {isGeneralCategory(item.category_id) ? (
                        <input type="text" placeholder="Enter product name" value={item.item_name}
                          onChange={(e) => { updateItem(index, "item_name", e.target.value); updateItem(index, "product_id", null); }}
                          className={inputCls} />
                      ) : (
                        <select value={item.product_id} onChange={(e) => {
                          const product = rowProducts?.find((p: any) => p._id === e.target.value);
                          updateItem(index, "product_id", e.target.value);
                          updateItem(index, "item_name", product?.name || "");
                          updateItem(index, "price", product?.mrp || 0);
                          updateItem(index, "discount", 0);
                        }} className={inputCls}>
                          <option value="">Select Product</option>
                          {rowProducts.map((p: any) => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={labelCls}>MRP</label>
                        <input type="number" value={item.price} onChange={(e) => updateItem(index, "price", e.target.value)}
                          readOnly={!isGeneralCategory(item.category_id)}
                          className={`${inputCls} ${!isGeneralCategory(item.category_id) ? "bg-gray-50 text-gray-400" : ""}`} />
                      </div>
                      <div>
                        <label className={labelCls}>Qty</label>
                        <input type="number" value={item.qty} onChange={(e) => updateItem(index, "qty", e.target.value)} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Discount</label>
                      <div className="flex gap-2">
                        <select value={item.discount_type} onChange={(e) => updateItem(index, "discount_type", e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none w-16 shrink-0 bg-white">
                          <option value="percent">%</option>
                          <option value="amount">Amt</option>
                        </select>
                        <input type="number" value={item.discount} onChange={(e) => updateItem(index, "discount", e.target.value)}
                          className={`${inputCls} min-w-0`} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                      <span className="text-xs text-gray-400">Item Total</span>
                      <span className="text-sm font-semibold text-gray-900">Rs {item.total.toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  /* Collapsed view */
                  <div className="p-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                      <div><span className="text-gray-400">Category: </span><span className="font-medium">{categories.find((c: any) => c._id === item.category_id)?.name || "—"}</span></div>
                      <div><span className="text-gray-400">Product: </span><span className="font-medium truncate">{item.item_name || "—"}</span></div>
                      <div><span className="text-gray-400">MRP: </span><span className="font-medium">{item.price}</span></div>
                      <div><span className="text-gray-400">Qty: </span><span className="font-medium">{item.qty}</span></div>
                      <div><span className="text-gray-400">Discount: </span><span className="font-medium">{item.discount} {item.discount_type === "percent" ? "%" : "Rs"}</span></div>
                      <div><span className="text-gray-400">Total: </span><span className="font-semibold text-gray-900">Rs {item.total.toFixed(2)}</span></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="py-8 text-center text-gray-400 text-sm border border-dashed border-gray-300 rounded-xl">
              No items added. Click "+ Add Item" to start.
            </div>
          )}
        </div>

        {items.length === 0 && (
          <p className="hidden md:block text-sm text-gray-400 text-center py-6">No items added. Click "+ Add Item" to start.</p>
        )}
      </div>

      {/* ── TOTALS CARD ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-3 md:p-5 shadow-sm ml-auto w-full md:max-w-xs space-y-2.5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Summary</h3>

        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal</span>
          <span className="font-medium text-gray-800">Rs {subtotal.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-14 shrink-0">Discount</span>
          <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
            className="border border-gray-200 rounded-lg px-1.5 py-1 text-xs focus:outline-none w-16 bg-white">
            <option value="amount">Amt</option>
            <option value="percent">%</option>
          </select>
          <input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })}
            className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none flex-1 min-w-0 bg-white" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-14 shrink-0">Tax</span>
          <select value={form.tax_type} onChange={(e) => setForm({ ...form, tax_type: e.target.value })}
            className="border border-gray-200 rounded-lg px-1.5 py-1 text-xs focus:outline-none w-16 bg-white">
            <option value="fixed">Amt</option>
            <option value="percent">%</option>
          </select>
          <input type="number" value={form.tax} onChange={(e) => setForm({ ...form, tax: e.target.value })}
            className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none flex-1 min-w-0 bg-white" />
        </div>

        <div className="flex justify-between font-semibold text-sm border-t pt-2">
          <span>Total</span>
          <span>Rs {getFinalTotal().toFixed(2)}</span>
        </div>

        <button onClick={handleSubmit}
          className="bg-gray-900 text-white w-full py-2.5 rounded-xl text-sm hover:bg-gray-700 transition font-medium">
          Save Order
        </button>
      </div>

    </div>
  );
}