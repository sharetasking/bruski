"use client";

import axios from 'axios';
import { useState, FormEvent, useCallback } from "react";


import useBruskiUser from "@/hooks/useBruskiUser";
import useLoginModal from "@/hooks/useLoginModal";
import { usePosts } from "@/hooks/usePosts";
import useRegisterModal from "@/hooks/useRegisterModal";
import { usePost } from "@/hooks/usePost";
import { toast } from "react-hot-toast";
import PostTypeToggles from "@/components/PostTypeToggles";
import { MediaType } from '@prisma/client';

interface FormProps {
  placeholder: string;
  isComment?: boolean;
  postId?: string;
  onPostSubmit: (comment: string, mediaType: MediaType) => void;

}

export const PostCreator: React.FC<FormProps> = ({placeholder, isComment, postId, onPostSubmit} ) => {


  const [body, setBody] = useState<string>("");


  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const { data: currentUser } = useBruskiUser();
  const { mutate: mutatePosts } = usePosts();
  const [isLoading, setIsLoading] = useState<boolean>(false);


  // Initialize posts state with data or an empty array to ensure it's always an array
  const [posts, setPosts] = useState([]);


  const [activePostType, setActivePostType] = useState<MediaType>("TEXT");

// OLD SUBMIT POST
  const onSubmit = useCallback(async (event: FormEvent) => {

    event.preventDefault();
    event.stopPropagation();


    onPostSubmit(body, activePostType);

    setBody('');
    // try {
    //   // setIsLoading(true);


    //   // const url = isComment ? `/api/comments?postId=${postId}` : `/api/posts?media_type=${activePostType}`;

    //   // const result = await axios.post(url, { body });
    //   // if(!result) 
    //   //   return;

      
    // } catch (error) {
    //   toast.error('Something went wrong');
    // } finally {
    //   // setIsLoading(false);
    // }


  }, [body, activePostType, onPostSubmit]); 



  return (
    <div className=" w-full bg-primary/10 mx-2 rounded-3xl px-4 py-1 shadow-sm mb-4 left-auto right-auto max-w-xl">
      <div className="">
    <div className="p-4 rounded-md flex flex-col max-w-2xl grow bg-primary/1">
      <h3>Create a post</h3>
      {/* {activePostType} */}
      {currentUser && (
        <form onSubmit={onSubmit} className='flex flex-col items-end'>
          <textarea
            onChange={(e) => setBody(e.target.value)}
            placeholder="What's happening in your world today?"
            value={body}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                onSubmit(e);
              }
            }}
            maxLength={280}
            required
            className="bg-transparent w-full resize-none outline-none border-none p-0"
          ></textarea>
          <div className="flex flex-col md:flex-row md:gap-4 gap-2 w-full items-center">
            <div  className="w-full grow-0"><PostTypeToggles onTypeChange={setActivePostType}/></div>
            <button type="submit" className="bg-primary w-36 h-12 text-primary-foreground btn text-sm rounded-2xl font-semibold hover:border-primary/70 active:bg-primary/80 border-2 hover:text-primary">Post</button>
          </div>
          
        </form>
      )}
    </div>
    <div className="max-w-2xl grow flex flex-col">

    
    </div>

  </div>
    </div>
  );
}