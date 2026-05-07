// import { API } from "@/app/components/lib/endpoints";

// const safeJson = async (res) => {
//   try {
//     return await res.json();
//   } catch {
//     return {};
//   }
// };

// class OrderService {
//   /* =========================
//      GET ALL ORDERS
//   ========================= */

//   async getAllOrders(businessId, filters = {}) {
//     try {
//       if (!businessId) return [];

//       const {
//         page = 1,
//         limit = 100,
//         search = "",
//         status = "",
//       } = filters;

//       const params = new URLSearchParams();

//       params.set("page", String(page));
//       params.set("limit", String(limit));

//       if (search) params.set("search", search);
//       if (status) params.set("status", status);

//       const res = await fetch(`${API.orders}/${businessId}?${params.toString()}`, {
//         method: "GET",
//         credentials: "include",
//       });

//       const result = await safeJson(res);

//       if (!res.ok) return [];

//       return result?.orders || [];
//     } catch (error) {
//       console.error("Get orders error:", error);
//       return [];
//     }
//   }

//   /* =========================
//      GET ORDERS WITH PAGINATION
//   ========================= */

// async getOrdersPaginated(businessId, filters = {}) {
//   try {
//     if (!businessId) {
//       return {
//         success: false,
//         orders: [],
//         pagination: null,
//       };
//     }

//     const {
//       page = 1,
//       limit = 20,
//       search = "",
//       status = "",
//     } = filters;

//     const params = new URLSearchParams();

//     params.set("page", String(page));
//     params.set("limit", String(limit));

//     if (search) params.set("search", search);
//     if (status) params.set("status", status);

//     const res = await fetch(`${API.orders}/${businessId}?${params.toString()}`, {
//       method: "GET",
//       credentials: "include",
//     });

//     const result = await safeJson(res);

//     if (!res.ok) {
//       throw new Error(result?.message || "Failed to fetch orders");
//     }

//     return {
//       success: true,
//       orders: result?.orders || [],
//       pagination: result?.pagination || {
//         page,
//         limit,
//         total: 0,
//         totalPages: 1,
//       },
//     };
//   } catch (err) {
//     console.error("Get paginated orders error:", err);

//     return {
//       success: false,
//       orders: [],
//       pagination: null,
//       message: err?.message || "Failed to fetch orders",
//     };
//   }
// }  /* =========================
//      DASHBOARD STATS
//   ========================= */

//   async getDashboardStats(businessId) {
//     try {
//       const res = await fetch(`${API.orders}/stats/${businessId}`, {
//         method: "GET",
//         credentials: "include",
//       });

//       const result = await safeJson(res);

//       if (!res.ok) return false;

//       return result;
//     } catch (error) {
//       console.error("Dashboard stats error:", error);
//       return false;
//     }
//   }

//   /* =========================
//      CREATE ORDER
//   ========================= */

//   async createOrder(data) {
//     try {
//       const res = await fetch(API.orders, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(data),
//       });

//       const result = await safeJson(res);

//       if (!res.ok) {
//         return {
//           success: false,
//           message: result?.message || "Order creation failed",
//         };
//       }

//       return {
//         success: true,
//         message: result?.message || "Order created successfully",
//         order: result?.order,
//       };
//     } catch (error) {
//       console.error("Create order error:", error);

//       return {
//         success: false,
//         message: error?.message || "Order creation failed",
//       };
//     }
//   }

//   /* =========================
//      UPDATE ORDER
//   ========================= */

//   async updateOrder(data, id) {
//     try {
//       const res = await fetch(`${API.orders}/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(data),
//       });

//       const result = await safeJson(res);

//       if (!res.ok) {
//         return {
//           success: false,
//           message: result?.message || "Order update failed",
//         };
//       }

//       return result;
//     } catch (error) {
//       console.error("Update order error:", error);

//       return {
//         success: false,
//         message: error?.message || "Order update failed",
//       };
//     }
//   }

//   /* =========================
//      DELETE ORDER
//   ========================= */

//   async deleteOrder(id) {
//     try {
//       const res = await fetch(`${API.orders}/${id}`, {
//         method: "DELETE",
//         credentials: "include",
//       });

//       const result = await safeJson(res);

//       if (!res.ok) {
//         return {
//           success: false,
//           message: result?.message || "Delete failed",
//         };
//       }

//       return result;
//     } catch (error) {
//       console.error("Delete order error:", error);

//       return {
//         success: false,
//         message: error?.message || "Delete failed",
//       };
//     }
//   }

//   /* =========================
//      GET PRODUCTS BY CATEGORY
//   ========================= */

//   async getProductsByCategory(categoryId) {
//     try {
//       if (!categoryId) return [];

//       const res = await fetch(`${API.orders}/products/${categoryId}`, {
//         method: "GET",
//         credentials: "include",
//       });

//       const result = await safeJson(res);

//       if (!res.ok) return [];

//       return result?.products || result || [];
//     } catch (error) {
//       console.error("Get products by category error:", error);
//       return [];
//     }
//   }

//   /* =========================
//      UPDATE STATUS
//   ========================= */

//   async updateStatus(id, statusData) {
//     try {
//       const body =
//         typeof statusData === "string"
//           ? { status: statusData }
//           : statusData;

//       const res = await fetch(`${API.orders}/update-status/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//         credentials: "include",
//       });

//       const result = await safeJson(res);

//       if (!res.ok) {
//         return {
//           success: false,
//           message: result?.message || "Status update failed",
//         };
//       }

//       return result;
//     } catch (error) {
//       console.error("Update status error:", error);

//       return {
//         success: false,
//         message: error?.message || "Status update failed",
//       };
//     }
//   }

//   /* =========================
//      GET ORDER BY ID
//   ========================= */

//   async getOrderById(id) {
//     try {
//       const res = await fetch(`${API.orders}/details/${id}`, {
//         method: "GET",
//         credentials: "include",
//       });

//       const result = await safeJson(res);

//       if (!res.ok) {
//         return {
//           success: false,
//           message: result?.message || "Failed to fetch order",
//         };
//       }

//       return result;
//     } catch (error) {
//       console.error("Get order detail error:", error);

//       return {
//         success: false,
//         message: error?.message || "Failed to fetch order",
//       };
//     }
//   }

//   /* =========================
//      GET AUDIT LOGS
//   ========================= */

//   async getAuditLogs(orderId) {
//     try {
//       const res = await fetch(`${API.audit}/entity/ORDER/${orderId}?page=1&limit=20`, {
//         method: "GET",
//         credentials: "include",
//       });

//       const result = await safeJson(res);

//       if (!res.ok) {
//         return {
//           success: false,
//           data: [],
//           message: result?.message || "Failed to fetch audit logs",
//         };
//       }

//       return result;
//     } catch (error) {
//       console.error("Get order audit logs error:", error);

//       return {
//         success: false,
//         data: [],
//         message: error?.message || "Failed to fetch audit logs",
//       };
//     }
//   }

//   /* =========================
//      DOWNLOAD PDF AS BLOB
//   ========================= */

//   async downloadPDF(id) {
//     try {
//       const res = await fetch(`${API.orders}/pdf/${id}`, {
//         method: "GET",
//         credentials: "include",
//       });

//       if (!res.ok) {
//         throw new Error("PDF download failed");
//       }

//       return await res.blob();
//     } catch (error) {
//       console.error("PDF blob error:", error);
//       throw error;
//     }
//   }

//   /* =========================
//      DIRECT PDF DOWNLOAD
//   ========================= */

//   async downloadPdf(id) {
//     try {
//       const res = await fetch(API.orderPdf(id), {
//         method: "GET",
//         credentials: "include",
//       });

//       if (!res.ok) {
//         const result = await safeJson(res);
//         throw new Error(result?.message || "PDF download failed");
//       }

//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);

//       let filename = `order-${id}.pdf`;

//       const disposition = res.headers.get("Content-Disposition");

//       if (disposition) {
//         const match = disposition.match(/filename="?([^"]+)"?/);
//         if (match?.[1]) filename = match[1];
//       }

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = filename;

//       document.body.appendChild(a);
//       a.click();
//       a.remove();

//       window.URL.revokeObjectURL(url);

//       return {
//         success: true,
//         message: "PDF downloaded successfully",
//       };
//     } catch (error) {
//       console.error("PDF download error:", error);

//       return {
//         success: false,
//         message: error?.message || "PDF download failed",
//       };
//     }
//   }
// }

// export const order = new OrderService();
// export default order;


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
  // async createOrder(data) {
  //     const res = await fetch(API.orders, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       credentials: "include",
  //       body: JSON.stringify(data)
  //     });

  //     const result = await res.json();

  //     if (!res.ok) return {success:false,message:result?.message};

  //     return {success:true,message:result?.message};
  // }

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

  if (!res.ok) return { success: false, message: result?.message };

  return { success: true, message: result?.message };
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