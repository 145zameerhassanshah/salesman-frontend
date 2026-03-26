// import { API } from "@/app/components/lib/endpoints";
// class DealerService {

//   /* GET ALL */
//   static async getAllDealers(businessId) {
//     const res = await fetch(`${API.dealers}/business/${businessId}`, {
//       credentials: "include"
//     });

//     return await res.json();
//   }

//   /* GET ONE */
//   static async getDealerById(id) {
//     const res = await fetch(`${API.dealers}/${id}`, {
//       credentials: "include"
//     });

//     return await res.json();
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
//       method: "PUT", // ✅ FIXED
//       credentials: "include",
//       body: data
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


import { API } from "@/app/components/lib/endpoints";

class DealerService {

  static async getAllDealers(businessId) {
    try {
      const res = await fetch(`${API.dealers}/business/${businessId}`, {
        credentials: "include"
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      return result.dealers || result;
    } catch (err) {
      console.error("Get Dealers Error:", err);
      return [];
    }
  }

  static async getDealerById(id) {
    try {
      const res = await fetch(`${API.dealers}/${id}`, {
        credentials: "include"
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      return result.dealer || result;
    } catch (err) {
      console.error("Get Dealer Error:", err);
      return null;
    }
  }

  static async createDealer(data, businessId) {
    try {
      const res = await fetch(`${API.dealers}/create/${businessId}`, {
        method: "POST",
        credentials: "include",
        body: data // FormData (correct)
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      return result.message;
    } catch (err) {
      return err.message;
    }
  }

  static async updateDealer(data, id) {
    try {
      const res = await fetch(`${API.dealers}/${id}`, {
        method: "PUT",
        credentials: "include",
        body: data
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      return result.message;
    } catch (err) {
      return err.message;
    }
  }

  static async deleteDealer(id) {
    try {
      const res = await fetch(`${API.dealers}/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      return result.message;
    } catch (err) {
      return err.message;
    }
  }
}

export default DealerService;