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

async getDashboardStats(id) {
  try {
    const res = await fetch(`${API.orders}/stats/${id}`, {
      method: "GET",
      credentials: "include"
    });

    const result = await res.json();

    if (!res.ok) return false;

    return result;

  } catch (error) {
    throw error.message;
  }
}
  /* =========================
     CREATE ORDER
  ========================= */
async downloadPDF(id) {
  const res = await fetch(`${API.orders}/pdf/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const blob = await res.blob();
  return blob;
}
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
  
      const res = await fetch(`${API.orders}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
      });

      const result = await res.json();

      return result;
  }


  /* =========================
     DELETE ORDER
  ========================= */

  async deleteOrder(id) {
        const res = await fetch(`${API.orders}/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      const result = await res.json();

      return result;
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

  async getOrderById(id) {
  try {
    const res = await fetch(`${API.orders}/details/${id}`, {
      method: "GET",
      credentials: "include",
    });
    return await res.json();
  } catch (error) {
    throw error.message;
  }
}

}

export const order = new OrderService();