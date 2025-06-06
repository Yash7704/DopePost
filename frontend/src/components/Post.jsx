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
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts } from '@/redux/postSlice'
import { setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'

function Post({post}) {
    const [text,setText] = useState("");
    const [open,setOpen] = useState(false);
    const changeEventHandler = (e) =>{
        const inputText = e.target.value;
        if(inputText.trim()){
                setText(inputText);
        }else{
            setText("");
        }
    }
    const {user} = useSelector(store=>store.auth);
    const {posts} = useSelector(store=>store.post)
    const dispatch = useDispatch();
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments);

    const deletePostHandler = async ()=>{
        try {
            const res =  await axios.delete(`http://localhost:8000/api/v1/post/delete/${post?._id}`,{withCredentials:true})
            if(res.data.success){
                const updatedPostData = posts.filter((postItem)=>postItem?._id !==post?._id ) 
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
            
        }
    }

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`, { withCredentials: true });
            console.log(res.data);
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked);

                // Updating likes
                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const bookmarkHandler = async () =>{
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/bookmark`,{withCredentials:true});
            if(res.data.success){
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            
        }
    }

    const commentHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            console.log(res.data);
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedCommentData } : p
                );

                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    }

     console.log('Avatar source:', post.author?.profilePicture);
    console.log('Full author data:', post.author);

  return (
    <div className='my-8 w-full max-w-sm mx-auto'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
           <Avatar className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden">
  <AvatarImage 
    src={post.author?.profilePicture}
    alt={`${post.author?.username}'s profile`}
    className="w-full h-full object-cover"
    onError={(e) => {
      e.target.src = '/default-avatar.png'; // Fallback image
    }}
  />
  <AvatarFallback className="flex items-center justify-center bg-gray-100 text-gray-600 w-full h-full">
    {post.author?.username?.charAt(0).toUpperCase() || 'U'}
  </AvatarFallback>
</Avatar>
            <div className='flex items-center gap-3'>
                <h1>{post.author?.username}</h1>
                {user?._id===post.author._id && <Badge variant='secondary'>Author</Badge>}

            </div>
        </div>
        <Dialog >
             <DialogTrigger asChild>
                <MoreHorizontal className="cursor-pointer"/>
             </DialogTrigger>
             <DialogContent className="flex flex-col items-center text-sm text-center">
                {
                    post?.author?._id!==user?._id && <Button variant ="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold ">Unfollow</Button>
                }
                <Button variant ="ghost" className="cursor-pointer w-fit ">Add to favourites</Button>
                {
                    user && user?._id === post?.author._id && <Button onClick={deletePostHandler} variant ="ghost" className="cursor-pointer w-fit ">Delete</Button>
                }
             </DialogContent>
        </Dialog>
        </div>
        <img className='rounded-sm my-2 w-full aspect-square object-cover'
        src={post.image} alt="" srcset="" />

            <div className='flex items-center justify-between my-2'>
            <div className='flex items-center gap-3'>
                 {
                        liked ? <FaHeart onClick={likeOrDislikeHandler} size={'24'} className='cursor-pointer text-red-600' /> : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    }
            <MessageCircle onClick={()=>{
                dispatch(setSelectedPost(post));
                setOpen(true)}} className='cursor-pointer hover:text-gray-600'/>
            <Send className='cursor-pointer hover:text-gray-600'/>
            </div>
            <Bookmark  onClick={bookmarkHandler}  className='cursor-pointer hover:text-gray-600'/>
            </div>  
            <span className=' font-medium block mb-2'>{postLike} likes</span>
            <p>
                <span className='font-medium mr-2'>{post.author?.username} </span>
                {post.caption}
            </p>
            {
                comment.length > 0 && (
                        <span className='cursor-pointer text-sm text-gray-400'  onClick={()=>{
                dispatch(setSelectedPost(post));
                setOpen(true)}}>View all {comment.length} comments...</span>
                )
            }
            
            <CommentDialog open={open} setOpen={setOpen}/>
            <div className='flex item-center justify-between'> 
                <input type="text" placeholder='Add a comment...'  className='outline-none text-sm w-full' value={text} onChange={changeEventHandler}/>
                {
                    text &&<span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>Post</span>
                }   
            </div>
    </div>
  )
}

export default Post