"use client"

import { map } from "zod";
import { useCallback } from "react";
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

export interface PostPageProps {
  user: BruskiUser|null;
  post: Post|null;
  comments: Comment[]|null;

}
const PostPage = ({user, post, comments}:{user:BruskiUser|null, post:Post, comments:Post[]|null}) => {

  const router = useRouter();



  const placeholder = "What's your take on things?"
  const [isLoading, setIsLoading] = useState(false);
  const [body, setBody] = useState('');

  // CLICKING USER
  const goToUser = useCallback((ev: any) => {
    ev.stopPropagation();
    router.push(`/${post?.poster?.id}`)
  }, [router, post?.poster?.id]);

  // // CLICKING POST
  // const goToPost = useCallback(() => {
  //   router.push(`/post/${data.id}`);
  // }, [router, data.id]);


  const onSubmit = useCallback(async () => {
    try {
      
      setIsLoading(true);
      setBody('');

      const isComment = true;
      const url = isComment ? `/api/comments?postId=${post?.id}` : '/api/posts';

      const results = await axios.post(url, { body });
      if(results.data) { toast.success('Success');}
      // console.log(results)

      // mutatePosts();
      // mutatePost();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [body]);




  return (
  <div className="lg:max-w-lg w-full m-auto">
    <div className="flex flex-col md:flex-row gap-4 md:-ml-40 md:p-8 p-4">

<div>
        {/* AVATAR IMAGE */}
        <Avatar img={post.poster?.img ?? "/images/placeholder.png"} url={post.poster.id ?? ""} size={12} hasBorder={false}/>
       
      <h2 className="user_name text-base" onClick={goToUser}>{post.poster?.display_name}</h2>
  
</div>

  <div className="grow flex flex-col rounded-lg">

  <div className="p-8 subpixel-antialiased">{post?.body}</div>
  <div className="flex items-center gap-2 justify-end text-sm text-primary/50">
    <div><span className="font-medium text-primary">{post?.num_comments ?? 0}</span> comments</div>
    {/* <div><span className="font-medium text-primary">{post?.num_likes ?? 0}</span> likes</div> */}
    {/* TODO: Readd <div><span className="font-medium text-primary">{post?.num_bookmarks ?? 0}</span> bookmarks</div> */}
  </div>

  {/* COMMENT CREATOR */}

  <div className="border-b-[1px] border-neutral-800/10 px-5 pt-2 pb-8">
    {
      (user && user.id)
        ? (<div>
          
          <div className="flex flex-row gap-4">
           <div>
              <Avatar img={user.profiles?.[0]?.img} url={user.profiles?.[0]?.id ?? ""} size={12} hasBorder={false}/>
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
                bg-primary/5
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
              <button className="btn" disabled={isLoading || !body} onClick={onSubmit}>Comment</button>
            </div>
          </div>
        </div>


      
        </div>)
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
              <Button disabled={isLoading || !body} onClick={onSubmit} label="Tweet" />
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
  {comments?.map((comment) =>  
      (<div key={comment?.id}>
        <PostItem data={comment} user={user} />
        </div>))
    }

  <div>

    
  </div>

  </div>
    </div>
    
    
    </div> );
}
 
export default PostPage;