import { API } from "@/app/components/lib/endpoints";

class DealerService {

  /* =========================
     GET ALL DEALERS
  ========================= */

  async getAllDealers() {
    try {

      const res = await fetch(API.dealers, {
        method: "GET",
        credentials: "include"
      });

      const result = await res.json();

      if (!res.ok) return false;

      return result.dealers;

    } catch (error) {
      throw error.message;
    }
  }


  /* =========================
     CREATE DEALER
  ========================= */

  async createDealer(data) {
    try {

      const res = await fetch(`${API.dealers}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) return false;

      return result.message;

    } catch (error) {
      throw error.message;
    }
  }


  /* =========================
     GET DEALER BY ID
  ========================= */

  async getDealerById(id) {
    try {

      const res = await fetch(`${API.dealers}/${id}`, {
        method: "GET",
        credentials: "include"
      });

      const result = await res.json();

      if (!res.ok) return false;

      return result.dealer;

    } catch (error) {
      throw error.message;
    }
  }


  /* =========================
     UPDATE DEALER
  ========================= */

  async updateDealer(data, id) {
    try {

      const res = await fetch(`${API.dealers}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) return false;

      return result.message;

    } catch (error) {
      throw error.message;
    }
  }


  /* =========================
     DELETE DEALER
  ========================= */

  async deleteDealer(id) {
    try {

      const res = await fetch(`${API.dealers}/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      const result = await res.json();

      if (!res.ok) return false;

      return result.message;

    } catch (error) {
      throw error.message;
    }
  }

}

export const dealer = new DealerService();