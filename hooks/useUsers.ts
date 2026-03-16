import { useQuery } from "@tanstack/react-query";
import { user } from "@/app/components/services/userService";

export const useUsers = () => {

  return useQuery({
    queryKey: ["users"],
    queryFn: user.fetchUsers
  });

};