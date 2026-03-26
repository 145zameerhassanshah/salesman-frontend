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
    const res = await fetch(`${API.quotations}/details/${id}`, {
      method: "GET",
      credentials: "include"
    }); 
    const result = await res.json();

   return result;
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

 static async updateQuotation(data, id) {

    const res = await fetch(`${API.quotations}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data)
    });

    const result = await res.json();
    return result;
  }

 static async updateQuotationStatus(id, status) {
  const res = await fetch(`${API.quotations}/update-status/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  return await res.json();
}

  /* ================= DELETE ================= */

  static async deleteQuotation(id) {

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
