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

  if (!orderData) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="flex justify-center bg-gray-200 py-8 px-3 print:bg-white print:py-0">
      <div
        id="invoice"
        className="
          w-full max-w-[210mm]
          min-h-[280mm]
          bg-white
          text-[12px]
          shadow-md
          print:shadow-none
          flex flex-col
          px-8 py-8
        "
      >
        {/* Header */}
        <HeaderInvoice order={orderData} />

        {/* Table Section */}
        <div className="mt-6">
          <TableInvoice items={items} />
        </div>

        {/* Footer */}
        <div className="mt-6">
          <InvoiceFooter order={orderData} />
        </div>

        {/* Bottom Contact Row */}
        <div className="border-t pt-3 flex justify-between text-gray-500 text-xs mt-6">
          <p>{orderData.businessId?.bussinesEmail || "-"}</p>
          <p>{orderData.businessId?.address || "-"}</p>
        </div>
      </div>
    </div>
  );
}