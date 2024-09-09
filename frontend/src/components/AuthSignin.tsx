import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { DATABASE_URL } from "../config";
import { FormEvent, useState } from "react";
import { useSetRecoilState } from "recoil";
import { validUser } from "../hooks/CustomAds";

export const  AuthSignin = () => {
  const navigate=useNavigate();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const setUser=useSetRecoilState(validUser);


  const handleSubmit=async (e:FormEvent)=>{
    
    e.preventDefault();
    try {
      const res=await axios.post(`${DATABASE_URL}/api/v1/user/signin`,{
        email:email,
        password
      }
    )
    localStorage.setItem("token",res.data);
    setUser(true);

    navigate('/');
    } catch (error ) {
        if(error instanceof AxiosError)
        alert(error.response?.data);

    }
    

  }
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="max-w-2xl text-4xl font-extrabold">Sign In</div>

      <div className="max-w-md text-md font-medium text-slate-400 mt-1">
        Don't have an account?
        <Link to="/signup" className="pl-2 underline">
          Create an account
        </Link>
      </div>

      <form className="w-full max-w-md mt-6" 
      onSubmit={handleSubmit}
      >
        <div>
          <label className="block mb-2 text-md text-black font-semibold">
            Email
          </label>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>
        <div>
          <label className="block mb-2 text-md text-black font-semibold pt-4">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>
        <button
          type="submit"
          className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 
                font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        >
            Sign In
        </button>
      </form>
    </div>
  );
};
