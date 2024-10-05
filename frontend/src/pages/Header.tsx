import axios from "axios";
import { FormEvent, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { DATABASE_URL } from "../config";
import {   useRecoilState,  useSetRecoilState } from "recoil";
import { category, customAds, validUser } from "../hooks/CustomAds";
import { UserDropdown } from "../components/UserDropdown";


export const Header=()=>{
        const navigate= useNavigate();
        const [user,setUser]=useRecoilState(validUser);
        const [value,setValue]=useState<string>("");
        const setCat=useSetRecoilState(category);
        const setAds=useSetRecoilState(customAds);

        useEffect(()=>{ 
                const fun= async ()=>{
                        try {
                       await axios.get(`${DATABASE_URL}/api/v1/ads`,{
                        headers:{
                                Authorization: localStorage.getItem("token")
                        }
                       })
                       setUser(true);
                        } catch (error) {
                                setUser(false);
                                navigate("/");
                                console.log(error);

                        }
                }
                fun();

        },[])


        const logout=()=>{
                localStorage.removeItem("token");
                        setUser(false);
                        navigate('/');
                }

        const handelSubmit= async (e:FormEvent)=>{
                e.preventDefault();
                try {
                        const res=await axios.get(`${DATABASE_URL}/api/v1/ads/search?category=${value}`)

                        console.log(res.data);
                        setAds(res.data);
                        setValue("");
                        setCat(value);
                        navigate(`/search?category=${value}`);

                } catch (error) {
                        console.log(error);
                }
        }


return (  
                <div className="flex justify-around items-center  bg-zinc-400  ">
                        <Link to="/" className="ml-10 text-2xl font-bold text-slate-700 hover:text-sl-800 hover:text-slate-800 ">
                        LOGO
                        </Link>

                        <form className="max-w-md mx-auto" onSubmit={handelSubmit}>   
                        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                                </div>
                                <input type="search" id="default-search" style={{ width: '400px' }} className="  block p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Find Mobiles,Laptops, ..." required  value={value}onChange={(e)=>setValue(e.target.value)}/>

                                <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                        </div>
                        </form>

                       {user?(<div className="flex justify-around items-center   mr-10">
                                <UserDropdown/>
                                <button onClick={logout} className=" text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 
                                focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-2 mb-2 ml-5">Logout</button>     
                        </div>):
                       ( <div className="flex justify-around items-center   mr-10">
                                <Link to="/signin" className=" text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 
                                focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-2 mb-2 mr-5">Signin</Link>
                                <Link to='/signup' className=" text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 
                                focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-2 mb-2 ml-5">Signup</Link>     
                        </div>)}                        

        </div>
   
      
)


}