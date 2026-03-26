import { useQuery } from "@tanstack/react-query";
import DealerService from "@/app/components/services/dealerService";

export const useDealers = (id:string) => {
  return useQuery({
    queryKey: ["dealers"],
    queryFn: () => DealerService.getAllDealers(id),
    enabled: !!id
  });
};