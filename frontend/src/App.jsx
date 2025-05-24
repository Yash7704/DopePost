/* eslint-disable no-unused-vars */

import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import MainLayout from './components/MainLayout.jsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Profile from './components/Profile.jsx'
import EditProfile from './components/EditProfile.jsx'
import ChatPage from './components/Chatpage.jsx'
import {io} from "socket.io-client"
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import store from './redux/store.js'
import { setSocket } from './redux/socketSlice.js'
import { setOnlineUsers } from './redux/chatSlice.js'
import { setLikeNotification } from './redux/rtnSlice.js'

const browserRouter = createBrowserRouter([
  {
    path:'/',
    element: <MainLayout/>,
    children:[{
      path:'/',
    element: <Home/>, 
    },
  {
      path:'/profile/:id',
    element: <Profile/>, 
    },
    {
      path:'/account/edit',
    element: <EditProfile/>, 
    },
    {
    path:'/chat',
    element: <ChatPage/>,
  }
  ]
  },
  {
    path:'/login',
    element: <Login/>,
  },
  {
    path:'/signup',
    element: <Signup/>,
  },
])




function App() {

const {user} = useSelector(store=>store.auth)
const dispatch = useDispatch(); 
const {socket} = useSelector(store=>store.socketio);

useEffect(()=>{
  if(user){
    const socketio = io('http://localhost:8000', {
      query:{
        userId:user?._id
      },
      transports:['websocket']
    });
    dispatch(setSocket(socketio));
    socketio.on('getOnlineUsers', (onlineUsers)=>{
      dispatch(setOnlineUsers(onlineUsers));
    });

    socketio.on('notification', (notification)=>{
      dispatch(setLikeNotification(notification));
    })

    return ()=>{
      socketio.close();
      dispatch(setSocket(null));
    }
  }else if(socket){
     socket?.close();
    dispatch(setSocket(null));
  }
},[user,dispatch]);
  return (
    <>
      <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
