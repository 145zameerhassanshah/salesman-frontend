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
          w-[210mm] min-h-[190mm] 
          bg-white shadow-lg 
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
          {quotation?.businessId.addressLogo && (
            <img
              src={quotation.businessId.addressLogo}
              alt="Address Logo"
      className="
        w-full 
        h-[40px] 
        object-cover
      "
            />
          )}

        </div>

      </div>
      </div>
    </div>
  );
}