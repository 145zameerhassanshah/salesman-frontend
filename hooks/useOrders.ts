import { useQuery } from "@tanstack/react-query";
import { order } from "@/app/components/services/orderService";

export const useOrders = () => {

  return useQuery({
    queryKey: ["orders"],
    queryFn: order.getAllOrders
  });

};