/* eslint-disable no-unused-vars */
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import home from './components/home.jsx'
import MainLayout from './components/MainLayout.jsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'

const browserRouter = createBrowserRouter([
  {
    path:'/',
    element: '<MainLayout/>',
    children:[{
      path:'/',
    element: <home/>, 
    }]
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
