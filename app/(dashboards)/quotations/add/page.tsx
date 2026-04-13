"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

import { category } from "@/app/components/services/categoryService";
import DealerService from "@/app/components/services/dealerService";
import QuotationService from "@/app/components/services/quotationService";

export default function AddQuotation() {
  const user = useSelector((state: any) => state.user.user);
  const businessId = user?.industry;
  const router = useRouter();

  const [dealers, setDealers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [items, setItems] = useState<any[]>([]);

  const [form, setForm] = useState({
    quotation_date: new Date().toISOString().split("T")[0],
    valid_until: "",
    dealer_id: "",
    notes: "",
    deliveryNotes: "",
    discount: 0,
    tax: 0,
    discount_type: "fixed",
    tax_type: "fixed",
  });

  useEffect(() => {
    if (businessId) fetchInitialData();
  }, [businessId]);

  useEffect(() => {
    if (activeCategory) {
      QuotationService.getProductsByCategory(activeCategory).then((res) => {
        setCategoryProducts(res?.products || res || []);
      });
    }
  }, [activeCategory]);

  useEffect(() => {
    if (items.length === 0) {
      setItems([blankItem()]);
      setEditingIndex(0);
    }
  }, []);

  const fetchInitialData = async () => {
    try {
      const [dealerRes, categoryRes] = await Promise.all([
        DealerService.getAllDealers(businessId),
        category.getIndustryCategories(businessId),
      ]);
      setDealers(dealerRes?.dealers || dealerRes || []);
      setCategories(categoryRes || []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load data");
    }
  };

  const blankItem = () => ({
    category_id: "",
    product_id: "",
    item_name: "",
    price: 0,
    discount: 0,
    discount_type: "percentage",
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

  const updateItem = (index: number, key: string, value: any) => {
    const updated = [...items];

    if (["discount", "qty", "price"].includes(key)) {
      updated[index][key] = value === "" ? 0 : Number(value);
    } else {
      updated[index][key] = value;
    }

    const price = Number(updated[index].price || 0);
    const qty = Number(updated[index].qty || 0);
    const discount = Number(updated[index].discount || 0);
    const discountType = updated[index].discount_type || "percentage";

    const discountAmount =
      discountType === "percentage" ? (price * qty * discount) / 100 : discount;

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
    if (form.discount_type === "percentage") {
      total -= (total * Number(form.discount)) / 100;
    } else {
      total -= Number(form.discount);
    }
    if (form.tax_type === "percentage") {
      total += (total * Number(form.tax)) / 100;
    } else {
      total += Number(form.tax);
    }
    return total < 0 ? 0 : total;
  };

  const handleSubmit = async () => {
    if (!form.dealer_id) return toast.error("Please select a dealer");
    if (items.length === 0) return toast.error("Please add at least one item");
    if (items.some((i) => !i.product_id)) return toast.error("Please select a product for all items");

    try {
      setLoading(true);
      const payload = {
        dealer_id: form.dealer_id,
        quotation_date: form.quotation_date,
        valid_until: form.valid_until || null,
        notes: form.notes?.trim() || null,
        deliveryNotes: form.deliveryNotes?.trim() || null,
        discount: Number(form.discount) || 0,
        tax: Number(form.tax) || 0,
        discount_type: form.discount_type,
        tax_type: form.tax_type,
        items: items.map((i) => ({
          product_id: i.product_id,
          category_id: i.category_id,
          unit_price: Number(i.price) || 0,
          item_name: i.item_name,
          discount_percent: Number(i.discount) || 0,
          discount_type: i.discount_type,
          quantity: Number(i.qty) || 1,
        })),
      };

      const msg = await QuotationService.createQuotation(payload, businessId);
      toast.success(msg || "Quotation created successfully");
      router.push("/quotations");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create quotation");
    } finally {
      setLoading(false);
    }
  };

  const field = "border p-2 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-black";

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen space-y-6">

      <h1 className="text-2xl md:text-3xl font-semibold">Create Quotation</h1>

      {/* DETAILS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Quotation Date</label>
          <input type="date" value={form.quotation_date} readOnly className={field} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Valid Until</label>
          <input
            type="date"
            value={form.valid_until}
            onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
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
            {dealers.map((d: any) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
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

        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">Quotation Items</h2>
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
          const isEditing = editingIndex === index;
          const rowProducts = item.category_id === activeCategory ? categoryProducts : [];

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
{categories
  .filter((c: any) => c.is_active === true)
  .map((c: any) => (
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
                <input type="number" value={item.price} readOnly className={field} />
              ) : (
                <span className="text-sm px-1">{item.price}</span>
              )}

              {/* DISCOUNT */}
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

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 w-16 shrink-0">Discount</span>
          <select
            value={form.discount_type}
            onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
            className="border rounded-lg px-2 py-1 text-xs focus:outline-none w-20"
          >
            <option value="fixed">Amt</option>
            <option value="percentage">%</option>
          </select>
          <input
            type="number"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
            className="border rounded-lg px-2 py-1 text-xs focus:outline-none flex-1 min-w-0"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 w-16 shrink-0">Tax</span>
          <select
            value={form.tax_type}
            onChange={(e) => setForm({ ...form, tax_type: e.target.value })}
            className="border rounded-lg px-2 py-1 text-xs focus:outline-none w-20"
          >
            <option value="fixed">Amt</option>
            <option value="percentage">%</option>
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
          disabled={loading}
          className="bg-black text-white w-full py-2 rounded-lg text-sm mt-1 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Quotation"}
        </button>

      </div>

    </div>
  );
}