"use client";

import { useEffect, useState } from "react";

export default function AddQuotation() {

  const [dealers, setDealers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [productsMap, setProductsMap] = useState<any>({});

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

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchDealers();
    fetchCategories();
  }, []);

  const fetchDealers = async () => {
    const res = await fetch("/api/dealers");
    const data = await res.json();
    setDealers(data.dealers || []);
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.category || []);
  };

  const fetchProducts = async (categoryId: string, index: number) => {
    const res = await fetch(`/api/quotation/products/${categoryId}`);
    const data = await res.json();

    setProductsMap((prev:any) => ({
      ...prev,
      [index]: data
    }));
  };

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
    fetchProducts(value, index);
  };

  /* ================= TOTAL ================= */

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  const getFinalTotal = () => {
    let total = subtotal;

    if (form.discount_type === "percentage") {
      total -= (total * form.discount) / 100;
    } else {
      total -= form.discount;
    }

    if (form.tax_type === "percentage") {
      total += (total * form.tax) / 100;
    } else {
      total += form.tax;
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

    const res = await fetch("/api/quotation/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    alert(data.message || "Saved!");
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen space-y-6">

      <h1 className="text-2xl md:text-3xl font-semibold">Create Quotation</h1>

      {/* DETAILS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">

        <input type="date"
          value={form.quotation_date}
          onChange={(e)=>setForm({...form,quotation_date:e.target.value})}
          className="border p-2 rounded-lg text-sm"
        />

        <input type="date"
          value={form.valid_until}
          onChange={(e)=>setForm({...form,valid_until:e.target.value})}
          className="border p-2 rounded-lg text-sm"
        />

        <select
          value={form.dealer_id}
          onChange={(e)=>setForm({...form,dealer_id:e.target.value})}
          className="border p-2 rounded-lg text-sm"
        >
          <option value="">Select Dealer</option>
          {dealers.map((d:any)=>(
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>

      </div>

      {/* ITEMS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm">

        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Quotation Items</h2>
          <button onClick={addRow} className="bg-black text-white px-3 py-1 rounded-lg text-sm">
            + Add Item
          </button>
        </div>

        {items.map((item, index) => {

          const productName =
            productsMap[index]?.find((p:any)=>p._id===item.product_id)?.name || "-";

          return (
            <div key={index} className="border rounded-xl p-3 mb-3">

              {/* SUMMARY */}
              <div className="flex justify-between items-center text-sm flex-wrap gap-2">

                <div>
                  <strong>Category:</strong> {item.category_id || "-"} ,{" "}
                  <strong>Product:</strong> {productName} ,{" "}
                  <strong>Total:</strong> {item.total.toFixed(2)}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={()=>updateItem(index,"open",!item.open)}
                    className="text-blue-600 text-sm"
                  >
                    {item.open ? "Hide" : "Edit"}
                  </button>

                  <button
                    onClick={()=>removeRow(index)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>

              </div>

              {/* DETAILS */}
              {item.open && (
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mt-3">

                  <select
                    value={item.category_id}
                    onChange={(e)=>handleCategoryChange(index,e.target.value)}
                    className="border p-2 rounded-lg text-sm"
                  >
                    <option value="">Category</option>
                    {categories.map((c:any)=>(
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    value={item.product_id}
                    onChange={(e)=>{
                      const product = productsMap[index]?.find(
                        (p:any)=>p._id === e.target.value
                      );

                      updateItem(index,"product_id",e.target.value);
                      updateItem(index,"price",product?.mrp || 0);
                      updateItem(index,"discount",product?.discount_percent || 0);
                    }}
                    className="border p-2 rounded-lg text-sm"
                  >
                    <option value="">Product</option>
                    {productsMap[index]?.map((p:any)=>(
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>

                  <input type="number"
                    value={item.price}
                    onChange={(e)=>updateItem(index,"price",e.target.value)}
                    className="border p-2 rounded-lg text-sm"
                  />

                  <input type="number"
                    value={item.discount}
                    onChange={(e)=>updateItem(index,"discount",e.target.value)}
                    className="border p-2 rounded-lg text-sm"
                  />

                  <input type="number"
                    value={item.qty}
                    onChange={(e)=>updateItem(index,"qty",e.target.value)}
                    className="border p-2 rounded-lg text-sm"
                  />

                  <input
                    value={item.total.toFixed(2)}
                    readOnly
                    className="border p-2 rounded-lg bg-gray-100 text-sm"
                  />

                </div>
              )}

            </div>
          );
        })}

      </div>

      {/* TOTAL */}
      <div className="bg-white p-4 rounded-2xl shadow-sm max-w-md ml-auto space-y-3">

        <div className="text-sm">Subtotal: {subtotal.toFixed(2)}</div>

        <div className="flex gap-2">
          <select
            value={form.discount_type}
            onChange={(e)=>setForm({...form,discount_type:e.target.value})}
            className="border p-2 rounded-lg text-sm"
          >
            <option value="fixed">Amount</option>
            <option value="percentage">Percent</option>
          </select>

          <input type="number"
            value={form.discount}
            onChange={(e)=>setForm({...form,discount:e.target.value})}
            className="border p-2 rounded-lg w-full text-sm"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={form.tax_type}
            onChange={(e)=>setForm({...form,tax_type:e.target.value})}
            className="border p-2 rounded-lg text-sm"
          >
            <option value="fixed">Amount</option>
            <option value="percentage">Percent</option>
          </select>

          <input type="number"
            value={form.tax}
            onChange={(e)=>setForm({...form,tax:e.target.value})}
            className="border p-2 rounded-lg w-full text-sm"
          />
        </div>

        <div className="font-semibold text-lg">
          Total: {getFinalTotal().toFixed(2)}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-black text-white w-full py-2 rounded-lg"
        >
          Save Quotation
        </button>

      </div>

    </div>
  );
}