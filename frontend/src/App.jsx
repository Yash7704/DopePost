/* eslint-disable no-unused-vars */
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import MainLayout from './components/MainLayout.jsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Profile from './components/Profile.jsx'

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
  }
])




function App() {

  return (
    <>
      <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
