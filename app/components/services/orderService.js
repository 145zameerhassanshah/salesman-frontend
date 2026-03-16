import { API } from "@/app/components/lib/endpoints";

class OrderService {

  /* =========================
     GET ALL ORDERS
  ========================= */

  async getAllOrders() {
    try {

      const res = await fetch(API.orders, {
        method: "GET",
        credentials: "include"
      });

      const result = await res.json();

      if (!res.ok) return false;

      return result.orders;

    } catch (error) {
      throw error.message;
    }
  }


  /* =========================
     CREATE ORDER
  ========================= */

  async createOrder(data) {
    try {

      const res = await fetch(API.orders, {
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
     UPDATE ORDER
  ========================= */

  async updateOrder(data, id) {
    try {

      const res = await fetch(`${API.orders}/${id}`, {
        method: "PATCH",
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
     DELETE ORDER
  ========================= */

  async deleteOrder(id) {
    try {

      const res = await fetch(`${API.orders}/${id}`, {
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


  /* =========================
     GET PRODUCTS BY CATEGORY
  ========================= */

  async getProductsByCategory(categoryId) {
    try {

      const res = await fetch(
        `${API.orders}/products/${categoryId}`,
        {
          method: "GET",
          credentials: "include"
        }
      );

      const result = await res.json();

      if (!res.ok) return false;

      return result;

    } catch (error) {
      throw error.message;
    }
  }

}

export const order = new OrderService();