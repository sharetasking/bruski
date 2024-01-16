//TEST FOR POST FEED MODULE
import { usePosts } from "@/hooks/usePosts";

interface PostFeedProps {
  // just gets the user id
  userId?: string;
}


export const Test:React.FC<PostFeedProps> = ({ userId })=> {
  
  const res = usePosts(userId);
  return ( <>{res}</> );
}