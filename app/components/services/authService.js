


import { API } from "@/app/components/lib/endpoints";

const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

class AuthService {
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

      return {
        success: true,
        ...result,
      };
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Login failed",
      };
    }
  }

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

      return {
        success: true,
        ...result,
      };
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Verification failed",
      };
    }
  }

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

      return {
        success: true,
        message: result?.message || "Logged out successfully",
      };
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Logout failed",
      };
    }
  }

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

      return {
        success: true,
        message: result?.message || "Password changed successfully",
      };
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Password change failed",
      };
    }
  }

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

      return {
        success: true,
        message: result?.message || "Reset link sent",
      };
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Forgot password failed",
      };
    }
  }

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

      return {
        success: true,
        message: result?.message || "Password reset successfully",
      };
    } catch (err) {
      return {
        success: false,
        message: err?.message || "Reset password failed",
      };
    }
  }
}

export default AuthService;