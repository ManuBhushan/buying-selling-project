import { useState } from "react"
import { Profile } from "../components/Profile";

export const  Setting=()=>{
  const [updateprofile , setUpdateProfile]=useState<boolean>(false);
  return (
    // <div>Setting</div>
    // // update Profile
      <div className="grid grid-cols-[30%_70%] ">
        <div className="bg-slate-700 h-screen flex-col flex justify-center items-center">

        <button className="block border-2" onClick={()=> setUpdateProfile((c)=>!c)}>Update Profile</button>
        <button className="block border-2">Update Password</button>

        </div>

        <div className="bg-slate-400">

      { updateprofile && <Profile/> }


        </div>

      </div>
  )
}

