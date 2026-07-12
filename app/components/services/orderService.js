

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
     ✅ ADDED: CREATE VOICE DRAFT
     This does not save order.
     It only creates draft payload.
  ========================= */

  async createVoiceDraft(data) {
  const res = await fetch(API.orderVoiceDraft, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const text = await res.text();

  console.log("VOICE DRAFT STATUS:", res.status);
  console.log("VOICE DRAFT RESPONSE:", text);

  let result;

  try {
    result = JSON.parse(text);
  } catch {
    return {
      success: false,
      message: `Server returned non-JSON response. Status: ${res.status}`,
      raw: text,
    };
  }

  if (!res.ok) {
    return {
      success: false,
      message: result?.message || "Voice draft failed",
    };
  }

  return result;
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

  let result;

  try {
    result = await res.json();
  } catch {
    return { success: false, message: "Server error (non-JSON response)" };
  }

  if (!res.ok) {
    return {
      success: false,
      message: result?.message || "Order creation failed",
    };
  }

  return {
    success: true,
    message: result?.message || "Order created successfully",
    order: result?.order,
  };
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
          body:JSON.stringify(status),
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
   GET AUDIT LOGS
========================= */

async getAuditLogs(orderId) {
  try {
    const res = await fetch(
      `${API_URL}/audit-logs?module=ORDER&entityId=${orderId}`,
      {
        method: "GET",
        credentials: "include", 
      }
    );

    return await res.json();
  } catch (err) {
    return { success: false };
  }
}
/* =========================
   DOWNLOAD PDF
========================= */
async downloadPDF(id) {
  const res = await fetch(API.orderPdf(id), {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    let result = {};
    try {
      result = await res.json();
    } catch {}

    throw new Error(result?.message || "PDF download failed");
  }

  return await res.blob();
}
}
export const order = new OrderService();
