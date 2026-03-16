import { useQuery } from "@tanstack/react-query";
import {product} from "@/app/components/services/productService";

export const useProducts = () => {

  return useQuery({
    queryKey: ["products"],
    queryFn: product.fetchProducts
  });

};