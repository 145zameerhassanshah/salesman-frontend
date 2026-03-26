import { API } from "@/app/components/lib/endpoints";

class QuotationService {

  static async createQuotation(data, businessId) {
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
static async getQuotations(businessId) {
  try {
    const res = await fetch(`${API.quotations}/${businessId}`, {
      method: "GET",
      credentials: "include"
    });
    const result = await res.json();

    if (!res.ok) throw new Error(result.message);
    return result.quotations || [];
  } catch (err) {
    return [];
  }
}

static async getQuotationById(id) {
  try {
    const res = await fetch(`${API.quotations}/${id}`, {
      method: "GET",
      credentials: "include"
    }); 
    const result = await res.json();

    if (!res.ok) throw new Error(result.message);
    return result.quotation || null;
  } catch (err) {
    return null;
  }
}

static async getProductsByCategory(categoryId) {
  try {
    const res = await fetch(`${API.quotations}/products/${categoryId}`, {
      method: "GET",
      credentials: "include"
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.message);

    return result.products || [];
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

}
export default  QuotationService; 
