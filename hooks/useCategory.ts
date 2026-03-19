import { useQuery } from "@tanstack/react-query";
import { category } from "@/app/components/services/categoryService";

export const useCategory = (id:string) => {

  return useQuery({
    queryKey: ["categories"],
    queryFn:()=> category.getIndustryCategories(id),
    enabled:!!id
  });

};