import { API } from "@/app/components/lib/endpoints";

class DashboardService {
async getStats(businessId) {
  if (!businessId) {
    console.log("NO BUSINESS ID ❌");
    return null;
  }

  const res = await fetch(`${API.dashboard}/${businessId}`, {
    method: "GET",
    credentials: "include",
  });

  return await res.json();
}
}

export const dashboard = new DashboardService();