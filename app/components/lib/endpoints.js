import API_URL from "@/app/components/lib/apiConfig";

export const API = {
  login: `${API_URL}/users/auth/login`,
  users:`${API_URL}/users`,
  me:`${API_URL}/users/me`,
  register: `${API_URL}/auth/register`,
  forgotPassword: `${API_URL}/users/auth/forgot-password`,
  resetPassword: `${API_URL}/users/auth/reset-password`,
    changePassword: `${API_URL}/users/auth/change-password`,
  logout:`${API_URL}/users/auth/logout`,
  productCategory:`${API_URL}/category`,
  products:`${API_URL}/products`,
  subCategory:`${API_URL}/sub-category`,
  orders:`${API_URL}/order`,
  industry:`${API_URL}/industry`,
  dealers:`${API_URL}/dealers`,
  quotations:`${API_URL}/quotation`,
    dashboard: `${API_URL}/dashboard`,

    orderPdf: (id) => `${API_URL}/order/pdf/${id}`,  

};