
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import MainLayout from './components/MainLayout.jsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Profile from './components/Profile.jsx'
import EditProfile from './components/EditProfile.jsx'
import ChatPage from './components/Chatpage.jsx'

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

  return (
    <>
      <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
