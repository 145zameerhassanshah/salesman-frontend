import { useQuery } from "@tanstack/react-query";
import { quotation } from "@/app/components/services/quotationService";

export const useQuotations = () => {

  return useQuery({
    queryKey: ["quotations"],
    queryFn: quotation.getAllQuotations
  });

};