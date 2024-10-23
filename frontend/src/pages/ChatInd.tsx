import { FormEvent, useEffect, useRef, useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { DATABASE_URL } from '../config';
import { useRecoilValue } from 'recoil';
import { validUser } from '../hooks/CustomAds';
import { Socket } from 'socket.io-client';

interface Conversation {
  senderId: number;
  message: string;
  id: number;
}

function ChatInd({ socket }: { socket: Socket | null }) {
  const location = useLocation();
  const { id } = useParams(); // adId 
  let { title, price, ownerId,senderName } = location.state || {}; // ownerId is the userId of the ad owner
  if (!title) title = "No title given";
  const navigate = useNavigate();
  const user = useRecoilValue(validUser);
  const login = user.isValid;
  const userId = user.userId; // the user currently sending the message
  const userName=user.userName;
  const [message, setMessage] = useState<string>("");
  const [allMessages, setAllMessages] = useState<Conversation[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${DATABASE_URL}/api/v2/message/indiMessages`, {
          params: {
            receiverId: ownerId,
            senderId: userId,
            adId: Number(id),
          },
          headers: {
            Authorization: localStorage.getItem('token') || '',
          },
        });
        setAllMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };
    fetchMessages();
  }, [ownerId, userId, id]);

  // Listen for new messages through WebSocket
  useEffect(() => {
    if (socket) {
      const handleMessage = (data: Conversation) => {
        const { senderId, message } = data;
        const newMessage: Conversation = {
          senderId,
          message,
          id: Date.now(),
        };
        setAllMessages((prevMessages) => [...(prevMessages || []), newMessage]);
      };

      socket.on('private-message', handleMessage);

      // Clean up the listener when the component unmounts
      return () => {
        socket.off('private-message', handleMessage);
      };
    }
  }, [socket]);



  // Function to send private message
  const sendPrivateMessage = async ({
    message,
    receiverId,
    senderId,
    adId,
  }: {
    message: string;
    receiverId: number;
    senderId: number;
    adId: number;
  }) => {
    if (socket) {
      try {
        const res = await axios.post(
          `${DATABASE_URL}/api/v2/message/createChat`,
          { message, receiverId, senderId, adId },
          {
            headers: {
              Authorization: localStorage.getItem('token') || '',
            },
          }
        );

        socket.emit('private-message', { message, receiverId, adId, senderId ,senderName:userName,title});
      } catch (error) {
        console.error("Error sending message", error);
      }
    } else {
      console.log("Socket is not connected.");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!login) {
      navigate('/signin');
      return;
    }

    const newMessage: Conversation = {
      senderId: userId,
      message: message,
      id: Date.now(), // Use a unique ID; in a real app, you might get this from the server
    };

    // Update state with the new message
    setAllMessages((prevMessages) => [...(prevMessages || []), newMessage]);

    // Send the message via WebSocket
    if(ownerId===userId){
        alert('You cannot send message to yourself');
    }
    else{
    sendPrivateMessage({ message, receiverId: ownerId , senderId: userId, adId: Number(id) });
}
    setMessage(""); // Clear the input
  };

  return (
    <div className=' rounded-sm min-h-screen bg-slate-700'>
      

      <div className='bg-slate-200 h-screen grid grid-rows-[auto_1fr_auto]'>
        {/* Header with title and price */}
        <div className='bg-blue-600 p-2 pr-5 pl-5 flex justify-between items-center'>
          <div className='text-xl text-white'>{senderName}</div>
          <div className='text-xl text-white'>{title}</div>
          <div className='text-md text-white'>₹{price}</div>
        </div>

        {/* Messages div */}
        <div className='flex-grow overflow-y-auto text-lg p-2'>
          {allMessages?.length ? (
            allMessages.map((m) => (
              <div key={m.id.toString()} className='flex flex-col'>
                {m.senderId === userId ? (
                  <div className='m-5 border-2 border-black ml-auto rounded pl-2 pr-2'>
                    {m.message}
                  </div>
                ) : (
                  <div className='m-5 border-black border-2  rounded '>{m.message}</div>
                )}
              </div>
            ))
          ) : (
            <div>Start a Conversation...</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input form */}
        <div>
          <form onSubmit={handleSubmit} className='flex justify-between items-center'>
            <input
              type='text'
              className='h-10 w-full bg-slate-200 rounded pl-2 mr-1 ml-1 text-lg'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Enter text...'
            />
            <IoSend type='submit' size={25} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatInd;
