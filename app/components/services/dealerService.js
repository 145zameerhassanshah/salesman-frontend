import { API } from "@/app/components/lib/endpoints";

// class DealerService {

//   static async getAllDealers(businessId) {
//     const res = await fetch(`${API.dealers}/business/${businessId}`, {
//       credentials: "include"
//     });
//     return await res.json();
//   }

//   static async getDealerById(id) {
//     try {
//       const res = await fetch(`${API.dealers}/${id}`, {
//         credentials: "include"
//       });

//       const result = await res.json();
//       return result.dealer;

//     } catch (err) {
//       return null;
//     }
//   }

//   /* CREATE */
//   static async createDealer(data, businessId) {
//     const res = await fetch(`${API.dealers}/create/${businessId}`, {
//       method: "POST",
//       credentials: "include",
//       body: data
//     });

//     return await res.json();
//   }

//   /* UPDATE */
//   static async updateDealer(data, id) {
//     const res = await fetch(`${API.dealers}/${id}`, {
//       method: "PUT",
//       credentials: "include",
//       body: data
//     });

//     return await res.json();
//   }

//   /* ✅ APPROVE / REJECT */
//   static async updateDealerStatus(id, data) {
//     const res = await fetch(`${API.dealers}/status/${id}`, {
//       method: "PATCH",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(data)
//     });

//     return await res.json();
//   }

//   /* ✅ UNAPPROVE */
//   static async unapproveDealer(id) {
//     const res = await fetch(`${API.dealers}/unapprove/${id}`, {
//       method: "PATCH",
//       credentials: "include"
//     });

//     return await res.json();
//   }

//   /* ✅ REASSIGN */
//   static async reassignDealer(id, newSalesmanId) {
//     const res = await fetch(`${API.dealers}/reassign/${id}`, {
//       method: "PATCH",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ newSalesmanId })
//     });

//     return await res.json();
//   }

//   /* DELETE */
//   static async deleteDealer(id) {
//     const res = await fetch(`${API.dealers}/${id}`, {
//       method: "DELETE",
//       credentials: "include"
//     });

//     return await res.json();
//   }
// }

// export default DealerService;




class DealerService {

  static async getAllDealers(businessId) {
    try {
      const res = await fetch(`${API.dealers}/business/${businessId}`, {
        credentials: "include"
      });
      return await res.json();
    } catch {
      return { success: false };
    }
  }

  static async getDealerById(id) {
    try {
      const res = await fetch(`${API.dealers}/${id}`, {
        credentials: "include"
      });
      return await res.json(); // 🔥 FIX
    } catch {
      return { success: false };
    }
  }

  static async createDealer(data, businessId) {
    const res = await fetch(`${API.dealers}/create/${businessId}`, {
      method: "POST",
      credentials: "include",
      body: data
    });
    return await res.json();
  }

  static async updateDealer(data, id) {
    const res = await fetch(`${API.dealers}/${id}`, {
      method: "PUT",
      credentials: "include",
      body: data
    });
    return await res.json();
  }

  static async updateDealerStatus(id, data) {
    const res = await fetch(`${API.dealers}/status/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await res.json();
  }

  static async unapproveDealer(id) {
    const res = await fetch(`${API.dealers}/unapprove/${id}`, {
      method: "PATCH",
      credentials: "include"
    });
    return await res.json();
  }

  static async reassignDealer(id, newSalesmanId) {
    const res = await fetch(`${API.dealers}/reassign/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newSalesmanId })
    });
    return await res.json();
  }

  static async deleteDealer(id) {
    const res = await fetch(`${API.dealers}/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    return await res.json();
  }
}
export default DealerService;
