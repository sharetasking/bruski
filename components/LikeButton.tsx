import { BruskiPost } from "@/hooks/usePost";
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineLike, AiOutlineDislike,AiOutlineUserAdd, AiOutlineUserDelete } from 'react-icons/ai';
import useLike from "@/hooks/useLike";
import toast from "react-hot-toast";
import { useCallback } from "react";
import { BruskiUser } from "@/hooks/useBruskiUser";


const LikeButton = ({post, user}:{post:BruskiPost, user:BruskiUser|null}) => {

  console.log(post)
  console.log(user)
  
  
  
  const { hasLiked, numLikes, toggleLike } = useLike({ postId: post.id, liked: !!post.isLiked, likesCount: post.num_likes});

  // LIKE ICON
  const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;

  console.log(post)


  // LIKE POST
  const onLike = useCallback(async (ev: any) => {
    
    ev.stopPropagation();

    if (!user) {
    toast.error('You must be logged in to like a post')
    //   return loginModal.onOpen();
    }

    toggleLike();
  }, [toggleLike, user]);



  return ( <>

     {/* Like */}
     <div
                onClick={onLike}
                className="
                  flex 
                  flex-row 
                  items-center 
                  text-primary
                  gap-1 
                  cursor-pointer 
                  hover:bg-primary/5
                  active:bg-primary/10
                  rounded-full
                  h-14 w-14
                  justify-center
                  transition 
                  hover:text-red-500
                  group
              ">
                <LikeIcon color={hasLiked ? 'red' : ''} size={20} className="" />
                <p className="text-xs">
                  {Math.max(numLikes, 0) }
                </p>
              </div>

  
  </> );
}
 
export default LikeButton;