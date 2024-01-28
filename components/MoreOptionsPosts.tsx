"use client"

import { useState } from 'react';
import { BruskiUser } from "@/hooks/useBruskiUser";
import { BruskiPost } from "@/hooks/usePost";
import { MoreHorizontal } from "lucide-react";import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineLike, AiOutlineDislike,AiOutlineUserAdd, AiOutlineUserDelete } from 'react-icons/ai';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useCallback } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const MoreOptionsPosts = ({post, user}: {post: BruskiPost, user: BruskiUser | null}) => {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const handleDeletePost = useCallback(async (e:React.MouseEvent) => {
    e.stopPropagation();
    try {
      const results = await axios.delete(`/api/posts/${post?.id}`);
      
      toast.success('Post deleted');
      router.push('/');
    } catch (error) {
      toast.error('Something went wrong');
    }
  }
  , [post?.id, router]);

  const stopPropagation = (e:React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(true);
  }



  return (
   
   

              <Popover>
                <PopoverTrigger onClick={stopPropagation} className="top-0 right-0 absolute z-40">
                  <MoreHorizontal />
                </PopoverTrigger>

                <PopoverContent className="top-0 right-0 absolute z-50">
                  
                  
                { (post.poster?.id == user?.profiles?.[0].id || post.poster?.userId == user?.id) && 
                  <AlertDialog>
                    <AlertDialogTrigger onClick={stopPropagation}><button className="btn bg-destructive hover:opacity-80 hover:bg-destructive">Delete Post</button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your post.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeletePost} className=" bg-destructive hover:opacity-80 hover:bg-destructive">Yes, delete post</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                }
                  {/* End delete post */}





                </PopoverContent>
              </Popover>
    
  );
};

export default MoreOptionsPosts;
