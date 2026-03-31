// import InvoiceFooter from "@/app/components/invoice/FooterInvoice";
// import HeaderInvoice from "@/app/components/invoice/HeaderInvoice"
// import TableInvoice from "@/app/components/invoice/TableInvoice";

// export default function Quotation() {
//   return (
//     <div className="flex justify-center py-10">
      
//       {/* A4 Container */}
//       <div
//         className="
//           w-[210mm] min-h-[297mm] 
//           bg-gray-100 shadow-lg 
//           p-6 md:p-10
//           text-[10px] md:text-[12px]
//           leading-relaxed
//           print:shadow-none

//           relative   /* ✅ IMPORTANT */
//         "
//       >
//         <HeaderInvoice />

//         <div className="my-6">
//           <TableInvoice />
//         </div>

//         {/* Main Footer */}
//         <InvoiceFooter />

//         {/* Bottom Bar */}
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
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { order } from "@/app/components/services/orderService";

import InvoiceFooter from "@/app/components/invoice/FooterInvoice";
import HeaderInvoice from "@/app/components/invoice/HeaderInvoice";
import TableInvoice from "@/app/components/invoice/TableInvoice";

export default function PrintOrderPage({ params }: any) {
  const user = useSelector((state: any) => state.user.user);
  const [orderData, setOrderData] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const canDownload = (orderObj: any) => {
    return (
      user?.user_type === "admin" ||
      (user?.user_type === "salesman" && orderObj?.status === "approved")
    );
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await order.getOrderById(params.id);

        if (!res?.success) {
          setLoading(false);
          return;
        }

        if (!canDownload(res.order)) {
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
  }, [params.id]);

  const downloadPdf = async () => {
    const element = document.getElementById("invoice");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save(`${orderData?.order_number || "order"}.pdf`);
  };

  useEffect(() => {
    if (!loading && orderData && canDownload(orderData)) {
      const timer = setTimeout(() => {
        downloadPdf();
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [loading, orderData]);

  if (loading) return <div className="p-10">Loading...</div>;

  if (!orderData) {
    return <div className="p-10 text-red-500">Order not found or download not allowed.</div>;
  }

  return (
    <div className="flex justify-center py-10 bg-white">
      <div
        id="invoice"
        className="
          w-[210mm] min-h-[297mm]
          bg-gray-100 shadow-lg
          p-6 md:p-10
          text-[10px] md:text-[12px]
          leading-relaxed
          relative
        "
      >
        <HeaderInvoice order={orderData} />

        <div className="my-6">
          <TableInvoice items={items} order={orderData} />
        </div>

        <InvoiceFooter />

        <div className="absolute bottom-6 left-10 right-10 border-t pt-3 flex justify-between text-gray-500 text-xs">
          <p>info@wcipk.com</p>
          <p>Small Industrial Estate 1, Gujranwala</p>
        </div>
      </div>
    </div>
  );
}
