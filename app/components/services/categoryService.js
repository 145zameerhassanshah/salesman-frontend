// import { API } from "@/app/components/lib/endpoints";

// class CategoryService {
//   async addCategory(data,id) {
//       const res = await fetch(`${API.productCategory}/${id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(data),
//       });
//       const result = await res.json();
//       return result;
//   }

//   async getAllCategories(){
//     try {
//         const res=await fetch(API.productCategory,{method:"GET",credentials:"include"});
//         const result=await res.json();

//         if(!res.ok){
//             return false;
//         }

//         return result.categories;
//     } catch (error) {
//         throw error.message;
//     }
//   }

//   async getIndustryCategories(id) {
//   try {

//     const res = await fetch(`${API.productCategory}/my-added/${id}`, {
//       method: "GET",
//       credentials: "include"
//     });

//     const result = await res.json();

//     if (!res.ok) {
//       throw new Error(result.message || "Failed to fetch");
//     }

//     return result.category;

//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }

// async updateCategory(data, id) {
//   try {
//     const res = await fetch(`${API.productCategory}/${id}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       credentials: "include",
//       body: JSON.stringify(data)
//     });

//     const result = await res.json();

//     if (!res.ok) {
//       return { success: false, message: result.message };
//     }

//     return { success: true, data: result.category }

//   } catch (error) {
//     return { success: false, message: error.message };
//   }
// }

// async removeCategory(id){
//     try {
//         const res=await fetch(`${API.productCategory}/${id}`,{
//             method:"DELETE",
//             credentials:"include",
//         });
//         const result=await res.json();
//         if(!res.ok) return result;

//         return result;
//     } catch (error) {
//         throw error.message;
//     }
// }

// }

// export const category=new CategoryService();





// // import { API } from "@/app/components/lib/endpoints";

// // class CategoryService {

// //   async addCategory(data, id) {
// //     try {
// //       const res = await fetch(`${API.productCategory}/${id}`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         credentials: "include",
// //         body: JSON.stringify(data),
// //       });

// //       const result = await res.json();

// //       if (!res.ok) throw new Error(result.message);

// //       return result.message;
// //     } catch (err) {
// //       return err.message;
// //     }
// //   }

// //   async getIndustryCategories(id) {
// //     try {
// //       const res = await fetch(`${API.productCategory}/my-added/${id}`, {
// //         credentials: "include"
// //       });

// //       const result = await res.json();

// //       if (!res.ok) throw new Error(result.message);

// //       return result.category || [];
// //     } catch (err) {
// //       console.error(err);
// //       return [];
// //     }
// //   }

// //   async updateCategory(data, id) {
// //     try {
// //       const res = await fetch(`${API.productCategory}/${id}`, {
// //         method: "PATCH",
// //         headers: { "Content-Type": "application/json" },
// //         credentials: "include",
// //         body: JSON.stringify(data)
// //       });

// //       const result = await res.json();

// //       if (!res.ok) throw new Error(result.message);

// //       return result.category;
// //     } catch (err) {
// //       return null;
// //     }
// //   }

// //   async removeCategory(id) {
// //     try {
// //       const res = await fetch(`${API.productCategory}/${id}`, {
// //         method: "DELETE",
// //         credentials: "include"
// //       });

// //       const result = await res.json();

// //       if (!res.ok) throw new Error(result.message);

// //       return result.message;
// //     } catch (err) {
// //       return err.message;
// //     }
// //   }
// // }

// // export const category = new CategoryService();
import { API } from "@/app/components/lib/endpoints";

const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

const buildCategoryQuery = (filters = {}) => {
  const {
    page = 1,
    limit = 20,
    search = "",
    status = "",
  } = filters;

  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));

  if (search) params.set("search", search);

  // ✅ Backend expects is_active, not status
  if (status === "active") params.set("is_active", "true");
  if (status === "inactive") params.set("is_active", "false");

  return params.toString();
};

class CategoryService {
  async addCategory(data, id) {
    try {
      const res = await fetch(`${API.productCategory}/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Failed to add category",
        };
      }

      return result;
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Failed to add category",
      };
    }
  }

  async getIndustryCategories(id, filters = {}) {
    try {
      if (!id) return [];

      const query = buildCategoryQuery({
        page: filters.page || 1,
        limit: filters.limit || 100,
        search: filters.search || "",
        status: filters.status || "",
      });

      const res = await fetch(
        `${API.productCategory}/my-added/${id}?${query}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await safeJson(res);

      if (!res.ok) return [];

      return result?.category || result?.categories || [];
    } catch (error) {
      console.error("Get industry categories error:", error);
      return [];
    }
  }

  async getIndustryCategoriesPaginated(id, filters = {}) {
    try {
      if (!id) {
        return {
          success: false,
          category: [],
          pagination: null,
        };
      }

      const query = buildCategoryQuery(filters);

      const res = await fetch(
        `${API.productCategory}/my-added/${id}?${query}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Failed to fetch categories",
          category: [],
          pagination: null,
        };
      }

      return {
        success: true,
        category: result?.category || result?.categories || [],
        pagination: result?.pagination || {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: 0,
          totalPages: 1,
        },
      };
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Failed to fetch categories",
        category: [],
        pagination: null,
      };
    }
  }

  async updateCategory(data, id) {
    try {
      const res = await fetch(`${API.productCategory}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Failed to update category",
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: error?.message || "Failed to update category",
      };
    }
  }

  async removeCategory(id, businessId) {
    try {
      const res = await fetch(`${API.productCategory}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",

        // ✅ because backend uses req.body.industry / req.user.industry
        body: JSON.stringify({
          industry: businessId,
        }),
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Failed to delete category",
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: error?.message || "Failed to delete category",
      };
    }
  }

  async getCategoryAuditLogs(categoryId, page = 1, limit = 20) {
    try {
      const res = await fetch(
        `${API.audit}/entity/CATEGORY/${categoryId}?page=${page}&limit=${limit}`,
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
          pagination: null,
          message: result?.message || "Failed to fetch category activity",
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: null,
        message: error?.message || "Failed to fetch category activity",
      };
    }
  }
}

export const category = new CategoryService();
export default category;