/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'

const Signup = () => {
    const [input,setInput] = useState({
        username: '',
        email: '',
        password: ''
    })

    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const {user} = useSelector(store=>store.auth)

    const changeEventHandler = (e)=>{
         setInput({...input,[e.target.name]:e.target.value})
    }

    const signupHandler = async (e)=>{
        e.preventDefault();
        console.log(input);
        
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/register',input,{
                headers:{
                    'Content-Type' : 'application/json'
                },
                withCredentials:true
            });
            if(res.data.success){
                navigate('/login');
                toast.success(res.data.message);
                setInput({
                     username: '',
                    email: '',
                    password: ''
                })
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
            
        }finally{
            setLoading(false);
        }
    }

useEffect(()=>{
        if(user){
            navigate("/")
        }
    },[])

  return (
    <div className='flex items-center w-screen h-screen justify-center'>
        <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8  '>
            <div className='my-4f'>
                <h1 className='text-center font-bold text-xl'>LOGO</h1>
                <p className='text-sm text-center'>Signup to see the content from your homies</p>
            </div>
            <div>
            <span className='py-1 font-medium' >Username</span>
            <Input type ='text' name='username' className="focus-visible:ring-transparent" value={input.username} onChange={changeEventHandler}/>
            </div>
            <div>
            <span className='py-1 font-medium' >Email</span>
            <Input type ='email' name='email' className="focus-visible:ring-transparent" value={input.email} onChange={changeEventHandler}/>
            </div>
            <div>
            <span className='py-1 font-medium' >Password</span>
            <Input type ='password' name='password' className="focus-visible:ring-transparent"  value={input.password} onChange={changeEventHandler}/>
            </div>

            {
                loading ? (
                    <Button>
                        <Loader2 className = "mr-2 h-4 w-4 animate-spin"/>
                        Please Wait...
                    </Button>
                ) : (
                    <Button type="submit" className="">Sign Up</Button>
                )
            }

            <span className='text-center '>Already have an account? <Link to="/login" className="text-blue-600">Login</Link></span>
            

        </form>
    </div>
  )
}

export default Signup