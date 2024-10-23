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

                const res=await axios.get(`${DATABASE_URL}/api/v2/message/${userId}`,{
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
        
            <div className='bg-zinc-600 rounded-sm min-h-screen'>
    
            
                    <div className=' text-xl p-2 text-white	bg-blue-600   '>
                        All your Chat
                    </div> 

                    <div className='text-white mt-5 bg-zinc-600 '>
                      {
                        chat?.length ? (
                            
                            chat.map((ch)=>(
                                <div className=' border-white border-2  flex justify-between items-center mb-2'key={ch.adId.toString()} > 
                                     <Link to={`/ad/${ch.adId}`}  className='flex flex-grow justify-between  p-2   border-r-2 border-black'>
                                     <div>
                                    <span className='text-red-700'> Name: </span> {ch.ad.user.name.toString()}
                                    </div>
                                    <div>
                                      <span className='text-red-700'> Title:</span> {ch.ad.title ? ch.ad.title :"No title given"}
                                     </div>
                                    <div>
                                    <span className='text-red-700'> Price: </span> {ch.ad.price.toString()}
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
             
)
}

export default Chat