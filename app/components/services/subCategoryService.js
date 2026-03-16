import { API } from "@/app/components/lib/endpoints";

class SubCategoryService {

  /* CREATE SUB CATEGORY */

  async addSubCategory(data) {
    try {
      const res = await fetch(API.subCategory, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) return false;

      return result.message;

    } catch (error) {
      throw error.message;
    }
  }


  /* GET ALL SUB CATEGORIES */

  async getAllSubCategories() {
    try {

      const res = await fetch(API.subCategory, {
        method: "GET",
        credentials: "include"
      });

      const result = await res.json();

      if (!res.ok) return false;

      return result.categories;

    } catch (error) {
      throw error.message;
    }
  }


  /* UPDATE SUB CATEGORY */

  async updateSubCategory(data, id) {
    try {

      const res = await fetch(`${API.subCategory}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) return false;

      return result.category;

    } catch (error) {
      throw error.message;
    }
  }


  /* DELETE SUB CATEGORY */

  async removeSubCategory(id) {
    try {

      const res = await fetch(`${API.subCategory}/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      const result = await res.json();

      if (!res.ok) return false;

      return result.message;

    } catch (error) {
      throw error.message;
    }
  }

}

export const subCategory = new SubCategoryService();