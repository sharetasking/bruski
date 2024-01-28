"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Pointer } from "lucide-react";
import { usePostModal } from "@/hooks/use-post-modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { PostCreator } from "@/components/post-creator";
import { MediaType } from "@prisma/client";
import Link from "next/link";
import useBruskiUser from "@/hooks/useBruskiUser";
import { usePosts } from "@/hooks/usePosts";
import toast from "react-hot-toast";

export const PostModal = () => {
  const postModal = usePostModal();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  // const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const {data:user} = useBruskiUser();

  // const onSubscribe = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get("/api/stripe");

  //     window.location.href = response.data.url;
  //   } catch (error) {
  //     toast({
  //       description: "Something went wrong",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  if (!isMounted) {
    return null;
  }

// const addPost = async (post:string, mediaType:MediaType) => {
// }

  // FUNCTION: ADD COMMENT 
  const addPost = async (post:string, mediaType:MediaType) => {
    postModal.onClose()
    const tempId = new Date().getTime().toString();
    
    let newPostObj = {
        id: tempId,
        body: post,
        mediaType: mediaType,
        media: [post],
        poster: user?.profiles?.[0], //TODO: fix this
        saving: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: [],
        num_comments: 0,
        num_likes: 0,
        num_reposts: 0,
        num_shares: 0,
        num_views: 0,
        liked: false,
        reposted: false,
        shared: false,
        viewed: false,
        profileId: user?.profiles?.[0]?.id,
        num_bookmarks: 0,

        
      };
    
    if(newPostObj.poster)
      newPostObj.poster.isFollowed = false;


    // setAllPosts(prevPosts => [newPostObj, ...prevPosts]);

      
    try {
      // Replace this with your actual API call logic to submit the comment
      const response = await fetch(`/api/posts?media_type=${mediaType}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body: newPostObj, poster: user?.profiles?.[0] }),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Update the state with the permanent ID received from the server
      // setAllPosts(prevPosts => prevPosts.map(post => 
      //     post.id === tempId ? { ...post, id: data.id, saving:false } : post
      // ));

      toast.success('Success');
  } catch (error) {
      console.log('Failed to submit post:', error);
      toast.error('Failed to submit post');

      // Optionally remove the temporary comment from the state
      // setAllPosts(prevPosts => prevPosts.filter(post => post.id !== tempId));
  }
    
  };


  if(postModal.isOpen)
    return (
    <div className="bounceInUp fixed inset-0 z-[60000] flex flex-col justify-start lg:justify-center lg:pt-0 pt-6 items-center bg-white">
      <PostCreator onPostSubmit={addPost}  placeholder="What's going on in your world today?" />
      <button onClick={postModal.onClose} className="text-sm font-medium text-muted-foreground">&larr; Click to return to feed</button>
    </div>)
  else return null


};
