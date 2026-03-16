import { API } from "@/app/components/lib/endpoints";

class QuotationService {

  /* =========================
     GET ALL QUOTATIONS
  ========================= */

  async getAllQuotations() {
    try {

      const res = await fetch(API.quotations, {
        method: "GET",
        credentials: "include"
      });

      const result = await res.json();

      if (!res.ok) return false;

      return result.quotations;

    } catch (error) {
      throw error.message;
    }
  }


  /* =========================
     CREATE QUOTATION
  ========================= */

  async createQuotation(data) {
    try {

      const res = await fetch(API.quotations, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) return false;

      return result.message;

    } catch (error) {
      throw error.message;
    }
  }


  /* =========================
     UPDATE QUOTATION
  ========================= */

  async updateQuotation(data, id) {
    try {

      const res = await fetch(`${API.quotations}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) return false;

      return result.message;

    } catch (error) {
      throw error.message;
    }
  }


  /* =========================
     DELETE QUOTATION
  ========================= */

  async deleteQuotation(id) {
    try {

      const res = await fetch(`${API.quotations}/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      const result = await res.json();

      if (!res.ok) return false;

      return result.message;

    } catch (error) {
      throw error.message;
    }
  }

  async getProductsByCategory(categoryId) {
    try {

      const res = await fetch(
        `${API.quotations}/products/${categoryId}`,
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

}

export const quotation = new QuotationService();