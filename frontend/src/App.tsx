import { BrowserRouter, Route, Routes,  } from 'react-router-dom';
import { Signin } from './pages/Signin';
import { Layout } from './pages/Layout';
import { HomePage } from './pages/HomePage';
import { Signup } from './pages/Signup';
import { MyAds } from './pages/MyAds';
import { AddItem } from './pages/AddItem';
import SearchAds from './pages/SearchAds';
import { Ad } from './pages/Ad';
import { Setting } from './pages/Setting';
import { LikedAds } from './pages/LikedAds';
import { useRecoilValue } from "recoil";
import {  Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { validUser } from './hooks/CustomAds';
import ChatInd from './pages/ChatInd';
import Chat from './pages/Chat';
import { SocketConnection } from './hooks/SocketConnection';
import QueryChat from './pages/QueryChat';

// Function to send private messages

function App() {
  const user = useRecoilValue(validUser);
  const [socket, setSocket] = useState<Socket | null >(null);

  useEffect(() => {
    if (user?.isValid) {

      const newSocket = SocketConnection(user);

      setSocket(newSocket);

      return ()=>{

        if (socket) {
          socket.disconnect(); 
        }

      }

    }
  }, [user.isValid]);

 

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<HomePage />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/search' element={<SearchAds />} />
          <Route path='/myads' element={<MyAds />} />
          <Route path='/additem' element={<AddItem />} />
          <Route path='/ad/:id' element={<Ad />} />
          <Route path='/setting' element={<Setting />} />
          <Route path='/liked' element={<LikedAds />} />
          <Route path='/chat/:id' element={<ChatInd socket={socket}/>}/>
          <Route path='/chat' element={<Chat/>}/>
          <Route path='/query' element={<QueryChat/>}/>


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
