import API_URL from "@/app/components/lib/apiConfig";

export const API = {
  login: `${API_URL}/users/auth/login`,
  me:`${API_URL}/users/me`,
  register: `${API_URL}/auth/register`,
  forgotPassword: `${API_URL}/users/auth/forgot-password`,
  resetPassword: `${API_URL}/users/auth/reset-password`,
    changePassword: `${API_URL}/users/auth/change-password`,

  productCategory:`${API_URL}/category`,
  subCategory:`${API_URL}/sub-category`,
  orders:`${API_URL}/order`,
  industry:`${API_URL}/industry`,
  dealers:`${API_URL}/dealers`,
  quotations:`${API_URL}/quotation`,
};