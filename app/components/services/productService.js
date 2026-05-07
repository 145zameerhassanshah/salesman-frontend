// import { API } from "@/app/components/lib/endpoints";

// class ProductService {

//   /* ================= GET ALL ================= */

//   static async getProducts(id) {
    
//       const res = await fetch(`${API.products}/${id}`, {
//         method: "GET",
//         credentials: "include"
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         throw new Error(result.message || "Failed to fetch products");
//       }

//       return result;

//   }

//   /* ================= GET BY ID ================= */

//   static async getProductById(id) {
//     try {
//       const res = await fetch(`${API.products}/single/${id}`, {
//         method: "GET",
//         credentials: "include"
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         throw new Error(result.message || "Failed to fetch product");
//       }

//       return result;

//     } catch (err) {
//       console.error("Get product error:", err);
//       throw err;
//     }
//   }

//   /* ================= ADD ================= */

//   static async addProduct(data, id) {
//     try {
//       const res = await fetch(`${API.products}/create/${id}`, {
//         method: "POST",
//         credentials: "include",
//         body: data
//       });

//       const result = await res.json();

//       if (!res.ok) {
//         throw new Error(result.message || "Failed to add product");
//       }

//       return result;

//     } catch (err) {
//       console.error("Add product error:", err);
//       throw err;
//     }
//   }

//   /* ================= UPDATE ================= */

//   static async updateProduct(data, id) {
//       const res = await fetch(`${API.products}/${id}`, {
//         method: "PATCH", 
//         credentials: "include",
//         body: data
//       });

//       const result = await res.json();

//       return result;
//   }

//   /* ================= DELETE ================= */

//   static async deleteProduct(id) {
//       const res = await fetch(`${API.products}/${id}`, {
//         method: "DELETE",
//         credentials: "include"
//       });

//       const result = await res.json();
//       return result;
//   }

// }

// export default ProductService;



import { API } from "@/app/components/lib/endpoints";

const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

class ProductService {
static async getProducts(id, filters = {}) {
  try {
    if (!id) return { success: false, products: [], count: 0, pagination: null };

    const {
      page = 1,
      limit = 100,
      search = "",
      status = "",
      category_id = "",
    } = filters;

    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("limit", String(limit));

    if (search) params.set("search", search);
    if (category_id) params.set("category_id", category_id);

    // ✅ IMPORTANT: backend expects is_active, not status
    if (status === "active") params.set("is_active", "true");
    if (status === "inactive") params.set("is_active", "false");

    const res = await fetch(`${API.products}/${id}?${params.toString()}`, {
      method: "GET",
      credentials: "include",
    });

    const result = await safeJson(res);

    if (!res.ok) {
      return {
        success: false,
        message: result?.message || "Failed to fetch products",
        products: [],
        count: 0,
        pagination: null,
      };
    }

    return {
      success: true,
      products: result?.products || [],
      count: result?.pagination?.total || result?.count || 0,
      pagination: result?.pagination || null,
    };
  } catch (err) {
    return {
      success: false,
      message: err?.message || "Failed to fetch products",
      products: [],
      count: 0,
      pagination: null,
    };
  }
}  static async getProductsPaginated(id, filters = {}) {
    return this.getProducts(id, filters);
  }

  static async getProductById(id) {
    try {
      const res = await fetch(`${API.products}/single/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Failed to fetch product",
          product: null,
        };
      }

      return result;
    } catch (err) {
      console.error("Get product error:", err);

      return {
        success: false,
        message: err?.message || "Failed to fetch product",
        product: null,
      };
    }
  }

  static async addProduct(data, id) {
    try {
      const res = await fetch(`${API.products}/create/${id}`, {
        method: "POST",
        credentials: "include",
        body: data,
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Failed to add product",
        };
      }

      return result;
    } catch (err) {
      console.error("Add product error:", err);

      return {
        success: false,
        message: err?.message || "Failed to add product",
      };
    }
  }

  static async updateProduct(data, id) {
    try {
      const res = await fetch(`${API.products}/${id}`, {
        method: "PATCH",
        credentials: "include",
        body: data,
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Failed to update product",
        };
      }

      return result;
    } catch (err) {
      console.error("Update product error:", err);

      return {
        success: false,
        message: err?.message || "Failed to update product",
      };
    }
  }

static async deleteProduct(id, businessId) {
  try {
    const params = new URLSearchParams();

    if (businessId) {
      params.set("businessId", businessId);
    }

    const url = params.toString()
      ? `${API.products}/${id}?${params.toString()}`
      : `${API.products}/${id}`;

    const res = await fetch(url, {
      method: "DELETE",
      credentials: "include",
    });

    const result = await safeJson(res);

    if (!res.ok) {
      return {
        success: false,
        message: result?.message || "Failed to delete product",
        error: result?.error,
      };
    }

    return result;
  } catch (err) {
    console.error("Delete product error:", err);

    return {
      success: false,
      message: err?.message || "Failed to delete product",
    };
  }
}
  static async getProductAuditLogs(productId, page = 1, limit = 20) {
    try {
      const res = await fetch(
        `${API.audit}/entity/PRODUCT/${productId}?page=${page}&limit=${limit}`,
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
          message: result?.message || "Failed to fetch product activity",
        };
      }

      return result;
    } catch (err) {
      return {
        success: false,
        data: [],
        pagination: null,
        message: err?.message || "Failed to fetch product activity",
      };
    }
  }
}

export default ProductService;