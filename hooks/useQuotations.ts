import { useQuery } from "@tanstack/react-query";
import  QuotationService  from "@/app/components/services/quotationService";

export const useQuotations = (id:string) => {

  return useQuery({
    queryKey: ["quotations"],
    queryFn: () => QuotationService.getQuotations(id),
    enabled: !!id,
  });

};