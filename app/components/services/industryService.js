// import { API } from "@/app/components/lib/endpoints";

// class IndustryService {

//   /* =========================
//      GET ALL INDUSTRIES
//   ========================= */

//   async getAllIndustries() {
//     try {

//       const res = await fetch(API.industry, {
//         method: "GET",
//         credentials: "include"
//       });

//       const result = await res.json();

//       if (result.success==false) return result;

//       return result.industry;

//     } catch (error) {
//       throw error.message;
//     }
//   }


//   /* =========================
//      CREATE INDUSTRY
//   ========================= */

//   async createIndustry(data) {
//       const res = await fetch(API.industry, {
//         method: "POST",
//         credentials: "include",
//         body: data
//       });

//       const result = await res.json();

//       if (!res.ok) return result;

//       return result;
//   }


//   /* =========================
//      GET INDUSTRY BY ID
//   ========================= */

//   async getIndustryById(id) {
//     try {

//       const res = await fetch(`${API.industry}/${id}`, {
//         method: "GET",
//         credentials: "include"
//       });

//       const result = await res.json();

//       if (!res.ok) return false;

//       return result.industry;

//     } catch (error) {
//       throw error.message;
//     }
//   }


//   /* =========================
//      UPDATE INDUSTRY
//   ========================= */

//   async updateIndustry(data, id) {
//     try {

//       const res = await fetch(`${API.industry}/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         credentials: "include",
//         body: JSON.stringify(data)
//       });

//       const result = await res.json();

//       if (!res.ok) return false;

//       return result.message;

//     } catch (error) {
//       throw error.message;
//     }
//   }


//   /* =========================
//      DELETE INDUSTRY
//   ========================= */

//   async deleteIndustry(id) {
//     try {

//       const res = await fetch(`${API.industry}/${id}`, {
//         method: "DELETE",
//         credentials: "include"
//       });

//       const result = await res.json();

//       if (!res.ok) return false;

//       return result.message;

//     } catch (error) {
//       throw error.message;
//     }
//   }

// }

// export const industry = new IndustryService();

import { API } from "@/app/components/lib/endpoints";

class IndustryService {
  /* =========================
     GET ALL INDUSTRIES
  ========================= */
  async getAllIndustries() {
    try {
      const res = await fetch(API.industry, {
        method: "GET",
        credentials: "include"
      });
      const result = await res.json();
      if (result.success == false) return result;
      return result.industry;
    } catch (error) {
      throw error.message;
    }
  }

  /* =========================
     CREATE INDUSTRY
  ========================= */
  async createIndustry(data) {
    const res = await fetch(API.industry, {
      method: "POST",
      credentials: "include",
      body: data
    });
    const result = await res.json();
    if (!res.ok) return result;
    return result;
  }

  /* =========================
     GET INDUSTRY BY ID
  ========================= */
  async getIndustryById(id) {
    try {
      const res = await fetch(`${API.industry}/${id}`, {
        method: "GET",
        credentials: "include"
      });
      const result = await res.json();
      if (!res.ok) return false;
      return result.industry;
    } catch (error) {
      throw error.message;
    }
  }

  /* =========================
     UPDATE INDUSTRY
  ========================= */
async updateIndustry(id, data) {
  try {
    const res = await fetch(`${API.industry}/${id}`, {
      method: "PUT",
      credentials: "include",
      body: data // ❌ JSON.stringify hatao
    });

    const result = await res.json();
    if (!res.ok) return result;
    return result;
  } catch (error) {
    throw error.message;
  }
}
  /* =========================
     DELETE INDUSTRY
  ========================= */
async deleteIndustry(id) {
  try {
    const res = await fetch(`${API.industry}/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    const result = await res.json();

    if (!res.ok) return result;

    return result; // 🔥 full object
  } catch (error) {
    throw error.message;
  }
}}

// Exporting as an instance
export const industry = new IndustryService();