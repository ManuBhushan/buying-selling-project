import { useRecoilValue } from 'recoil'
import { validUser } from '../hooks/CustomAds'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { DATABASE_URL } from '../config';
import { Link } from 'react-router-dom';
import { IoMdChatboxes } from 'react-icons/io';


interface Sender{
    name:String
}

interface Ad{
    title:String | null,
    price :Number,
    sold:Boolean,
    userId:Number
    user:Sender
}
interface AdOverview{

    ad:Ad
    adId:Number

}
function Chat() {
    const userId=useRecoilValue(validUser).userId;
    const [chat,setChat]=useState<AdOverview[]>();

    useEffect(()=>{
        const fun=async ()=>{
            try {

                const res=await axios.get(`${DATABASE_URL}/api/v2/messages/${userId}`,{
                    headers:{
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
    
        
            <div className='grid grid-cols-1 lg:grid-cols-[40%_60%] ml-20 mr-20 border-2  border-red-700  rounded-sm min-h-screen  bg-slate-700 '>
    
                <div className='border-r-2 border-red-700 lg:block hidden'>
            
                    <div className='bg-red-200 text-xl p-2	 '>
                        INBOX
                    </div> 

                    <div className='text-white mt-5 '>
                      {
                        chat?.length ? (
                            
                            chat.map((ch)=>(
                                <div className=' border-white border-2  flex justify-between items-center mb-2'key={ch.adId.toString()} > 
                                     <Link to={`/ad/${ch.adId}`}  className='flex flex-grow justify-between   p-2   border-r-2 border-black'>
                                     <div>
                                       Title: {ch.ad.title ? ch.ad.title :"No title given"}
                                     </div>
                                    <div>
                                        Price: {ch.ad.price.toString()}
                                    </div>

                                    </Link>

                                    <Link  to={`/chat/${ch.adId}`}state={{title:ch.ad.title , price:ch.ad.price , ownerId:ch.ad.userId, senderName:ch.ad.user.name}} className="pl-2 pr-2" >
                                        <IoMdChatboxes  size={30}/>
                                   </Link>
                                </div>
                              
                               
                            ))
                        
                        )
                        
                        
                        
                        
                        
                        
                        :(<></>) 
                      }
                    </div>
            
                </div>
                <div className='bg-red-200 text-xl p-2	 '>
                        SEcond
                    </div> 
          </div>
    
    
    </>
  )
}

export default Chat