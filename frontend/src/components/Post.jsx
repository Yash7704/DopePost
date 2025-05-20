/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Avatar,AvatarImage,AvatarFallback } from '@radix-ui/react-avatar'
import { Dialog,DialogTrigger,DialogContent } from './ui/dialog'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart,FaRegHeart } from "react-icons/fa";
import { MessageCircle } from 'lucide-react'
import { Send } from 'lucide-react'
import { Bookmark } from 'lucide-react'
import CommentDialog from './CommentDialog'
import { useSelector } from 'react-redux'

function Post({post}) {
    const [text,setText] = useState("");
    const [open,setOpen] = useState(false);
    const changeEventHandler = (e) =>{
        const inputText = e.target.value;
        if(inputText.trim){
                setText(inputText);
        }else{
            setText("");
        }
    }
    const {user} = useSelector(store=>store.auth)

  return (
    <div className='my-8 w-full max-w-sm mx-auto'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
            <Avatar>
                <AvatarImage src={post.author?.profilePicture} alt="post_image" />
                 <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        <h1>{post.author?.username}</h1>
        </div>
        <Dialog >
             <DialogTrigger asChild>
                <MoreHorizontal className="cursor-pointer"/>
             </DialogTrigger>
             <DialogContent className="flex flex-col items-center text-sm text-center">
                <Button variant ="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold ">Unfollow</Button>
                <Button variant ="ghost" className="cursor-pointer w-fit ">Add to favourites</Button>
                {
                    user && user?._id === post?.author._id && <Button variant ="ghost" className="cursor-pointer w-fit ">Delete</Button>
                }
             </DialogContent>
        </Dialog>
        </div>
        <img className='rounded-sm my-2 w-full aspect-square object-cover'
        src={post.image} alt="" srcset="" />

            <div className='flex items-center justify-between my-2'>
            <div className='flex items-center gap-3'>
            <FaRegHeart size={'22px'} className='cursor-pointer hover:text-gray-600'/>
            <MessageCircle onClick={()=>setOpen(true)} className='cursor-pointer hover:text-gray-600'/>
            <Send className='cursor-pointer hover:text-gray-600'/>
            </div>
            <Bookmark className='cursor-pointer hover:text-gray-600'/>
            </div>  
            <span className=' font-medium block mb-2'>{post.likes.length} likes</span>
            <p>
                <span className='font-medium mr-2'>{post.author?.username} </span>
                {post.caption}
            </p>
            <span className='cursor-pointer text-sm text-gray-400' onClick={()=>setOpen(true)}>View all 10 comments...</span>
            <CommentDialog open={open} setOpen={setOpen}/>
            <div className='flex item-center justify-between'> 
                <input type="text" placeholder='Add a comment...'  className='outline-none text-sm w-full' value={text} onChange={changeEventHandler}/>
                {
                    text &&<span className='text-[#3BADF8] '>Post</span>
                }   
            </div>
    </div>
  )
}

export default Post