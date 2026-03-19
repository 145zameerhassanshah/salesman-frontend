import { API } from "@/app/components/lib/endpoints";

class QuotationService {

  async createQuotation(data, businessId) {
    try {
      const res = await fetch(`${API.quotations}/create/${businessId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      return result.message;
    } catch (err) {
      return err.message;
    }
  }

  async getProductsByCategory(categoryId) {
    try {
      const res = await fetch(`${API.quotations}/products/${categoryId}`, {
        credentials: "include"
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      return result.products || result;
    } catch (err) {
      return [];
    }
  }



  async updateQuotation(data, id) {

    const res = await fetch(`${API.quotations}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.message);

    return result.message;
  }


  /* ================= DELETE ================= */

  async deleteQuotation(id) {

    const res = await fetch(`${API.quotations}/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.message);

    return result.message;
  }


  /* ================= PRODUCTS BY CATEGORY ================= */

  async getProductsByCategory(categoryId) {

    const res = await fetch(
      `${API.quotations}/products/${categoryId}`,
      { method: "GET", credentials: "include" }
    );

    const result = await res.json();

    if (!res.ok) throw new Error(result.message);

    return result;
  }

}

export default new QuotationService(); 
