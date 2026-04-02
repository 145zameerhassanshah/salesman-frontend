// "use client";

// import { useEffect, useState, useRef } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { order } from "@/app/components/services/orderService";

// import HeaderInvoice from "@/app/components/invoice/HeaderInvoice";
// import TableInvoice from "@/app/components/invoice/TableInvoice";
// import InvoiceFooter from "@/app/components/invoice/FooterInvoice";

// export default function OrderPdfGenerator({ orderId, onDone }: any) {
//   const [orderData, setOrderData] = useState<any>(null);
//   const [items, setItems] = useState<any[]>([]);
//   const invoiceRef = useRef<HTMLDivElement>(null);

//   /* ================= FETCH ================= */
//   useEffect(() => {
//     if (!orderId) return;

//     const fetchOrder = async () => {
//       const res = await order.getOrderById(orderId);

//       if (res?.success) {
//         setOrderData(res.order);
//         setItems(res.items || []);
//       }
//     };

//     fetchOrder();
//   }, [orderId]);

//   /* ================= GENERATE PDF ================= */
//   useEffect(() => {
//     if (!orderData || items.length === 0) return;

//     const generatePdf = async () => {
//       const element = invoiceRef.current;
//       if (!element) return;

//       // 🔥 FULL RENDER WAIT
//       await new Promise((r) => setTimeout(r, 1200));
//       await new Promise((r) => requestAnimationFrame(r));

//       const canvas = await html2canvas(element, {
//         scale: 4,
//         useCORS: true,
//         backgroundColor: "#ffffff",
//       });

//       const imgData = canvas.toDataURL("image/png");

//       const pdf = new jsPDF("p", "mm", "a4");

//       const imgWidth = 210;
//       const pageHeight = 297;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       let heightLeft = imgHeight;
//       let position = 0;

//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;

//       while (heightLeft > 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }

//       pdf.save(`${orderData.order_number}.pdf`);

//       onDone?.(); // cleanup
//     };

//     generatePdf();
//   }, [orderData, items]);

//   if (!orderData) return null;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         opacity: 0,
//         zIndex: -1,
//       }}
//     >
//       <div
//         ref={invoiceRef}
//         className="w-[794px] min-h-[1123px] bg-gray-100 p-6 md:p-10 text-[12px] relative"
//       >
//         <HeaderInvoice order={orderData} />

//         <div className="my-6">
//           <TableInvoice items={items} order={orderData} />
//         </div>

//         <InvoiceFooter />

//         <div className="absolute bottom-6 left-10 right-10 border-t pt-3 flex justify-between text-gray-500 text-xs">
//           <p>info@wcipk.com</p>
//           <p>Small Industrial Estate 1, Gujranwala</p>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PrintOrderPage() {
  const params = useParams();

  const orderId = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const [orderData, setOrderData] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ORDER ================= */
  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`); // backend getOrderById
        const data = await res.json();

        if (!data?.success) {
          setLoading(false);
          return;
        }

        setOrderData(data.order);
        setItems(data.items || []);
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
    if (!orderId) return;

    try {
      const res = await fetch(`/api/orders/downloadPDF/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `order-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err);
    }
  };

  /* ================= AUTO DOWNLOAD ================= */
  useEffect(() => {
    if (!loading && orderData) {
      downloadPdf(); // Puppeteer backend PDF download
    }
  }, [loading, orderData]);

  /* ================= UI ================= */
  if (loading) return <div className="p-10">Loading...</div>;

  if (!orderData) return <div className="p-10 text-red-500">Order not found</div>;

  return (
    <div className="flex justify-center py-10 bg-white">
      <div
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