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
/* =========================
   DOWNLOAD PDF
========================= */
async downloadPdf(id) {
  try {
    const res = await fetch(API.orderPdf(id), {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("PDF download failed");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `order-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("PDF download error:", error);
  }
}
}
export const order = new OrderService();