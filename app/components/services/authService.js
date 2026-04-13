import { API } from "@/app/components/lib/endpoints";

class AuthService {


  static async loginUser(data){
    try{

      const res = await fetch(API.login,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify(data)
      });

      const result = await res.json();
      return result;

    }catch(err){
      console.error("Login error:",err);
      throw err;
    }
  }


  /* LOGOUT */

  static async logoutUser(){
    try{

      const res = await fetch(API.logout,{
        method:"GET",
        credentials:"include"
      });

      const result = await res.json();

      if(!res.ok){
        throw new Error(result.message || "Logout failed");
      }

      return result;

    }catch(err){
      console.error("Logout error:",err);
      throw err;
    }
  }


  /* CURRENT USER */

  static async getCurrentUser(){
      const res = await fetch(API.me,{
        method:"GET",
        credentials:"include"
      });

      const result = await res.json();

      if(!res.ok){
        throw new Error(result.message || "Failed to fetch user");
      }

      return result;
  }


  /* CHANGE PASSWORD */

  static async changePassword(data){
    try{

      const res = await fetch(API.changePassword,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify(data)
      });

      const result = await res.json();

      if(!res.ok){
        throw new Error(result.message || "Password change failed");
      }

      return result;

    }catch(err){
      console.error("Change password error:",err);
      throw err;
    }
  }


  /* FORGOT PASSWORD */

  static async forgotPassword(data){
    try{

      const res = await fetch(API.forgotPassword,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
      });

      const result = await res.json();

      if(!res.ok){
        throw new Error(result.message || "Forgot password failed");
      }

      return result;

    }catch(err){
      console.error("Forgot password error:",err);
      throw err;
    }
  }

  static async verifyUser(data){
    const res=await fetch(`${API.users}/verify-user`,{method:"POST", headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify(data)});

    const result=await res.json();
    return result;
  }
 static async resetPassword(data){  
    try{

      const res = await fetch(API.resetPassword,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
      }); 
            const result = await res.json();

      if(!res.ok){
        throw new Error(result.message || "Reset password failed");
      }
      return result;

    } 
    catch(err){
      console.error("Reset password error:",err);
      throw err;
    }
  }

static async deleteUser(id) {
  const res = await fetch(`${API.users}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Delete failed");
  }

  return result;
}
}

export default AuthService;