import API_URL from "@/app/components/lib/apiConfig";

export const API = {
  login: `${API_URL}/users/auth/login`,
  register: `${API_URL}/auth/register`,
  forgotPassword: `${API_URL}/auth/forget-password`,
  resetPassword: `${API_URL}/auth/reset-password`,

  products: `${API_URL}/dashboard/products`,
  orders: `${API_URL}/dashboard/orders`,
  quotations: `${API_URL}/dashboard/quotations`,
};