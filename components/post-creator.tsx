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

interface FormProps {
  placeholder: string;
  isComment?: boolean;
  postId?: string;
  onCommentSubmit: (comment: string) => void;

}

export const PostCreator: React.FC<FormProps> = ({placeholder, isComment, postId, onCommentSubmit} ) => {


  const [body, setBody] = useState<string>("");


  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const { data: currentUser } = useBruskiUser();
  const { mutate: mutatePosts } = usePosts();
  const [isLoading, setIsLoading] = useState<boolean>(false);


  // Initialize posts state with data or an empty array to ensure it's always an array
  const [posts, setPosts] = useState([]);


  const [activePostType, setActivePostType] = useState("text");

// OLD SUBMIT POST
  const onSubmit = useCallback(async (event: FormEvent) => {

    event.preventDefault();
    event.stopPropagation();


    onCommentSubmit(body);

    try {
      // setIsLoading(true);


      const url = isComment ? `/api/comments?postId=${postId}` : `/api/posts?media_type=${activePostType}`;

      const result = await axios.post(url, { body });
      if(!result) 
        return;

        
      toast.success('Post created');
      setBody('');
      mutatePosts();
      // mutatePost();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      // setIsLoading(false);
    }


  }, [body, mutatePosts, isComment, postId, activePostType, onCommentSubmit]); //, isComment, postId, mutatePost



  return (
    <div className=" w-full bg-secondary rounded-md shadow-sm p-4 left-auto right-auto max-w-xl">
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
          <div  className="w-full"><PostTypeToggles onTypeChange={setActivePostType}/></div>
          <button type="submit" className="bg-primary text-primary-foreground btn text-sm font-semibold hover:border-primary/70 active:bg-primary/80 border-2 hover:text-primary">Post</button>
        </form>
      )}
    </div>
    <div className="max-w-2xl grow flex flex-col">

    
    </div>

  </div>
    </div>
  );
}