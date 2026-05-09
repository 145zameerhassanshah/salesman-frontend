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
//       if (result.success == false) return result;
//       return result.industry;
//     } catch (error) {
//       throw error.message;
//     }
//   }

//   /* =========================
//      CREATE INDUSTRY
//   ========================= */
//   async createIndustry(data) {
//     const res = await fetch(API.industry, {
//       method: "POST",
//       credentials: "include",
//       body: data
//     });
//     const result = await res.json();
//     if (!res.ok) return result;
//     return result;
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
// async updateIndustry(id, data) {
//   try {
//     const res = await fetch(`${API.industry}/${id}`, {
//       method: "PUT",
//       credentials: "include",
//       body: data // ❌ JSON.stringify hatao
//     });

//     const result = await res.json();
//     if (!res.ok) return result;
//     return result;
//   } catch (error) {
//     throw error.message;
//   }
// }
//   /* =========================
//      DELETE INDUSTRY
//   ========================= */
// async deleteIndustry(id) {
//   try {
//     const res = await fetch(`${API.industry}/${id}`, {
//       method: "DELETE",
//       credentials: "include"
//     });

//     const result = await res.json();

//     if (!res.ok) return result;

//     return result; // 🔥 full object
//   } catch (error) {
//     throw error.message;
//   }
// }}

// // Exporting as an instance
// export const industry = new IndustryService();



import { API } from "@/app/components/lib/endpoints";

const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

class IndustryService {
  /* =========================
     GET ALL INDUSTRIES
  ========================= */

  async getAllIndustries(filters = {}) {
    try {
      const {
        page = 1,
        limit = 12,
        search = "",
        status = "",
      } = filters;

      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", String(limit));

      if (search) params.set("search", search);
      if (status) params.set("status", status);

      const res = await fetch(`${API.industry}?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Failed to fetch businesses",
          industry: [],
          industries: [],
          pagination: null,
        };
      }

      return {
        success: true,
        industry: result?.industry || result?.industries || [],
        industries: result?.industries || result?.industry || [],
        pagination: result?.pagination || null,
        count: result?.pagination?.total || result?.count || 0,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || "Failed to fetch businesses",
        industry: [],
        industries: [],
        pagination: null,
      };
    }
  }

  /* =========================
     CREATE INDUSTRY
  ========================= */

  async createIndustry(data) {
    try {
      const res = await fetch(API.industry, {
        method: "POST",
        credentials: "include",
        body: data,
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Failed to create business",
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: error?.message || "Failed to create business",
      };
    }
  }

  /* =========================
     GET INDUSTRY BY ID
  ========================= */

  async getIndustryById(id) {
    try {
      const res = await fetch(`${API.industry}/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Failed to fetch business",
          industry: null,
        };
      }

      return {
        success: true,
        industry: result?.industry || null,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || "Failed to fetch business",
        industry: null,
      };
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
        body: data,
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Failed to update business",
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: error?.message || "Failed to update business",
      };
    }
  }

  /* =========================
     DELETE INDUSTRY
  ========================= */

  async deleteIndustry(id) {
    try {
      const res = await fetch(`${API.industry}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Failed to delete business",
          error: result?.error,
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: error?.message || "Failed to delete business",
      };
    }
  }

  /* =========================
     AUDIT HISTORY
  ========================= */

  async getIndustryAuditLogs(industryId, page = 1, limit = 20) {
    try {
      const res = await fetch(
        `${API.audit}/entity/INDUSTRY/${industryId}?page=${page}&limit=${limit}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          data: [],
          logs: [],
          pagination: null,
          message: result?.message || "Failed to fetch business activity",
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        data: [],
        logs: [],
        pagination: null,
        message: error?.message || "Failed to fetch business activity",
      };
    }
  }
}

export const industry = new IndustryService();
export default industry;