import { API } from "@/app/components/lib/endpoints";
class DealerService {

  /* GET ALL */
  static async getAllDealers(businessId) {
    const res = await fetch(`${API.dealers}/business/${businessId}`, {
      credentials: "include"
    });

    return await res.json();
  }

  /* GET ONE */
  static async getDealerById(id) {
    const res = await fetch(`${API.dealers}/${id}`, {
      credentials: "include"
    });

    return await res.json();
  }

  /* CREATE */
  static async createDealer(data, businessId) {
    const res = await fetch(`${API.dealers}/create/${businessId}`, {
      method: "POST",
      credentials: "include",
      body: data
    });

    return await res.json();
  }

  /* UPDATE */
  static async updateDealer(data, id) {
    const res = await fetch(`${API.dealers}/${id}`, {
      method: "PUT", // ✅ FIXED
      credentials: "include",
      body: data
    });

    return await res.json();
  }

  /* DELETE */
  static async deleteDealer(id) {
    const res = await fetch(`${API.dealers}/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    return await res.json();
  }
}

export default DealerService;