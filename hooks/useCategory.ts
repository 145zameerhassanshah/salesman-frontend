import { useQuery } from "@tanstack/react-query";
import { category } from "@/app/components/services/categoryService";

export const useCategory = () => {

  return useQuery({
    queryKey: ["categories"],
    queryFn: category.getAllCategories
  });

};