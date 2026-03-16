import { API } from "@/app/components/lib/endpoints";

class CategoryService {
  async addCategory(data) {
    try {
      const res = await fetch(API.productCategory, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        return false;
      }

      return result.message;
    } catch (error) {
        throw error.message;
    }
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

async updateCategory(data,id){
    try {
        const res=await fetch(`${API.productCategory}/${id}`,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            credentials:"include",
            body:JSON.stringify(data)
        });
        const result=await res.json();
        if(!res.ok){
            return false;
        }
         return result.updatedCategory;

    } catch (error) {
        throw error.message;
    }
}

async removeCategory(id){
    try {
        const res=await fetch(`${API.productCategory}/${id}`,{
            method:"DELETE",
            credentials:"include",
        });
        const result=await res.json();
        if(!res.ok) return false;

        return result.message;
    } catch (error) {
        throw error.message;
    }
}

}

export const category=new CategoryService();
