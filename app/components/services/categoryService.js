import { API } from "@/app/components/lib/endpoints";

class CategoryService {
  async addCategory(data,id) {
      const res = await fetch(`${API.productCategory}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        return result;
      }

      return result.message;
  }

  async getAllCategories(){
    try {
        const res=await fetch(API.productCategory,{method:"GET",credentials:"include"});
        const result=await res.json();

        if(!res.ok){
            return false;
        }

        return result.categories;
    } catch (error) {
        throw error.message;
    }
  }

  async getIndustryCategories(id) {
  try {

    const res = await fetch(`${API.productCategory}/my-added/${id}`, {
      method: "GET",
      credentials: "include"
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch");
    }

    return result.category;

  } catch (error) {
    console.error(error);
    return [];
  }
}

async updateCategory(data, id) {
  try {
    const res = await fetch(`${API.productCategory}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
      return { success: false, message: result.message };
    }

    return { success: true, data: result.category }

  } catch (error) {
    return { success: false, message: error.message };
  }
}

async removeCategory(id){
    try {
        const res=await fetch(`${API.productCategory}/${id}`,{
            method:"DELETE",
            credentials:"include",
        });
        const result=await res.json();
        if(!res.ok) return result;

        return result;
    } catch (error) {
        throw error.message;
    }
}

}

export const category=new CategoryService();
