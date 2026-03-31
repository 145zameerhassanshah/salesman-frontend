"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { order } from "@/app/components/services/orderService";

import InvoiceFooter from "@/app/components/invoice/FooterInvoice";
import HeaderInvoice from "@/app/components/invoice/HeaderInvoice";
import TableInvoice from "@/app/components/invoice/TableInvoice";

export default function Quotation() {
  const params = useParams();
  const id = params?.id;

  const [orderData, setOrderData] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await order.getOrderById(id);
        if (res.success) {
          setOrderData(res.order);
          setItems(res.items);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (id) fetchData();
  }, [id]);

  // 🔥 Loading state
  if (!orderData) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="flex justify-center py-10">
      
      {/* A4 Container */}
      <div
        id="invoice"   // 🔥 VERY IMPORTANT (Puppeteer)
        className="
          w-[210mm] min-h-[297mm] 
          bg-gray-100 shadow-lg 
          p-6 md:p-10
          text-[10px] md:text-[12px]
          leading-relaxed
          print:shadow-none
          relative
        "
      >

        {/* 🔥 HEADER */}
        <HeaderInvoice order={orderData} />

        {/* 🔥 TABLE */}
        <div className="my-6">
          <TableInvoice items={items} />
          <InvoiceFooter order={orderData} />

        </div>

        {/* 🔥 FOOTER */}
        {/* 🔥 BOTTOM BAR (DYNAMIC) */}
        <div className="absolute bottom-6 left-10 right-10 border-t pt-3 flex justify-between text-gray-500 text-xs">
          <p>{orderData.businessId?.bussinesEmail || "-"}</p>
          <p>{orderData.businessId?.address || "-"}</p>
        </div>

      </div>
    </div>
  );
}