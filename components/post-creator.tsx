"use client";

import axios from 'axios';
import { useState, FormEvent, useCallback } from "react";


import useBruskiUser from "@/hooks/useBruskiUser";
import useLoginModal from "@/hooks/useLoginModal";
import { usePosts } from "@/hooks/usePosts";
import useRegisterModal from "@/hooks/useRegisterModal";
import { usePost } from "@/hooks/usePost";
import { toast } from "react-hot-toast";

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



// OLD SUBMIT POST
  const onSubmit = useCallback(async (event: FormEvent) => {

    onCommentSubmit(body);

    event.preventDefault();
    event.stopPropagation();
    try {
      // setIsLoading(true);

      const url = isComment ? `/api/comments?postId=${postId}` : '/api/posts';

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


  }, [body, mutatePosts, isComment, postId]); //, isComment, postId, mutatePost



  return (
    <div className=" w-full bg-secondary rounded-md shadow-sm p-4 left-auto right-auto max-w-xl">
      <div className="">
    <div className="p-4 rounded-md flex flex-col max-w-2xl grow bg-primary/1">

      <h3>Posts</h3>
      {currentUser && (
        <form onSubmit={onSubmit}>
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