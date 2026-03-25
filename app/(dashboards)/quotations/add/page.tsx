"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { category } from "@/app/components/services/categoryService";
import DealerService from "@/app/components/services/dealerService";
import QuotationService from "@/app/components/services/quotationService";

type ItemType = {
  category_id: string;
  product_id: string;
  price: number;
  discount: number;
  qty: number;
  total: number;
  open: boolean;
};

export default function AddQuotation() {
  const user = useSelector((state: any) => state.user.user);
  const businessId = user?.industry;

  const [dealers, setDealers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [productsMap, setProductsMap] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState<ItemType[]>([
    {
      category_id: "",
      product_id: "",
      price: 0,
      discount: 0,
      qty: 1,
      total: 0,
      open: true,
    },
  ]);

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
    if (businessId) {
      fetchInitialData();
    }
  }, [businessId]);

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

  const fetchProducts = async (categoryId: string, index: number) => {
    try {
      if (!categoryId) {
        setProductsMap((prev) => ({
          ...prev,
          [index]: [],
        }));
        return;
      }

      const products = await QuotationService.getProductsByCategory(categoryId);
console.log("Fetched products for category", categoryId, products);
      setProductsMap((prev) => ({
        ...prev,
        [index]: products || [],
      }));
    } catch {
      setProductsMap((prev) => ({
        ...prev,
        [index]: [],
      }));
    }
  };

  const getCategoryName = (id: string) =>
    categories.find((c: any) => c._id === id)?.name || "-";

  const getProductName = (index: number, id: string) =>
    productsMap[index]?.find((p: any) => p._id === id)?.name || "-";

  const calculateRowTotal = (price: number, qty: number, discount: number) => {
    const safePrice = Number(price) || 0;
    const safeQty = Number(qty) || 0;
    const safeDiscount = Number(discount) || 0;

    const gross = safePrice * safeQty;
    const discountAmount = (gross * safeDiscount) / 100;

    return gross - discountAmount;
  };

  const addRow = () => {
    setItems((prev) => [
      ...prev,
      {
        category_id: "",
        product_id: "",
        price: 0,
        discount: 0,
        qty: 1,
        total: 0,
        open: true,
      },
    ]);
  };

  const removeRow = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated.length ? updated : [
      {
        category_id: "",
        product_id: "",
        price: 0,
        discount: 0,
        qty: 1,
        total: 0,
        open: true,
      },
    ]);

    setProductsMap((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  const updateItem = (index: number, key: keyof ItemType, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      const row = { ...updated[index], [key]: value };

      row.total = calculateRowTotal(
        Number(row.price),
        Number(row.qty),
        Number(row.discount)
      );

      updated[index] = row;
      return updated;
    });
  };

  const handleCategoryChange = async (index: number, value: string) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        category_id: value,
        product_id: "",
        price: 0,
        discount: 0,
        qty: 1,
        total: 0,
      };
      return updated;
    });

    await fetchProducts(value, index);
  };

  const subtotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);

  const getFinalTotal = () => {
    const discountValue = Number(form.discount) || 0;
    const taxValue = Number(form.tax) || 0;

    let total = subtotal;

    total -=
      form.discount_type === "percentage"
        ? (total * discountValue) / 100
        : discountValue;

    total +=
      form.tax_type === "percentage"
        ? (total * taxValue) / 100
        : taxValue;

    return total < 0 ? 0 : total;
  };

  const validateForm = () => {
    if (!businessId) {
      toast.error("Business not found");
      return false;
    }

    if (!form.dealer_id) {
      toast.error("Dealer is required");
      return false;
    }

    if (!form.quotation_date) {
      toast.error("Quotation date is required");
      return false;
    }

    if (!items.length) {
      toast.error("At least one item is required");
      return false;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item.category_id) {
        toast.error(`Category is required in row ${i + 1}`);
        return false;
      }

      if (!item.product_id) {
        toast.error(`Product is required in row ${i + 1}`);
        return false;
      }

      if (!item.qty || Number(item.qty) <= 0) {
        toast.error(`Quantity must be greater than 0 in row ${i + 1}`);
        return false;
      }

      if (Number(item.price) < 0) {
        toast.error(`Price cannot be negative in row ${i + 1}`);
        return false;
      }

      if (Number(item.discount) < 0 || Number(item.discount) > 100) {
        toast.error(`Discount must be between 0 and 100 in row ${i + 1}`);
        return false;
      }
    }

    if (Number(form.discount) < 0) {
      toast.error("Discount cannot be negative");
      return false;
    }

    if (Number(form.tax) < 0) {
      toast.error("Tax cannot be negative");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setForm({
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

    setItems([
      {
        category_id: "",
        product_id: "",
        price: 0,
        discount: 0,
        qty: 1,
        total: 0,
        open: true,
      },
    ]);

    setProductsMap({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

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
          discount_percent: Number(i.discount) || 0,
          quantity: Number(i.qty) || 1,
        })),
      };

      const msg = await QuotationService.createQuotation(payload, businessId);
      toast.success(msg || "Quotation created successfully");
      resetForm();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create quotation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <h1 className="text-3xl font-semibold">Create Quotation</h1>

      <div className="bg-white p-4 rounded-xl grid md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs block mb-1">Quotation Date *</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={form.quotation_date}
            onChange={(e) =>
              setForm({ ...form, quotation_date: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-xs block mb-1">Valid Until</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={form.valid_until}
            onChange={(e) =>
              setForm({ ...form, valid_until: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-xs block mb-1">Dealer *</label>
          <select
            className="border p-2 rounded w-full"
            value={form.dealer_id}
            onChange={(e) => setForm({ ...form, dealer_id: e.target.value })}
          >
            <option value="">Select Dealer</option>
            {dealers.map((d: any) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs block mb-1">Notes</label>
          <input
            className="border p-2 rounded w-full"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Optional notes"
          />
        </div>

        <div className="md:col-span-4">
          <label className="text-xs block mb-1">Delivery Notes</label>
          <textarea
            className="border p-2 rounded w-full min-h-[90px]"
            value={form.deliveryNotes}
            onChange={(e) =>
              setForm({ ...form, deliveryNotes: e.target.value })
            }
            placeholder="Optional delivery notes"
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Items</h2>
          <button
            type="button"
            onClick={addRow}
            className="bg-black text-white px-4 py-2 rounded"
          >
            + Add Item
          </button>
        </div>

        <div className="hidden md:grid grid-cols-6 gap-2 text-xs font-semibold mb-2">
          <span>Category</span>
          <span>Product</span>
          <span>Price</span>
          <span>Discount %</span>
          <span>Qty</span>
          <span>Total</span>
        </div>

        {items.map((item, index) => {
          const categoryName = getCategoryName(item.category_id);
          const productName = getProductName(index, item.product_id);

          return (
            <div key={index} className="border rounded p-3 mb-3">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-3 text-sm">
                <div className="font-medium">
                  {categoryName} | {productName} | {Number(item.total).toFixed(2)}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => updateItem(index, "open", !item.open)}
                    className="text-blue-600"
                  >
                    {item.open ? "Hide" : "Edit"}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {item.open && (
                <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                  <select
                    className="border p-2 rounded"
                    value={item.category_id}
                    onChange={(e) =>
                      handleCategoryChange(index, e.target.value)
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((c: any) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <select
                    className="border p-2 rounded"
                    value={item.product_id}
                    onChange={(e) => {
                      const product = productsMap[index]?.find(
                        (p: any) => p._id === e.target.value
                      );

                      updateItem(index, "product_id", e.target.value);
                      updateItem(index, "price", Number(product?.mrp) || 0);
                      updateItem(
                        index,
                        "discount",
                        Number(product?.discount_percent) || 0
                      );
                    }}
                  >
                    <option value="">Select Product</option>
                    {productsMap[index]?.length ? (
                      productsMap[index].map((p: any) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No products found
                      </option>
                    )}
                  </select>

                  <input
                    type="number"
                    className="border p-2 rounded"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(index, "price", Number(e.target.value))
                    }
                    placeholder="Price"
                  />

                  <input
                    type="number"
                    className="border p-2 rounded"
                    value={item.discount}
                    onChange={(e) =>
                      updateItem(index, "discount", Number(e.target.value))
                    }
                    placeholder="Discount %"
                  />

                  <input
                    type="number"
                    className="border p-2 rounded"
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(index, "qty", Number(e.target.value))
                    }
                    placeholder="Qty"
                  />

                  <input
                    readOnly
                    className="border p-2 rounded bg-gray-100"
                    value={Number(item.total).toFixed(2)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-white p-4 rounded-xl max-w-md ml-auto space-y-3">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex gap-2">
          <select
            className="border p-2 rounded"
            value={form.discount_type}
            onChange={(e) =>
              setForm({ ...form, discount_type: e.target.value })
            }
          >
            <option value="fixed">Amount</option>
            <option value="percentage">Percent</option>
          </select>

          <input
            type="number"
            className="border p-2 rounded w-full"
            value={form.discount}
            onChange={(e) =>
              setForm({ ...form, discount: Number(e.target.value) })
            }
            placeholder="Discount"
          />
        </div>

        <div className="flex gap-2">
          <select
            className="border p-2 rounded"
            value={form.tax_type}
            onChange={(e) => setForm({ ...form, tax_type: e.target.value })}
          >
            <option value="fixed">Amount</option>
            <option value="percentage">Percent</option>
          </select>

          <input
            type="number"
            className="border p-2 rounded w-full"
            value={form.tax}
            onChange={(e) =>
              setForm({ ...form, tax: Number(e.target.value) })
            }
            placeholder="Tax"
          />
        </div>

        <div className="font-bold text-lg flex justify-between">
          <span>Total:</span>
          <span>{getFinalTotal().toFixed(2)}</span>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white w-full py-2 rounded disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Quotation"}
        </button>
      </div>
    </div>
  );
}
// "use client";

// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";

// import { category } from "@/app/components/services/categoryService";
// import DealerService from "@/app/components/services/dealerService";
// import QuotationService from "@/app/components/services/quotationService";

// export default function AddQuotation() {

//   const user = useSelector((state: any) => state.user.user);
//   const businessId = user?.industry;

//   const [dealers, setDealers] = useState<any[]>([]);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [productsMap, setProductsMap] = useState<any>({});

//   const [items, setItems] = useState([
//     {
//       category_id: "",
//       product_id: "",
//       price: 0,
//       discount: 0,
//       qty: 1,
//       total: 0,
//       open: true
//     }
//   ]);

//   const [form, setForm] = useState({
//     quotation_date: new Date().toISOString().split("T")[0],
//     valid_until: "",
//     dealer_id: "",
//     notes: "",
//     deliveryNotes: "",
//     discount: 0,
//     tax: 0,
//     discount_type: "fixed",
//     tax_type: "fixed"
//   });

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     if (businessId) {
//       fetchDealers();
//       fetchCategories();
//     }
//   }, [businessId]);

//   const fetchDealers = async () => {
//     const data = await DealerService.getAllDealers(businessId);
//     setDealers(data || []);
//   };

//   const fetchCategories = async () => {
//     const data = await category.getIndustryCategories(businessId);
//     setCategories(data || []);
//   };

//   const fetchProducts = async (categoryId: string, index: number) => {
//     const data = await QuotationService.getProductsByCategory(categoryId);

//     setProductsMap((prev: any) => ({
//       ...prev,
//       [index]: data || []
//     }));
//   };

//   /* ================= ROW ================= */

//   const addRow = () => {
//     setItems([
//       ...items,
//       {
//         category_id: "",
//         product_id: "",
//         price: 0,
//         discount: 0,
//         qty: 1,
//         total: 0,
//         open: true
//       }
//     ]);
//   };

//   const removeRow = (index: number) => {
//     setItems(items.filter((_, i) => i !== index));
//   };

//   /* ================= ITEM ================= */

//   const updateItem = (index: number, key: string, value: any) => {
//     const updated = [...items];
//     updated[index][key] = value;

//     const price = Number(updated[index].price);
//     const qty = Number(updated[index].qty);
//     const discount = Number(updated[index].discount);

//     updated[index].total =
//       price * qty - (price * qty * discount) / 100;

//     setItems(updated);
//   };

//   const handleCategoryChange = (index: number, value: string) => {
//     updateItem(index, "category_id", value);
//     updateItem(index, "product_id", "");
//     fetchProducts(value, index);
//   };

//   /* ================= TOTAL ================= */

//   const subtotal = items.reduce((sum, item) => sum + item.total, 0);

//   const getFinalTotal = () => {
//     let total = subtotal;

//     if (form.discount_type === "percentage") {
//       total -= (total * Number(form.discount)) / 100;
//     } else {
//       total -= Number(form.discount);
//     }

//     if (form.tax_type === "percentage") {
//       total += (total * Number(form.tax)) / 100;
//     } else {
//       total += Number(form.tax);
//     }

//     return total;
//   };

//   /* ================= SUBMIT ================= */

//   const handleSubmit = async () => {

//     if (!form.dealer_id) {
//       toast.error("Select dealer");
//       return;
//     }

//     if (!items.length || !items[0].product_id) {
//       toast.error("Add at least one product");
//       return;
//     }

//     const payload = {
//       dealer_id: form.dealer_id,
//       quotation_date: form.quotation_date,
//       valid_until: form.valid_until,
//       notes: form.notes,
//       deliveryNotes: form.deliveryNotes,
//       discount: Number(form.discount),
//       tax: Number(form.tax),
//       discount_type: form.discount_type,
//       tax_type: form.tax_type,
//       items: items.map(i => ({
//         product_id: i.product_id,
//         category_id: i.category_id,
//         unit_price: Number(i.price),
//         discount_percent: Number(i.discount),
//         quantity: Number(i.qty)
//       }))
//     };

//     const msg = await QuotationService.createQuotation(payload, businessId);
//     toast.success(msg || "Quotation Created");
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="p-4 md:p-6 bg-gray-100 min-h-screen space-y-6">

//       <h1 className="text-2xl md:text-3xl font-semibold">Create Quotation</h1>

//       {/* DETAILS */}
//       <div className="bg-white p-4 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">

//         <div>
//           <label className="text-xs">Quotation Date</label>
//           <input type="date" value={form.quotation_date}
//             onChange={(e)=>setForm({...form,quotation_date:e.target.value})}
//             className="border p-2 rounded-lg w-full"
//           />
//         </div>

//         <div>
//           <label className="text-xs">Valid Until</label>
//           <input type="date" value={form.valid_until}
//             onChange={(e)=>setForm({...form,valid_until:e.target.value})}
//             className="border p-2 rounded-lg w-full"
//           />
//         </div>

//         <div>
//           <label className="text-xs">Dealer</label>
//           <select value={form.dealer_id}
//             onChange={(e)=>setForm({...form,dealer_id:e.target.value})}
//             className="border p-2 rounded-lg w-full"
//           >
//             <option value="">Select Dealer</option>
//             {dealers.map((d:any)=>(
//               <option key={d._id} value={d._id}>{d.name}</option>
//             ))}
//           </select>
//         </div>

//       </div>

//       {/* NOTES */}
//       <div className="bg-white p-4 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">

//         <div>
//           <label className="text-xs">Notes</label>
//           <textarea value={form.notes}
//             onChange={(e)=>setForm({...form,notes:e.target.value})}
//             className="border p-2 rounded-lg w-full"
//           />
//         </div>

//         <div>
//           <label className="text-xs">Delivery Notes</label>
//           <textarea value={form.deliveryNotes}
//             onChange={(e)=>setForm({...form,deliveryNotes:e.target.value})}
//             className="border p-2 rounded-lg w-full"
//           />
//         </div>

//       </div>

//       {/* ITEMS */}
//       <div className="bg-white p-4 rounded-2xl shadow-sm">

//         <div className="flex justify-between mb-4">
//           <h2 className="font-semibold">Items</h2>
//           <button onClick={addRow} className="bg-black text-white px-3 py-1 rounded">
//             + Add
//           </button>
//         </div>

//         {items.map((item, index) => {

//           const productName =
//             productsMap[index]?.find((p:any)=>p._id===item.product_id)?.name || "-";

//           return (
//             <div key={index} className="border rounded-xl p-3 mb-3">

//               <div className="flex justify-between text-sm mb-2">
//                 <div>
//                   <strong>{productName}</strong> | Total: {item.total.toFixed(2)}
//                 </div>

//                 <div className="flex gap-3">
//                   <button onClick={()=>updateItem(index,"open",!item.open)}>
//                     {item.open ? "Hide" : "Edit"}
//                   </button>
//                   <button onClick={()=>removeRow(index)} className="text-red-500">
//                     Delete
//                   </button>
//                 </div>
//               </div>

//               {item.open && (
//                 <div className="grid grid-cols-2 md:grid-cols-6 gap-2">

//                   <select value={item.category_id}
//                     onChange={(e)=>handleCategoryChange(index,e.target.value)}
//                     className="border p-2 rounded"
//                   >
//                     <option value="">Category</option>
//                     {categories.map((c:any)=>(
//                       <option key={c._id} value={c._id}>{c.name}</option>
//                     ))}
//                   </select>

//                   <select value={item.product_id}
//                     onChange={(e)=>{
//                       const product = productsMap[index]?.find(
//                         (p:any)=>p._id === e.target.value
//                       );

//                       updateItem(index,"product_id",e.target.value);
//                       updateItem(index,"price",product?.mrp || 0);
//                       updateItem(index,"discount",product?.discount_percent || 0);
//                     }}
//                     className="border p-2 rounded"
//                   >
//                     <option value="">Product</option>
//                     {productsMap[index]?.map((p:any)=>(
//                       <option key={p._id} value={p._id}>{p.name}</option>
//                     ))}
//                   </select>

//                   <input type="number" value={item.price}
//                     onChange={(e)=>updateItem(index,"price",e.target.value)}
//                     className="border p-2 rounded"
//                   />

//                   <input type="number" value={item.discount}
//                     onChange={(e)=>updateItem(index,"discount",e.target.value)}
//                     className="border p-2 rounded"
//                   />

//                   <input type="number" value={item.qty}
//                     onChange={(e)=>updateItem(index,"qty",e.target.value)}
//                     className="border p-2 rounded"
//                   />

//                   <input value={item.total.toFixed(2)} readOnly className="border p-2 rounded bg-gray-100" />

//                 </div>
//               )}

//             </div>
//           );
//         })}

//       </div>

//       {/* TOTAL */}
//       <div className="bg-white p-4 rounded-2xl shadow-sm max-w-md ml-auto space-y-3">

//         <div>Subtotal: {subtotal.toFixed(2)}</div>

//         <div className="flex gap-2">
//           <select value={form.discount_type}
//             onChange={(e)=>setForm({...form,discount_type:e.target.value})}
//             className="border p-2 rounded"
//           >
//             <option value="fixed">Amount</option>
//             <option value="percentage">Percent</option>
//           </select>

//           <input type="number" value={form.discount}
//             onChange={(e)=>setForm({...form,discount:e.target.value})}
//             className="border p-2 rounded w-full"
//           />
//         </div>

//         <div className="flex gap-2">
//           <select value={form.tax_type}
//             onChange={(e)=>setForm({...form,tax_type:e.target.value})}
//             className="border p-2 rounded"
//           >
//             <option value="fixed">Amount</option>
//             <option value="percentage">Percent</option>
//           </select>

//           <input type="number" value={form.tax}
//             onChange={(e)=>setForm({...form,tax:e.target.value})}
//             className="border p-2 rounded w-full"
//           />
//         </div>

//         <div className="font-bold">
//           Total: {getFinalTotal().toFixed(2)}
//         </div>

//         <button onClick={handleSubmit} className="bg-black text-white w-full py-2 rounded">
//           Save Quotation
//         </button>

//       </div>

//     </div>
//   );
// }