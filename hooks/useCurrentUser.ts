import { useQuery } from "@tanstack/react-query";
import AuthService from "@/app/components/services/authService";

export const useCurrentUser = (isLoggedIn: boolean) => {

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: AuthService.getCurrentUser,
    enabled: isLoggedIn,   // 👈 prevents query if logged out
    retry: false
  });

};