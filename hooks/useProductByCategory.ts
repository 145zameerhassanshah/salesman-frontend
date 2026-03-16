import { useQuery } from "@tanstack/react-query";
import { order } from "@/app/components/services/orderService";

export const useProductsByCategory = (categoryId:any) => {

  return useQuery({
    queryKey: ["productsByCategory", categoryId],
    queryFn: () => order.getProductsByCategory(categoryId),
    enabled: !!categoryId
  });

};