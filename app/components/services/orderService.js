import { API } from "@/app/components/lib/endpoints";

class OrderService {

  /* =========================
     GET ALL ORDERS
  ========================= */

  async getAllOrders(id) {
    try {

      const res = await fetch(`${API.orders}/${id}`, {
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
      const res = await fetch(API.orders, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) return {success:false,message:result?.message};

      return {success:true,message:result?.message};
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

  async updateStatus(id,status){
    try {

      const res = await fetch(
        `${API.orders}/update-status/${id}`,
        {
          method: "PATCH",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({status}),
          credentials: "include"
        }
      );

      return await res.json();

       } catch (error) {
      throw error.message;
    }
  }

}

export const order = new OrderService();