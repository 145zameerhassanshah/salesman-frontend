import { useQuery } from "@tanstack/react-query";
import   ProductService from "@/app/components/services/productService";

export const useProducts = (id:string) => {

  return useQuery({
    queryKey: ["products"],
    queryFn:()=> ProductService.getProducts(id),
    enabled:!!id
  });

};