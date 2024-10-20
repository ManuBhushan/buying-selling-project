import { useRecoilValue } from 'recoil'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IoMdChatboxes } from 'react-icons/io';
import { validUser } from '../hooks/CustomAds';
import { DATABASE_URL } from '../config';

interface Ad{
    title:String | null,
    price :Number,
    id:Number
}
interface Sender{
    name:String
    id:Number
}
interface QueryOverview{

    ad:Ad
    sender:Sender
}
function QueryChat() {
    const userId=useRecoilValue(validUser).userId;
    const [chat,setChat]=useState<QueryOverview[]>();

    useEffect(()=>{
        const fun=async ()=>{
            try {

                const res=await axios.get(`${DATABASE_URL}/api/v2/saleQuery/`,{
                   params:{
                    ownerId:userId
                   }, headers:{
                        Authorization: localStorage.getItem("token") || ""
                    }
                })
                setChat(res.data);

            } catch (error) {
                
            }
          

        } 

        fun();
    },[])


  return (
    <>
    
        
            <div className=' ml-20 mr-20 border-2  border-red-700  rounded-sm min-h-screen  bg-slate-700 '>
    
                <div className='border-r-2 border-red-700 '>
            
                    <div className='bg-red-200 text-xl p-2	 '>
                        INBOX
                    </div> 

                    <div className='text-white mt-5 '>
                      {
                        chat?.length ? (
                            
                            chat.map((ch)=>(
                                <div className=' flex items-center justify-between  border-white border-2  flex justify-between items-center mb-2'key={ch.ad.id.toString()+ch.sender.id.toString()} > 
                                     <Link to={`/ad/${ch.ad.id}`}  className='flex flex-grow justify-between   p-2   border-r-2 border-black'>
                                    
                                    <div>
                                      <span className='text-red-700'> Sender Name:</span> {ch.sender.name}
                                    </div>
                                    <div>
                                    <span className='text-red-700'>   Title:</span> {ch.ad.title ? ch.ad.title :"No title given"}
                                    </div>
                                    <div>
                                    <span className='text-red-700'>  Price:</span> {ch.ad.price.toString()}
                                    </div>

                                    </Link>

                                    <Link  to={`/chat/${ch.ad.id}`}state={{title:ch.ad.title , price:ch.ad.price , ownerId:ch.sender.id ,senderName:ch.sender.name}} className="pl-2 pr-2" >
                                        <IoMdChatboxes  size={30}/>
                                   </Link>
                                </div>
                              
                               
                            ))
                        
                        )
                        :
                        (<>No Query Related to any Listed Product</>) 
                      }
                    </div>
            
                </div>
               
          </div>
    
    
    </>
  )
}

export default QueryChat