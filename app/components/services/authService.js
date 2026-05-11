




import { API } from "@/app/components/lib/endpoints";

const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

class AuthService {
  /* ================= LOGIN ================= */

  static async loginUser(data) {
    try {
      const res = await fetch(API.login, {
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
          message: result?.message || "Login failed",
        };
      }

      return result;
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Login failed",
      };
    }
  }

  /* ================= VERIFY USER OTP ================= */

  static async verifyUser(data) {
    try {
      const res = await fetch(`${API.users}/verify-user`, {
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
          message: result?.message || "Verification failed",
        };
      }

      return result;
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Verification failed",
      };
    }
  }

  /* ================= CURRENT USER ================= */

  static async getCurrentUser() {
    try {
      const res = await fetch(API.me, {
        method: "GET",
        credentials: "include",
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          loggedInUser: null,
          message: result?.message || "Failed to fetch user",
        };
      }

      return {
        success: true,
        loggedInUser: result?.loggedInUser || result?.user || null,
        message: result?.message || "User retrieved successfully",
      };
    } catch (err) {
      return {
        success: false,
        loggedInUser: null,
        message: err?.message || "Failed to fetch user",
      };
    }
  }

  /* ================= LOGOUT ================= */

  static async logoutUser() {
    try {
      const res = await fetch(API.logout, {
        method: "GET",
        credentials: "include",
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Logout failed",
        };
      }

      return result;
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Logout failed",
      };
    }
  }

  /* ================= CHANGE PASSWORD ================= */

  static async changePassword(data) {
    try {
      const res = await fetch(API.changePassword, {
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
          message: result?.message || "Password change failed",
        };
      }

      return result;
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Password change failed",
      };
    }
  }

  /* ================= FORGOT PASSWORD ================= */

  static async forgotPassword(data) {
    try {
      const res = await fetch(API.forgotPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Forgot password failed",
        };
      }

      return result;
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Forgot password failed",
      };
    }
  }

  /* ================= RESET PASSWORD ================= */

  static async resetPassword(data) {
    try {
      const res = await fetch(API.resetPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await safeJson(res);

      if (!res.ok) {
        return {
          success: false,
          message: result?.message || "Reset password failed",
        };
      }

      return result;
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Reset password failed",
      };
    }
  }

  /* ================= GET USER BY ID ================= */
  // Backend route: router.get("/user-profile/:id", authMiddleware, getUser)

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

  /* ================= USERS BY INDUSTRY WITH PAGINATION ================= */
  // Backend route: router.get("/industry/:industry_id", ...)

  static async getUsersByIndustryPaginated(industryId, filters = {}) {
    try {
      if (!industryId) {
        return {
          success: false,
          userByIndustry: [],
          pagination: null,
          message: "Industry id is required",
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

  /* ================= OLD HOOK COMPATIBILITY ================= */

  static async getUsersByIndustry(industryId) {
    return this.getUsersByIndustryPaginated(industryId, {
      page: 1,
      limit: 100,
    });
  }

  /* ================= CREATE TEAM MEMBER / ADMIN ================= */
  // Backend route: router.post("/create-user", ...)

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

      return result;
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Failed to create user",
      };
    }
  }

  /* For BusinessDetail old code compatibility */
  static async createAdmin(data) {
    return this.createTeamMember(data);
  }

  /* ================= UPDATE USER ================= */
  // Backend route: router.patch("/update/:id", ...)

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

      return result;
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Update failed",
      };
    }
  }

  /* ================= DELETE USER ================= */
  // Backend route: router.delete("/:id", ...)

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

      return result;
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Delete failed",
      };
    }
  }

  /* ================= USER AUDIT LOGS ================= */

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
}

export default AuthService;