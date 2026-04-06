"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QuotationService from "@/app/components/services/quotationService";

import QuotationFooter from "@/app/components/quotation/FooterQuotation";
import HeaderQuotation from "@/app/components/quotation/HeaderQuotation";
import TableQuotation from "@/app/components/quotation/TableQuotation";

export default function Quotation() {
  const params = useParams();
  const id = params?.id;

  const [quotation, setQuotation] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await QuotationService.getQuotationById(id);
      if (res.success) {
        setQuotation(res.quotation);
        setItems(res.items);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (!quotation) return <div>Loading...</div>;

  return (
    <div className="flex justify-center py-10">
      <div
        id="invoice"
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
<HeaderQuotation quotation={quotation} />

        <div className="my-6">
          <TableQuotation items={items} />
        </div>

<QuotationFooter quotation={quotation} />        

      <div className="print-footer">
        <div className="border-t pt-3 flex justify-between text-gray-500 text-xs">
          <img
  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${quotation?.businessId.business_logo}`}
  alt="Industry Logo"
  className="w-8 h-8 object-contain bg-gray-100 rounded-md p-1"
/>

          <p>{quotation.businessId?.bussinesEmail || "-"}</p>
          <p>{quotation.businessId?.address || "-"}</p>
        </div>
      </div>
      </div>
    </div>
  );
}