import InvoiceFooter from "@/pages/invoice/FooterInvoice";
import HeaderInvoice from "@/pages/invoice/HeaderInvoice"
import TableInvoice from "@/pages/invoice/TableInvoice";

export default function Quotation() {
  return (
    <div className="flex justify-center py-10">
      
      {/* A4 Container */}
      <div
        className="
          w-[210mm] min-h-[297mm] 
          bg-gray-100 shadow-lg 
          p-6 md:p-10
          text-[10px] md:text-[12px]
          leading-relaxed
          print:shadow-none

          relative   /* ✅ IMPORTANT */
        "
      >
        <HeaderInvoice />

        <div className="my-6">
          <TableInvoice />
        </div>

        {/* Main Footer */}
        <InvoiceFooter />

        {/* Bottom Bar */}
        <div className="absolute bottom-6 left-10 right-10 border-t pt-3 flex justify-between text-gray-500 text-xs">
          <p>info@wcipk.com</p>
          <p>Small Industrial Estate 1, Gujranwala</p>
        </div>

      </div>

    </div>
  );
}