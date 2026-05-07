import { API } from "@/app/components/lib/endpoints";

const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

class QuotationService {
  /* ================= CREATE ================= */

  static async createQuotation(data, businessId) {
    try {
      const res = await fetch(`${API.quotations}/create/${businessId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await safeJson(res);

      if (!res.ok) {
        throw new Error(result?.message || "Quotation creation failed");
      }

      // Old code agar string expect kar raha hai to ye safe hai
      return result?.message || "Quotation created successfully";
    } catch (err) {
      return err?.message || "Quotation creation failed";
    }
  }

  /* ================= LIST ================= */

  static async getQuotations(businessId, filters = {}) {
    try {
      if (!businessId) return [];

      const {
        page = 1,
        limit = 100,
        search = "",
        status = "",
      } = filters;

      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", String(limit));

      if (search) params.set("search", search);
      if (status) params.set("status", status);

      const res = await fetch(`${API.quotations}/${businessId}?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await safeJson(res);

      if (!res.ok) {
        throw new Error(result?.message || "Failed to fetch quotations");
      }

      return result?.quotations || [];
    } catch (err) {
      console.error("Get quotations error:", err);
      return [];
    }
  }

  /* ================= LIST WITH PAGINATION ================= */

  static async getQuotationsPaginated(businessId, filters = {}) {
    try {
      if (!businessId) {
        return {
          success: false,
          quotations: [],
          pagination: null,
        };
      }

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
      if (status) params.set("status", status);

      const res = await fetch(`${API.quotations}/${businessId}?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await safeJson(res);

      if (!res.ok) {
        throw new Error(result?.message || "Failed to fetch quotations");
      }

      return {
        success: true,
        quotations: result?.quotations || [],
        pagination: result?.pagination || null,
      };
    } catch (err) {
      console.error("Get paginated quotations error:", err);

      return {
        success: false,
        quotations: [],
        pagination: null,
        message: err?.message || "Failed to fetch quotations",
      };
    }
  }

  /* ================= DETAILS ================= */

  static async getQuotationById(id) {
    try {
      const res = await fetch(`${API.quotations}/details/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await safeJson(res);

      if (!res.ok) {
        throw new Error(result?.message || "Failed to fetch quotation");
      }

      return result;
    } catch (err) {
      console.error("Get quotation detail error:", err);

      return {
        success: false,
        message: err?.message || "Failed to fetch quotation",
      };
    }
  }

  /* ================= PRODUCTS BY CATEGORY ================= */

  static async getProductsByCategory(categoryId) {
    try {
      if (!categoryId) return [];

      const res = await fetch(`${API.quotations}/products/${categoryId}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await safeJson(res);

      if (!res.ok) {
        throw new Error(result?.message || "Failed to fetch products");
      }

      return result?.products || [];
    } catch (err) {
      console.error("Get quotation products error:", err);
      return [];
    }
  }

  /* ================= UPDATE ================= */

  static async updateQuotation(data, id) {
    try {
      const res = await fetch(`${API.quotations}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await safeJson(res);

      if (!res.ok) {
        throw new Error(result?.message || "Quotation update failed");
      }

      return result;
    } catch (err) {
      console.error("Update quotation error:", err);

      return {
        success: false,
        message: err?.message || "Quotation update failed",
      };
    }
  }

  /* ================= STATUS UPDATE ================= */

  static async updateQuotationStatus(id, status) {
    try {
      const res = await fetch(`${API.quotations}/update-status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      const result = await safeJson(res);

      if (!res.ok) {
        throw new Error(result?.message || "Status update failed");
      }

      return result;
    } catch (err) {
      console.error("Update quotation status error:", err);

      return {
        success: false,
        message: err?.message || "Status update failed",
      };
    }
  }

  /* ================= DELETE ================= */

  static async deleteQuotation(id) {
    try {
      const res = await fetch(`${API.quotations}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await safeJson(res);

      if (!res.ok) {
        throw new Error(result?.message || "Delete failed");
      }

      // Old code agar string expect kar raha hai to ye safe hai
      return result?.message || "Quotation deleted successfully";
    } catch (err) {
      console.error("Delete quotation error:", err);
      throw new Error(err?.message || "Delete failed");
    }
  }

  /* ================= PDF DOWNLOAD ================= */

  static async downloadPdf(id) {
    try {
      const res = await fetch(`${API.quotations}/pdf/${id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const result = await safeJson(res);
        throw new Error(result?.message || "PDF download failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      let filename = `quotation-${id}.pdf`;

      const disposition = res.headers.get("Content-Disposition");

      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) {
          filename = match[1];
        }
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      return {
        success: true,
        message: "PDF downloaded successfully",
      };
    } catch (error) {
      console.error("PDF download error:", error);

      return {
        success: false,
        message: error?.message || "PDF download failed",
      };
    }
  }
}

export default QuotationService;