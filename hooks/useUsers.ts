import { useQuery } from "@tanstack/react-query";
import UserService from "@/app/components/services/userService";

export const useUsers = (id: string) => {
  return useQuery({
    queryKey: ["users", id], 
    queryFn: () => UserService.fetchUsers(id), 
    enabled: !!id
  });
};