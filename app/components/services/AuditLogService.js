import { API } from "@/app/components/lib/endpoints";

const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  return query.toString();
};

class AuditLogService {
  /*
  |--------------------------------------------------------------------------
  | GET ALL AUDIT LOGS
  |--------------------------------------------------------------------------
  | ✅ OPTIMIZED:
  | page, limit, module, action, entityId, performedBy, status, search support
  */
  static async getAllAuditLogs(params = {}) {
    try {
      const query = buildQuery(params);

      const url = query ? `${API.audit}?${query}` : API.audit;

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const result = await safeJson(res);

      if (!res.ok) {
        throw new Error(result?.message || "Failed to fetch audit logs");
      }

      return {
        success: true,
        data: result?.data || [],
        pagination: result?.pagination || null,
        message: result?.message || "Audit logs fetched successfully",
      };
    } catch (err) {
      console.error("Get all audit logs error:", err);

      return {
        success: false,
        message: err?.message || "Failed to fetch audit logs",
        data: [],
        pagination: null,
      };
    }
  }

  /*
  |--------------------------------------------------------------------------
  | GET BUSINESS WISE AUDIT LOGS
  |--------------------------------------------------------------------------
  | ✅ OPTIMIZED:
  | page + limit query
  */
  static async getBusinessAuditLogs(businessId, params = {}) {
    try {
      if (!businessId) {
        return {
          success: false,
          message: "Business id is required",
          data: [],
          pagination: null,
        };
      }

      const query = buildQuery({
        page: params.page || 1,
        limit: params.limit || 20,
      });

      const res = await fetch(`${API.audit}/business/${businessId}?${query}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await safeJson(res);

      if (!res.ok) {
        throw new Error(
          result?.message || "Failed to fetch business audit logs"
        );
      }

      return {
        success: true,
        data: result?.data || [],
        pagination: result?.pagination || null,
        message: result?.message || "Business audit logs fetched successfully",
      };
    } catch (err) {
      console.error("Get business audit logs error:", err);

      return {
        success: false,
        message: err?.message || "Failed to fetch business audit logs",
        data: [],
        pagination: null,
      };
    }
  }

  /*
  |--------------------------------------------------------------------------
  | GET SINGLE RECORD / ENTITY HISTORY
  |--------------------------------------------------------------------------
  | ✅ MAIN OPTIMIZATION:
  | View modal ke liye sirf latest 20 logs load karo.
  */
  static async getEntityAuditLogs(module, entityId, params = {}) {
    try {
      if (!module || !entityId) {
        return {
          success: false,
          message: "Module and entity id are required",
          data: [],
          pagination: null,
        };
      }

      const query = buildQuery({
        page: params.page || 1,
        limit: params.limit || 20,
      });

      const res = await fetch(
        `${API.audit}/entity/${module}/${entityId}?${query}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await safeJson(res);

      if (!res.ok) {
        throw new Error(
          result?.message || "Failed to fetch entity audit logs"
        );
      }

      return {
        success: true,
        data: result?.data || [],
        pagination: result?.pagination || null,
        message: result?.message || "Entity audit logs fetched successfully",
      };
    } catch (err) {
      console.error("Get entity audit logs error:", err);

      return {
        success: false,
        message: err?.message || "Failed to fetch entity audit logs",
        data: [],
        pagination: null,
      };
    }
  }
}

export default AuditLogService;