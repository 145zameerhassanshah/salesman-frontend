import { API } from "@/app/components/lib/endpoints";

class CategoryService {
  async addCategory(data) {
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

  async getMyCategories(){
    try {
        const res=await fetch(API.myadded,{method:"GET",credentials:"include"});
        const result=await res.json();

        return result.category;
    } catch (error) {
        return [];
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
