import axios from "axios";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import useBruskiUser from "./useBruskiUser";
import useLoginModal from "./useLoginModal";
import {usePost} from "./usePost";
import {usePosts} from "./usePosts";
import {useState} from "react";

const useLike = ({ postId, profileId, liked, likesCount }: { postId: string, profileId?: string, liked: boolean, likesCount:number }) => {
  
  const [hasLiked, setHasLiked] = useState(liked);
  const [numLikes, setNumLikes] = useState(likesCount);
  

  // BEGIN TOGGLE POST
  const toggleLike = useCallback(async () => {
    // UNLIKE POST
    if (hasLiked) {  
      try {
        setHasLiked(false);
        setNumLikes(numLikes-1)
        await unlikePost(postId); 
        toast.success("Success")
      } catch (error) {

        setHasLiked(true);
        setNumLikes(numLikes)
        toast.error("Error")
        console.error('Failed to unlike post:', error);
      }
    }
    // LIKE POST
    else {
      try {
        setHasLiked(true);
        setNumLikes(numLikes+1)
        
        const numLikesNew = await likePost(postId); // Replace with your API call

        if(numLikes != numLikesNew && numLikesNew != null)
          setNumLikes(numLikesNew)
        
        toast.success("Success")
      } catch (error) {
        // revert
        setNumLikes(numLikes)
        setHasLiked(false);

        toast.error("Error")
        console.error('Failed to like post:', error);
      }
    }
  }, [hasLiked, postId, profileId, numLikes]);

  return { hasLiked, toggleLike, numLikes };
}

function likePost(postId: string) {
  axios.post('/api/likes', { postId }).then(({data}) => {
    return data.num_likes;
  }
  ).catch((err) => {
    console.log(err);
    return null;
  })

  return null;
}

function unlikePost(postId: string) {
  return axios.delete('/api/likes', { data: { postId } });
}

export default useLike;


// ********************************************* END ********************************

  // const { data: currentUser } = useBruskiUser();
  // const { data: fetchedPost, mutate: mutateFetchedPost } = usePost(postId);
  // const { mutate: mutateFetchedPosts } = usePosts(profileId);

  // const loginModal = useLoginModal();


  //   if (!currentUser) {
  //     return loginModal.onOpen(); //todo: code
  //   }
    