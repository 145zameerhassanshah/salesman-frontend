

import { API } from "@/app/components/lib/endpoints";

const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

class UserService {
  static async createTeamMember(data) {
    try {
      const res = await fetch(`${API.users}/create-user`, {
        method: "POST",
        credentials: "include",
        body: data,
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Failed to create user",
        };
      }

      return {
        success: true,
        message: result?.message || "User created successfully",
        user: result?.user || null,
      };
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Failed to create user",
      };
    }
  }

  static async createAdmin(data) {
    return this.createTeamMember(data);
  }

  static async getUsersByIndustryPaginated(industryId, filters = {}) {
    try {
      if (!industryId) {
        return {
          success: false,
          message: "Industry id is required",
          userByIndustry: [],
          pagination: null,
        };
      }

      const {
        page = 1,
        limit = 20,
        search = "",
        user_type = "",
        status = "",
      } = filters;

      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", String(limit));

      if (search) params.set("search", search);
      if (user_type) params.set("user_type", user_type);
      if (status) params.set("status", status);

      const res = await fetch(
        `${API.users}/industry/${industryId}?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Failed to fetch users",
          userByIndustry: [],
          pagination: null,
        };
      }

      return {
        success: true,
        message: result?.message || "Users fetched successfully",
        userByIndustry: result?.userByIndustry || [],
        pagination: result?.pagination || null,
      };
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Failed to fetch users",
        userByIndustry: [],
        pagination: null,
      };
    }
  }

  static async getUsersByIndustry(industryId) {
    return this.getUsersByIndustryPaginated(industryId, {
      page: 1,
      limit: 100,
    });
  }

  static async fetchUsers(industryId) {
    return this.getUsersByIndustry(industryId);
  }

  static async getSalesmen(businessId) {
    try {
      if (!businessId) {
        return {
          success: false,
          message: "Business id is required",
          salesmen: [],
        };
      }

      const res = await fetch(`${API.users}/salesmen/${businessId}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Failed to fetch salesmen",
          salesmen: [],
        };
      }

      return {
        success: true,
        salesmen: result?.salesmen || [],
      };
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Failed to fetch salesmen",
        salesmen: [],
      };
    }
  }

  static async getUserById(id) {
    try {
      if (!id) {
        return {
          success: false,
          user: null,
          message: "User id is required",
        };
      }

      const res = await fetch(`${API.users}/user-profile/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          user: null,
          message: result?.message || "Failed to fetch user details",
        };
      }

      return {
        success: true,
        user: result?.user || null,
        message: result?.message || "User retrieved successfully",
      };
    } catch (err) {
      return {
        success: false,
        user: null,
        message: err?.message || "Failed to fetch user details",
      };
    }
  }

  static async updateUser(id, data) {
    try {
      if (!id) {
        return {
          success: false,
          message: "User id is required",
        };
      }

      const res = await fetch(`${API.users}/update/${id}`, {
        method: "PATCH",
        credentials: "include",
        body: data,
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Update failed",
        };
      }

      return {
        success: true,
        message: result?.message || "User updated successfully",
        updatedUser: result?.updatedUser || null,
      };
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Update failed",
      };
    }
  }

  static async deleteUser(id) {
    try {
      if (!id) {
        return {
          success: false,
          message: "User id is required",
        };
      }

      const res = await fetch(`${API.users}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Delete failed",
        };
      }

      return {
        success: true,
        message: result?.message || "User deleted successfully",
      };
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Delete failed",
      };
    }
  }

  static async getUserAuditLogs(userId, page = 1, limit = 20) {
    try {
      if (!userId) {
        return {
          success: false,
          data: [],
          logs: [],
          pagination: null,
          message: "User id is required",
        };
      }

      const res = await fetch(
        `${API.audit}/entity/USER/${userId}?page=${page}&limit=${limit}`,
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
          message: result?.message || "Failed to fetch user activity",
        };
      }

      return {
        success: true,
        data: result?.data || result?.logs || [],
        logs: result?.logs || result?.data || [],
        pagination: result?.pagination || null,
      };
    } catch (err) {
      return {
        success: false,
        data: [],
        logs: [],
        pagination: null,
        message: err?.message || "Failed to fetch user activity",
      };
    }
  }

  static async changeUserPassword(id, data) {
    try {
      if (!id) {
        return {
          success: false,
          message: "User id is required",
        };
      }

      const res = await fetch(`${API.users}/${id}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Failed to change password",
        };
      }

      return {
        success: true,
        message: result?.message || "Password changed successfully",
      };
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Failed to change password",
      };
    }
  }

  static async resetUserPassword(id) {
    try {
      if (!id) {
        return {
          success: false,
          message: "User id is required",
        };
      }

      const res = await fetch(`${API.users}/${id}/reset-password`, {
        method: "POST",
        credentials: "include",
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Failed to reset password",
        };
      }

      return {
        success: true,
        message: result?.message || "Password reset successfully",
      };
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Failed to reset password",
      };
    }
  }
}

export default UserService;