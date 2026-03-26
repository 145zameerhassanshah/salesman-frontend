import { useQuery } from "@tanstack/react-query";
import { order } from "@/app/components/services/orderService";

export const useOrders = (id:string) => {

  return useQuery({
    queryKey: ["orders"],
    queryFn:()=> order.getAllOrders(id),
    enabled:!!id
  });

};