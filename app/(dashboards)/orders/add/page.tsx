"use client";

import { useCategory } from "@/hooks/useCategory";
import { useDealers } from "@/hooks/useDealers";
import { useProductsByCategory } from "@/hooks/useProductByCategory";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function AddOrder() {

  const user = useSelector((state:any)=>state.user.user);

  const { data: categories = [] } = useCategory(user?.industry);
  console.log(categories)
  const { data } = useDealers(user?.industry);
  // const {data:productsByCategory}=useProductsByCategory(categories[0]);
  // console.log(productsByCategory)
  const dealers = data?.dealers || [];

  const [items, setItems] = useState([
    {
      category_id: "",
      product_id: "",
      price: 0,
      discount: 0,
      qty: 1,
      total: 0,
      open: true
    }
  ]);

  const [form, setForm] = useState({
    quotation_date: new Date().toISOString().split("T")[0],
    valid_until: "",
    dealer_id: "",
    notes: "",
    discount: 0,
    tax: 0,
    discount_type: "fixed",
    tax_type: "fixed"
  });

  /* ================= ROW ================= */

  const addRow = () => {
    setItems([
      ...items,
      {
        category_id: "",
        product_id: "",
        price: 0,
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

  const handleCategoryChange = (index: number, value: string) => {
    updateItem(index, "category_id", value);
    updateItem(index, "product_id", "");
  };

  /* ================= TOTAL ================= */

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

    return total;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    const payload = {
      dealer_id: form.dealer_id,
      quotation_date: form.quotation_date,
      valid_until: form.valid_until,
      notes: form.notes,
      discount: form.discount,
      tax: form.tax,
      discount_type: form.discount_type,
      tax_type: form.tax_type,
      items: items.map(i => ({
        product_id: i.product_id,
        category_id: i.category_id,
        unit_price: i.price,
        discount_percent: i.discount,
        quantity: i.qty
      }))
    };

    console.log(payload);
  };

  /* ================= UI ================= */

  const field =
    "border p-2 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-black";

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen space-y-6">

      <h1 className="text-2xl md:text-3xl font-semibold">Create Order</h1>

      {/* DETAILS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Creation Date</label>
          <input
            type="date"
            value={form.quotation_date}
            onChange={(e)=>setForm({...form,quotation_date:e.target.value})}
            className={field}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Due Date</label>
          <input
            type="date"
            value={form.valid_until}
            onChange={(e)=>setForm({...form,valid_until:e.target.value})}
            className={field}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Dealer</label>
          <select
            value={form.dealer_id}
            onChange={(e)=>setForm({...form,dealer_id:e.target.value})}
            className={field}
          >
            <option value="">Select Dealer</option>
            {dealers.map((d:any)=>(
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* ITEMS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm">

        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Order Items</h2>
          <button onClick={addRow} className="bg-black text-white px-3 py-1 rounded-lg text-sm">
            + Add Item
          </button>
        </div>

        {items.map((item, index) => {

          const { data: products = [] } = useProductsByCategory(item.category_id);

          const productName =
            products?.find((p:any)=>p._id===item.product_id)?.name || "-";

          return (
            <div key={index} className="border rounded-xl p-3 mb-3">

              <div className="flex justify-between items-center text-sm flex-wrap gap-2">
                <div>
                  <strong>Category:</strong> {item.category_id || "-"} ,{" "}
                  <strong>Product:</strong> {productName} ,{" "}
                  <strong>Total:</strong> {item.total.toFixed(2)}
                </div>

                <div className="flex gap-3">
                  <button onClick={()=>updateItem(index,"open",!item.open)} className="text-blue-600 text-sm">
                    {item.open ? "Hide" : "Edit"}
                  </button>
                  <button onClick={()=>removeRow(index)} className="text-red-500 text-sm">
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
                        const product = products?.find(
                          (p:any)=>p._id === e.target.value
                        );

                        updateItem(index,"product_id",e.target.value);
                        updateItem(index,"price",product?.mrp || 0);
                        updateItem(index,"discount",product?.discount_percent || 0);
                      }}
                      className={field}
                    >
                      <option value="">Select</option>
                      {products.map((p:any)=>(
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* MRP */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">MRP</label>
                    <input type="number" value={item.price}
                      onChange={(e)=>updateItem(index,"price",e.target.value)}
                      className={field}
                    />
                  </div>

                  {/* Discount */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Discount %</label>
                    <input type="number" value={item.discount}
                      onChange={(e)=>updateItem(index,"discount",e.target.value)}
                      className={field}
                    />
                  </div>

                  {/* Quantity */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Qty</label>
                    <input type="number" value={item.qty}
                      onChange={(e)=>updateItem(index,"qty",e.target.value)}
                      className={field}
                    />
                  </div>

                  {/* Total */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Total</label>
                    <input value={item.total.toFixed(2)} readOnly
                      className="border p-2 rounded-lg bg-gray-100 text-sm w-full"
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

        <div className="text-sm">Subtotal: {subtotal.toFixed(2)}</div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Discount</label>
          <div className="flex gap-2">
            <select
              value={form.discount_type}
              onChange={(e)=>setForm({...form,discount_type:e.target.value})}
              className={field}
            >
              <option value="fixed">Amount</option>
              <option value="percentage">Percent</option>
            </select>

            <input
              type="number"
              value={form.discount}
              onChange={(e)=>setForm({...form,discount:e.target.value})}
              className={field}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Tax</label>
          <div className="flex gap-2">
            <select
              value={form.tax_type}
              onChange={(e)=>setForm({...form,tax_type:e.target.value})}
              className={field}
            >
              <option value="fixed">Amount</option>
              <option value="percentage">Percent</option>
            </select>

            <input
              type="number"
              value={form.tax}
              onChange={(e)=>setForm({...form,tax:e.target.value})}
              className={field}
            />
          </div>
        </div>

        <div className="font-semibold text-lg">
          Total: {getFinalTotal().toFixed(2)}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-black text-white w-full py-2 rounded-lg"
        >
          Save Order
        </button>

      </div>

    </div>
  );
}