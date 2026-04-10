import { API } from "@/app/components/lib/endpoints";

class ProductService {

  /* ================= GET ALL ================= */

  static async getProducts(id) {
    
      const res = await fetch(`${API.products}/${id}`, {
        method: "GET",
        credentials: "include"
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch products");
      }

      return result;

  }

  /* ================= GET BY ID ================= */

  static async getProductById(id) {
    try {
      const res = await fetch(`${API.products}/single/${id}`, {
        method: "GET",
        credentials: "include"
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch product");
      }

      return result;

    } catch (err) {
      console.error("Get product error:", err);
      throw err;
    }
  }

  /* ================= ADD ================= */

  static async addProduct(data, id) {
    try {
      const res = await fetch(`${API.products}/create/${id}`, {
        method: "POST",
        credentials: "include",
        body: data
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to add product");
      }

      return result;

    } catch (err) {
      console.error("Add product error:", err);
      throw err;
    }
  }

  /* ================= UPDATE ================= */

  static async updateProduct(data, id) {
      const res = await fetch(`${API.products}/${id}`, {
        method: "PATCH", 
        credentials: "include",
        body: data
      });

      const result = await res.json();

      return result;
  }

  /* ================= DELETE ================= */

  static async deleteProduct(id) {
      const res = await fetch(`${API.products}/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      const result = await res.json();
      return result;
  }

}

export default ProductService;