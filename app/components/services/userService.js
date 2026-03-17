import { API } from "@/app/components/lib/endpoints";

class UserService {


  static async createAdmin(data){
      const res = await fetch(`${API.users}/create-user`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify(data)
      });

      const result = await res.json();

      if(!res.ok){
        return result;
      }

      return result;
  }

  static async createTeamMember(data){
    try{

      const res = await fetch(API.createUser,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify(data)
      });

      const result = await res.json();

      if(!res.ok){
        throw new Error(result.message || "Failed to create user");
      }

      return result;

    }catch(err){
      console.error("Create team member error:",err);
      throw err;
    }
  }

  static async fetchUsers(id){
    try{

      const res = await fetch(`${API.users}/industry/${id}`,{
        method:"GET",
        credentials:"include"
      });

      const result = await res.json();

      if(!res.ok){
        return result;
      }

      return result;

    }catch(err){
      console.error("Fetch users error:",err);
      throw err;
    }
  }

  static async getUserById(id){
    try{

      const res = await fetch(`${API.users}/${id}`,{
        method:"GET",
        credentials:"include"
      });

      const result = await res.json();

      if(!res.ok){
        throw new Error(result.message || "Failed to fetch user");
      }

      return result;

    }catch(err){
      console.error("Get user error:",err);
      throw err;
    }
  }




  static async updateUser(id,data){
    try{

      const res = await fetch(`${API.users}/${id}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify(data)
      });

      const result = await res.json();

      if(!res.ok){
        throw new Error(result.message || "Failed to update user");
      }

      return result;

    }catch(err){
      console.error("Update user error:",err);
      throw err;
    }
  }

  static async deleteUser(id){
    try{

      const res = await fetch(`${API.users}/${id}`,{
        method:"DELETE",
        credentials:"include"
      });

      const result = await res.json();

      if(!res.ok){
        throw new Error(result.message || "Failed to delete user");
      }

      return result;

    }catch(err){
      console.error("Delete user error:",err);
      throw err;
    }
  }

  static async changeUserPassword(id,data){
    try{

      const res = await fetch(`${API.users}/${id}/change-password`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify(data)
      });

      const result = await res.json();

      if(!res.ok){
        throw new Error(result.message || "Failed to change password");
      }

      return result;

    }catch(err){
      console.error("Change password error:",err);
      throw err;
    }
  }

  static async resetUserPassword(id){
    try{

      const res = await fetch(`${API.users}/${id}/reset-password`,{
        method:"POST",
        credentials:"include"
      });

      const result = await res.json();

      if(!res.ok){
        throw new Error(result.message || "Failed to reset password");
      }

      return result;

    }catch(err){
      console.error("Reset password error:",err);
      throw err;
    }
  }

}

export default UserService;