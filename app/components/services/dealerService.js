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

      return result;

    } catch (error) {
      throw error;
    }
  }

  /* =========================
     CREATE DEALER
  ========================= */

  async createDealer(data, isFormData = false) {
    try {

      const res = await fetch(`${API.dealers}/create`, {
        method: "POST",
        credentials: "include",
        headers: isFormData ? undefined : {
          "Content-Type": "application/json"
        },
        body: isFormData ? data : JSON.stringify(data)
      });

      const result = await res.json();

      return result;

    } catch (error) {
      throw error;
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

      return result;

    } catch (error) {
      throw error;
    }
  }

  /* =========================
     UPDATE DEALER
  ========================= */

  async updateDealer(data, id) {
    try {

      const res = await fetch(`${API.dealers}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      return result;

    } catch (error) {
      throw error;
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

      return result;

    } catch (error) {
      throw error;
    }
  }

}

export const dealer = new DealerService();