import { useState } from "react"
import { Profile } from "../components/Profile";
import { UpdatePassword } from "../components/UpdatePassword";

export const  Setting=()=>{
  const [updateprofile , setUpdateProfile]=useState<boolean>(false);
  const [updatepassword,setUpadatePassword]=useState<boolean>(false);
  return (
   
      <div className="grid grid-cols-[20%_80%] ">
        
        <div className="bg-slate-700 h-screen flex-col flex justify-center ">

        <button className="p-5  text-lg font-bold hover:text-white " onClick={()=>{ setUpdateProfile((c)=>!c);
          setUpadatePassword(false);
        }
        }>Update Profile</button>
        <button className="p-5 mt-5 text-lg font-bold hover:text-white  " onClick={()=>{
          setUpadatePassword((c)=>!c);
          setUpdateProfile(false);} 
          }>Update Password</button>

        </div>

        <div className="bg-slate-400">

        { updateprofile && <Profile/> }
        {updatepassword && <UpdatePassword/>}

        </div>

      </div>
  )
}

