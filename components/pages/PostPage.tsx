"use client"

import { map } from "zod";
import { useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation"
import Avatar from "@/components/Avatar"
import Button from "@/components/Button"
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { BruskiUser } from "@/hooks/useBruskiUser";
import { Profile, Post } from "@prisma/client";
import { Navbar } from "../navbar";
import PostItem from "../posts/PostItem";
import { BruskiPost } from "@/hooks/usePost";
import { useEffect } from "react";
import mixpanel from "@/utils/mixpanel";
import { usePosts } from "@/hooks/usePosts";
import { useComments } from "@/hooks/useComments";
import { MoreHorizontal, } from 'lucide-react';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineLike, AiOutlineDislike,AiOutlineUserAdd, AiOutlineUserDelete } from 'react-icons/ai';
import LikeButton from "@/components/LikeButton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
import MoreOptionsPosts from "../MoreOptionsPosts";


export interface PostPageProps {
  user: BruskiUser|null;
  post: Post|null;
  mutateComments: () => void;

}
const PostPage = ({user, post}:{user:BruskiUser|null, post:BruskiPost|null}) => {
  const router = useRouter();
  
  
  

  const {data:comments, isLoading:comments_isLoading, isError:comments_isError, mutate:mutateComments} = useComments({take: 30, postId: post?.id});


  const {data:posts, isLoading, isError, mutate} = usePosts({take: 30, target: post?.id});
  
  const handleDeletePost = useCallback(async () => {
    try {
      const results = await axios.delete(`/api/posts/${post?.id}`);
      
      toast.success('Post deleted');
      router.push('/');
    } catch (error) {
      toast.error('Something went wrong');
    }
  }
  , [post?.id, router]);


      useEffect(() => {

        
        // SET MIXPANEL USER
      mixpanel.identify(user?.id);
      mixpanel.people.set({
        $email: user?.email,
        // ... other user properties
      });

      mixpanel.track("page_view", {
        // Optionally include properties about the page
        page_name: "PostPage",
        url: window.location.pathname,
        post: post?.id,
      });

    });


    const placeholder = "What's your take on things?"
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [body, setBody] = useState('');
  
    const onSubmit = useCallback(async () => {
      console.log('submitting') 
      try {
        
        setIsSubmitting(true);
        setBody('');
  
        const isComment = true;
        const url = isComment ? `/api/comments?postId=${post?.id}` : '/api/posts';
  
        const results = await axios.post(url, { body });
        if(results.data) { toast.success('Success');}

        mutateComments();
  
      } catch (error) {
        toast.error('Something went wrong');
      } finally {
        setIsSubmitting(false);
      }
    }, [body, post?.id, mutateComments]);

    



  // CLICKING USER
  const goToUser = useCallback((ev: any) => {
    ev.stopPropagation();
    router.push(`/${post?.poster?.url}`)
  }, [router, post?.poster?.url]);

  // // CLICKING POST
  // const goToPost = useCallback(() => {
  //   router.push(`/post/${data.id}`);
  // }, [router, data.id]);


  


  if(!post) return null;  



  return (
  <div className="lg:max-w-lg w-full m-auto pb-48 relative">
    <div className="flex flex-col md:flex-row gap-4 md:-ml-40 md:p-8 p-4">

<div>
        {/* AVATAR IMAGE */}
        <Avatar img={post.poster?.img ?? "/img/placeholder.svg"} url={"/"+post.poster.url ?? ""} size={12} hasBorder={false}/>
       
      <h2 className="user_name text-base" onClick={goToUser}>{post.poster?.display_name}</h2>
  

</div>








  <div className="grow flex flex-col rounded-lg">


              {/* PopUp Menu */}
              <MoreOptionsPosts post={post} user={user} />

  { post.mediaType == "CHALLENGE" && <div className="flex flex-col subpixel-antialiased bg-primary/90 text-primary-foreground rounded-lg min-h-90 p-4 lg:p-8 text-xl leading-[21px] mt-1 grow-0 whitespace-pre-line">
            {post.body}
          </div>
}
  { post.mediaType != "CHALLENGE" && <div className="p-8 subpixel-antialiased whitespace-pre-line">{post?.body}</div> }
  <div className="flex items-center gap-4 justify-start text-sm text-primary/50 my-4">
    {/* <div className="w-fit flex items-center font-medium text-primary gap-1"><AiFillHeart color={true ? 'red' : ''} size={20} /><span className="font-medium text-primary">{post?.num_likes ?? 0}</span></div> */}
    <LikeButton post={post} user={user} />
    <div><span className="w-fit flex items-center font-medium text-primary gap-1"> <AiOutlineMessage size={18} /> {post?.num_comments ?? 0}</span></div>
    
    
    {/* TODO: Readd <div><span className="font-medium text-primary">{post?.num_bookmarks ?? 0}</span> bookmarks</div> */}
  </div>






  {/* COMMENT CREATOR */}

  <div className="border-b-[1px] border-neutral-800/10 px-5 pt-2 pb-8">
    {
      (user && user.id)
        ? (<form><div>
          
          <div className="flex flex-row gap-4">
           <div>
              <Avatar img={user.profiles?.[0]?.img ?? ""} url={"/"+user.profiles?.[0]?.url ?? ""} size={12} hasBorder={false}/>
           </div>
           <div className="w-full">
             <textarea
              disabled={false} /*isLoading*/
              onChange={(event) => setBody(event.target.value)}
              onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                onSubmit();
              }
            }}
              value={body}
              className="
                disabled:opacity-80
                peer
                resize-none 
                mt-3 
                w-full 
                bg-secondary
                p-4
                text-base
                rounded-lg 
                ring-0 
                outline-none 
                text-[20px] 
                placeholder-neutral-500 
                text-primary
                p-b-8
              "
              placeholder={placeholder}>
            </textarea>
            {/* <hr 
              className="
                opacity-0 
                peer-focus:opacity-100 
                h-[1px] 
                w-full 
                border-neutral-800 
                transition"
            /> */}
            <div className="mt-4 flex flex-row justify-end">
              <button type="submit" className="btn" disabled={!body} onClick={onSubmit}>Comment</button>
            </div>
          </div>
        </div>


        </div>
        </form>)
        : (<div>
          Not logged in
        </div>)
    }
      {/* {currentUser ? ( 
        <div className="flex flex-row gap-4">
          <div>
            <Avatar userId={currentUser?.id} />
          </div>
          <div className="w-full">
            <textarea
              disabled={isLoading}
              onChange={(event) => setBody(event.target.value)}
              value={body}
              className="
                disabled:opacity-80
                peer
                resize-none 
                mt-3 
                w-full 
                bg-black 
                ring-0 
                outline-none 
                text-[20px] 
                placeholder-neutral-500 
                text-white
              "
              placeholder={placeholder}>
            </textarea>
            <hr 
              className="
                opacity-0 
                peer-focus:opacity-100 
                h-[1px] 
                w-full 
                border-neutral-800 
                transition"
            />
            <div className="mt-4 flex flex-row justify-end">
              <Button disabled={isLoading || !body} onClick={onSubmit} label="Post" />
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8">
          <h1 className="text-white text-2xl text-center mb-4 font-bold">Welcome to Bruski</h1>
          <div className="flex flex-row items-center justify-center gap-4"> */}
            {/* TODO: <Button label="Login" onClick={loginModal.onOpen} />
             TODO: <Button label="Register" onClick={registerModal.onOpen} secondary /> */}
          {/* </div>
        </div>
      )
    }  */}
    </div>


  <div>

  </div>
  {comments && comments?.map((comment:BruskiPost) =>  
      (
      <div key={comment?.id}>
        <PostItem data={comment} user={user} />
      </div>
        
        ))
    }

  <div>

    
  </div>

  </div>
    </div>
    
    
    </div> );
}
 
export default PostPage;