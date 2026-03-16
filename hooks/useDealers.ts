import { useQuery } from "@tanstack/react-query";
import { dealer } from "@/app/components/services/dealerService";

export const useDealers = () => {
  return useQuery({
    queryKey: ["dealers"],
    queryFn: dealer.getAllDealers,
  });
};