"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { order } from "@/app/components/services/orderService";
import { useParams } from "next/navigation";

import InvoiceFooter from "@/app/components/invoice/FooterInvoice";
import HeaderInvoice from "@/app/components/invoice/HeaderInvoice";
import TableInvoice from "@/app/components/invoice/TableInvoice";

export default function PrintOrderPage() {
  const params = useParams();

  const orderId = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const invoiceRef = useRef<HTMLDivElement>(null);

  const [orderData, setOrderData] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ORDER ================= */
  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await order.getOrderById(orderId);

        if (!res?.success) {
          setLoading(false);
          return;
        }

        setOrderData(res.order);
        setItems(res.items || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  /* ================= PDF DOWNLOAD ================= */
  const downloadPdf = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 4, // 🔥 HIGH QUALITY
      useCORS: true,
      backgroundColor: "#ffffff",
      scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const pageHeight = 297;

    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 🔥 MULTI PAGE FIX
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${orderData?.order_number || "order"}.pdf`);
  };

  /* ================= AUTO DOWNLOAD ================= */
  useEffect(() => {
    if (!loading && orderData) {
      const timer = setTimeout(() => {
        downloadPdf();
      }, 1200); // 🔥 optimized delay

      return () => clearTimeout(timer);
    }
  }, [loading, orderData]);

  /* ================= UI ================= */

  if (loading) return <div className="p-10">Loading...</div>;

  if (!orderData) {
    return <div className="p-10 text-red-500">Order not found</div>;
  }

  return (
    <div className="flex justify-center py-10 bg-white">
      <div
        ref={invoiceRef}
        id="invoice"
        className="
          w-[794px] min-h-[1123px]
          bg-gray-100 shadow-lg
          p-6 md:p-10
          text-[12px]
          leading-relaxed
          relative
        "
      >
        {/* HEADER */}
        <HeaderInvoice order={orderData} />

        {/* TABLE */}
        <div className="my-6">
          <TableInvoice items={items} order={orderData} />
        </div>

        {/* FOOTER */}
        <InvoiceFooter />

        {/* BOTTOM BAR */}
        <div className="absolute bottom-6 left-10 right-10 border-t pt-3 flex justify-between text-gray-500 text-xs">
          <p>info@wcipk.com</p>
          <p>Small Industrial Estate 1, Gujranwala</p>
        </div>
      </div>
    </div>
  );
}